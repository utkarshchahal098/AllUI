import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { finalPrice, type Game } from '../data/games'

export interface CartLine {
  id: string
  slug: string
  title: string
  studio: string
  unitPrice: number
  listPrice: number
  qty: number
  palette: [string, string]
}

interface CartState {
  lines: CartLine[]
  promo: string | null
  add: (game: Game) => void
  remove: (id: string) => void
  setQty: (id: string, qty: number) => void
  clear: () => void
  applyPromo: (code: string) => boolean
  clearPromo: () => void
  has: (id: string) => boolean
}

export const PROMO_CODES: Record<string, number> = {
  NEON15: 0.15,
  RUIN25: 0.25,
  STATIC10: 0.1,
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      promo: null,

      add: (game) =>
        set((s) => {
          const existing = s.lines.find((l) => l.id === game.id)
          if (existing) {
            return { lines: s.lines.map((l) => (l.id === game.id ? { ...l, qty: Math.min(9, l.qty + 1) } : l)) }
          }
          return {
            lines: [
              ...s.lines,
              {
                id: game.id,
                slug: game.slug,
                title: game.title,
                studio: game.studio,
                unitPrice: finalPrice(game),
                listPrice: game.price,
                qty: 1,
                palette: game.palette,
              },
            ],
          }
        }),

      remove: (id) => set((s) => ({ lines: s.lines.filter((l) => l.id !== id) })),

      setQty: (id, qty) =>
        set((s) => ({
          lines:
            qty <= 0
              ? s.lines.filter((l) => l.id !== id)
              : s.lines.map((l) => (l.id === id ? { ...l, qty: Math.min(9, qty) } : l)),
        })),

      clear: () => set({ lines: [], promo: null }),

      applyPromo: (code) => {
        const key = code.trim().toUpperCase()
        if (!(key in PROMO_CODES)) return false
        set({ promo: key })
        return true
      },

      clearPromo: () => set({ promo: null }),

      has: (id) => get().lines.some((l) => l.id === id),
    }),
    { name: 'neonruin.cart', version: 1 },
  ),
)

/* ---- derived selectors (kept outside the store to stay referentially safe) ---- */
export const cartCount = (lines: CartLine[]) => lines.reduce((n, l) => n + l.qty, 0)
export const cartSubtotal = (lines: CartLine[]) => lines.reduce((n, l) => n + l.unitPrice * l.qty, 0)
export const cartSaved = (lines: CartLine[]) =>
  lines.reduce((n, l) => n + (l.listPrice - l.unitPrice) * l.qty, 0)
