import { useQuery, keepPreviousData } from '@tanstack/react-query'
import {
  fetchBestSellers,
  fetchFeatured,
  fetchGame,
  fetchGames,
  fetchMarketTicker,
  fetchRelated,
  fetchTradeQuote,
  type Condition,
  type GameQuery,
} from '../lib/api'

export const qk = {
  games: (q: GameQuery) => ['games', q] as const,
  game: (slug: string) => ['game', slug] as const,
  bestSellers: (n: number) => ['best-sellers', n] as const,
  featured: () => ['featured'] as const,
  related: (slug: string) => ['related', slug] as const,
  ticker: () => ['ticker'] as const,
  quote: (id: string, c: Condition) => ['quote', id, c] as const,
}

export const useGamesQuery = (q: GameQuery) =>
  useQuery({
    queryKey: qk.games(q),
    queryFn: () => fetchGames(q),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  })

export const useGameQuery = (slug: string) =>
  useQuery({ queryKey: qk.game(slug), queryFn: () => fetchGame(slug), staleTime: 60_000, retry: false })

export const useBestSellersQuery = (limit = 6) =>
  useQuery({ queryKey: qk.bestSellers(limit), queryFn: () => fetchBestSellers(limit), staleTime: 60_000 })

export const useFeaturedQuery = () =>
  useQuery({ queryKey: qk.featured(), queryFn: fetchFeatured, staleTime: 60_000 })

export const useRelatedQuery = (slug: string) =>
  useQuery({ queryKey: qk.related(slug), queryFn: () => fetchRelated(slug), staleTime: 60_000, enabled: !!slug })

export const useTickerQuery = () =>
  useQuery({ queryKey: qk.ticker(), queryFn: fetchMarketTicker, staleTime: 120_000 })

export const useTradeQuoteQuery = (gameId: string | null, condition: Condition) =>
  useQuery({
    queryKey: qk.quote(gameId ?? '', condition),
    queryFn: () => fetchTradeQuote(gameId!, condition),
    enabled: !!gameId,
    staleTime: 15_000,
  })
