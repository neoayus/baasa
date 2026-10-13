import { delay, read, write } from './_mock'

export const VERIFICATION_FEE = 19
export const TYPES = ['identity', 'contact', 'property']
const REVIEW_MS = 12000 // how long the mock "review" takes before resolving

const blank = (userId) => ({
  userId,
  feePaid: false,
  identity: { status: 'not_verified' },
  contact: { status: 'not_verified' },
  property: { status: 'not_verified' },
})

const seed = (userId) => {
  const rec = blank(userId)
  if (userId === 'usr_demo') rec.contact = { status: 'verified', submittedAt: Date.now() - 86400000 * 30 }
  return rec
}

const resolveRecord = (rec) => {
  let changed = false
  TYPES.forEach((t) => {
    const item = rec[t]
    if (item.status === 'pending' && Date.now() - item.submittedAt >= REVIEW_MS) {
      item.status = String(item.note || '').toLowerCase().includes('reject') ? 'rejected' : 'verified'
      changed = true
    }
  })
  return changed
}

export const overallStatus = (rec) => {
  const states = TYPES.map((t) => rec[t].status)
  if (states.includes('rejected')) return 'rejected'
  if (states.every((s) => s === 'verified')) return 'verified'
  if (states.includes('pending')) return 'pending'
  return 'not_verified'
}

export async function getVerification(userId) {
  await delay(150)
  const store = read('verification', {})
  const rec = store[userId] || seed(userId)
  if (resolveRecord(rec) || !store[userId]) write('verification', { ...store, [userId]: rec })
  return { ...rec, overall: overallStatus(rec), fee: VERIFICATION_FEE }
}

export async function submitVerification({ userId, type, note, details }) {
  await delay(800)
  const store = read('verification', {})
  const rec = store[userId] || seed(userId)
  rec[type] = { status: 'pending', submittedAt: Date.now(), note: note || '', details: details || {} }
  rec.feePaid = true
  write('verification', { ...store, [userId]: rec })
  return { ...rec, overall: overallStatus(rec), fee: VERIFICATION_FEE }
}
