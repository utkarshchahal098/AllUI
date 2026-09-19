import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Condition, ListingReceipt } from '../lib/api'

export interface OwnedLicence {
  id: string
  slug: string
  title: string
  acquiredAt: number
  pricePaid: number
  hoursPlayed: number
}

export interface SoldRecord {
  listingId: string
  gameId: string
  title: string
  condition: Condition
  askingPrice: number
  soldAt: number
}

interface LibraryState {
  credits: number
  owned: OwnedLicence[]
  sold: SoldRecord[]
  grant: (licences: Omit<OwnedLicence, 'acquiredAt' | 'hoursPlayed'>[]) => void
  spend: (amount: number) => boolean
  deposit: (amount: number) => void
  recordSale: (r: ListingReceipt, title: string) => void
  ownsGame: (id: string) => boolean
  reset: () => void
}

const STARTING_CREDITS = 250

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set, get) => ({
      credits: STARTING_CREDITS,
      owned: [],
      sold: [],

      grant: (licences) =>
        set((s) => {
          const ownedIds = new Set(s.owned.map((o) => o.id))
          const fresh = licences
            .filter((l) => !ownedIds.has(l.id))
            .map((l) => ({ ...l, acquiredAt: Date.now(), hoursPlayed: 0 }))
          return { owned: [...fresh, ...s.owned] }
        }),

      spend: (amount) => {
        if (get().credits < amount) return false
        set((s) => ({ credits: Math.round((s.credits - amount) * 100) / 100 }))
        return true
      },

      deposit: (amount) => set((s) => ({ credits: Math.round((s.credits + amount) * 100) / 100 })),

      recordSale: (r, title) =>
        set((s) => ({
          credits: Math.round((s.credits + r.payload.askingPrice - r.escrow) * 100) / 100,
          sold: [
            {
              listingId: r.id,
              gameId: r.payload.gameId,
              title,
              condition: r.payload.condition,
              askingPrice: r.payload.askingPrice,
              soldAt: r.postedAt,
            },
            ...s.sold,
          ],
          owned: s.owned.filter((o) => o.id !== r.payload.gameId),
        })),

      ownsGame: (id) => get().owned.some((o) => o.id === id),

      reset: () => set({ credits: STARTING_CREDITS, owned: [], sold: [] }),
    }),
    { name: 'neonruin.library', version: 1 },
  ),
)
