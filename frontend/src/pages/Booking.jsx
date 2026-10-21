import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Lock, ShieldCheck } from 'lucide-react'
import Stepper from '../components/ui/Stepper'
import SmartImage from '../components/ui/SmartImage'
import { Chip, Field } from '../components/ui/Field'
import { EmptyState, PageFallback, Spinner, SuccessMark } from '../components/ui/States'
import { useApp } from '../context/AppContext'
import { getPropertyById } from '../services/propertyService'
import { bookingTotals, createBooking } from '../services/bookingService'
import { getVerification, submitVerification } from '../services/verificationService'
import { validate } from '../utils/validate'
import { fmtDate, imgW, money, todayISO } from '../utils/format'
import useDocTitle from '../hooks/useDocTitle'

const STEPS = ['Dates', 'Details', 'Verify', 'Payment', 'Confirmed']
const TERMS = [1, 3, 6, 12]

const fmtCard = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
const fmtExp = (v) => {
  const d = v.replace(/\D/g, '').slice(0, 4)
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d
}

export default function Booking() {
  const { id } = useParams()
  const { user, toast } = useApp()
  const [p, setP] = useState(null)
  const [status, setStatus] = useState('loading')
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const [failure, setFailure] = useState('')
  const [booking, setBooking] = useState(null)
  const [idVerified, setIdVerified] = useState(false)
  const [v, setV] = useState({
    moveIn: '', months: 6, occupants: 1,
    name: user?.name || '', email: user?.email || '', phone: user?.phone || '', notes: '',
    idDoc: '', consent: false,
    cardName: '', cardNumber: '', expiry: '', cvc: '',
  })
  useDocTitle(p ? `Book ${p.name}` : 'Book')

  useEffect(() => {
    let live = true
    getPropertyById(id)
      .then((r) => {
        if (!live) return
        setP(r)
        setV((s) => ({ ...s, moveIn: r.availableFrom > todayISO() ? r.availableFrom : todayISO() }))
        setStatus('ready')
      })
      .catch(() => live && setStatus('missing'))
    getVerification(user.id).then((r) => live && setIdVerified(r.identity.status === 'verified')).catch(() => {})
    return () => {
      live = false
    }
  }, [id, user.id])

  if (status === 'loading') return <div className="pt-32"><PageFallback /></div>
  if (status === 'missing') {
    return <div className="container-x pb-12 pt-36"><EmptyState title="That property is no longer available." action="Explore places" to="/explore" /></div>
  }

  const totals = bookingTotals(p.price)
  const set = (k) => (e) => setV((s) => ({ ...s, [k]: e.target.value }))
  const minDate = p.availableFrom > todayISO() ? p.availableFrom : todayISO()

  const rules = [
    { moveIn: { required: true, message: 'Choose a move-in date', custom: (d) => (d < minDate ? `Earliest move-in is ${fmtDate(minDate)}` : undefined) } },
    { name: { required: true, message: 'Enter your full name' }, email: { required: true, email: true }, phone: { required: true, phone: true } },
    idVerified ? {} : { idDoc: { required: true, message: 'Select a photo ID to upload' }, consent: { required: true, message: 'Please confirm to continue' } },
    {
      cardName: { required: true, message: 'Name on card' },
      cardNumber: { required: true, custom: (n) => (n.replace(/\D/g, '').length === 16 ? undefined : 'Enter a 16-digit card number') },
      expiry: { required: true, custom: (e) => (/^(0[1-9]|1[0-2])\/\d{2}$/.test(e) ? undefined : 'Use MM/YY') },
      cvc: { required: true, custom: (c) => (/^\d{3,4}$/.test(c) ? undefined : '3 or 4 digits') },
    },
  ]

  const go = (to) => {
    setDir(to > step ? 1 : -1)
    setStep(to)
    setErrors({})
    setFailure('')
  }

  const next = async () => {
    const errs = validate(v, rules[step])
    setErrors(errs)
    if (Object.keys(errs).length) return
    if (step === 2 && !idVerified) {
      try {
        await submitVerification({ userId: user.id, type: 'identity', note: v.idDoc })
        toast('Verification submitted')
      } catch {
        /* verification can be completed later from the Verification page */
      }
    }
    if (step === 3) {
      setBusy(true)
      setFailure('')
      try {
        const b = await createBooking({ ...v, userId: user.id, property: p })
        setBooking(b)
        toast('Booking confirmed')
        go(4)
      } catch (err) {
        setFailure(err.message || 'The payment could not be processed. Nothing was charged.')
      } finally {
        setBusy(false)
      }
      return
    }
    go(step + 1)
  }

  return (
    <div className="container-x pb-12 pt-28 lg:pt-36">
      <Link to={`/property/${p.id}`} className="meta mb-6 inline-flex items-center gap-2 hover:text-bone"><ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> Back to {p.name}</Link>
      <h1 className="h-xl mb-10">{step === 4 ? 'You’re booked.' : 'Book your stay'}</h1>
      <Stepper steps={STEPS} current={step} onJump={step < 4 ? go : undefined} />

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_24rem] lg:gap-16">
        <div className="min-w-0">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={step}
              custom={dir}
              variants={{ enter: (d) => ({ opacity: 0, x: 40 * d }), center: { opacity: 1, x: 0 }, exit: (d) => ({ opacity: 0, x: -40 * d }) }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {step === 0 && (
                <div className="space-y-8">
                  <StepTitle n="01" title="Dates" text="Pick when you would like to move in and for how long." />
                  <Field label="Move-in date" type="date" required min={minDate} value={v.moveIn} onChange={set('moveIn')} error={errors.moveIn} hint={`Available from ${fmtDate(p.availableFrom)}`} className="max-w-sm" />
                  <fieldset>
                    <legend className="meta mb-3">Lease length</legend>
                    <div className="flex flex-wrap gap-2">{TERMS.map((m) => <Chip key={m} active={v.months === m} onClick={() => setV((s) => ({ ...s, months: m }))}>{m} {m === 1 ? 'month' : 'months'}</Chip>)}</div>
                  </fieldset>
                  <fieldset>
                    <legend className="meta mb-3">Occupants</legend>
                    <div className="flex flex-wrap gap-2">{[1, 2, 3, 4, 5].map((n) => <Chip key={n} active={v.occupants === n} onClick={() => setV((s) => ({ ...s, occupants: n }))}>{n}</Chip>)}</div>
                  </fieldset>
                </div>
              )}

              {step === 1 && (
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2"><StepTitle n="02" title="Details" text="Who is moving in? The owner sees these details after you book." /></div>
                  <Field label="Full name" required value={v.name} onChange={set('name')} error={errors.name} autoComplete="name" />
                  <Field label="Email" required type="email" value={v.email} onChange={set('email')} error={errors.email} autoComplete="email" />
                  <Field label="Phone" required type="tel" value={v.phone} onChange={set('phone')} error={errors.phone} autoComplete="tel" />
                  <Field as="textarea" label="Notes for the owner" className="sm:col-span-2" value={v.notes} onChange={set('notes')} placeholder="Arrival time, pets, parking needs…" />
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <StepTitle n="03" title="Verify" text="Owners rent to people they can trust. You only do this once." />
                  {idVerified ? (
                    <div className="card flex items-center gap-4 p-6"><ShieldCheck className="h-8 w-8 text-accent" aria-hidden="true" /><div><p className="font-display text-xl font-semibold">Your identity is already verified.</p><p className="text-sm text-mute">Nothing more to do here — continue to payment.</p></div></div>
                  ) : (
                    <>
                      <Field
                        label="Photo ID" required type="file" accept="image/*,.pdf"
                        onChange={(e) => setV((s) => ({ ...s, idDoc: e.target.files?.[0]?.name || '' }))}
                        error={errors.idDoc}
                        hint="Demo only — the file never leaves your browser. Name it with “reject” to preview a rejected state."
                        className="[&_input]:file:mr-4 [&_input]:file:rounded-full [&_input]:file:border-0 [&_input]:file:bg-surface2 [&_input]:file:px-4 [&_input]:file:py-2 [&_input]:file:text-bone"
                      />
                      <div>
                        <label className="flex cursor-pointer items-start gap-3 text-sm text-mute">
                          <input type="checkbox" checked={v.consent} onChange={(e) => setV((s) => ({ ...s, consent: e.target.checked }))} className="mt-1 h-4 w-4 accent-[#F4B03E]" />
                          I confirm the document is mine and agree to a one-time identity check.
                        </label>
                        {errors.consent && <p role="alert" className="mt-1.5 text-xs text-red-300">{errors.consent}</p>}
                      </div>
                    </>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2"><StepTitle n="04" title="Payment" text="Demo mode: no card is charged and nothing is stored." /></div>
                  {failure && <p role="alert" className="rounded-2xl border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-200 sm:col-span-2">{failure}</p>}
                  <Field label="Name on card" required className="sm:col-span-2" value={v.cardName} onChange={set('cardName')} error={errors.cardName} autoComplete="cc-name" />
                  <Field label="Card number" required className="sm:col-span-2" inputMode="numeric" placeholder="4242 4242 4242 4242" value={v.cardNumber} onChange={(e) => setV((s) => ({ ...s, cardNumber: fmtCard(e.target.value) }))} error={errors.cardNumber} autoComplete="cc-number" />
                  <Field label="Expiry" required placeholder="MM/YY" inputMode="numeric" value={v.expiry} onChange={(e) => setV((s) => ({ ...s, expiry: fmtExp(e.target.value) }))} error={errors.expiry} autoComplete="cc-exp" />
                  <Field label="CVC" required placeholder="123" inputMode="numeric" maxLength={4} value={v.cvc} onChange={(e) => setV((s) => ({ ...s, cvc: e.target.value.replace(/\D/g, '') }))} error={errors.cvc} autoComplete="cc-csc" />
                  <p className="meta flex items-center gap-2 sm:col-span-2"><Lock className="h-3.5 w-3.5 text-accent" aria-hidden="true" /> Mock checkout · Stripe is not connected</p>
                </div>
              )}

              {step === 4 && booking && (
                <div className="card flex flex-col items-center px-6 py-14 text-center">
                  <SuccessMark />
                  <p className="meta mt-8">Booking reference</p>
                  <p className="mt-2 font-display text-4xl font-semibold tracking-wider text-accent">{booking.ref}</p>
                  <p className="mt-5 max-w-md text-mute">
                    {booking.status === 'upcoming' ? `Your stay at ${p.name} is confirmed.` : `Your request has been sent to ${p.owner.name}. They usually reply ${p.owner.response}.`} Move-in is {fmtDate(booking.moveIn)} for {booking.months} {booking.months === 1 ? 'month' : 'months'}.
                  </p>
                  <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <Link to="/bookings" className="btn-accent">View my bookings</Link>
                    <Link to="/explore" className="btn-ghost">Keep exploring</Link>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {step < 4 && (
            <div className="mt-10 flex items-center justify-between border-t border-line pt-6">
              <button type="button" onClick={() => go(step - 1)} disabled={step === 0 || busy} className="btn-ghost"><ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back</button>
              <button type="button" onClick={next} disabled={busy} className="btn-accent min-w-44">
                {busy ? <Spinner /> : step === 3 ? `Pay ${money(totals.total)}` : <>Continue <ArrowRight className="h-4 w-4" aria-hidden="true" /></>}
              </button>
            </div>
          )}
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start" aria-label="Order summary">
          <div className="card overflow-hidden">
            <SmartImage src={imgW(p.images[0], 700)} alt={p.name} className="aspect-[16/10]" />
            <div className="p-6">
              <p className="meta mb-1">{p.city}, {p.state}</p>
              <h2 className="font-display text-2xl font-semibold">{p.name}</h2>
              <dl className="mt-5 space-y-3 border-t border-line pt-5 text-sm">
                <Row l="Move-in" r={fmtDate(v.moveIn) || '—'} />
                <Row l="Lease" r={`${v.months} ${v.months === 1 ? 'month' : 'months'}`} />
                <Row l="First month" r={money(totals.rent)} />
                <Row l="Deposit" r={money(totals.deposit)} />
                <Row l="Service fee" r={money(totals.fee)} />
                <div className="flex justify-between border-t border-line pt-4 font-display text-xl font-semibold"><dt>Due today</dt><dd>{money(totals.total)}</dd></div>
              </dl>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

const Row = ({ l, r }) => <div className="flex justify-between"><dt className="text-mute">{l}</dt><dd>{r}</dd></div>

function StepTitle({ n, title, text }) {
  return (
    <div>
      <p className="meta mb-3 text-accent">Step {n}</p>
      <h2 className="h-lg">{title}</h2>
      <p className="mt-3 max-w-lg text-mute">{text}</p>
    </div>
  )
}
