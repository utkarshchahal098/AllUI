import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import GameCard from '../components/game/GameCard'
import GamePoster from '../components/game/GamePoster'
import Empty from '../components/ui/Empty'
import Icon from '../components/ui/Icon'
import Loader from '../components/ui/Loader'
import Rating from '../components/ui/Rating'
import Reveal from '../components/ui/Reveal'
import { stagger } from '../components/ui/motion'
import { finalPrice } from '../data/games'
import { useGameQuery, useRelatedQuery } from '../hooks/useGames'
import { compact, credits, pct } from '../lib/format'
import { useCartStore } from '../store/useCartStore'
import { useLibraryStore } from '../store/useLibraryStore'
import { useUiStore } from '../store/useUiStore'

type Tab = 'overview' | 'story' | 'cast' | 'specs'

const TABS: { id: Tab; label: string; icon: 'bolt' | 'library' | 'user' | 'chip' }[] = [
  { id: 'overview', label: 'Overview', icon: 'bolt' },
  { id: 'story', label: 'Storyline', icon: 'library' },
  { id: 'cast', label: 'Cast', icon: 'user' },
  { id: 'specs', label: 'Spec sheet', icon: 'chip' },
]

export default function GameDetail() {
  const { slug = '' } = useParams()
  const { hash } = useLocation()
  const { data: game, isPending, isError, error } = useGameQuery(slug)
  const { data: related } = useRelatedQuery(slug)
  // Tab + spoiler state is derived from the route, adjusted during render rather than in an effect
  // so a /game/x#story deep link lands on the storyline without a second paint.
  const routeKey = `${slug}${hash}`
  const [view, setView] = useState<{ key: string; tab: Tab; spoilers: boolean }>(() => ({
    key: routeKey,
    tab: hash === '#story' ? 'story' : 'overview',
    spoilers: false,
  }))
  if (view.key !== routeKey) {
    setView({ key: routeKey, tab: hash === '#story' ? 'story' : 'overview', spoilers: false })
  }
  const { tab, spoilers } = view
  const setTab = (next: Tab) => setView((v) => ({ ...v, tab: next }))
  const setSpoilers = (next: boolean | ((prev: boolean) => boolean)) =>
    setView((v) => ({ ...v, spoilers: typeof next === 'function' ? next(v.spoilers) : next }))

  const add = useCartStore((s) => s.add)
  const inCart = useCartStore((s) => s.lines.some((l) => l.id === game?.id))
  const owned = useLibraryStore((s) => s.owned.some((o) => o.id === game?.id))
  const toast = useUiStore((s) => s.toast)

  if (isPending) {
    return (
      <div className="shell page">
        <Loader label="Pulling dossier" />
      </div>
    )
  }

  if (isError || !game) {
    return (
      <div className="shell page">
        <Empty
          icon="close"
          title="Dossier not found"
          body={error instanceof Error ? error.message : 'That title is not in the catalogue.'}
          action={
            <Link to="/browse" className="btn btn-primary">
              Back to catalogue
            </Link>
          }
        />
      </div>
    )
  }

  const price = finalPrice(game)
  const hasStory = !!game.story?.length

  return (
    <div className="detail" style={{ ['--c1' as string]: game.palette[0], ['--c2' as string]: game.palette[1] }}>
      {/* ---------------- key art banner ---------------- */}
      <section className="detail-hero">
        <div className="detail-hero-art">
          <GamePoster seed={game.slug} variant={game.art} palette={game.palette} ratio={2.1} className="detail-hero-svg" />
        </div>
        <div className="detail-hero-scrim" aria-hidden="true" />
        <span className="scan-sweep detail-hero-sweep" aria-hidden="true" />

        <div className="shell detail-hero-inner">
          <Link to="/browse" className="detail-back mono">
            <Icon name="arrowLeft" size={14} /> Catalogue
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="detail-flags">
              {game.bestSeller && (
                <span className="chip chip-amber">
                  <Icon name="flame" size={11} filled /> Best seller
                </span>
              )}
              {game.status === 'early-access' && <span className="chip chip-cyan">Early access</span>}
              {game.status === 'preorder' && <span className="chip chip-magenta">Pre-order</span>}
              {hasStory && <span className="chip chip-lime">Storyline published</span>}
            </div>

            <h1 className="display d-xl detail-title">{game.title}</h1>
            <p className="detail-tagline">“{game.tagline}”</p>
            <p className="mono detail-credits">
              {game.studio} · {game.year} · {game.genres.join(' / ')}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="shell detail-body">
        {/* ---------------- main column ---------------- */}
        <div className="detail-main">
          <nav className="tabs" role="tablist" aria-label="Dossier sections">
            {TABS.map((t) => {
              const disabled = (t.id === 'story' && !hasStory) || (t.id === 'cast' && !game.characters?.length)
              return (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={tab === t.id}
                  disabled={disabled}
                  className={`tab ${tab === t.id ? 'is-on' : ''}`}
                  onClick={() => setTab(t.id)}
                >
                  <Icon name={t.icon} size={14} />
                  {t.label}
                  {tab === t.id && <motion.span layoutId="tab-underline" className="tab-underline" />}
                </button>
              )
            })}
          </nav>

          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="tab-panel"
              role="tabpanel"
            >
              {tab === 'overview' && (
                <div className="stack gap-4">
                  <p className="detail-syn">{game.synopsis}</p>

                  <div className="detail-facts">
                    {[
                      { l: 'Players', v: game.players },
                      { l: 'Playtime', v: game.playtime },
                      { l: 'Platforms', v: game.platforms.join(' · ') },
                      { l: 'Studio', v: game.studio },
                    ].map((f) => (
                      <div key={f.l} className="detail-fact">
                        <p className="label">{f.l}</p>
                        <p className="detail-fact-v">{f.v}</p>
                      </div>
                    ))}
                  </div>

                  <div>
                    <p className="label detail-taglabel">Tags</p>
                    <div className="row wrap gap-2">
                      {game.genres.map((g) => (
                        <span key={g} className="chip chip-cyan">{g}</span>
                      ))}
                      {game.tags.map((t) => (
                        <span key={t} className="chip">{t}</span>
                      ))}
                    </div>
                  </div>

                  <div className="reviews-bar panel cut-sm">
                    <div className="reviews-score">
                      <p className="display reviews-num">{game.rating.toFixed(1)}</p>
                      <Rating value={game.rating} size={14} showValue={false} />
                      <p className="mono dim">{compact(game.reviews)} verified reviews</p>
                    </div>
                    <div className="reviews-bars">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const share =
                          star === Math.round(game.rating)
                            ? 0.58
                            : Math.abs(star - game.rating) < 1.2
                              ? 0.24
                              : 0.06 / Math.abs(star - game.rating)
                        return (
                          <div key={star} className="reviews-row">
                            <span className="mono reviews-star">{star}★</span>
                            <span className="reviews-track">
                              <motion.span
                                className="reviews-fill"
                                initial={{ width: 0 }}
                                whileInView={{ width: `${Math.min(100, share * 100)}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                              />
                            </span>
                            <span className="mono reviews-pct">{Math.round(Math.min(100, share * 100))}%</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}

              {tab === 'story' && hasStory && (
                <div className="story">
                  <div className="story-warn panel cut-sm">
                    <Icon name="shield" size={16} />
                    <div>
                      <p className="story-warn-title">Full plot ahead</p>
                      <p className="dim story-warn-body">
                        We publish complete act structures, including endings. Reveal it only if that is what you
                        came for.
                      </p>
                    </div>
                    <button
                      className={`btn btn-sm ${spoilers ? 'btn-ghost' : 'btn-primary'}`}
                      onClick={() => setSpoilers((v) => !v)}
                    >
                      {spoilers ? 'Hide plot' : 'Reveal plot'}
                    </button>
                  </div>

                  <motion.ol className="acts" variants={stagger} initial="hidden" animate="show">
                    {game.story!.map((a, i) => (
                      <motion.li
                        key={a.act}
                        className="act"
                        initial={{ opacity: 0, x: -18 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                      >
                        <span className="act-spine" aria-hidden="true">
                          <span className="act-node" />
                        </span>
                        <div className="act-card panel cut">
                          <p className="mono act-num">{a.act}</p>
                          <h3 className="display d-md act-title">{a.title}</h3>
                          <p className="act-sum">{a.summary}</p>
                          <div className={`act-beats ${spoilers ? '' : 'is-blurred'}`}>
                            <ul>
                              {a.beats.map((b) => (
                                <li key={b}>
                                  <Icon name="chevronRight" size={13} />
                                  <span>{b}</span>
                                </li>
                              ))}
                            </ul>
                            {!spoilers && (
                              <button className="act-unlock" onClick={() => setSpoilers(true)}>
                                <Icon name="bolt" size={14} /> Tap to decrypt {a.beats.length} plot beats
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </motion.ol>
                </div>
              )}

              {tab === 'cast' && (
                <div className="cast">
                  {game.characters?.map((c, i) => (
                    <Reveal key={c.name} delay={i * 0.07}>
                      <article className="cast-card panel cut">
                        <span className="cast-avatar" aria-hidden="true">
                          {c.name
                            .split(' ')
                            .map((w) => w[0])
                            .join('')
                            .slice(0, 2)}
                        </span>
                        <div>
                          <h3 className="display cast-name">{c.name}</h3>
                          <p className="mono cast-role">{c.role}</p>
                          <blockquote className="cast-line">“{c.line}”</blockquote>
                        </div>
                      </article>
                    </Reveal>
                  ))}
                </div>
              )}

              {tab === 'specs' && (
                <div className="specs panel cut">
                  <table className="spec-table">
                    <tbody>
                      {[
                        ['Licence ID', game.id.toUpperCase()],
                        ['Release', String(game.year)],
                        ['Status', game.status.replace('-', ' ')],
                        ['Engine', 'Ruinworks 4 — in-house'],
                        ['Platforms', game.platforms.join(', ')],
                        ['Players', game.players],
                        ['Playtime', game.playtime],
                        ['Languages', 'EN · JP · DE · PT-BR · KO · Astran'],
                        ['Accessibility', 'Full remap, colour-blind sets, subtitle scaling, no-flash mode'],
                        ['Licences moved', compact(game.sales)],
                        ['Trade-in eligible', game.status === 'preorder' ? 'On release' : 'Yes'],
                      ].map(([k, v]) => (
                        <tr key={k}>
                          <th scope="row" className="mono">{k}</th>
                          <td>{v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ---------------- buy rail ---------------- */}
        <aside className="detail-rail">
          <div className="buybox panel cut hud-corners">
            <div className="buybox-art">
              <GamePoster seed={game.slug} variant={game.art} palette={game.palette} ratio={1.55} className="buybox-svg" />
            </div>

            <div className="buybox-price">
              {game.discount > 0 && (
                <>
                  <span className="chip chip-lime">−{pct(game.discount)} this cycle</span>
                  <s className="mono dim">{credits(game.price)}</s>
                </>
              )}
              <strong className="display buybox-now">{credits(price)}</strong>
            </div>

            {owned ? (
              <Link to="/library" className="btn btn-block btn-lime btn-ghost">
                <Icon name="check" size={14} /> In your library
              </Link>
            ) : (
              <button
                className="btn btn-block btn-primary btn-lg"
                onClick={() => {
                  add(game)
                  toast({ tone: 'success', title: 'Added to cart', body: `${game.title} — ${credits(price)}` })
                }}
              >
                <Icon name={inCart ? 'check' : 'cart'} size={15} />
                {inCart ? 'In cart — add another' : 'Add to cart'}
              </button>
            )}

            <Link to="/cart" className="btn btn-block btn-ghost">
              <Icon name="arrowRight" size={14} /> Go to checkout
            </Link>

            <hr className="rule" />

            <ul className="buybox-facts">
              {[
                ['Rating', `${game.rating.toFixed(1)} / 5`],
                ['Reviews', compact(game.reviews)],
                ['Sold', compact(game.sales)],
                ['Trade-in value', credits(Math.round(game.price * 0.62 * 100) / 100)],
              ].map(([k, v]) => (
                <li key={k}>
                  <span className="mono dim">{k}</span>
                  <span className="mono">{v}</span>
                </li>
              ))}
            </ul>

            <Link to="/sell" className="buybox-sell mono">
              <Icon name="coins" size={13} /> Sell this licence back later
            </Link>
          </div>
        </aside>
      </div>

      {/* ---------------- related ---------------- */}
      {!!related?.length && (
        <section className="shell page">
          <Reveal>
            <div className="section-head">
              <div>
                <p className="kicker">// Adjacent signals</p>
                <h2 className="display d-md">Players also opened</h2>
              </div>
            </div>
          </Reveal>
          <motion.div className="grid-games" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
            {related.map((g) => (
              <GameCard key={g.id} game={g} />
            ))}
          </motion.div>
        </section>
      )}
    </div>
  )
}
