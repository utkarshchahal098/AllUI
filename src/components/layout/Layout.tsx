import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Ambience from '../fx/Ambience'
import ScrollProgress from '../ui/ScrollProgress'
import Toaster from '../ui/Toaster'
import Footer from './Footer'
import Navbar from './Navbar'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])
  return null
}

export default function Layout() {
  const location = useLocation()

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Ambience />
      <ScrollProgress />
      <Navbar />
      <ScrollToTop />

      <main id="main">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
      <Toaster />
    </>
  )
}
