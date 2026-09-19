import { useEffect, useRef } from 'react'

interface Props {
  /** Horizon position as a fraction of canvas height. */
  horizon?: number
  /** Vanishing-point / sun position as a fraction of canvas width. */
  focusX?: number
  className?: string
}

/**
 * Animated synthwave horizon: a perspective grid scrolling toward the viewer,
 * a sun disc with scanline cutouts, and drifting data motes.
 * Renders into its parent element and pauses when off-screen or hidden.
 */
export default function NeonGrid({ horizon = 0.58, focusX = 0.5, className }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0
    let h = 0
    let dpr = 1
    let raf = 0
    let running = true
    let t = 0

    const motes = Array.from({ length: 46 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.4 + Math.random() * 1.5,
      s: 0.02 + Math.random() * 0.09,
      hue: Math.random() > 0.55 ? '#1ee7ff' : '#ff2d9b',
      a: 0.15 + Math.random() * 0.5,
    }))

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = parent.clientWidth
      h = parent.clientHeight
      canvas.width = Math.max(1, Math.floor(w * dpr))
      canvas.height = Math.max(1, Math.floor(h * dpr))
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const drawSun = (hy: number) => {
      const cx = w * focusX
      const r = Math.min(w, h) * 0.19
      const cy = hy - r * 0.34

      const grad = ctx.createLinearGradient(cx, cy - r, cx, cy + r)
      grad.addColorStop(0, '#ffb43d')
      grad.addColorStop(0.45, '#ff2d9b')
      grad.addColorStop(1, '#8b5cff')

      ctx.save()
      ctx.globalAlpha = 0.55
      ctx.shadowBlur = 70
      ctx.shadowColor = 'rgba(255,45,155,0.55)'
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.fillStyle = grad
      ctx.fill()
      ctx.restore()

      // horizontal cutouts widening toward the bottom of the disc
      ctx.save()
      ctx.globalCompositeOperation = 'destination-out'
      for (let i = 0; i < 9; i++) {
        const y = cy + r * (0.04 + i * 0.115)
        const band = 1.2 + i * 1.3
        ctx.fillRect(cx - r, y, r * 2, band)
      }
      ctx.restore()
    }

    const drawGrid = (hy: number) => {
      const vpx = w * focusX
      const depth = 22
      const scroll = (t * 0.55) % 1

      ctx.lineWidth = 1

      // receding horizontal lines
      for (let i = 0; i < depth; i++) {
        const p = (i + scroll) / depth
        const eased = Math.pow(p, 2.6)
        const y = hy + eased * (h - hy) * 1.25
        if (y > h) continue
        const alpha = 0.07 + p * 0.3
        ctx.strokeStyle = `rgba(30, 231, 255, ${alpha})`
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
        ctx.stroke()
      }

      // converging verticals
      const cols = 26
      for (let i = -cols; i <= cols; i++) {
        const x = vpx + i * (w / 9)
        const grad = ctx.createLinearGradient(vpx, hy, x, h)
        grad.addColorStop(0, 'rgba(255, 45, 155, 0)')
        grad.addColorStop(0.35, 'rgba(255, 45, 155, 0.16)')
        grad.addColorStop(1, 'rgba(30, 231, 255, 0.34)')
        ctx.strokeStyle = grad
        ctx.beginPath()
        ctx.moveTo(vpx, hy)
        ctx.lineTo(x, h)
        ctx.stroke()
      }

      // horizon bloom
      const bloom = ctx.createLinearGradient(0, hy - 26, 0, hy + 26)
      bloom.addColorStop(0, 'rgba(30, 231, 255, 0)')
      bloom.addColorStop(0.5, 'rgba(140, 240, 255, 0.5)')
      bloom.addColorStop(1, 'rgba(30, 231, 255, 0)')
      ctx.fillStyle = bloom
      ctx.fillRect(0, hy - 26, w, 52)
    }

    const drawMotes = (hy: number) => {
      for (const m of motes) {
        if (!reduce) {
          m.y -= m.s / 100
          if (m.y < -0.02) {
            m.y = 1.02
            m.x = Math.random()
          }
        }
        const x = m.x * w
        const y = m.y * hy
        ctx.beginPath()
        ctx.arc(x, y, m.r, 0, Math.PI * 2)
        ctx.fillStyle = m.hue
        ctx.globalAlpha = m.a * (0.4 + 0.6 * Math.sin(t * 2 + m.x * 10))
        ctx.shadowBlur = 8
        ctx.shadowColor = m.hue
        ctx.fill()
      }
      ctx.globalAlpha = 1
      ctx.shadowBlur = 0
    }

    const frame = () => {
      if (!running) return
      const hy = h * horizon
      ctx.clearRect(0, 0, w, h)
      drawMotes(hy)
      drawSun(hy)
      drawGrid(hy)
      if (!reduce) t += 0.016
      raf = requestAnimationFrame(frame)
    }

    resize()
    frame()

    const ro = new ResizeObserver(resize)
    if (canvas.parentElement) ro.observe(canvas.parentElement)

    const onVisibility = () => {
      running = !document.hidden
      if (running) raf = requestAnimationFrame(frame)
      else cancelAnimationFrame(raf)
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [horizon, focusX])

  return <canvas ref={ref} className={className} aria-hidden="true" />
}
