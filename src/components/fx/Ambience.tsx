/** Full-page atmospheric layers: gradient field, scanlines, film grain, vignette. */
export default function Ambience() {
  return (
    <>
      <div className="app-bg" aria-hidden="true" />
      <div className="fx-noise" aria-hidden="true" />
      <div className="fx-scanlines" aria-hidden="true" />
      <div className="fx-vignette" aria-hidden="true" />
    </>
  )
}
