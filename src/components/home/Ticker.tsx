import { useTickerQuery } from '../../hooks/useGames'
import Icon from '../ui/Icon'

export default function Ticker() {
  const { data } = useTickerQuery()
  const ticks = data ?? []
  if (!ticks.length) return <div className="ticker-placeholder" aria-hidden="true" />

  const row = [...ticks, ...ticks]

  return (
    <div className="marquee ticker" aria-label="Live marketplace prices">
      <div className="marquee-track">
        {row.map((t, i) => (
          <span key={`${t.label}-${i}`} className="ticker-item mono">
            <span className="ticker-label">{t.label}</span>
            <span className="ticker-value">{t.value}</span>
            <span className={`ticker-delta ${t.delta >= 0 ? 'up' : 'down'}`}>
              <Icon name={t.delta >= 0 ? 'arrowRight' : 'arrowRight'} size={11} style={{ transform: `rotate(${t.delta >= 0 ? -45 : 45}deg)` }} />
              {Math.abs(t.delta).toFixed(1)}%
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
