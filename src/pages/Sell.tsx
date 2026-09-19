import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from 'zod'
import GamePoster from '../components/game/GamePoster'
import Icon from '../components/ui/Icon'
import Reveal from '../components/ui/Reveal'
import { games } from '../data/games'
import { useTradeQuoteQuery } from '../hooks/useGames'
import { submitListing, type Condition, type ListingReceipt } from '../lib/api'
import { credits } from '../lib/format'
import { useLibraryStore } from '../store/useLibraryStore'
import { useUiStore } from '../store/useUiStore'

const schema = z.object({
  gameId: z.string().min(1, 'Pick a licence to trade.'),
  condition: z.enum(['mint', 'used', 'degraded']),
  askingPrice: z
    .number({ message: 'Enter a number.' })
    .positive('Asking price must be above zero.')
    .max(200, 'The desk caps listings at 200 CR.'),
  handle: z
    .string()
    .min(3, 'At least 3 characters.')
    .max(24, 'Keep it under 24 characters.')
    .regex(/^[a-zA-Z0-9_.-]+$/, 'Letters, digits, dot, dash and underscore only.'),
  notes: z.string().max(240, 'Keep notes under 240 characters.').optional(),
})

type FormValues = z.infer<typeof schema>

const CONDITIONS: { value: Condition; label: string; blurb: string }[] = [
  { value: 'mint', label: 'Mint', blurb: 'Untouched licence, no play hours logged, all DLC intact.' },
  { value: 'used', label: 'Used', blurb: 'Completed at least once. Save data cleared on transfer.' },
  { value: 'degraded', label: 'Degraded', blurb: 'Partial licence, region-locked, or missing season content.' },
]

export default function Sell() {
  const owned = useLibraryStore((s) => s.owned)
  const recordSale = useLibraryStore((s) => s.recordSale)
  const balance = useLibraryStore((s) => s.credits)
  const toast = useUiStore((s) => s.toast)

  const tradeable = useMemo(() => {
    const ownedIds = new Set(owned.map((o) => o.id))
    const inLibrary = games.filter((g) => ownedIds.has(g.id))
    return { inLibrary, all: games.filter((g) => g.status !== 'preorder') }
  }, [owned])

  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      gameId: tradeable.inLibrary[0]?.id ?? '',
      condition: 'mint',
      askingPrice: 0,
      handle: '',
      notes: '',
    },
    mode: 'onBlur',
  })

  const gameId = useWatch({ control, name: 'gameId' })
  const condition = useWatch({ control, name: 'condition' })
  const askingPrice = useWatch({ control, name: 'askingPrice' })

  const { data: quote, isFetching: quoting } = useTradeQuoteQuery(gameId || null, condition)
  const game = games.find((g) => g.id === gameId)

  // Seed the asking price from each new quote so the field always has a sane default.
  useEffect(() => {
    if (quote) setValue('askingPrice', quote.offer, { shouldValidate: false })
  }, [quote, setValue])

  const mutation = useMutation<ListingReceipt, Error, FormValues>({
    mutationFn: (values) =>
      submitListing({
        gameId: values.gameId,
        condition: values.condition,
        askingPrice: values.askingPrice,
        handle: values.handle,
        notes: values.notes,
      }),
    onSuccess: (receipt) => {
      const title = games.find((g) => g.id === receipt.payload.gameId)?.title ?? 'Licence'
      recordSale(receipt, title)
      toast({
        tone: 'success',
        title: `Listing ${receipt.id} cleared`,
        body: `${credits(receipt.payload.askingPrice - receipt.escrow)} credited after escrow.`,
      })
    },
    onError: (e) => toast({ tone: 'error', title: 'Desk rejected the listing', body: e.message }),
  })

  const escrow = Math.round((askingPrice || 0) * 0.04 * 100) / 100
  const net = Math.max(0, Math.round(((askingPrice || 0) - escrow) * 100) / 100)
  const overAsk = quote && askingPrice > quote.offer * 1.35

  return (
    <div className="shell page sell">
      <header className="sell-head">
        <div>
          <p className="kicker kicker-m">// Trade desk</p>
          <h1 className="display d-lg">
            Sell a <span className="grad-text">licence</span>
          </h1>
          <p className="lede">
            Declare the licence and its condition. The desk returns a live quote built from base price, a condition
            multiplier and current market demand — all of it shown to you before you commit.
          </p>
        </div>
        <div className="sell-balance panel cut-sm">
          <p className="label">Balance</p>
          <p className="display sell-balance-v">{credits(balance)}</p>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {mutation.isSuccess ? (
          <motion.div
            key="receipt"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="receipt panel cut hud-corners"
          >
            <span className="receipt-stamp mono">CLEARED</span>
            <p className="kicker">// Listing receipt</p>
            <h2 className="display d-md">{mutation.data.id}</h2>
            <dl className="receipt-rows">
              {[
                ['Title', games.find((g) => g.id === mutation.data.payload.gameId)?.title ?? '—'],
                ['Condition', CONDITIONS.find((c) => c.value === mutation.data.payload.condition)!.label],
                ['Asking price', credits(mutation.data.payload.askingPrice)],
                ['Escrow (4%)', `− ${credits(mutation.data.escrow)}`],
                ['Credited', credits(mutation.data.payload.askingPrice - mutation.data.escrow)],
                ['Seller handle', mutation.data.payload.handle],
              ].map(([k, v]) => (
                <div key={k} className="receipt-row">
                  <dt className="mono dim">{k}</dt>
                  <dd className="mono">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="row wrap gap-2 receipt-cta">
              <button
                className="btn btn-primary"
                onClick={() => {
                  mutation.reset()
                  reset({ gameId: '', condition: 'mint', askingPrice: 0, handle: '', notes: '' })
                }}
              >
                <Icon name="plus" size={14} /> List another
              </button>
              <Link to="/library" className="btn btn-ghost">
                <Icon name="library" size={14} /> View library
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div key="form" exit={{ opacity: 0 }} className="sell-layout">
            <form className="sell-form panel cut" onSubmit={handleSubmit((v) => mutation.mutate(v))} noValidate>
              {/* ---- licence ---- */}
              <fieldset className="sell-step">
                <legend className="sell-step-head">
                  <span className="sell-step-num mono">01</span> Choose the licence
                </legend>

                {owned.length > 0 && (
                  <p className="mono dim sell-hint">
                    {owned.length} licence{owned.length > 1 ? 's' : ''} in your library are ready to trade.
                  </p>
                )}

                <div className="field">
                  <label className="label" htmlFor="gameId">
                    Title
                  </label>
                  <select id="gameId" className="select" {...register('gameId')} aria-invalid={!!errors.gameId}>
                    <option value="">— select a title —</option>
                    {tradeable.inLibrary.length > 0 && (
                      <optgroup label="In your library">
                        {tradeable.inLibrary.map((g) => (
                          <option key={g.id} value={g.id}>
                            {g.title}
                          </option>
                        ))}
                      </optgroup>
                    )}
                    <optgroup label="Full catalogue">
                      {tradeable.all.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.title} — {g.studio}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                  {errors.gameId && <p className="err">{errors.gameId.message}</p>}
                </div>
              </fieldset>

              {/* ---- condition ---- */}
              <fieldset className="sell-step">
                <legend className="sell-step-head">
                  <span className="sell-step-num mono">02</span> Declare condition
                </legend>
                <Controller
                  control={control}
                  name="condition"
                  render={({ field }) => (
                    <div className="cond-grid">
                      {CONDITIONS.map((c) => (
                        <label key={c.value} className={`cond ${field.value === c.value ? 'is-on' : ''}`}>
                          <input
                            type="radio"
                            name={field.name}
                            value={c.value}
                            checked={field.value === c.value}
                            onChange={() => field.onChange(c.value)}
                            className="sr-only"
                          />
                          <span className="cond-title display">{c.label}</span>
                          <span className="cond-blurb">{c.blurb}</span>
                          <span className="cond-mult mono">
                            ×{c.value === 'mint' ? '0.62' : c.value === 'used' ? '0.44' : '0.23'}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                />
              </fieldset>

              {/* ---- price ---- */}
              <fieldset className="sell-step">
                <legend className="sell-step-head">
                  <span className="sell-step-num mono">03</span> Set your ask
                </legend>
                <div className="sell-price-row">
                  <div className="field">
                    <label className="label" htmlFor="askingPrice">
                      Asking price (CR)
                    </label>
                    <input
                      id="askingPrice"
                      className="input mono"
                      type="number"
                      step="0.01"
                      min="0"
                      {...register('askingPrice', { valueAsNumber: true })}
                      aria-invalid={!!errors.askingPrice}
                    />
                    {errors.askingPrice && <p className="err">{errors.askingPrice.message}</p>}
                  </div>
                  <div className="field">
                    <label className="label" htmlFor="handle">
                      Seller handle
                    </label>
                    <input
                      id="handle"
                      className="input"
                      placeholder="kaeda_07"
                      {...register('handle')}
                      aria-invalid={!!errors.handle}
                    />
                    {errors.handle && <p className="err">{errors.handle.message}</p>}
                  </div>
                </div>

                {overAsk && (
                  <p className="sell-warn mono">
                    <Icon name="shield" size={13} /> You are asking well above the desk quote — expect a slow clear.
                  </p>
                )}

                <div className="field">
                  <label className="label" htmlFor="notes">
                    Notes to buyers (optional)
                  </label>
                  <textarea
                    id="notes"
                    className="textarea"
                    placeholder="Season 3 cosmetics included, save data wiped, no region lock…"
                    {...register('notes')}
                    aria-invalid={!!errors.notes}
                  />
                  {errors.notes && <p className="err">{errors.notes.message}</p>}
                </div>
              </fieldset>

              <button className="btn btn-lg btn-primary btn-block" type="submit" disabled={isSubmitting || mutation.isPending}>
                {mutation.isPending ? (
                  <>
                    <span className="btn-spin" /> Clearing with the desk…
                  </>
                ) : (
                  <>
                    <Icon name="coins" size={15} /> Submit listing
                  </>
                )}
              </button>
            </form>

            {/* ---- live quote rail ---- */}
            <aside className="quote-rail">
              <div className="quote panel cut hud-corners">
                <p className="kicker">// Live quote</p>

                {!gameId ? (
                  <p className="dim quote-empty">Select a title to pull a quote from the desk.</p>
                ) : (
                  <>
                    {game && (
                      <div className="quote-game">
                        <span className="quote-art">
                          <GamePoster seed={game.slug} variant={game.art} palette={game.palette} ratio={0.95} className="quote-svg" />
                        </span>
                        <span>
                          <span className="display quote-title">{game.title}</span>
                          <span className="mono dim quote-studio">{game.studio}</span>
                        </span>
                      </div>
                    )}

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`${gameId}-${condition}-${quoting}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {quoting || !quote ? (
                          <div className="quote-loading">
                            <span className="btn-spin" />
                            <span className="mono dim">Pricing against live demand…</span>
                          </div>
                        ) : (
                          <>
                            <p className="display quote-offer">{credits(quote.offer)}</p>
                            <p className="mono quote-sub">
                              desk offer · valid {quote.expiresInMinutes} min
                            </p>

                            <ul className="quote-breakdown">
                              <li>
                                <span className="mono dim">Base price</span>
                                <span className="mono">{credits(quote.basePrice)}</span>
                              </li>
                              <li>
                                <span className="mono dim">Condition ×</span>
                                <span className="mono">{quote.conditionMultiplier.toFixed(2)}</span>
                              </li>
                              <li>
                                <span className="mono dim">Demand ×</span>
                                <span className="mono">
                                  {quote.demandMultiplier.toFixed(2)}{' '}
                                  <span
                                    className={`chip ${
                                      quote.demandLabel === 'Surging'
                                        ? 'chip-lime'
                                        : quote.demandLabel === 'Healthy'
                                          ? 'chip-cyan'
                                          : ''
                                    }`}
                                  >
                                    {quote.demandLabel}
                                  </span>
                                </span>
                              </li>
                            </ul>
                          </>
                        )}
                      </motion.div>
                    </AnimatePresence>

                    <hr className="rule" />

                    <ul className="quote-breakdown">
                      <li>
                        <span className="mono dim">Your ask</span>
                        <span className="mono">{credits(askingPrice || 0)}</span>
                      </li>
                      <li>
                        <span className="mono dim">Escrow 4%</span>
                        <span className="mono">− {credits(escrow)}</span>
                      </li>
                      <li className="quote-net">
                        <span className="mono">You receive</span>
                        <span className="mono">{credits(net)}</span>
                      </li>
                    </ul>

                    {quote && (
                      <button
                        type="button"
                        className="btn btn-sm btn-ghost btn-block"
                        onClick={() => setValue('askingPrice', quote.offer, { shouldValidate: true })}
                      >
                        <Icon name="bolt" size={13} /> Match desk quote
                      </button>
                    )}
                  </>
                )}
              </div>

              <Reveal delay={0.1}>
                <div className="quote-note panel cut-sm">
                  <Icon name="shield" size={16} />
                  <p className="dim">
                    Listings clear against the live player economy. Nothing is held back: escrow, demand and
                    condition multipliers are the same numbers our own desk sees.
                  </p>
                </div>
              </Reveal>
            </aside>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
