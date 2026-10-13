import { users as seedUsers } from '../data/users'
import { ApiError, delay, read, remove, uid, write } from './_mock'

// NOTE: passwords are stored in plain text in localStorage because this is a mock.
// A real backend must hash passwords (bcrypt/argon2) and issue a session cookie or JWT.
const strip = ({ password, ...user }) => user
const allUsers = () => [...seedUsers, ...read('users', [])]

export const getSession = () => read('session', null)

export async function login({ email, password }) {
  await delay(450)
  const found = allUsers().find((u) => u.email.toLowerCase() === String(email).trim().toLowerCase())
  if (!found || found.password !== password) throw new ApiError('Incorrect email or password', 401)
  const session = strip(found)
  write('session', session)
  return session
}

export async function signup({ name, email, phone, password }) {
  await delay(550)
  if (allUsers().some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
    throw new ApiError('An account with this email already exists', 409)
  }
  const user = { id: uid('usr'), name: name.trim(), email: email.trim(), phone: phone.trim(), password, joined: new Date().toISOString() }
  write('users', [...read('users', []), user])
  const session = strip(user)
  write('session', session)
  return session
}

export async function logout() {
  await delay(120)
  remove('session')
}

export async function updateProfile(id, patch) {
  await delay(350)
  const session = { ...getSession(), ...patch }
  write('session', session)
  write('users', read('users', []).map((u) => (u.id === id ? { ...u, ...patch } : u)))
  return session
}
