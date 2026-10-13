export const money = (n, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n || 0)

export const fmtDate = (d, opts = { month: 'short', day: 'numeric', year: 'numeric' }) => {
  if (!d) return ''
  const dt = new Date(String(d).length === 10 ? `${d}T00:00:00` : d)
  if (Number.isNaN(dt.getTime())) return ''
  return dt.toLocaleDateString('en-US', opts)
}

export const pad = (n) => String(n).padStart(2, '0')
export const todayISO = () => new Date().toISOString().slice(0, 10)
export const km = (n) => `${Number(n).toFixed(1)} km away`
export const bedLabel = (b) => (b === 0 ? 'Studio' : `${b} bed${b > 1 ? 's' : ''}`)
export const initials = (name = '') =>
  name.split(' ').filter(Boolean).slice(0, 2).map((s) => s[0].toUpperCase()).join('') || 'A'

// Swap the width parameter on image URLs so cards load smaller files than the gallery.
export const imgW = (url, w) => (typeof url === 'string' && url.includes('w=') ? url.replace(/w=\d+/, `w=${w}`) : url)
