import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import PropertyGrid from '../components/PropertyGrid/PropertyGrid'
import SortMenu from '../components/FilterBar/SortMenu'
import FilterDrawer from '../components/FilterBar/FilterDrawer'
import { EmptyState, ErrorState } from '../components/ui/States'
import { getCities, queryProperties } from '../services/propertyService'
import { countActiveFilters, defaultFilters, PRICE_MAX } from '../utils/propertyQuery'
import { money } from '../utils/format'
import useDebounce from '../hooks/useDebounce'
import useDocTitle from '../hooks/useDocTitle'

const chipsFor = (f) => {
  const out = []
  if (f.priceMin > 0 || f.priceMax < PRICE_MAX) out.push({ k: 'price', label: `${money(f.priceMin)} – ${money(f.priceMax)}`, clear: { priceMin: 0, priceMax: PRICE_MAX } })
  if (f.location) out.push({ k: 'loc', label: f.location, clear: { location: '' } })
  f.types.forEach((t) => out.push({ k: `t-${t}`, label: t, clear: { types: f.types.filter((x) => x !== t) } }))
  if (f.bedrooms) out.push({ k: 'bd', label: `${f.bedrooms}+ beds`, clear: { bedrooms: 0 } })
  if (f.bathrooms) out.push({ k: 'ba', label: `${f.bathrooms}+ baths`, clear: { bathrooms: 0 } })
  if (f.furnished) out.push({ k: 'fu', label: 'Furnished', clear: { furnished: false } })
  if (f.instantBooking) out.push({ k: 'ib', label: 'Instant booking', clear: { instantBooking: false } })
  if (f.tourAvailable) out.push({ k: 'tr', label: 'Tour available', clear: { tourAvailable: false } })
  if (f.verified) out.push({ k: 've', label: 'Verified', clear: { verified: false } })
  if (f.availableBy) out.push({ k: 'av', label: `By ${f.availableBy}`, clear: { availableBy: '' } })
  return out
}

export default function Explore() {
  useDocTitle('Explore', 'Browse verified homes, lofts, studios and rooms. Filter by price, type, bedrooms and availability.')
  const [params] = useSearchParams()
  const [q, setQ] = useState(params.get('q') || '')
  const [filters, setFilters] = useState(() => ({ ...defaultFilters, types: params.get('type') ? [params.get('type')] : [] }))
  const [sort, setSort] = useState('recommended')
  const [drawer, setDrawer] = useState(false)
  const [cities, setCities] = useState([])
  const [state, setState] = useState({ loading: true, error: null, items: [] })
  const [nonce, setNonce] = useState(0)
  const dq = useDebounce(q, 220)
  const first = useRef(true)

  useEffect(() => {
    getCities().then(setCities).catch(() => setCities([]))
  }, [])

  useEffect(() => {
    let live = true
    setState((s) => ({ ...s, loading: first.current, error: null }))
    queryProperties({ query: dq, filters, sort })
      .then((items) => {
        if (!live) return
        first.current = false
        setState({ loading: false, error: null, items })
      })
      .catch((e) => live && setState({ loading: false, error: e.message || 'Request failed', items: [] }))
    return () => {
      live = false
    }
  }, [dq, filters, sort, nonce])

  const active = countActiveFilters(filters)
  const chips = chipsFor(filters)
  const reset = () => {
    setQ('')
    setFilters(defaultFilters)
  }

  return (
    <div className="container-x pb-12 pt-28 lg:pt-40">
      <p className="meta mb-5">Index — All places</p>
      <h1 className="h-mega">Explore</h1>

      <div className="mt-10 flex flex-col gap-3 md:mt-14 md:flex-row md:items-center">
        <div role="search" className="flex h-12 flex-1 items-center gap-3 rounded-full border border-line bg-ink2 pl-1.5 pr-5 transition-colors focus-within:border-accent">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent text-ink"><Search className="h-4 w-4" aria-hidden="true" /></span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search city, ZIP, neighbourhood or name…"
            aria-label="Search properties"
            className="min-w-0 flex-1 bg-transparent text-sm placeholder:text-mute focus:outline-none [&::-webkit-search-cancel-button]:hidden"
          />
          {q && <button type="button" onClick={() => setQ('')} aria-label="Clear search" className="text-mute hover:text-bone"><X className="h-4 w-4" /></button>}
        </div>
        <div className="flex gap-3">
          <SortMenu value={sort} onChange={setSort} />
          <button
            type="button"
            onClick={() => setDrawer(true)}
            className="relative inline-flex h-12 flex-1 items-center justify-center gap-2.5 rounded-full border border-line px-5 text-sm transition-colors hover:bg-white/5 md:flex-none"
          >
            <SlidersHorizontal className="h-4 w-4 text-accent" aria-hidden="true" />
            <span className="meta !text-bone">Smart filter</span>
            {active > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 font-mono text-[0.65rem] text-ink">{active}</span>}
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {chips.length > 0 && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <ul className="flex flex-wrap gap-2 pt-5" aria-label="Active filters">
              {chips.map((c) => (
                <li key={c.k}>
                  <button type="button" onClick={() => setFilters((f) => ({ ...f, ...c.clear }))} className="chip !border-accent/50 text-accent">
                    {c.label} <X className="h-3 w-3" aria-hidden="true" />
                    <span className="sr-only">remove filter</span>
                  </button>
                </li>
              ))}
              <li><button type="button" onClick={() => setFilters(defaultFilters)} className="px-3 py-2 text-xs text-mute underline-offset-4 hover:text-bone hover:underline">Clear all</button></li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-10 mt-10 flex items-baseline justify-between border-b border-line pb-4" aria-live="polite">
        <p className="font-display text-2xl font-semibold tracking-tight">
          {state.loading ? 'Finding places…' : `${state.items.length} ${state.items.length === 1 ? 'place' : 'places'}`}
        </p>
        <p className="meta">{dq ? `For “${dq}”` : 'Everywhere'}</p>
      </div>

      {state.error ? (
        <ErrorState title="We could not load places" text={state.error} onRetry={() => setNonce((n) => n + 1)} />
      ) : state.loading ? (
        <PropertyGrid loading properties={[]} />
      ) : state.items.length === 0 ? (
        <EmptyState
          title="Nothing matches yet."
          text="Try a different city, widen your budget or remove a filter. New homes are added every week."
          action="Reset search & filters"
          onClick={reset}
        />
      ) : (
        <PropertyGrid key={`${dq}-${sort}-${JSON.stringify(filters)}`} properties={state.items} />
      )}

      <FilterDrawer open={drawer} onClose={() => setDrawer(false)} filters={filters} onApply={setFilters} cities={cities} query={dq} />
    </div>
  )
}
