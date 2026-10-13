import { properties as seed } from '../data/properties'
import { applyQuery } from '../utils/propertyQuery'
import { CITY_ORDER } from '../data/extras'
import { ApiError, delay, read, uid, write } from './_mock'

// Real API: GET /properties — merged here with listings created in this browser.
const all = () => [...read('listings', []), ...seed]

export async function getProperties() {
  await delay()
  return all()
}

export async function getPropertyById(id) {
  await delay(160)
  const found = all().find((p) => p.id === id)
  if (!found) throw new ApiError('Property not found', 404)
  return found
}

export async function searchProperties(query) {
  await delay(60)
  return applyQuery(all(), { query })
}

export async function queryProperties(options) {
  await delay()
  return applyQuery(all(), options)
}

export async function getCities() {
  const counts = {}
  all().forEach((p) => {
    counts[p.city] = (counts[p.city] || 0) + 1
  })
  return Object.keys(counts).sort((a, b) => {
    const ia = CITY_ORDER.indexOf(a)
    const ib = CITY_ORDER.indexOf(b)
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib)
  }).map((city) => ({ city, count: counts[city] }))
}

export async function getSimilar(property, limit = 3) {
  await delay(120)
  return applyQuery(all().filter((p) => p.id !== property.id), { sort: 'recommended' })
    .sort((a, b) => Number(b.city === property.city) - Number(a.city === property.city))
    .slice(0, limit)
}

/* ---------- saved ---------- */
export const getSavedIds = () => read('favorites', [])

export async function saveProperty(id) {
  const ids = getSavedIds()
  const saved = !ids.includes(id)
  const next = saved ? [...ids, id] : ids.filter((x) => x !== id)
  write('favorites', next)
  await delay(60)
  return { saved, ids: next }
}

export async function getSavedProperties() {
  await delay()
  const ids = getSavedIds()
  return all().filter((p) => ids.includes(p.id))
}

/* ---------- listings ---------- */
export async function createListing(data, user) {
  await delay(700)
  const listing = {
    id: uid('lst'),
    name: data.name.trim(),
    description: data.description.trim(),
    city: data.city.trim(),
    state: data.state.trim().toUpperCase(),
    zip: data.zip.trim(),
    neighborhood: data.neighborhood.trim() || data.city.trim(),
    location: `${data.neighborhood.trim() || data.city.trim()}, ${data.city.trim()}, ${data.state.trim().toUpperCase()}`,
    distance: 1.5,
    price: Number(data.price),
    currency: 'USD',
    propertyType: data.propertyType,
    bedrooms: Number(data.bedrooms),
    bathrooms: Number(data.bathrooms),
    sqft: Number(data.sqft) || 0,
    furnished: !!data.furnished,
    images: data.images,
    amenities: data.amenities,
    tags: data.amenities.slice(0, 3),
    verified: false,
    instantBooking: !!data.instantBooking,
    tourAvailable: !!data.tourAvailable,
    availableFrom: data.availableFrom,
    listedAt: new Date().toISOString().slice(0, 10),
    rating: 4.5,
    reviews: 0,
    owner: { id: user.id, name: user.name, since: new Date().getFullYear(), response: 'within a day', listings: 1, verified: false },
    ownerUserId: user.id,
    verifyRequested: !!data.requestVerification,
  }
  const ok = write('listings', [listing, ...read('listings', [])])
  if (!ok) throw new ApiError('Your browser storage is full. Try fewer or smaller photos.', 507)
  return listing
}

export async function getListingsByOwner(userId) {
  await delay(150)
  return read('listings', []).filter((l) => l.ownerUserId === userId)
}
