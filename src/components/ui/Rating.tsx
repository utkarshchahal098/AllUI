import Icon from './Icon'

interface Props {
  value: number
  size?: number
  showValue?: boolean
  className?: string
}

export default function Rating({ value, size = 13, showValue = true, className = '' }: Props) {
  return (
    <span className={`rating ${className}`} title={`${value.toFixed(1)} out of 5`}>
      <span className="rating-stars" style={{ ['--fill' as string]: `${(value / 5) * 100}%` }}>
        <span className="rating-track">
          {[0, 1, 2, 3, 4].map((i) => (
            <Icon key={i} name="star" size={size} filled />
          ))}
        </span>
        <span className="rating-fill">
          {[0, 1, 2, 3, 4].map((i) => (
            <Icon key={i} name="star" size={size} filled />
          ))}
        </span>
      </span>
      {showValue && <span className="mono rating-num">{value.toFixed(1)}</span>}
    </span>
  )
}
