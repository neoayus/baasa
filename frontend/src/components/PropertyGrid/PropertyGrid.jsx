import PropertyCard from '../PropertyCard/PropertyCard'
import { SkeletonCard } from '../ui/States'
import { cn } from '../../utils/cn'

/** Editorial grid: 1 column on mobile, 2 on tablet, 3 on desktop with a staggered middle column. */
export default function PropertyGrid({ properties, loading = false, className, skeletons = 6, columns = 3 }) {
  return (
    <div
      className={cn(
        'grid gap-x-6 gap-y-14 sm:grid-cols-2',
        columns === 3 ? 'lg:grid-cols-3 lg:[&>*:nth-child(3n+2)]:mt-14' : 'lg:grid-cols-2',
        className,
      )}
    >
      {loading
        ? Array.from({ length: skeletons }, (_, i) => <SkeletonCard key={i} />)
        : properties.map((p, i) => <PropertyCard key={p.id} property={p} index={i} />)}
    </div>
  )
}
