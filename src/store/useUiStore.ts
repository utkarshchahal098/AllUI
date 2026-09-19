import { create } from 'zustand'

export type ToastTone = 'info' | 'success' | 'warn' | 'error'

export interface Toast {
  id: number
  tone: ToastTone
  title: string
  body?: string
}

interface UiState {
  toasts: Toast[]
  navOpen: boolean
  searchOpen: boolean
  toast: (t: Omit<Toast, 'id'>) => void
  dismiss: (id: number) => void
  setNavOpen: (v: boolean) => void
  setSearchOpen: (v: boolean) => void
}

let seq = 0

export const useUiStore = create<UiState>()((set) => ({
  toasts: [],
  navOpen: false,
  searchOpen: false,

  toast: (t) => {
    const id = ++seq
    set((s) => ({ toasts: [...s.toasts, { ...t, id }] }))
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })), 4200)
  },

  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })),
  setNavOpen: (navOpen) => set({ navOpen }),
  setSearchOpen: (searchOpen) => set({ searchOpen }),
}))
