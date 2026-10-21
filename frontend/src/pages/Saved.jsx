import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'
import PropertyGrid from '../components/PropertyGrid/PropertyGrid'
import { EmptyState, ErrorState } from '../components/ui/States'
import { useApp } from '../context/AppContext'
import { getSavedProperties } from '../services/propertyService'
import useDocTitle from '../hooks/useDocTitle'

export default function Saved() {
  useDocTitle('Saved')
  const { favorites } = useApp()
  const [items, setItems] = useState([])
  const [state, setState] = useState('loading')
  const [nonce, setNonce] = useState(0)

  useEffect(() => {
    let live = true
    getSavedProperties()
      .then((r) => { if (live) { setItems(r); setState('ready') } })
      .catch(() => live && setState('error'))
    return () => { live = false }
    // re-sync when the saved set changes
  }, [favorites, nonce])

  const visible = items.filter((p) => favorites.includes(p.id))

  return (
    <div className="container-x pb-12 pt-28 lg:pt-40">
      <p className="meta mb-5">Collection — Your shortlist</p>
      <h1 className="h-mega">Saved</h1>
      <p className="mb-12 mt-6 border-b border-line pb-4 font-display text-2xl font-semibold tracking-tight" aria-live="polite">{visible.length} {visible.length === 1 ? 'place' : 'places'}</p>
      {state === 'error' ? (
        <ErrorState onRetry={() => setNonce((n) => n + 1)} />
      ) : state === 'loading' ? (
        <PropertyGrid loading properties={[]} skeletons={3} />
      ) : visible.length === 0 ? (
        <EmptyState icon={Heart} title="Nothing saved yet." text="Tap the heart on any home to keep it here. Your saved places stay on this device." action="Find places to save" to="/explore" />
      ) : (
        <PropertyGrid properties={visible} />
      )}
    </div>
  )
}
