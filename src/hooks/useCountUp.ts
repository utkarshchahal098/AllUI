import { useEffect, useRef, useState } from 'react'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Counts from 0 to `target` once the element scrolls into view. */
export function useCountUp(target: number, duration = 1400) {
  // Reduced motion resolves to the final value up front — no animation, no effect-time setState.
  const [value, setValue] = useState(() => (prefersReducedMotion() ? target : 0))
  const ref = useRef<HTMLElement | null>(null)
  const done = useRef(false)

  useEffect(() => {
    const node = ref.current
    if (!node || prefersReducedMotion()) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || done.current) return
        done.current = true
        const start = performance.now()
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration)
          setValue(target * (1 - Math.pow(1 - t, 3)))
          if (t < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [target, duration])

  return { ref, value }
}
