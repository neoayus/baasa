import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Field, Switch } from '../components/ui/Field'
import { Spinner } from '../components/ui/States'
import { StatusPill } from './Verification'
import PropertyCard from '../components/PropertyCard/PropertyCard'
import { BookingCard } from './Bookings'
import { useApp } from '../context/AppContext'
import { getSavedProperties, getListingsByOwner } from '../services/propertyService'
import { getBookings } from '../services/bookingService'
import { getInquiries } from '../services/inquiryService'
import { getVerification } from '../services/verificationService'
import { validate } from '../utils/validate'
import { cn } from '../utils/cn'
import { fmtDate, initials } from '../utils/format'
import useDocTitle from '../hooks/useDocTitle'

const TABS = [['profile', 'Profile'], ['verification', 'Verification'], ['saved', 'Saved'], ['bookings', 'Bookings'], ['inquiries', 'Inquiries'], ['listings', 'Listings'], ['settings', 'Settings']]

export default function Profile() {
  useDocTitle('Profile')
  const { user, favorites, updateUser, logout } = useApp()
  const navigate = useNavigate()
  const [tab, setTab] = useState('profile')
  const [data, setData] = useState({ saved: [], bookings: [], inquiries: [], listings: [], verification: null })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let live = true
    setLoading(true)
    Promise.all([getSavedProperties(), getBookings(user.id), getInquiries(user.id), getListingsByOwner(user.id), getVerification(user.id)])
      .then(([saved, bookings, inquiries, listings, verification]) => live && setData({ saved, bookings, inquiries, listings, verification }))
      .catch(() => {})
      .finally(() => live && setLoading(false))
    return () => { live = false }
  }, [user.id, favorites])

  return (
    <div className="container-x pb-12 pt-28 lg:pt-40">
      <div className="flex flex-wrap items-center gap-6">
        <span className="grid h-24 w-24 place-items-center rounded-full bg-accent font-display text-3xl font-semibold text-ink">{initials(user.name)}</span>
        <div>
          <p className="meta mb-2">Member since {fmtDate(user.joined, { month: 'long', year: 'numeric' })}</p>
          <h1 className="h-xl !text-[clamp(2.2rem,6vw,5rem)]">{user.name}</h1>
        </div>
        {data.verification && <StatusPill status={data.verification.overall} className="sm:ml-auto" />}
      </div>

      <div role="tablist" aria-label="Profile sections" className="no-scrollbar -mx-5 mt-12 flex gap-1 overflow-x-auto border-b border-line px-5 sm:mx-0 sm:px-0">
        {TABS.map(([id, label]) => (
          <button key={id} role="tab" type="button" aria-selected={tab === id} onClick={() => setTab(id)} className={cn('relative shrink-0 px-4 py-4 text-sm transition-colors', tab === id ? 'text-bone' : 'text-mute hover:text-bone')}>
            {label}
            {tab === id && <motion.span layoutId="profile-tab" className="absolute inset-x-3 bottom-0 h-0.5 bg-accent" />}
          </button>
        ))}
      </div>

      <motion.div key={tab} role="tabpanel" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mt-10">
        {tab === 'profile' && <ProfileForm user={user} onSave={updateUser} />}

        {tab === 'verification' && (
          <div className="grid gap-4 sm:grid-cols-3">
            {loading || !data.verification ? <Spinner className="text-accent" /> : ['identity', 'contact', 'property'].map((t) => (
              <div key={t} className="card p-6"><p className="meta mb-4 capitalize">{t}</p><StatusPill status={data.verification[t].status} /></div>
            ))}
            <div className="sm:col-span-3"><Link to="/verification" className="btn-accent">Open verification centre</Link></div>
          </div>
        )}

        {tab === 'saved' && (loading ? <Spinner className="text-accent" /> : data.saved.length === 0
          ? <Empty text="You have not saved any places yet." to="/explore" cta="Explore places" />
          : <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">{data.saved.map((p, i) => <PropertyCard key={p.id} property={p} index={i} reveal={false} />)}</div>)}

        {tab === 'bookings' && (loading ? <Spinner className="text-accent" /> : data.bookings.length === 0
          ? <Empty text="No bookings yet." to="/explore" cta="Find a place" />
          : <ol className="space-y-4">{data.bookings.map((b) => <BookingCard key={b.id} b={b} onCancel={() => navigate('/bookings')} />)}</ol>)}

        {tab === 'inquiries' && (loading ? <Spinner className="text-accent" /> : data.inquiries.length === 0
          ? <Empty text="You have not sent any inquiries." to="/explore" cta="Browse homes" />
          : <ul className="divide-y divide-line border-y border-line">
              {data.inquiries.map((i) => (
                <li key={i.id} className="flex flex-wrap items-center justify-between gap-4 py-5">
                  <div><Link to={`/property/${i.propertyId}`} className="font-display text-xl font-semibold hover:text-accent">{i.propertyName}</Link><p className="mt-1 max-w-xl truncate text-sm text-mute">{i.message}</p></div>
                  <p className="meta">{i.ref} · {fmtDate(i.createdAt)}</p>
                </li>
              ))}
            </ul>)}

        {tab === 'listings' && (loading ? <Spinner className="text-accent" /> : data.listings.length === 0
          ? <Empty text="You have not listed a property yet." to="/list-property" cta="List a property" />
          : <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">{data.listings.map((p, i) => <PropertyCard key={p.id} property={p} index={i} reveal={false} />)}</div>)}

        {tab === 'settings' && <SettingsPanel onLogout={async () => { await logout(); navigate('/') }} />}
      </motion.div>
    </div>
  )
}

function Empty({ text, to, cta }) {
  return (
    <div className="card flex flex-col items-start gap-5 p-8">
      <p className="text-mute">{text}</p>
      <Link to={to} className="btn-accent">{cta}</Link>
    </div>
  )
}

function ProfileForm({ user, onSave }) {
  const [v, setV] = useState({ name: user.name, email: user.email, phone: user.phone || '' })
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const set = (k) => (e) => setV((s) => ({ ...s, [k]: e.target.value }))
  const submit = async (e) => {
    e.preventDefault()
    const errs = validate(v, { name: { required: true }, email: { required: true, email: true }, phone: { required: true, phone: true } })
    setErrors(errs)
    if (Object.keys(errs).length) return
    setBusy(true)
    try { await onSave(v) } finally { setBusy(false) }
  }
  return (
    <form onSubmit={submit} noValidate className="grid max-w-2xl gap-5 sm:grid-cols-2">
      <Field label="Name" required className="sm:col-span-2" value={v.name} onChange={set('name')} error={errors.name} />
      <Field label="Email" type="email" required value={v.email} onChange={set('email')} error={errors.email} />
      <Field label="Phone" type="tel" required value={v.phone} onChange={set('phone')} error={errors.phone} />
      <div className="sm:col-span-2"><button type="submit" disabled={busy} className="btn-accent min-w-40">{busy ? <Spinner /> : 'Save changes'}</button></div>
    </form>
  )
}

function SettingsPanel({ onLogout }) {
  const [s, setS] = useState({ email: true, tours: true, news: false })
  return (
    <div className="max-w-xl">
      <div className="divide-y divide-line border-y border-line">
        <Switch checked={s.email} onChange={(x) => setS({ ...s, email: x })} label="Booking and inquiry emails" description="Updates when owners reply" />
        <Switch checked={s.tours} onChange={(x) => setS({ ...s, tours: x })} label="Tour reminders" />
        <Switch checked={s.news} onChange={(x) => setS({ ...s, news: x })} label="New listings in my saved cities" />
      </div>
      <button type="button" onClick={onLogout} className="btn-ghost mt-8">Log out</button>
    </div>
  )
}
