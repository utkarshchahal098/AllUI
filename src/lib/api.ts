import { games, finalPrice, type Game } from '../data/games'

/**
 * Simulated storefront backend. Every call is async with jittered latency so the
 * TanStack Query layer behaves exactly as it would against a real service.
 */
const latency = (min = 220, max = 620) =>
  new Promise<void>((r) => setTimeout(r, min + Math.random() * (max - min)))

export type SortKey = 'relevance' | 'price-asc' | 'price-desc' | 'rating' | 'newest' | 'sales'

export interface GameQuery {
  search?: string
  genres?: string[]
  tags?: string[]
  maxPrice?: number
  onSaleOnly?: boolean
  sort?: SortKey
}

export interface Facets {
  genres: { value: string; count: number }[]
  tags: { value: string; count: number }[]
  priceCeiling: number
}

export interface GameListResult {
  items: Game[]
  total: number
  facets: Facets
}

const matches = (g: Game, q: GameQuery) => {
  if (q.search) {
    const needle = q.search.toLowerCase().trim()
    const haystack = `${g.title} ${g.studio} ${g.tagline} ${g.genres.join(' ')} ${g.tags.join(' ')}`.toLowerCase()
    if (!haystack.includes(needle)) return false
  }
  if (q.genres?.length && !q.genres.some((x) => g.genres.includes(x))) return false
  if (q.tags?.length && !q.tags.every((x) => g.tags.includes(x))) return false
  if (q.maxPrice != null && finalPrice(g) > q.maxPrice) return false
  if (q.onSaleOnly && g.discount === 0) return false
  return true
}

const sorters: Record<SortKey, (a: Game, b: Game) => number> = {
  relevance: (a, b) => Number(b.bestSeller) - Number(a.bestSeller) || b.rating - a.rating,
  'price-asc': (a, b) => finalPrice(a) - finalPrice(b),
  'price-desc': (a, b) => finalPrice(b) - finalPrice(a),
  rating: (a, b) => b.rating - a.rating,
  newest: (a, b) => b.year - a.year || b.sales - a.sales,
  sales: (a, b) => b.sales - a.sales,
}

const countBy = (list: Game[], pick: (g: Game) => string[]) => {
  const map = new Map<string, number>()
  for (const g of list) for (const v of pick(g)) map.set(v, (map.get(v) ?? 0) + 1)
  return [...map.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value))
}

export async function fetchGames(q: GameQuery = {}): Promise<GameListResult> {
  await latency()
  const items = games.filter((g) => matches(g, q)).sort(sorters[q.sort ?? 'relevance'])
  return {
    items,
    total: items.length,
    facets: {
      genres: countBy(games, (g) => g.genres),
      tags: countBy(games, (g) => g.tags),
      priceCeiling: Math.ceil(Math.max(...games.map(finalPrice))),
    },
  }
}

export async function fetchGame(slug: string): Promise<Game> {
  await latency(180, 460)
  const game = games.find((g) => g.slug === slug)
  if (!game) throw new Error(`No dossier found for "${slug}"`)
  return game
}

export async function fetchBestSellers(limit = 6): Promise<Game[]> {
  await latency(160, 400)
  return [...games].sort((a, b) => b.sales - a.sales).slice(0, limit)
}

export async function fetchFeatured(): Promise<Game[]> {
  await latency(140, 360)
  return games.filter((g) => g.bestSeller).slice(0, 4)
}

export async function fetchRelated(slug: string, limit = 4): Promise<Game[]> {
  await latency(160, 380)
  const game = games.find((g) => g.slug === slug)
  if (!game) return []
  return games
    .filter((g) => g.slug !== slug)
    .map((g) => ({
      g,
      score:
        g.genres.filter((x) => game.genres.includes(x)).length * 3 +
        g.tags.filter((x) => game.tags.includes(x)).length * 2 +
        (g.studio === game.studio ? 2 : 0),
    }))
    .sort((a, b) => b.score - a.score || b.g.rating - a.g.rating)
    .slice(0, limit)
    .map((x) => x.g)
}

/* ------------------------------------------------------------------
   Trade desk — the "sell" side of the marketplace
   ------------------------------------------------------------------ */

export type Condition = 'mint' | 'used' | 'degraded'

export interface TradeQuote {
  gameId: string
  title: string
  basePrice: number
  condition: Condition
  conditionMultiplier: number
  demandMultiplier: number
  offer: number
  expiresInMinutes: number
  demandLabel: string
}

const CONDITION_MULT: Record<Condition, number> = { mint: 0.62, used: 0.44, degraded: 0.23 }

export async function fetchTradeQuote(gameId: string, condition: Condition): Promise<TradeQuote> {
  await latency(420, 900)
  const game = games.find((g) => g.id === gameId)
  if (!game) throw new Error('Unknown licence — this title is not tradeable on our desk.')

  // Demand tracks sales volume and current rating, capped to a sane band.
  const demand = Math.min(1.35, Math.max(0.7, 0.68 + (game.sales / 7_000_000) * 0.5 + (game.rating - 4) * 0.22))
  const conditionMultiplier = CONDITION_MULT[condition]
  const offer = Math.round(game.price * conditionMultiplier * demand * 100) / 100

  return {
    gameId,
    title: game.title,
    basePrice: game.price,
    condition,
    conditionMultiplier,
    demandMultiplier: Math.round(demand * 100) / 100,
    offer,
    expiresInMinutes: 15,
    demandLabel: demand > 1.15 ? 'Surging' : demand > 0.95 ? 'Healthy' : 'Soft',
  }
}

export interface ListingPayload {
  gameId: string
  condition: Condition
  askingPrice: number
  handle: string
  notes?: string
}

export interface ListingReceipt {
  id: string
  postedAt: number
  escrow: number
  payload: ListingPayload
}

export async function submitListing(payload: ListingPayload): Promise<ListingReceipt> {
  await latency(700, 1400)
  if (payload.askingPrice <= 0) throw new Error('The desk rejected a zero-value listing.')
  return {
    id: `LST-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    postedAt: Date.now(),
    escrow: Math.round(payload.askingPrice * 0.04 * 100) / 100,
    payload,
  }
}

export interface MarketTick {
  label: string
  value: string
  delta: number
}

export async function fetchMarketTicker(): Promise<MarketTick[]> {
  await latency(120, 300)
  const top = [...games].sort((a, b) => b.sales - a.sales).slice(0, 8)
  return top.map((g, i) => ({
    label: g.title,
    value: `${finalPrice(g).toFixed(2)} CR`,
    delta: Math.round((Math.sin(i * 2.7) * 9 + (g.discount > 0 ? -4 : 3)) * 10) / 10,
  }))
}
