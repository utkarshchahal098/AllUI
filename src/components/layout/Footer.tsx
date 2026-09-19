import { Link } from 'react-router-dom'
import Icon from '../ui/Icon'

const columns = [
  {
    head: 'Storefront',
    links: [
      { to: '/browse', label: 'Full catalogue' },
      { to: '/browse?sale=1', label: 'Current deals' },
      { to: '/stories', label: 'Story archive' },
      { to: '/sell', label: 'Trade desk' },
    ],
  },
  {
    head: 'Studio',
    links: [
      { to: '/studio', label: 'About NEONRUIN' },
      { to: '/studio#teams', label: 'Internal teams' },
      { to: '/studio#tech', label: 'Engine tech' },
      { to: '/library', label: 'Your library' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="foot">
      <div className="foot-glow" aria-hidden="true" />
      <div className="shell foot-inner">
        <div className="foot-brand">
          <p className="display d-md foot-word">
            NEON<span className="grad-text">RUIN</span>
          </p>
          <p className="lede foot-lede">
            An independent studio and marketplace operating out of the Astra Prime market district. We build the
            games, we run the desk, and we buy them back when you are done.
          </p>
          <div className="foot-social">
            {(['globe', 'send', 'external'] as const).map((n) => (
              <span key={n} className="icon-btn cut-sm">
                <Icon name={n} size={15} />
              </span>
            ))}
          </div>
        </div>

        {columns.map((c) => (
          <nav key={c.head} className="foot-col" aria-label={c.head}>
            <p className="kicker">{c.head}</p>
            <ul>
              {c.links.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="foot-link">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div className="foot-col">
          <p className="kicker">Signal</p>
          <p className="foot-note">Drop your relay address for build notes and season briefings.</p>
          <form className="foot-form" onSubmit={(e) => e.preventDefault()}>
            <input className="input" placeholder="handle@relay" aria-label="Relay address" />
            <button className="btn btn-sm btn-primary" type="submit">
              <Icon name="send" size={13} />
            </button>
          </form>
        </div>
      </div>

      <div className="shell foot-base">
        <p className="mono foot-fine">© 2089 NEONRUIN INTERACTIVE — ALL TIMELINES RESERVED</p>
        <p className="mono foot-fine foot-status">
          <span className="dot" style={{ color: 'var(--lime)' }} /> ALL SYSTEMS NOMINAL · ASTRA-PRIME-01
        </p>
      </div>
    </footer>
  )
}
