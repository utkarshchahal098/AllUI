import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { finalPrice } from '../../data/games'
import { useFeaturedQuery } from '../../hooks/useGames'
import { compact, credits, pct } from '../../lib/format'
import GamePoster from '../game/GamePoster'
import Icon from '../ui/Icon'
import Rating from '../ui/Rating'

const DURATION = 7600

export default function Spotlight() {
  const { data, isPending } = useFeaturedQuery()
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const items = data ?? []

  useEffect(() => {
    if (!items.length || paused) return
    const t = setTimeout(() => setI((n) => (n + 1) % items.length), DURATION)
    return () => clearTimeout(t)
  }, [i, items.length, paused])

  if (isPending || !items.length) {
    return <div className="skeleton spotlight-skel cut" />
  }

  const game = items[i % items.length]

  return (
    <section
      className="spotlight panel cut hud-corners"
      style={{ ['--c1' as string]: game.palette[0], ['--c2' as string]: game.palette[1] }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Featured title"
    >
      <div className="spotlight-art">
        <AnimatePresence mode="wait">
          <motion.div
            key={game.id}
            initial={{ opacity: 0, scale: 1.08, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.97, filter: 'blur(8px)' }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="spotlight-art-inner"
          >
            <GamePoster seed={game.slug} variant={game.art} palette={game.palette} ratio={0.78} className="spotlight-svg" />
          </motion.div>
        </AnimatePresence>
        <div className="spotlight-art-scrim" />
        <span className="spotlight-tape mono">FEATURED // {String(i + 1).padStart(2, '0')} OF {String(items.length).padStart(2, '0')}</span>
      </div>

      <div className="spotlight-body">
        <AnimatePresence mode="wait">
          <motion.div
            key={game.id}
            initial={{ opacity: 0, x: 26 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -18 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="kicker kicker-m">
              <Icon name="flame" size={12} filled /> Best seller · {compact(game.sales)} licences moved
            </p>
            <h2 className="display d-lg spotlight-title">{game.title}</h2>
            <p className="spotlight-tagline">“{game.tagline}”</p>
            <p className="lede spotlight-syn">{game.synopsis}</p>

            <div className="spotlight-meta">
              <Rating value={game.rating} />
              <span className="chip chip-cyan">{game.genres.join(' · ')}</span>
              <span className="chip">
                <Icon name="clock" size={11} /> {game.playtime}
              </span>
              <span className="chip">{game.players}</span>
            </div>

            <div className="spotlight-foot">
              <div className="spotlight-price">
                {game.discount > 0 && (
                  <span className="chip chip-lime spotlight-off">−{pct(game.discount)}</span>
                )}
                {game.discount > 0 && <s className="mono dim">{credits(game.price)}</s>}
                <strong className="display spotlight-now">{credits(finalPrice(game))}</strong>
              </div>
              <div className="spotlight-actions">
                <Link to={`/game/${game.slug}`} className="btn btn-primary">
                  <Icon name="arrowRight" size={14} /> Open dossier
                </Link>
                {game.story && (
                  <Link to={`/game/${game.slug}#story`} className="btn btn-ghost btn-magenta">
                    <Icon name="library" size={14} /> Storyline
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="spotlight-dots" role="tablist" aria-label="Featured titles">
          {items.map((g, n) => (
            <button
              key={g.id}
              role="tab"
              aria-selected={n === i}
              aria-label={g.title}
              className={`spot-dot ${n === i ? 'is-on' : ''}`}
              onClick={() => setI(n)}
            >
              <span
                className="spot-dot-fill"
                style={{ animationDuration: `${DURATION}ms`, animationPlayState: paused ? 'paused' : 'running' }}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
