import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Loader from './components/ui/Loader'
import Home from './pages/Home'

const Browse = lazy(() => import('./pages/Browse'))
const GameDetail = lazy(() => import('./pages/GameDetail'))
const Stories = lazy(() => import('./pages/Stories'))
const Sell = lazy(() => import('./pages/Sell'))
const Cart = lazy(() => import('./pages/Cart'))
const Library = lazy(() => import('./pages/Library'))
const Studio = lazy(() => import('./pages/Studio'))
const NotFound = lazy(() => import('./pages/NotFound'))

const withSuspense = (node: React.ReactNode) => (
  <Suspense
    fallback={
      <div className="shell page">
        <Loader label="Loading module" />
      </div>
    }
  >
    {node}
  </Suspense>
)

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="browse" element={withSuspense(<Browse />)} />
        <Route path="game/:slug" element={withSuspense(<GameDetail />)} />
        <Route path="stories" element={withSuspense(<Stories />)} />
        <Route path="sell" element={withSuspense(<Sell />)} />
        <Route path="cart" element={withSuspense(<Cart />)} />
        <Route path="library" element={withSuspense(<Library />)} />
        <Route path="studio" element={withSuspense(<Studio />)} />
        <Route path="store" element={<Navigate to="/browse" replace />} />
        <Route path="about" element={<Navigate to="/studio" replace />} />
        <Route path="*" element={withSuspense(<NotFound />)} />
      </Route>
    </Routes>
  )
}
