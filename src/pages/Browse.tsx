import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import GameCard, { GameCardSkeleton } from '../components/game/GameCard'
import GameRow from '../components/game/GameRow'
import Empty from '../components/ui/Empty'
import Icon from '../components/ui/Icon'
import { stagger } from '../components/ui/motion'
import { useGamesQuery } from '../hooks/useGames'
import type { SortKey } from '../lib/api'
import { useFilterStore } from '../store/useFilterStore'

const SORTS: { value: SortKey; label: string }[] = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'sales', label: 'Best selling' },
  { value: 'rating', label: 'Highest rated' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: low → high' },
  { value: 'price-desc', label: 'Price: high → low' },
]

/** Debounce the free-text field so we are not re-querying on every keystroke. */
function useDebounced<T>(value: T, ms = 260) {
  const [v, setV] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms)
    return () => clearTimeout(t)
  }, [value, ms])
  return v
}

export default function Browse() {
  const f = useFilterStore()
  const [params, setParams] = useSearchParams()
  const [panelOpen, setPanelOpen] = useState(false)
  const debouncedSearch = useDebounced(f.search)

  // Deep links: /browse?sale=1&genre=Horror&q=...
  useEffect(() => {
    const q = params.get('q')
    const genre = params.get('genre')
    const sale = params.get('sale')
    if (q) f.setSearch(q)
    if (genre && !f.genres.includes(genre)) f.toggleGenre(genre)
    if (sale === '1') f.setOnSaleOnly(true)
    if (q || genre || sale) setParams({}, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const query = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      genres: f.genres.length ? f.genres : undefined,
      tags: f.tags.length ? f.tags : undefined,
      maxPrice: f.maxPrice ?? undefined,
      onSaleOnly: f.onSaleOnly || undefined,
      sort: f.sort,
    }),
    [debouncedSearch, f.genres, f.tags, f.maxPrice, f.onSaleOnly, f.sort],
  )

  const { data, isPending, isFetching } = useGamesQuery(query)
  const facets = data?.facets
  const ceiling = facets?.priceCeiling ?? 70
  const activeCount = f.activeCount()

  const filters = (
    <div className="filters">
      <div className="filter-group">
        <p className="label">Search</p>
        <div className="filter-search">
          <Icon name="search" size={14} />
          <input
            className="input"
            value={f.search}
            onChange={(e) => f.setSearch(e.target.value)}
            placeholder="Title, studio, tag…"
            aria-label="Search catalogue"
          />
          {f.search && (
            <button className="filter-clear" onClick={() => f.setSearch('')} aria-label="Clear search">
              <Icon name="close" size={13} />
            </button>
          )}
        </div>
      </div>

      <hr className="rule" />

      <div className="filter-group">
        <p className="label">Genre</p>
        <div className="filter-chips">
          {facets?.genres.map((g) => (
            <button
              key={g.value}
              className={`filter-chip ${f.genres.includes(g.value) ? 'is-on' : ''}`}
              onClick={() => f.toggleGenre(g.value)}
              aria-pressed={f.genres.includes(g.value)}
            >
              {g.value}
              <span className="mono filter-count">{g.count}</span>
            </button>
          ))}
        </div>
      </div>

      <hr className="rule" />

      <div className="filter-group">
        <p className="label">Tags — matches all</p>
        <div className="filter-chips">
          {facets?.tags.slice(0, 14).map((t) => (
            <button
              key={t.value}
              className={`filter-chip ${f.tags.includes(t.value) ? 'is-on' : ''}`}
              onClick={() => f.toggleTag(t.value)}
              aria-pressed={f.tags.includes(t.value)}
            >
              {t.value}
            </button>
          ))}
        </div>
      </div>

      <hr className="rule" />

      <div className="filter-group">
        <p className="label">
          Max price <span className="mono filter-val">{f.maxPrice == null ? 'Any' : `${f.maxPrice} CR`}</span>
        </p>
        <input
          className="range"
          type="range"
          min={5}
          max={ceiling}
          step={1}
          value={f.maxPrice ?? ceiling}
          onChange={(e) => f.setMaxPrice(Number(e.target.value) >= ceiling ? null : Number(e.target.value))}
          aria-label="Maximum price"
        />
        <div className="filter-range-ends mono">
          <span>5 CR</span>
          <span>{ceiling} CR</span>
        </div>
      </div>

      <hr className="rule" />

      <label className="switch">
        <input type="checkbox" checked={f.onSaleOnly} onChange={(e) => f.setOnSaleOnly(e.target.checked)} />
        <span className="switch-track" aria-hidden="true">
          <span className="switch-thumb" />
        </span>
        <span>Discounted only</span>
      </label>

      {activeCount > 0 && (
        <button className="btn btn-sm btn-ghost btn-block" onClick={f.reset}>
          <Icon name="close" size={13} /> Clear {activeCount} filter{activeCount > 1 ? 's' : ''}
        </button>
      )}
    </div>
  )

  return (
    <div className="shell page browse">
      <header className="browse-head">
        <div>
          <p className="kicker">// Catalogue</p>
          <h1 className="display d-lg">Browse games</h1>
          <p className="lede">
            {isPending ? 'Querying the storefront index…' : `${data?.total ?? 0} titles match your filter set.`}
          </p>
        </div>

        <div className="browse-tools">
          <button
            className={`btn btn-sm ${activeCount ? 'btn-primary' : 'btn-ghost'} browse-filter-btn`}
            onClick={() => setPanelOpen((v) => !v)}
            aria-expanded={panelOpen}
          >
            <Icon name="filter" size={13} /> Filters{activeCount ? ` (${activeCount})` : ''}
          </button>

          <div className="segmented" role="group" aria-label="Layout">
            <button
              className={f.view === 'grid' ? 'is-on' : ''}
              onClick={() => f.setView('grid')}
              aria-label="Grid view"
              aria-pressed={f.view === 'grid'}
            >
              <Icon name="grid" size={14} />
            </button>
            <button
              className={f.view === 'list' ? 'is-on' : ''}
              onClick={() => f.setView('list')}
              aria-label="List view"
              aria-pressed={f.view === 'list'}
            >
              <Icon name="list" size={14} />
            </button>
          </div>

          <select
            className="select browse-sort"
            value={f.sort}
            onChange={(e) => f.setSort(e.target.value as SortKey)}
            aria-label="Sort by"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </header>

      <div className="browse-layout">
        <aside className={`browse-aside panel cut ${panelOpen ? 'is-open' : ''}`} aria-label="Filters">
          {filters}
        </aside>

        <section className={`browse-results ${isFetching && !isPending ? 'is-refetching' : ''}`}>
          {isPending ? (
            <div className="grid-games">
              {Array.from({ length: 8 }, (_, i) => (
                <GameCardSkeleton key={i} />
              ))}
            </div>
          ) : !data?.items.length ? (
            <Empty
              title="No signal"
              body="Nothing in the catalogue matches that combination. Loosen a filter and try the query again."
              action={
                <button className="btn btn-primary" onClick={f.reset}>
                  Reset filters
                </button>
              }
            />
          ) : f.view === 'grid' ? (
            <motion.div className="grid-games" variants={stagger} initial="hidden" animate="show" key={f.sort + f.view}>
              {data.items.map((g) => (
                <GameCard key={g.id} game={g} />
              ))}
            </motion.div>
          ) : (
            <motion.div className="rows" variants={stagger} initial="hidden" animate="show" key={f.sort + f.view}>
              {data.items.map((g) => (
                <GameRow key={g.id} game={g} />
              ))}
            </motion.div>
          )}
        </section>
      </div>
    </div>
  )
}
