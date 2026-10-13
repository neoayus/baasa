import { seedBookings } from '../data/users'
import { ApiError, delay, read, refCode, uid, write } from './_mock'

const all = () => {
  const stored = read('bookings', null)
  if (stored) return stored
  write('bookings', seedBookings)
  return seedBookings
}

export const bookingTotals = (monthly) => {
  const deposit = monthly
  const fee = Math.round(monthly * 0.03)
  return { rent: monthly, deposit, fee, total: monthly + deposit + fee }
}

export async function getBookings(userId) {
  await delay(200)
  return all()
    .filter((b) => b.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function createBooking(data) {
  await delay(900)
  if (!data.userId) throw new ApiError('Please log in to book', 401)
  const { property } = data
  const totals = bookingTotals(property.price)
  const booking = {
    id: uid('bk'),
    ref: refCode(),
    userId: data.userId,
    propertyId: property.id,
    propertyName: property.name,
    city: property.city,
    state: property.state,
    image: property.images[0],
    monthly: property.price,
    moveIn: data.moveIn,
    months: data.months,
    occupants: data.occupants,
    guest: { name: data.name, email: data.email, phone: data.phone, notes: data.notes || '' },
    payment: { last4: String(data.cardNumber || '').replace(/\D/g, '').slice(-4) },
    status: property.instantBooking ? 'upcoming' : 'pending',
    total: totals.total,
    createdAt: new Date().toISOString(),
  }
  write('bookings', [booking, ...all()])
  return booking
}

export async function cancelBooking(id) {
  await delay(400)
  const list = all()
  const target = list.find((b) => b.id === id)
  if (!target) throw new ApiError('Booking not found', 404)
  write('bookings', list.map((b) => (b.id === id ? { ...b, status: 'cancelled' } : b)))
  return { ...target, status: 'cancelled' }
}
