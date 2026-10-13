import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, Bath, BadgeCheck, BedDouble, Check, Clock, Eye, MapPin, Ruler, ShieldCheck, Star, Zap } from 'lucide-react'
import Gallery from '../components/Gallery/Gallery'
import FAQ from '../components/FAQ/FAQ'
import PropertyCard from '../components/PropertyCard/PropertyCard'
import FavoriteButton from '../components/ui/FavoriteButton'
import Badge from '../components/ui/Badge'
import { EmptyState, PageFallback } from '../components/ui/States'
import { Reveal } from '../animations/Reveal'
import { useApp } from '../context/AppContext'
import { getPropertyById, getSimilar } from '../services/propertyService'
import { bookingTotals } from '../services/bookingService'
import { NEARBY, REVIEW_POOL, RULES } from '../data/extras'
import { propertyFaqs } from '../data/faqs'
import { bedLabel, fmtDate, initials, km, money, pad } from '../utils/format'
import useDocTitle from '../hooks/useDocTitle'

function Section({ n, title, children }) {
  return (
    <section className="grid gap-6 border-t border-line py-10 md:grid-cols-[11rem_1fr] md:py-14" aria-labelledby={`sec-${n}`}>
      <h2 id={`sec-${n}`} className="meta md:pt-2"><span className="text-accent">{n}</span> — {title}</h2>
      <Reveal>{children}</Reveal>
    </section>
  )
}

function MiniCalendar({ from }) {
  const start = new Date(`${from}T00:00:00`)
  const year = start.getFullYear()
  const month = start.getMonth()
  const first = new Date(year, month, 1).getDay()
  const days = new Date(year, month + 1, 0).getDate()
  const cells = [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)]
  return (
    <div className="max-w-sm rounded-3xl border border-line p-5" role="img" aria-label={`Available from ${fmtDate(from)}`}>
      <p className="mb-4 font-display text-lg font-semibold">{start.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <span key={i} className="meta pb-2">{d}</span>)}
        {cells.map((d, i) => d === null ? <span key={i} /> : (
          <span key={i} className={d >= start.getDate() ? 'grid aspect-square place-items-center rounded-full bg-accent/15 text-accent' : 'grid aspect-square place-items-center text-mute/40 line-through'}>
            {d}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function PropertyDetails() {
  const { id } = useParams()
  const { favorites, toggleFavorite, openInquiry } = useApp()
  const [p, setP] = useState(null)
  const [similar, setSimilar] = useState([])
  const [status, setStatus] = useState('loading')

  useDocTitle(p ? p.name : 'Property', p?.description?.slice(0, 150))

  useEffect(() => {
    let live = true
    setStatus('loading')
    setP(null)
    getPropertyById(id)
      .then((r) => {
        if (!live) return
        setP(r)
        setStatus('ready')
        getSimilar(r).then((s) => live && setSimilar(s)).catch(() => {})
      })
      .catch(() => live && setStatus('missing'))
    return () => {
      live = false
    }
  }, [id])

  const reviews = useMemo(() => (p ? [0, 1, 2].map((k) => REVIEW_POOL[(Number(p.id.replace(/\D/g, '')) + k) % REVIEW_POOL.length]) : []), [p])

  if (status === 'loading') return <div className="pt-32"><PageFallback /></div>
  if (status === 'missing') {
    return (
      <div className="container-x pb-12 pt-36">
        <EmptyState title="We could not find that property." text="It may have been rented or removed by the owner. Browse our current places instead." action="Explore places" to="/explore" />
      </div>
    )
  }

  const saved = favorites.includes(p.id)
  const totals = bookingTotals(p.price)
  const nearby = NEARBY[p.city] || NEARBY.Austin
  const sqm = Math.round(p.sqft * 0.0929)
  const rooms = [
    ['Living room', `${Math.round(sqm * 0.3)} m²`],
    ['Kitchen', `${Math.round(sqm * 0.16)} m²`],
    ...Array.from({ length: Math.max(p.bedrooms, 1) }, (_, i) => [p.bedrooms === 0 ? 'Sleeping area' : i === 0 ? 'Primary bedroom' : `Bedroom ${i + 1}`, `${Math.round(sqm * (i === 0 ? 0.2 : 0.13))} m²`]),
    ['Bathrooms', `${p.bathrooms} total`],
  ]

  return (
    <article className="pb-28 lg:pb-12">
      <div className="container-x pt-24 lg:pt-32">
        <nav aria-label="Breadcrumb" className="meta mb-6 flex flex-wrap items-center gap-2">
          <Link to="/explore" className="hover:text-bone">Explore</Link>/<Link to={`/search?q=${encodeURIComponent(p.city)}`} className="hover:text-bone">{p.city}</Link>/<span className="text-bone">{p.name}</span>
        </nav>
        <Gallery images={p.images} name={p.name} />
      </div>

      <div className="container-x mt-12 grid gap-12 lg:grid-cols-[1fr_24rem] lg:gap-16 xl:grid-cols-[1fr_27rem]">
        <div>
          <header>
            <div className="mb-5 flex flex-wrap gap-2">
              {p.verified ? <Badge icon={BadgeCheck} tone="accent">Verified</Badge> : <Badge icon={Clock}>Verification pending</Badge>}
              {p.instantBooking && <Badge icon={Zap}>Instant book</Badge>}
              {p.tourAvailable && <Badge icon={Eye}>Tour available</Badge>}
            </div>
            <h1 className="h-xl">{p.name}</h1>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-mute">
              <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-accent" aria-hidden="true" />{p.location} · {p.zip}</span>
              <span className="inline-flex items-center gap-2"><Star className="h-4 w-4 fill-accent text-accent" aria-hidden="true" />{p.rating.toFixed(1)} <span className="text-mute/70">({p.reviews} reviews)</span></span>
              <span>{km(p.distance)}</span>
            </div>
            <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-4">
              {[[BedDouble, 'Bedrooms', bedLabel(p.bedrooms)], [Bath, 'Bathrooms', p.bathrooms], [Ruler, 'Interior', `${p.sqft.toLocaleString()} ft²`], [Check, 'Furnished', p.furnished ? 'Yes' : 'No']].map(([Icon, l, v]) => (
                <div key={l} className="bg-ink p-5">
                  <dt className="meta flex items-center gap-2"><Icon className="h-3.5 w-3.5" aria-hidden="true" />{l}</dt>
                  <dd className="mt-2 font-display text-2xl font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
          </header>

          <Section n="01" title="Overview">
            <p className="max-w-2xl text-lg leading-relaxed text-bone/85">{p.description}</p>
            <ul className="mt-6 flex flex-wrap gap-2">{p.tags.map((t) => <li key={t} className="chip">{t}</li>)}</ul>
          </Section>

          <Section n="02" title="Amenities">
            <ul className="grid gap-x-8 sm:grid-cols-2">
              {p.amenities.map((a) => (
                <li key={a} className="flex items-center gap-3 border-b border-line py-3.5"><Check className="h-4 w-4 text-accent" aria-hidden="true" />{a}</li>
              ))}
            </ul>
          </Section>

          <Section n="03" title="Rooms">
            <ul>
              {rooms.map(([n, s]) => <li key={n} className="flex justify-between border-b border-line py-3.5"><span>{n}</span><span className="font-mono text-sm text-mute">{s}</span></li>)}
            </ul>
          </Section>

          <Section n="04" title="Availability">
            <div className="grid gap-6 sm:grid-cols-[auto_1fr] sm:items-start">
              <MiniCalendar from={p.availableFrom} />
              <div>
                <p className="font-display text-3xl font-semibold">{fmtDate(p.availableFrom)}</p>
                <p className="mt-2 text-mute">Earliest move-in. Leases run from 1 to 12 months.</p>
              </div>
            </div>
          </Section>

          <Section n="05" title="House rules">
            <ul className="grid gap-x-8 sm:grid-cols-2">
              {RULES.map((r) => <li key={r} className="border-b border-line py-3.5 text-mute">{r}</li>)}
            </ul>
          </Section>

          <Section n="06" title="Your host">
            <div className="flex flex-wrap items-center gap-5">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-surface2 font-display text-xl font-semibold ring-1 ring-line">{initials(p.owner.name)}</span>
              <div className="flex-1">
                <p className="flex items-center gap-2 font-display text-2xl font-semibold">{p.owner.name}{p.owner.verified && <ShieldCheck className="h-5 w-5 text-accent" aria-label="Verified owner" />}</p>
                <p className="text-sm text-mute">Hosting since {p.owner.since} · {p.owner.listings} listing{p.owner.listings > 1 ? 's' : ''} · Replies {p.owner.response}</p>
              </div>
              <button type="button" onClick={() => openInquiry(p)} className="btn-ghost">Message host</button>
            </div>
          </Section>

          <Section n="07" title="Nearby">
            <ul className="grid gap-x-8 sm:grid-cols-2">
              {nearby.map(([name, cat, min]) => (
                <li key={name} className="flex items-center justify-between border-b border-line py-3.5">
                  <span><span className="block">{name}</span><span className="meta">{cat}</span></span>
                  <span className="font-mono text-sm text-mute">{min} min</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section n="08" title="Reviews">
            <div className="mb-8 flex items-end gap-4">
              <span className="font-display text-6xl font-semibold tracking-tighter">{p.rating.toFixed(1)}</span>
              <span className="pb-2 text-mute">from {p.reviews} verified stays</span>
            </div>
            <ul className="grid gap-4 md:grid-cols-3">
              {reviews.map((r) => (
                <li key={r.author} className="card p-6">
                  <div className="mb-3 flex gap-0.5" aria-label={`${r.rating} out of 5 stars`}>{Array.from({ length: r.rating }, (_, i) => <Star key={i} className="h-3.5 w-3.5 fill-accent text-accent" aria-hidden="true" />)}</div>
                  <p className="text-sm leading-relaxed text-bone/85">{r.text}</p>
                  <p className="meta mt-5">{r.author} · {fmtDate(r.date, { month: 'short', year: 'numeric' })}</p>
                </li>
              ))}
            </ul>
          </Section>

          <Section n="09" title="Questions"><FAQ items={propertyFaqs} defaultOpen={-1} /></Section>
        </div>

        {/* Sticky booking panel */}
        <aside className="hidden lg:block" aria-label="Booking">
          <div className="sticky top-28">
            <BookingPanel p={p} totals={totals} saved={saved} onSave={() => toggleFavorite(p.id)} onInquire={() => openInquiry(p)} />
          </div>
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="container-x mt-20" aria-labelledby="similar">
          <p className="meta mb-4">Keep looking</p>
          <h2 id="similar" className="h-lg mb-10">You might also like</h2>
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((s, i) => <PropertyCard key={s.id} property={s} index={i} />)}
          </div>
        </section>
      )}

      {/* Mobile action bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-ink/90 px-5 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-xl items-center gap-3">
          <div className="mr-auto">
            <p className="font-display text-xl font-semibold leading-none">{money(p.price)}<span className="text-sm font-normal text-mute"> /mo</span></p>
            <p className="meta mt-1">From {fmtDate(p.availableFrom, { month: 'short', day: 'numeric' })}</p>
          </div>
          <button type="button" onClick={() => openInquiry(p)} className="btn-ghost !px-5">Inquire</button>
          <Link to={`/book/${p.id}`} className="btn-accent !px-5">{p.instantBooking ? 'Book now' : 'Request'}</Link>
        </div>
      </div>
    </article>
  )
}

function BookingPanel({ p, totals, saved, onSave, onInquire }) {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }} className="card p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="meta mb-2">Monthly rent</p>
          <p className="font-display text-5xl font-semibold tracking-tighter">{money(p.price)}</p>
        </div>
        <FavoriteButton active={saved} label={p.name} onToggle={onSave} className="!bg-surface2" />
      </div>
      <dl className="mt-6 space-y-3 border-y border-line py-5 text-sm">
        <div className="flex justify-between"><dt className="text-mute">Available from</dt><dd>{fmtDate(p.availableFrom)}</dd></div>
        <div className="flex justify-between"><dt className="text-mute">Security deposit</dt><dd>{money(totals.deposit)}</dd></div>
        <div className="flex justify-between"><dt className="text-mute">Service fee (3%)</dt><dd>{money(totals.fee)}</dd></div>
      </dl>
      <Link to={`/book/${p.id}`} className="btn-accent mt-6 w-full !py-4">
        {p.instantBooking ? 'Book instantly' : 'Request to book'} <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
      </Link>
      <button type="button" onClick={onInquire} className="btn-ghost mt-3 w-full !py-4">Send an inquiry</button>
      <p className="meta mt-5 flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5 text-accent" aria-hidden="true" /> You won’t be charged yet</p>
    </motion.div>
  )
}
