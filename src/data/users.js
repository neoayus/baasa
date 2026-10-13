import { properties } from './properties'

export const users = [
  {
    id: 'usr_demo',
    name: 'Maya Okafor',
    email: 'demo@alcove.house',
    password: 'demo1234',
    phone: '+1 512 555 0142',
    joined: '2026-02-14T00:00:00.000Z',
  },
]

export const DEMO_CREDENTIALS = { email: 'demo@alcove.house', password: 'demo1234' }

const snap = (id) => {
  const p = properties.find((x) => x.id === id)
  return { propertyId: p.id, propertyName: p.name, city: p.city, state: p.state, image: p.images[0], monthly: p.price }
}

export const seedBookings = [
  { id: 'bk_seed1', ref: 'ALC-48K2QX', userId: 'usr_demo', ...snap('alc-008'), moveIn: '2026-11-01', months: 6, occupants: 1, status: 'upcoming', total: 8353, createdAt: '2026-10-01T10:00:00.000Z' },
  { id: 'bk_seed2', ref: 'ALC-71M9TD', userId: 'usr_demo', ...snap('alc-001'), moveIn: '2026-12-01', months: 3, occupants: 2, status: 'pending', total: 8526, createdAt: '2026-10-06T15:20:00.000Z' },
  { id: 'bk_seed3', ref: 'ALC-19P3ZA', userId: 'usr_demo', ...snap('alc-005'), moveIn: '2026-03-01', months: 6, occupants: 1, status: 'completed', total: 4364, createdAt: '2026-02-10T09:12:00.000Z' },
  { id: 'bk_seed4', ref: 'ALC-33H8WB', userId: 'usr_demo', ...snap('alc-012'), moveIn: '2026-09-15', months: 12, occupants: 1, status: 'cancelled', total: 2334, createdAt: '2026-08-20T18:40:00.000Z' },
]
