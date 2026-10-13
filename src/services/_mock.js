/**
 * Shared helpers for the mock service layer.
 * Every service function is async and returns plain objects, exactly like an HTTP client would.
 * To go live, replace the bodies of the service functions with calls to `http` (see README).
 */
export const API_URL = import.meta.env.VITE_API_URL || ''

export const delay = (ms = 220) => new Promise((resolve) => setTimeout(resolve, ms + Math.random() * 160))

export class ApiError extends Error {
  constructor(message, status = 400) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

const PREFIX = 'alcove:'

export const read = (key, fallback) => {
  try {
    const v = localStorage.getItem(PREFIX + key)
    return v == null ? fallback : JSON.parse(v)
  } catch {
    return fallback
  }
}

export const write = (key, value) => {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export const remove = (key) => {
  try {
    localStorage.removeItem(PREFIX + key)
  } catch {
    /* ignore */
  }
}

export const uid = (prefix = 'id') => `${prefix}_${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`

export const refCode = () =>
  `ALC-${Math.random().toString(36).replace(/[^a-z0-9]/g, '').slice(0, 6).toUpperCase().padEnd(6, 'X')}`

/**
 * Minimal fetch wrapper you can use once a real API exists:
 *   const items = await http.get('/properties')
 */
export const http = {
  async request(path, options = {}) {
    const res = await fetch(`${API_URL}${path}`, {
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options,
    })
    if (!res.ok) throw new ApiError(`Request failed (${res.status})`, res.status)
    return res.json()
  },
  get: (path) => http.request(path),
  post: (path, body) => http.request(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: (path, body) => http.request(path, { method: 'PATCH', body: JSON.stringify(body) }),
}
