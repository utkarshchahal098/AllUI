import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import GlitchText from '../components/fx/GlitchText'
import NeonGrid from '../components/fx/NeonGrid'
import Icon from '../components/ui/Icon'

export default function NotFound() {
  return (
    <section className="nf">
      <div className="nf-canvas">
        <NeonGrid horizon={0.5} className="nf-grid" />
      </div>
      <div className="nf-fade" aria-hidden="true" />

      <div className="shell nf-inner">
        <motion.p
          className="kicker kicker-m"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <span className="dot" style={{ color: 'var(--danger)' }} /> Signal lost · Node 07
        </motion.p>

        <motion.h1
          className="display d-xl nf-code"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <GlitchText as="span">404</GlitchText>
        </motion.h1>

        <motion.p
          className="lede nf-lede"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          That address does not resolve. Either the route was decommissioned or the district rewrote itself again
          overnight — it does that.
        </motion.p>

        <motion.div
          className="nf-cta"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.36 }}
        >
          <Link to="/" className="btn btn-lg btn-primary">
            <Icon name="arrowLeft" size={15} /> Back to the storefront
          </Link>
          <Link to="/browse" className="btn btn-lg btn-ghost">
            <Icon name="grid" size={15} /> Browse catalogue
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
