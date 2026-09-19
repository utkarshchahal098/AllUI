# NEONRUIN

A dark, cyberpunk storefront for a fictional game studio and marketplace. Buy games, browse the
catalogue, read the full act-by-act storyline of any best seller, and sell licences back to the
trade desk at a quoted price.

## Stack

| Concern | Choice |
| --- | --- |
| UI | React 19 + TypeScript |
| Routing | React Router 7 (lazy-loaded routes) |
| Server state | TanStack Query 5 |
| Client state | Zustand 5 (cart, library and filters; cart/library persisted) |
| Forms | React Hook Form + Zod |
| Motion | Framer Motion + CSS keyframes + a canvas horizon |
| Styling | Hand-written CSS with design tokens — no UI framework |

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc -b && vite build
npm run lint
```

## Routes

| Path | What it does |
| --- | --- |
| `/` | Hero with animated synthwave horizon, live price ticker, rotating spotlight, best sellers |
| `/browse` | Faceted catalogue — search, genre/tag filters, price ceiling, sort, grid/list views |
| `/game/:slug` | Dossier: overview, **storyline** (spoiler-gated acts), cast, spec sheet, buy panel |
| `/stories` | Story archive — pick a title, read its acts in an accordion reader |
| `/sell` | Trade desk — live quote from condition × demand, validated listing form, receipt |
| `/cart` | Line items, quantities, promo codes (`NEON15`, `RUIN25`, `STATIC10`), checkout |
| `/library` | Owned licences, credit balance, trade history |
| `/studio` | About the studio: teams, timeline, engine tech |

## How it is put together

- **`src/lib/api.ts`** is a simulated backend. Every call is async with jittered latency, so the
  TanStack Query layer (loading, `keepPreviousData`, cache keys, mutations) behaves exactly as it
  would against a real service. Swap this file for `fetch` calls and nothing else changes.
- **`src/data/games.ts`** holds the catalogue: 16 titles, five of them with full published
  storylines (acts, beats, endings) and principal cast.
- **`src/components/game/GamePoster.tsx`** generates every piece of cover art as inline SVG from a
  seeded PRNG — six art variants (skyline, visor, horizon, orbital, circuit, monolith) coloured by
  each title's palette. No image assets, no network requests.
- **`src/components/fx/NeonGrid.tsx`** draws the animated horizon on canvas: scrolling perspective
  grid, banded sun, drifting motes. Pauses when the tab is hidden and respects
  `prefers-reduced-motion`.
- **Stores** live in `src/store/`. `useCartStore` and `useLibraryStore` persist to localStorage;
  `useFilterStore` keeps browse filters across navigation; `useUiStore` drives toasts and the
  mobile drawer.

Motion is reduced to near-zero under `prefers-reduced-motion`, every interactive control is
keyboard reachable, and the layout is responsive from 390px up.
