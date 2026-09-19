import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTypewriter } from '../../hooks/useTypewriter'
import NeonGrid from '../fx/NeonGrid'
import GlitchText from '../fx/GlitchText'
import Icon from '../ui/Icon'

const PHRASES = [
  'Buy the game.',
  'Sell it back when you are done.',
  'Read how the story ends first.',
  'The desk is always open.',
]

const stats = [
  { k: '16', l: 'Titles shipped' },
  { k: '31M', l: 'Licences moved' },
  { k: '4.6', l: 'Mean player score' },
  { k: '24/7', l: 'Trade desk' },
]

export default function Hero() {
  const typed = useTypewriter(PHRASES)

  return (
    <section className="hero">
      <div className="hero-canvas">
        <NeonGrid focusX={0.68} horizon={0.55} className="hero-grid" />
      </div>
      <div className="hero-fade" aria-hidden="true" />

      <div className="shell hero-inner">
        <motion.p
          className="kicker hero-kicker"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
        >
          <span className="dot" /> Astra Prime · Market District · Node 07
        </motion.p>

        <motion.h1
          className="display d-xl hero-title"
          initial={{ opacity: 0, y: 30, filter: 'blur(12px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ delay: 0.25, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <GlitchText as="span" className="hero-word">NEON</GlitchText>
          <span className="hero-word grad-text">RUIN</span>
        </motion.h1>

        <motion.p
          className="hero-type mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          &gt; {typed}
          <span className="caret" />
        </motion.p>

        <motion.p
          className="lede hero-lede"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.7 }}
        >
          We make games about cities that do not forgive, and we run the marketplace that trades them. Browse the
          catalogue, read the full storyline of any best seller before you spend a credit, and sell your licences
          back to the desk at a price you can see in advance.
        </motion.p>

        <motion.div
          className="hero-cta"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.82, duration: 0.7 }}
        >
          <Link to="/browse" className="btn btn-lg btn-primary">
            <Icon name="grid" size={15} /> Browse catalogue
          </Link>
          <Link to="/stories" className="btn btn-lg btn-magenta">
            <Icon name="library" size={15} /> Read the storylines
          </Link>
          <Link to="/sell" className="btn btn-lg btn-ghost btn-lime">
            <Icon name="coins" size={15} /> Sell a licence
          </Link>
        </motion.div>

        <motion.dl
          className="hero-stats"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.7 }}
        >
          {stats.map((s) => (
            <div key={s.l} className="hero-stat">
              <dt className="display hero-stat-k">{s.k}</dt>
              <dd className="mono hero-stat-l">{s.l}</dd>
            </div>
          ))}
        </motion.dl>
      </div>

      <motion.div
        className="hero-scroll mono"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        aria-hidden="true"
      >
        <span>SCROLL</span>
        <span className="hero-scroll-line" />
      </motion.div>
    </section>
  )
}
