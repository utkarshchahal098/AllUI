import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { finalPrice, type Game } from '../../data/games'
import { compact, credits, pct } from '../../lib/format'
import { useCartStore } from '../../store/useCartStore'
import { useUiStore } from '../../store/useUiStore'
import Icon from '../ui/Icon'
import Rating from '../ui/Rating'
import { riseItem } from '../ui/motion'
import GamePoster from './GamePoster'

export default function GameRow({ game }: { game: Game }) {
  const add = useCartStore((s) => s.add)
  const inCart = useCartStore((s) => s.lines.some((l) => l.id === game.id))
  const toast = useUiStore((s) => s.toast)
  const price = finalPrice(game)

  return (
    <motion.article
      variants={riseItem}
      className="grow panel cut"
      style={{ ['--c1' as string]: game.palette[0], ['--c2' as string]: game.palette[1] }}
    >
      <Link to={`/game/${game.slug}`} className="grow-art">
        <GamePoster seed={game.slug} variant={game.art} palette={game.palette} ratio={1.3} className="grow-svg" />
        <span className="grow-art-edge" />
      </Link>

      <div className="grow-body">
        <div className="grow-top">
          <p className="mono grow-studio">{game.studio} · {game.year} · {game.genres.join(' / ')}</p>
          <Link to={`/game/${game.slug}`}>
            <h3 className="display grow-title">{game.title}</h3>
          </Link>
          <p className="grow-tagline">{game.tagline}</p>
        </div>

        <p className="grow-syn dim">{game.synopsis.slice(0, 170)}…</p>

        <div className="grow-meta">
          <Rating value={game.rating} />
          <span className="mono dim">{compact(game.reviews)} reviews</span>
          <span className="mono dim">·</span>
          <span className="mono dim">{compact(game.sales)} sold</span>
          {game.story && (
            <span className="chip chip-magenta">
              <Icon name="library" size={11} /> Storyline published
            </span>
          )}
        </div>
      </div>

      <div className="grow-buy">
        {game.discount > 0 && <span className="chip chip-lime">−{pct(game.discount)}</span>}
        {game.discount > 0 && <s className="mono dim grow-was">{credits(game.price)}</s>}
        <strong className="display grow-now">{credits(price)}</strong>
        <button
          className={`btn btn-sm ${inCart ? 'btn-ghost' : 'btn-primary'}`}
          onClick={() => {
            add(game)
            toast({ tone: 'success', title: 'Added to cart', body: `${game.title} — ${credits(price)}` })
          }}
        >
          <Icon name={inCart ? 'check' : 'cart'} size={13} />
          {inCart ? 'In cart' : 'Add to cart'}
        </button>
        <Link to={`/game/${game.slug}`} className="btn btn-sm btn-ghost">
          Dossier <Icon name="arrowRight" size={12} />
        </Link>
      </div>
    </motion.article>
  )
}
