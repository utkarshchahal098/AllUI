import type { Variants } from 'framer-motion'

/** Shared list/grid entrance variants. Kept out of Reveal.tsx so that file only exports a component. */
export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.075, delayChildren: 0.05 } },
}

export const riseItem: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}
