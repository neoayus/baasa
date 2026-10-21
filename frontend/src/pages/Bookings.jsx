import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { CalendarX2 } from 'lucide-react'
import SmartImage from '../components/ui/SmartImage'
import { EmptyState, ErrorState, Spinner } from '../components/ui/States'
import { useApp } from '../context/AppContext'
import { cancelBooking, getBookings } from '../services/bookingService'
import { cn } from '../utils/cn'
import { fmtDate, imgW, money } from '../utils/format'
import useDocTitle from '../hooks/useDocTitle'

const TABS = [['upcoming', 'Upcoming'], ['pending', 'Pending'], ['completed', 'Completed'], ['cancelled', 'Cancelled']]
const DOT = { upcoming: 'bg-accent', pending: 'bg-bone/60', completed: 'bg-emerald-400', cancelled: 'bg-red-400' }

export function BookingCard({ b, onCancel, busy }) {
  return (
    <motion.li layout initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.5 }} className="card relative grid gap-5 overflow-hidden p-4 sm:grid-cols-[11rem_1fr] sm:p-5 md:grid-cols-[12rem_1fr_auto]">
      <Link to={`/property/${b.propertyId}`} aria-label={`View ${b.propertyName}`}>
        <SmartImage src={imgW(b.image, 500)} alt={b.propertyName} className="aspect-[16/10] rounded-2xl sm:aspect-square" />
      </Link>
      <div className="min-w-0 self-center">
        <p className="meta mb-2 flex items-center gap-2"><span className={cn('h-2 w-2 rounded-full', DOT[b.status])} aria-hidden="true" /> {b.status} · {b.ref}</p>
        <h3 className="font-display text-2xl font-semibold leading-tight"><Link to={`/property/${b.propertyId}`} className="hover:text-accent">{b.propertyName}</Link></h3>
        <p className="mt-1 text-sm text-mute">{b.city}, {b.state}</p>
        <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm">
          <div><dt className="meta">Move-in</dt><dd>{fmtDate(b.moveIn)}</dd></div>
          <div><dt className="meta">Lease</dt><dd>{b.months} {b.months === 1 ? 'month' : 'months'}</dd></div>
          <div><dt className="meta">Paid</dt><dd>{money(b.total)}</dd></div>
        </dl>
      </div>
      <div className="flex items-end gap-2 md:flex-col md:justify-center">
        {(b.status === 'upcoming' || b.status === 'pending') && (
          <button type="button" onClick={() => onCancel(b)} disabled={busy} className="btn-ghost !px-5 !py-2.5 text-sm">{busy ? <Spinner className="h-4 w-4" /> : 'Cancel booking'}</button>
        )}
        {b.status === 'completed' && <Link to={`/property/${b.propertyId}`} className="btn-ghost !px-5 !py-2.5 text-sm">Book again</Link>}
      </div>
    </motion.li>
  )
}

export default function Bookings() {
  useDocTitle('My bookings')
  const { user, toast } = useApp()
  const [items, setItems] = useState([])
  const [state, setState] = useState('loading')
  const [tab, setTab] = useState('upcoming')
  const [busyId, setBusyId] = useState(null)
  const [nonce, setNonce] = useState(0)

  useEffect(() => {
    let live = true
    getBookings(user.id)
      .then((r) => { if (live) { setItems(r); setState('ready') } })
      .catch(() => live && setState('error'))
    return () => { live = false }
  }, [user.id, nonce])

  const cancel = async (b) => {
    setBusyId(b.id)
    try {
      await cancelBooking(b.id)
      setItems((l) => l.map((x) => (x.id === b.id ? { ...x, status: 'cancelled' } : x)))
      toast('Booking cancelled', 'info')
    } catch (err) {
      toast(err.message || 'Could not cancel booking', 'error')
    } finally {
      setBusyId(null)
    }
  }

  const shown = items.filter((b) => b.status === tab)

  return (
    <div className="container-x pb-12 pt-28 lg:pt-40">
      <p className="meta mb-5">Stays — Your timeline</p>
      <h1 className="h-mega">Bookings</h1>

      <div role="tablist" aria-label="Booking status" className="no-scrollbar -mx-5 mt-12 flex gap-2 overflow-x-auto border-b border-line px-5 sm:mx-0 sm:px-0">
        {TABS.map(([id, label]) => (
          <button key={id} role="tab" type="button" aria-selected={tab === id} onClick={() => setTab(id)} className={cn('relative shrink-0 px-5 py-4 text-sm transition-colors', tab === id ? 'text-bone' : 'text-mute hover:text-bone')}>
            {label} <span className="ml-1 font-mono text-[0.65rem] text-mute">{items.filter((b) => b.status === id).length}</span>
            {tab === id && <motion.span layoutId="booking-tab" className="absolute inset-x-3 bottom-0 h-0.5 bg-accent" />}
          </button>
        ))}
      </div>

      <div className="mt-10">
        {state === 'error' ? (
          <ErrorState onRetry={() => { setState('loading'); setNonce((n) => n + 1) }} />
        ) : state === 'loading' ? (
          <div className="grid place-items-center py-24"><Spinner className="h-8 w-8 text-accent" /></div>
        ) : shown.length === 0 ? (
          <EmptyState icon={CalendarX2} title={items.length === 0 ? 'No bookings yet.' : `No ${tab} bookings.`} text="When you book a home it will appear here with its full status." action="Find a place" to="/explore" />
        ) : (
          <ol role="tabpanel" className="space-y-4 border-l border-line pl-4 sm:pl-8">
            <AnimatePresence>
              {shown.map((b) => <BookingCard key={b.id} b={b} onCancel={cancel} busy={busyId === b.id} />)}
            </AnimatePresence>
          </ol>
        )}
      </div>
    </div>
  )
}
