import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { credits } from '../../lib/format'
import { cartCount, useCartStore } from '../../store/useCartStore'
import { useFilterStore } from '../../store/useFilterStore'
import { useLibraryStore } from '../../store/useLibraryStore'
import { useUiStore } from '../../store/useUiStore'
import Icon from '../ui/Icon'

const links = [
  { to: '/browse', label: 'Browse', icon: 'grid' as const },
  { to: '/stories', label: 'Stories', icon: 'library' as const },
  { to: '/sell', label: 'Sell', icon: 'coins' as const },
  { to: '/studio', label: 'Studio', icon: 'cpu' as const },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const navOpen = useUiStore((s) => s.navOpen)
  const setNavOpen = useUiStore((s) => s.setNavOpen)
  const count = useCartStore((s) => cartCount(s.lines))
  const balance = useLibraryStore((s) => s.credits)
  const ownedCount = useLibraryStore((s) => s.owned.length)
  const setSearch = useFilterStore((s) => s.setSearch)
  const navigate = useNavigate()
  const location = useLocation()
  const [q, setQ] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setNavOpen(false), [location.pathname, setNavOpen])

  useEffect(() => {
    document.body.style.overflow = navOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [navOpen])

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearch(q)
    navigate('/browse')
  }

  return (
    <>
      <header className={`nav ${scrolled ? 'nav-solid' : ''}`}>
        <div className="shell nav-inner">
          <Link to="/" className="brand" aria-label="NEONRUIN home">
            <span className="brand-mark" aria-hidden="true">
              <svg viewBox="0 0 32 32" width="30" height="30">
                <defs>
                  <linearGradient id="bg1" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#1ee7ff" />
                    <stop offset="100%" stopColor="#ff2d9b" />
                  </linearGradient>
                </defs>
                <path d="M4 27V5l12 11V5l12 11v11L16 16v11L4 16Z" fill="url(#bg1)" />
              </svg>
            </span>
            <span className="brand-type">
              <span className="brand-name display">NEON<em>RUIN</em></span>
              <span className="brand-sub mono">GAME STUDIO · EST 2079</span>
            </span>
          </Link>

          <nav className="nav-links" aria-label="Primary">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`}>
                {l.label}
                <span className="nav-link-bar" />
              </NavLink>
            ))}
          </nav>

          <form className="nav-search" onSubmit={submitSearch} role="search">
            <Icon name="search" size={15} />
            <input
              className="nav-search-input"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search the catalogue…"
              aria-label="Search games"
            />
            <kbd className="mono">↵</kbd>
          </form>

          <div className="nav-actions">
            <Link to="/library" className="nav-credits mono" title="Your credit balance">
              <Icon name="coins" size={14} />
              <span>{credits(balance)}</span>
            </Link>

            <Link to="/library" className="icon-btn cut-sm nav-lib" aria-label={`Library, ${ownedCount} titles`}>
              <Icon name="library" size={16} />
              {ownedCount > 0 && <span className="pip">{ownedCount}</span>}
            </Link>

            <Link to="/cart" className="icon-btn cut-sm nav-cart" aria-label={`Cart, ${count} items`}>
              <Icon name="cart" size={16} />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key={count}
                    className="pip pip-hot"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'spring', stiffness: 520, damping: 18 }}
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            <button
              className="icon-btn cut-sm nav-burger"
              onClick={() => setNavOpen(!navOpen)}
              aria-label={navOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={navOpen}
            >
              <Icon name={navOpen ? 'close' : 'menu'} size={17} />
            </button>
          </div>
        </div>
        <span className="nav-edge" aria-hidden="true" />
      </header>

      <AnimatePresence>
        {navOpen && (
          <motion.div
            className="drawer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <button className="drawer-scrim" onClick={() => setNavOpen(false)} aria-label="Close menu" />
            <motion.nav
              className="drawer-panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
              aria-label="Mobile"
            >
              <p className="kicker drawer-kicker">Navigation</p>
              {links.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, x: 28 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + i * 0.06 }}
                >
                  <NavLink to={l.to} className={({ isActive }) => `drawer-link ${isActive ? 'is-active' : ''}`}>
                    <Icon name={l.icon} size={17} />
                    {l.label}
                    <Icon name="chevronRight" size={15} className="drawer-chev" />
                  </NavLink>
                </motion.div>
              ))}
              <hr className="rule drawer-rule" />
              <NavLink to="/library" className="drawer-link">
                <Icon name="library" size={17} /> Library
              </NavLink>
              <NavLink to="/cart" className="drawer-link">
                <Icon name="cart" size={17} /> Cart ({count})
              </NavLink>
              <div className="drawer-balance mono">
                <Icon name="coins" size={14} /> Balance {credits(balance)}
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
