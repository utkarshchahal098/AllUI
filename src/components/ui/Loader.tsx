interface Props {
  label?: string
}

export default function Loader({ label = 'Decrypting' }: Props) {
  return (
    <div className="loader" role="status" aria-live="polite">
      <div className="loader-ring">
        <span />
        <span />
        <span />
      </div>
      <p className="mono loader-label">
        {label}
        <span className="loader-dots">
          <i>.</i>
          <i>.</i>
          <i>.</i>
        </span>
      </p>
    </div>
  )
}
