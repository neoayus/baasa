import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import PropertyGrid from '../components/PropertyGrid/PropertyGrid'
import SearchBar from '../components/SearchBar/SearchBar'
import { EmptyState, ErrorState } from '../components/ui/States'
import { getCities, searchProperties } from '../services/propertyService'
import useDocTitle from '../hooks/useDocTitle'

export default function Search() {
  const [params] = useSearchParams()
  const q = (params.get('q') || '').trim()
  useDocTitle(q ? `Search: ${q}` : 'Search')
  const [state, setState] = useState({ loading: true, error: null, items: [] })
  const [cities, setCities] = useState([])
  const [nonce, setNonce] = useState(0)

  useEffect(() => {
    getCities().then(setCities).catch(() => setCities([]))
  }, [])

  useEffect(() => {
    let live = true
    setState((s) => ({ ...s, loading: true, error: null }))
    searchProperties(q)
      .then((items) => live && setState({ loading: false, error: null, items }))
      .catch((e) => live && setState({ loading: false, error: e.message || 'Request failed', items: [] }))
    return () => {
      live = false
    }
  }, [q, nonce])

  return (
    <div className="container-x pb-12 pt-28 lg:pt-40">
      <p className="meta mb-5">Search results</p>
      <h1 className="h-xl max-w-5xl">{q ? <>Results for <span className="text-accent">“{q}”</span></> : 'Search every place'}</h1>
      <div className="mt-10"><SearchBar key={q} variant="hero" defaultValue={q} placeholder="Try “Austin”, “78701” or “loft”…" /></div>

      <div className="mb-10 mt-12 flex items-baseline justify-between border-b border-line pb-4" aria-live="polite">
        <p className="font-display text-2xl font-semibold tracking-tight">{state.loading ? 'Searching…' : `${state.items.length} ${state.items.length === 1 ? 'result' : 'results'}`}</p>
        <Link to="/explore" className="meta underline-offset-4 hover:text-bone hover:underline">Use filters instead</Link>
      </div>

      {state.error ? (
        <ErrorState title="Search failed" text={state.error} onRetry={() => setNonce((n) => n + 1)} />
      ) : state.loading ? (
        <PropertyGrid loading properties={[]} />
      ) : state.items.length === 0 ? (
        <div>
          <EmptyState title={`No places match “${q}”.`} text="Check the spelling or try a city, ZIP code or neighbourhood. These are good places to start:" action="Browse all places" to="/explore" />
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {cities.slice(0, 8).map((c) => <Link key={c.city} to={`/search?q=${encodeURIComponent(c.city)}`} className="chip">{c.city}</Link>)}
          </div>
        </div>
      ) : (
        <PropertyGrid properties={state.items} />
      )}
    </div>
  )
}
