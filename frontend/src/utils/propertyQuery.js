export const PRICE_MAX = 8000

export const PROPERTY_TYPES = ['House', 'Villa', 'Townhouse', 'Apartment', 'Loft', 'Studio', 'Private Room']

export const defaultFilters = {
  priceMin: 0,
  priceMax: PRICE_MAX,
  location: '',
  types: [],
  bedrooms: 0,
  bathrooms: 0,
  furnished: false,
  instantBooking: false,
  tourAvailable: false,
  verified: false,
  availableBy: '',
}

export const SORT_OPTIONS = [
  { id: 'recommended', label: 'Recommended' },
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
  { id: 'distance', label: 'Distance' },
  { id: 'newest', label: 'Newest' },
  { id: 'rating', label: 'Rating' },
]

const haystack = (p) =>
  [p.name, p.city, p.state, p.zip, p.neighborhood, p.location, p.propertyType, ...(p.tags || [])]
    .join(' ')
    .toLowerCase()

export function matchesQuery(p, query) {
  const tokens = (query || '').toLowerCase().split(/[\s,]+/).filter(Boolean)
  if (!tokens.length) return true
  const h = haystack(p)
  return tokens.every((t) => h.includes(t))
}

export function matchesFilters(p, f) {
  if (p.price < f.priceMin || p.price > f.priceMax) return false
  if (f.location && p.city !== f.location) return false
  if (f.types.length && !f.types.includes(p.propertyType)) return false
  if (f.bedrooms && p.bedrooms < f.bedrooms) return false
  if (f.bathrooms && p.bathrooms < f.bathrooms) return false
  if (f.furnished && !p.furnished) return false
  if (f.instantBooking && !p.instantBooking) return false
  if (f.tourAvailable && !p.tourAvailable) return false
  if (f.verified && !p.verified) return false
  if (f.availableBy && p.availableFrom > f.availableBy) return false
  return true
}

const score = (p) => p.rating * 10 + (p.verified ? 4 : 0) + (p.instantBooking ? 2 : 0) - p.distance * 0.3

export function sortList(list, sort) {
  const l = [...list]
  switch (sort) {
    case 'price-asc':
      return l.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return l.sort((a, b) => b.price - a.price)
    case 'distance':
      return l.sort((a, b) => a.distance - b.distance)
    case 'newest':
      return l.sort((a, b) => (b.listedAt || '').localeCompare(a.listedAt || ''))
    case 'rating':
      return l.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews)
    default:
      return l.sort((a, b) => score(b) - score(a))
  }
}

export function applyQuery(list, { query = '', filters = defaultFilters, sort = 'recommended' } = {}) {
  const f = { ...defaultFilters, ...filters }
  return sortList(
    list.filter((p) => matchesQuery(p, query) && matchesFilters(p, f)),
    sort,
  )
}

export function countActiveFilters(f) {
  let n = 0
  if (f.priceMin > 0 || f.priceMax < PRICE_MAX) n++
  if (f.location) n++
  if (f.types.length) n++
  if (f.bedrooms) n++
  if (f.bathrooms) n++
  if (f.furnished) n++
  if (f.instantBooking) n++
  if (f.tourAvailable) n++
  if (f.verified) n++
  if (f.availableBy) n++
  return n
}
