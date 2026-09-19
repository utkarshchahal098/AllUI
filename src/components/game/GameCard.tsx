import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { finalPrice, type Game } from '../../data/games'
import { credits, compact, pct } from '../../lib/format'
import { useCartStore } from '../../store/useCartStore'
import { useLibraryStore } from '../../store/useLibraryStore'
import { useUiStore } from '../../store/useUiStore'
import Icon from '../ui/Icon'
import Rating from '../ui/Rating'
import { riseItem } from '../ui/motion'
import GamePoster from './GamePoster'

interface Props {
  game: Game
}

export default function GameCard({ game }: Props) {
  const add = useCartStore((s) => s.add)
  const inCart = useCartStore((s) => s.lines.some((l) => l.id === game.id))
  const owned = useLibraryStore((s) => s.owned.some((o) => o.id === game.id))
  const toast = useUiStore((s) => s.toast)

  const price = finalPrice(game)
  const onSale = game.discount > 0

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    add(game)
    toast({ tone: 'success', title: 'Added to cart', body: `${game.title} — ${credits(price)}` })
  }

  return (
    <motion.article
      variants={riseItem}
      className="gcard"
      style={{ ['--c1' as string]: game.palette[0], ['--c2' as string]: game.palette[1] }}
    >
      <Link to={`/game/${game.slug}`} className="gcard-link">
        <div className="gcard-art">
          <GamePoster seed={game.slug} variant={game.art} palette={game.palette} className="gcard-svg" />
          <div className="gcard-scrim" />

          <div className="gcard-flags">
            {game.bestSeller && (
              <span className="chip chip-amber">
                <Icon name="flame" size={11} filled /> Best seller
              </span>
            )}
            {game.status === 'early-access' && <span className="chip chip-cyan">Early access</span>}
            {game.status === 'preorder' && <span className="chip chip-magenta">Pre-order</span>}
          </div>

          {onSale && <span className="gcard-discount mono">−{pct(game.discount)}</span>}

          <div className="gcard-hover">
            <span className="gcard-cta">
              <Icon name="play" size={12} filled /> View dossier
            </span>
          </div>

          <span className="gcard-scanline" />
        </div>

        <div className="gcard-body">
          <p className="gcard-studio mono">{game.studio} · {game.year}</p>
          <h3 className="gcard-title display">{game.title}</h3>
          <p className="gcard-tagline">{game.tagline}</p>

          <div className="gcard-meta">
            <Rating value={game.rating} />
            <span className="mono gcard-reviews">{compact(game.reviews)} reviews</span>
          </div>

          <div className="gcard-tags">
            {game.genres.slice(0, 1).map((g) => (
              <span key={g} className="chip chip-cyan">{g}</span>
            ))}
            {game.tags.slice(0, 2).map((t) => (
              <span key={t} className="chip">{t}</span>
            ))}
          </div>
        </div>
      </Link>

      <footer className="gcard-foot">
        <div className="gcard-price">
          {onSale && <s className="mono gcard-was">{credits(game.price)}</s>}
          <strong className="mono gcard-now">{credits(price)}</strong>
        </div>
        {owned ? (
          <Link to="/library" className="btn btn-sm btn-ghost btn-lime">
            <Icon name="library" size={13} /> Owned
          </Link>
        ) : (
          <button className={`btn btn-sm ${inCart ? '' : 'btn-primary'}`} onClick={handleAdd}>
            <Icon name={inCart ? 'check' : 'cart'} size={13} />
            {inCart ? 'In cart' : 'Add'}
          </button>
        )}
      </footer>
    </motion.article>
  )
}

export function GameCardSkeleton() {
  return (
    <div className="gcard gcard-skel">
      <div className="skeleton gcard-art" />
      <div className="gcard-body">
        <div className="skeleton skel-line" style={{ width: '45%' }} />
        <div className="skeleton skel-line" style={{ width: '80%', height: 20 }} />
        <div className="skeleton skel-line" style={{ width: '95%' }} />
        <div className="skeleton skel-line" style={{ width: '60%' }} />
      </div>
    </div>
  )
}
