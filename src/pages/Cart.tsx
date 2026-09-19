import { useMutation } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import GamePoster from '../components/game/GamePoster'
import Empty from '../components/ui/Empty'
import Icon from '../components/ui/Icon'
import { gameById } from '../data/games'
import { credits } from '../lib/format'
import { cartSaved, cartSubtotal, PROMO_CODES, useCartStore } from '../store/useCartStore'
import { useLibraryStore } from '../store/useLibraryStore'
import { useUiStore } from '../store/useUiStore'

const TAX_RATE = 0.06

export default function Cart() {
  const lines = useCartStore((s) => s.lines)
  const promo = useCartStore((s) => s.promo)
  const setQty = useCartStore((s) => s.setQty)
  const remove = useCartStore((s) => s.remove)
  const clear = useCartStore((s) => s.clear)
  const applyPromo = useCartStore((s) => s.applyPromo)
  const clearPromo = useCartStore((s) => s.clearPromo)

  const balance = useLibraryStore((s) => s.credits)
  const grant = useLibraryStore((s) => s.grant)
  const spend = useLibraryStore((s) => s.spend)
  const toast = useUiStore((s) => s.toast)
  const navigate = useNavigate()

  const [code, setCode] = useState('')

  const subtotal = cartSubtotal(lines)
  const saved = cartSaved(lines)
  const promoRate = promo ? PROMO_CODES[promo] : 0
  const promoCut = Math.round(subtotal * promoRate * 100) / 100
  const taxed = Math.round((subtotal - promoCut) * TAX_RATE * 100) / 100
  const total = Math.round((subtotal - promoCut + taxed) * 100) / 100
  const payableByCredits = Math.min(balance, total)

  const checkout = useMutation({
    mutationFn: async () => {
      await new Promise((r) => setTimeout(r, 1100))
      return true
    },
    onSuccess: () => {
      grant(
        lines.map((l) => ({
          id: l.id,
          slug: l.slug,
          title: l.title,
          pricePaid: l.unitPrice * l.qty,
        })),
      )
      spend(payableByCredits)
      toast({
        tone: 'success',
        title: 'Order cleared',
        body: `${lines.length} licence${lines.length > 1 ? 's' : ''} added to your library.`,
      })
      clear()
      navigate('/library')
    },
  })

  const submitPromo = (e: React.FormEvent) => {
    e.preventDefault()
    if (applyPromo(code)) {
      toast({ tone: 'success', title: 'Promo applied', body: `${code.toUpperCase()} is live on this order.` })
      setCode('')
    } else {
      toast({ tone: 'error', title: 'Bad code', body: 'The desk does not recognise that promo.' })
    }
  }

  if (!lines.length) {
    return (
      <div className="shell page">
        <Empty
          icon="cart"
          title="Cart is empty"
          body="Nothing queued for purchase. The catalogue is sixteen titles deep and four of them are on discount right now."
          action={
            <Link to="/browse" className="btn btn-primary btn-lg">
              <Icon name="grid" size={15} /> Browse the catalogue
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="shell page cart">
      <header className="section-head">
        <div>
          <p className="kicker">// Checkout</p>
          <h1 className="display d-lg">Your cart</h1>
          <p className="lede">
            {lines.length} title{lines.length > 1 ? 's' : ''} queued. Licences are delivered to your library the
            moment the order clears.
          </p>
        </div>
        <button className="btn btn-sm btn-ghost" onClick={clear}>
          <Icon name="trash" size={13} /> Empty cart
        </button>
      </header>

      <div className="cart-layout">
        <ul className="cart-lines">
          <AnimatePresence initial={false}>
            {lines.map((l) => {
              const game = gameById(l.id)
              return (
                <motion.li
                  key={l.id}
                  layout
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -40, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
                  className="cart-line panel cut"
                  style={{ ['--c1' as string]: l.palette[0], ['--c2' as string]: l.palette[1] }}
                >
                  <Link to={`/game/${l.slug}`} className="cart-art">
                    {game && (
                      <GamePoster seed={game.slug} variant={game.art} palette={game.palette} ratio={0.95} className="cart-svg" />
                    )}
                  </Link>

                  <div className="cart-info">
                    <Link to={`/game/${l.slug}`}>
                      <h3 className="display cart-title">{l.title}</h3>
                    </Link>
                    <p className="mono dim">{l.studio}</p>
                    {l.listPrice > l.unitPrice && (
                      <p className="mono cart-saving">
                        Saving {credits((l.listPrice - l.unitPrice) * l.qty)} on this line
                      </p>
                    )}
                  </div>

                  <div className="qty" role="group" aria-label={`Quantity for ${l.title}`}>
                    <button onClick={() => setQty(l.id, l.qty - 1)} aria-label="Decrease quantity">
                      <Icon name="minus" size={13} />
                    </button>
                    <span className="mono qty-n">{l.qty}</span>
                    <button onClick={() => setQty(l.id, l.qty + 1)} aria-label="Increase quantity" disabled={l.qty >= 9}>
                      <Icon name="plus" size={13} />
                    </button>
                  </div>

                  <div className="cart-money">
                    {l.listPrice > l.unitPrice && <s className="mono dim">{credits(l.listPrice * l.qty)}</s>}
                    <strong className="mono cart-total">{credits(l.unitPrice * l.qty)}</strong>
                  </div>

                  <button className="cart-x" onClick={() => remove(l.id)} aria-label={`Remove ${l.title}`}>
                    <Icon name="trash" size={15} />
                  </button>
                </motion.li>
              )
            })}
          </AnimatePresence>
        </ul>

        <aside className="cart-summary panel cut hud-corners">
          <p className="kicker">// Order summary</p>

          <form className="promo" onSubmit={submitPromo}>
            <input
              className="input mono"
              placeholder="Promo code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              aria-label="Promo code"
            />
            <button className="btn btn-sm" type="submit">
              Apply
            </button>
          </form>
          <p className="mono dim promo-hint">Try NEON15 · RUIN25 · STATIC10</p>

          <ul className="sum-rows">
            <li>
              <span className="mono dim">Subtotal</span>
              <span className="mono">{credits(subtotal)}</span>
            </li>
            {saved > 0 && (
              <li className="sum-good">
                <span className="mono">Catalogue discounts</span>
                <span className="mono">− {credits(saved)}</span>
              </li>
            )}
            {promo && (
              <li className="sum-good">
                <span className="mono">
                  Promo {promo}
                  <button className="promo-x" onClick={clearPromo} aria-label="Remove promo">
                    <Icon name="close" size={11} />
                  </button>
                </span>
                <span className="mono">− {credits(promoCut)}</span>
              </li>
            )}
            <li>
              <span className="mono dim">District levy (6%)</span>
              <span className="mono">{credits(taxed)}</span>
            </li>
          </ul>

          <hr className="rule" />

          <div className="sum-total">
            <span className="mono dim">Total</span>
            <strong className="display sum-total-v">{credits(total)}</strong>
          </div>

          <div className="sum-balance mono">
            <Icon name="coins" size={13} />
            Balance {credits(balance)} — covering {credits(payableByCredits)}
            {total > balance && <span className="dim"> · {credits(total - balance)} on card</span>}
          </div>

          <button
            className="btn btn-lg btn-primary btn-block"
            onClick={() => checkout.mutate()}
            disabled={checkout.isPending}
          >
            {checkout.isPending ? (
              <>
                <span className="btn-spin" /> Clearing order…
              </>
            ) : (
              <>
                <Icon name="shield" size={15} /> Complete purchase
              </>
            )}
          </button>

          <Link to="/browse" className="btn btn-sm btn-ghost btn-block">
            Keep browsing
          </Link>

          <p className="mono dim cart-fine">
            No subscriptions, no auto-renew. Licences are yours and tradeable at the desk from day one.
          </p>
        </aside>
      </div>
    </div>
  )
}
