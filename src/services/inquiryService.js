import { delay, read, refCode, uid, write } from './_mock'

export async function createInquiry(data) {
  await delay(700)
  const inquiry = {
    id: uid('inq'),
    ref: refCode(),
    userId: data.userId || null,
    propertyId: data.propertyId,
    propertyName: data.propertyName,
    name: data.name,
    email: data.email,
    phone: data.phone,
    moveIn: data.moveIn,
    message: data.message,
    contactPreference: data.contactPreference,
    status: 'sent',
    createdAt: new Date().toISOString(),
  }
  write('inquiries', [inquiry, ...read('inquiries', [])])
  return inquiry
}

export async function getInquiries(userId) {
  await delay(150)
  return read('inquiries', []).filter((i) => i.userId === userId)
}

/** Housing-expert, partner and support requests share one mock collection. */
export async function createExpertRequest(data) {
  await delay(800)
  const request = { id: uid('req'), ref: refCode(), type: data.type || 'expert', ...data, createdAt: new Date().toISOString() }
  write('requests', [request, ...read('requests', [])])
  return request
}
