import { create } from 'zustand'
import type { SortKey } from '../lib/api'

interface FilterState {
  search: string
  genres: string[]
  tags: string[]
  maxPrice: number | null
  onSaleOnly: boolean
  sort: SortKey
  view: 'grid' | 'list'
  setSearch: (v: string) => void
  toggleGenre: (v: string) => void
  toggleTag: (v: string) => void
  setMaxPrice: (v: number | null) => void
  setOnSaleOnly: (v: boolean) => void
  setSort: (v: SortKey) => void
  setView: (v: 'grid' | 'list') => void
  reset: () => void
  activeCount: () => number
}

const initial = {
  search: '',
  genres: [] as string[],
  tags: [] as string[],
  maxPrice: null as number | null,
  onSaleOnly: false,
  sort: 'relevance' as SortKey,
}

const toggle = (list: string[], v: string) =>
  list.includes(v) ? list.filter((x) => x !== v) : [...list, v]

export const useFilterStore = create<FilterState>()((set, get) => ({
  ...initial,
  view: 'grid',
  setSearch: (search) => set({ search }),
  toggleGenre: (v) => set((s) => ({ genres: toggle(s.genres, v) })),
  toggleTag: (v) => set((s) => ({ tags: toggle(s.tags, v) })),
  setMaxPrice: (maxPrice) => set({ maxPrice }),
  setOnSaleOnly: (onSaleOnly) => set({ onSaleOnly }),
  setSort: (sort) => set({ sort }),
  setView: (view) => set({ view }),
  reset: () => set({ ...initial }),
  activeCount: () => {
    const s = get()
    return (
      (s.search ? 1 : 0) +
      s.genres.length +
      s.tags.length +
      (s.maxPrice != null ? 1 : 0) +
      (s.onSaleOnly ? 1 : 0)
    )
  },
}))
