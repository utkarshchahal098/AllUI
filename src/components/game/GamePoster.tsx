import { useId, useMemo } from 'react'
import type { ArtVariant } from '../../data/games'

interface Props {
  seed: string
  variant: ArtVariant
  palette: [string, string]
  className?: string
  /** Taller framing for detail-page key art. */
  ratio?: number
}

/** Small deterministic PRNG so each title's art is stable across renders. */
function rng(seed: string) {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return () => {
    h ^= h << 13
    h ^= h >>> 17
    h ^= h << 5
    return ((h >>> 0) % 100000) / 100000
  }
}

const W = 400
const H = 500

export default function GamePoster({ seed, variant, palette, className, ratio }: Props) {
  const uid = useId().replace(/:/g, '')
  const h = ratio ? Math.round(W / ratio) : H
  const [c1, c2] = palette

  const art = useMemo(() => {
    const r = rng(seed)
    switch (variant) {
      case 'skyline':
        return skyline(r, h)
      case 'visor':
        return visor(r, h)
      case 'horizon':
        return horizon(r, h)
      case 'orbital':
        return orbital(r, h)
      case 'circuit':
        return circuit(r, h)
      case 'monolith':
        return monolith(r, h)
    }
  }, [seed, variant, h])

  return (
    <svg
      viewBox={`0 0 ${W} ${h}`}
      className={className}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`Key art for ${seed}`}
    >
      <defs>
        <linearGradient id={`sky-${uid}`} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#05070f" />
          <stop offset="46%" stopColor={c2} stopOpacity="0.32" />
          <stop offset="100%" stopColor="#03040a" />
        </linearGradient>
        <linearGradient id={`beam-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={c1} />
          <stop offset="100%" stopColor={c2} />
        </linearGradient>
        <radialGradient id={`glow-${uid}`} cx="50%" cy="46%" r="52%">
          <stop offset="0%" stopColor={c1} stopOpacity="0.85" />
          <stop offset="58%" stopColor={c2} stopOpacity="0.28" />
          <stop offset="100%" stopColor={c2} stopOpacity="0" />
        </radialGradient>
        <filter id={`blur-${uid}`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <filter id={`soft-${uid}`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3.2" />
        </filter>
        <pattern id={`scan-${uid}`} width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="4" height="1.4" fill="#000" opacity="0.34" />
        </pattern>
      </defs>

      <rect width={W} height={h} fill={`url(#sky-${uid})`} />
      <ellipse cx={W / 2} cy={h * 0.46} rx={W * 0.62} ry={h * 0.42} fill={`url(#glow-${uid})`} filter={`url(#blur-${uid})`} />

      <g>{art.render(uid, c1, c2)}</g>

      <rect width={W} height={h} fill={`url(#scan-${uid})`} opacity="0.5" />
      <rect width={W} height={h} fill="url(#poster-vig)" />
      <defs>
        <radialGradient id="poster-vig" cx="50%" cy="42%" r="78%">
          <stop offset="55%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.72" />
        </radialGradient>
      </defs>
    </svg>
  )
}

type Art = { render: (uid: string, c1: string, c2: string) => React.ReactNode }
type R = () => number

/* ---------------------------------------------------------------- skyline */
function skyline(r: R, h: number): Art {
  const layers = [0.82, 0.9, 0.98].map((base, li) => {
    const towers: { x: number; w: number; top: number; lit: boolean }[] = []
    let x = -20
    while (x < W + 20) {
      const w = 16 + r() * 42
      const top = h * (base - 0.12 - r() * (0.26 - li * 0.06))
      towers.push({ x, w, top, lit: r() > 0.42 })
      x += w + 3 + r() * 9
    }
    return { towers, base, li }
  })

  const sunY = h * 0.42
  return {
    render: (uid, c1, c2) => (
      <>
        <circle cx={W * 0.52} cy={sunY} r={h * 0.15} fill={`url(#beam-${uid})`} opacity="0.55" filter={`url(#soft-${uid})`} />
        {[...Array(7)].map((_, i) => (
          <rect key={i} x={W * 0.52 - h * 0.16} y={sunY + i * (h * 0.022)} width={h * 0.32} height={2 + i * 1.1} fill="#03040a" opacity="0.9" />
        ))}
        {layers.map(({ towers, base, li }) => (
          <g key={li} opacity={0.45 + li * 0.27}>
            {towers.map((t, i) => (
              <g key={i}>
                <rect x={t.x} y={t.top} width={t.w} height={h * base - t.top + 40} fill="#04060d" />
                <rect x={t.x} y={t.top} width={t.w} height={1.4} fill={li === 2 ? c1 : c2} opacity={0.7} />
                {t.lit &&
                  [...Array(Math.floor(3 + r() * 6))].map((_, k) => (
                    <rect
                      key={k}
                      x={t.x + 3 + (k % 3) * (t.w / 3.4)}
                      y={t.top + 9 + Math.floor(k / 3) * 13}
                      width={2.6}
                      height={4}
                      fill={k % 2 ? c1 : c2}
                      opacity={0.55 + r() * 0.45}
                    />
                  ))}
              </g>
            ))}
          </g>
        ))}
        <rect x="0" y={h * 0.955} width={W} height={h * 0.045} fill="#020307" />
        <rect x="0" y={h * 0.955} width={W} height="1.2" fill={c1} opacity="0.8" />
      </>
    ),
  }
}

/* ------------------------------------------------------------------ visor */
function visor(r: R, h: number): Art {
  const cx = W / 2
  const cy = h * 0.46
  const lines = [...Array(9)].map(() => 0.2 + r() * 0.6)
  return {
    render: (uid, c1, c2) => (
      <>
        <path
          d={`M${cx - 120} ${cy - 110} q120 -70 240 0 l14 118 q-16 118 -134 168 q-118 -50 -134 -168 Z`}
          fill="#05070f"
          stroke={c1}
          strokeWidth="1.6"
          opacity="0.95"
        />
        <path
          d={`M${cx - 104} ${cy - 46} q104 -56 208 0 q-6 74 -104 96 q-98 -22 -104 -96 Z`}
          fill={`url(#beam-${uid})`}
          opacity="0.72"
        />
        {lines.map((p, i) => (
          <rect key={i} x={cx - 104} y={cy - 44 + i * 13} width={208 * p} height="2" fill="#03060d" opacity="0.55" />
        ))}
        <path d={`M${cx - 104} ${cy - 46} q104 -56 208 0`} fill="none" stroke="#fff" strokeWidth="1.2" opacity="0.55" />
        {[...Array(5)].map((_, i) => (
          <circle key={i} cx={cx - 60 + i * 30} cy={cy + 120} r={2 + r() * 2} fill={i % 2 ? c1 : c2} opacity="0.8" />
        ))}
        <path d={`M${cx - 150} ${cy + 168} h300`} stroke={c2} strokeWidth="1" opacity="0.5" />
        <path d={`M${cx - 168} ${cy - 128} h336`} stroke={c1} strokeWidth="1" opacity="0.35" />
      </>
    ),
  }
}

/* ---------------------------------------------------------------- horizon */
function horizon(r: R, h: number): Art {
  const hy = h * 0.55
  const ridge = [...Array(14)].map((_, i) => ({ x: (i / 13) * W, y: hy - (10 + r() * 78) }))
  const d = `M0 ${hy} ` + ridge.map((p) => `L${p.x} ${p.y}`).join(' ') + ` L${W} ${hy} Z`
  return {
    render: (uid, c1, c2) => (
      <>
        <circle cx={W * 0.5} cy={hy - 46} r={h * 0.13} fill={`url(#beam-${uid})`} opacity="0.7" filter={`url(#soft-${uid})`} />
        <path d={d} fill="#04060e" stroke={c2} strokeWidth="1.3" opacity="0.9" />
        {[...Array(15)].map((_, i) => {
          const p = (i + 1) / 15
          const y = hy + Math.pow(p, 2.4) * (h - hy)
          return <line key={i} x1="0" y1={y} x2={W} y2={y} stroke={c1} strokeWidth="1" opacity={0.12 + p * 0.5} />
        })}
        {[...Array(17)].map((_, i) => (
          <line
            key={i}
            x1={W / 2}
            y1={hy}
            x2={W / 2 + (i - 8) * 92}
            y2={h}
            stroke={i % 2 ? c1 : c2}
            strokeWidth="1"
            opacity="0.3"
          />
        ))}
        <rect x="0" y={hy - 2} width={W} height="3" fill={c1} opacity="0.9" />
      </>
    ),
  }
}

/* ---------------------------------------------------------------- orbital */
function orbital(r: R, h: number): Art {
  const cx = W * 0.5
  const cy = h * 0.45
  const rings = [0.2, 0.3, 0.42, 0.56, 0.72]
  return {
    render: (uid, c1, c2) => (
      <>
        {rings.map((k, i) => (
          <ellipse
            key={i}
            cx={cx}
            cy={cy}
            rx={h * k}
            ry={h * k * (0.26 + r() * 0.14)}
            fill="none"
            stroke={i % 2 ? c1 : c2}
            strokeWidth={i === 2 ? 2 : 1}
            opacity={0.55 - i * 0.07}
            transform={`rotate(${-18 + i * 7} ${cx} ${cy})`}
          />
        ))}
        <circle cx={cx} cy={cy} r={h * 0.14} fill="#05070f" stroke={c1} strokeWidth="1.5" />
        <circle cx={cx} cy={cy} r={h * 0.14} fill={`url(#beam-${uid})`} opacity="0.5" />
        {[...Array(6)].map((_, i) => (
          <rect key={i} x={cx - h * 0.14} y={cy - h * 0.1 + i * (h * 0.04)} width={h * 0.28} height="2" fill="#03040a" opacity="0.7" />
        ))}
        {[...Array(9)].map((_, i) => {
          const y = h * (0.12 + r() * 0.78)
          const len = 40 + r() * 150
          const x = r() * (W - len)
          return <rect key={i} x={x} y={y} width={len} height={1 + r() * 1.6} fill={i % 3 === 0 ? c2 : c1} opacity={0.2 + r() * 0.45} />
        })}
      </>
    ),
  }
}

/* ---------------------------------------------------------------- circuit */
function circuit(r: R, h: number): Art {
  const traces = [...Array(16)].map(() => {
    let x = r() * W
    let y = r() * h
    let d = `M${x.toFixed(1)} ${y.toFixed(1)}`
    const nodes: [number, number][] = [[x, y]]
    for (let i = 0; i < 4; i++) {
      const horiz = r() > 0.5
      const step = (r() - 0.5) * 170
      if (horiz) x = Math.max(8, Math.min(W - 8, x + step))
      else y = Math.max(8, Math.min(h - 8, y + step))
      d += ` L${x.toFixed(1)} ${y.toFixed(1)}`
      nodes.push([x, y])
    }
    return { d, nodes, warm: r() > 0.55 }
  })

  return {
    render: (_uid, c1, c2) => (
      <>
        <g opacity="0.16">
          {[...Array(11)].map((_, i) => (
            <line key={`v${i}`} x1={(i / 10) * W} y1="0" x2={(i / 10) * W} y2={h} stroke={c1} strokeWidth="0.6" />
          ))}
          {[...Array(13)].map((_, i) => (
            <line key={`hz${i}`} x1="0" y1={(i / 12) * h} x2={W} y2={(i / 12) * h} stroke={c1} strokeWidth="0.6" />
          ))}
        </g>
        {traces.map((t, i) => (
          <g key={i}>
            <path d={t.d} fill="none" stroke={t.warm ? c2 : c1} strokeWidth="1.5" opacity="0.55" strokeLinejoin="round" />
            {t.nodes.map(([nx, ny], k) => (
              <circle key={k} cx={nx} cy={ny} r={k === 0 ? 3.4 : 2} fill={t.warm ? c2 : c1} opacity="0.85" />
            ))}
          </g>
        ))}
        <rect x={W * 0.3} y={h * 0.38} width={W * 0.4} height={h * 0.24} fill="#05070f" stroke={c1} strokeWidth="1.6" />
        <rect x={W * 0.34} y={h * 0.42} width={W * 0.32} height={h * 0.16} fill="none" stroke={c2} strokeWidth="1" opacity="0.7" />
        {[...Array(6)].map((_, i) => (
          <rect key={i} x={W * 0.3 + 8 + i * (W * 0.064)} y={h * 0.355} width="3" height={h * 0.025} fill={c1} opacity="0.8" />
        ))}
      </>
    ),
  }
}

/* --------------------------------------------------------------- monolith */
function monolith(r: R, h: number): Art {
  const slabW = W * 0.34
  const x = (W - slabW) / 2
  return {
    render: (uid, c1, c2) => (
      <>
        <rect x="0" y={h * 0.78} width={W} height={h * 0.22} fill="#04060d" />
        <rect x={x} y={h * 0.14} width={slabW} height={h * 0.66} fill="#02030a" stroke={c2} strokeWidth="1.2" opacity="0.95" />
        <rect x={x + slabW * 0.44} y={h * 0.2} width={slabW * 0.12} height={h * 0.54} fill={`url(#beam-${uid})`} filter={`url(#soft-${uid})`} opacity="0.9" />
        <rect x={x + slabW * 0.47} y={h * 0.2} width={slabW * 0.06} height={h * 0.54} fill="#fff" opacity="0.55" />
        {[...Array(10)].map((_, i) => (
          <rect key={i} x={x - 14} y={h * (0.2 + i * 0.058)} width={slabW + 28} height={1} fill={c1} opacity={0.08 + r() * 0.24} />
        ))}
        <ellipse cx={W / 2} cy={h * 0.8} rx={slabW * 1.5} ry={h * 0.035} fill={c1} opacity="0.2" filter={`url(#soft-${uid})`} />
        {[...Array(5)].map((_, i) => (
          <rect key={i} x={20 + i * 14} y={h * (0.3 + r() * 0.4)} width="2" height={20 + r() * 60} fill={c2} opacity="0.25" />
        ))}
        {[...Array(5)].map((_, i) => (
          <rect key={i} x={W - 26 - i * 14} y={h * (0.3 + r() * 0.4)} width="2" height={20 + r() * 60} fill={c1} opacity="0.25" />
        ))}
      </>
    ),
  }
}
