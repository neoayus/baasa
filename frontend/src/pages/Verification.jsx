import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BadgeCheck, Clock, FileCheck2, Mail, ShieldAlert, ShieldCheck, Home as HomeIcon, UserRound } from 'lucide-react'
import { Field } from '../components/ui/Field'
import { ErrorState, Spinner } from '../components/ui/States'
import { useApp } from '../context/AppContext'
import { getVerification, submitVerification } from '../services/verificationService'
import { validate } from '../utils/validate'
import { cn } from '../utils/cn'
import { money } from '../utils/format'
import useDocTitle from '../hooks/useDocTitle'

const STATUS = {
  not_verified: { label: 'Not verified', icon: ShieldAlert, cls: 'border-line text-mute' },
  pending: { label: 'Pending review', icon: Clock, cls: 'border-accent/50 text-accent' },
  verified: { label: 'Verified', icon: BadgeCheck, cls: 'border-emerald-400/50 bg-emerald-400/10 text-emerald-300' },
  rejected: { label: 'Rejected', icon: ShieldAlert, cls: 'border-red-400/50 bg-red-400/10 text-red-300' },
}

export function StatusPill({ status, className }) {
  const s = STATUS[status] || STATUS.not_verified
  const Icon = s.icon
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.12em]', s.cls, className)}>
      <Icon className="h-3 w-3" aria-hidden="true" /> {s.label}
    </span>
  )
}

const SECTIONS = [
  { type: 'identity', icon: UserRound, title: 'Identity verification', text: 'Confirm who you are with a government-issued photo ID.', field: 'document', label: 'Photo ID', kind: 'file' },
  { type: 'contact', icon: Mail, title: 'Contact verification', text: 'Confirm the phone number owners and renters will reach you on.', field: 'phone', label: 'Mobile number', kind: 'tel' },
  { type: 'property', icon: HomeIcon, title: 'Property verification', text: 'Owners only — prove you control the property you are listing.', field: 'address', label: 'Property address or deed reference', kind: 'text' },
]

export default function Verification() {
  useDocTitle('Verification')
  const { user, toast } = useApp()
  const [rec, setRec] = useState(null)
  const [error, setError] = useState('')
  const [nonce, setNonce] = useState(0)

  const load = useCallback(() => getVerification(user.id).then((r) => { setRec(r); setError('') }), [user.id])

  useEffect(() => {
    load().catch((e) => setError(e.message || 'Could not load verification'))
  }, [load, nonce])

  // Poll while anything is pending so the mock review result appears live.
  const pending = rec && ['identity', 'contact', 'property'].some((t) => rec[t].status === 'pending')
  useEffect(() => {
    if (!pending) return undefined
    const t = setInterval(() => load().catch(() => {}), 3000)
    return () => clearInterval(t)
  }, [pending, load])

  if (error) return <div className="container-x pb-12 pt-36"><ErrorState text={error} onRetry={() => setNonce((n) => n + 1)} /></div>
  if (!rec) return <div className="container-x grid pt-40 place-items-center"><Spinner className="h-8 w-8 text-accent" /></div>

  return (
    <div className="container-x pb-12 pt-28 lg:pt-40">
      <p className="meta mb-5">Trust — Verification centre</p>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h1 className="h-mega">Verified<span className="text-accent">.</span></h1>
        <StatusPill status={rec.overall} className="!px-5 !py-2.5 !text-xs" />
      </div>
      <p className="mt-6 max-w-xl text-mute">Verified renters book faster and verified owners rank higher. One flat fee of <span className="text-bone">{money(rec.fee)}</span> covers all three checks{rec.feePaid && ' — already paid'}.</p>

      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {SECTIONS.map((s, i) => (
          <VerificationCard key={s.type} s={s} item={rec[s.type]} index={i} userId={user.id} fee={rec.fee} feePaid={rec.feePaid} onSubmitted={(r) => { setRec(r); toast('Verification submitted') }} />
        ))}
      </div>

      <div className="card mt-8 flex flex-wrap items-center gap-4 p-6 text-sm text-mute">
        <FileCheck2 className="h-5 w-5 text-accent" aria-hidden="true" />
        Reviews usually take one business day. In this demo they resolve in about 12 seconds.
      </div>
    </div>
  )
}

function VerificationCard({ s, item, index, userId, fee, feePaid, onSubmitted }) {
  const [value, setValue] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const Icon = s.icon
  const canSubmit = item.status === 'not_verified' || item.status === 'rejected'

  const submit = async (e) => {
    e.preventDefault()
    const errors = validate({ value }, { value: { required: true, message: `Add your ${s.label.toLowerCase()}`, phone: s.kind === 'tel', min: s.kind === 'text' ? 5 : undefined } })
    setErr(errors.value || '')
    if (errors.value) return
    setBusy(true)
    try {
      const r = await submitVerification({ userId, type: s.type, note: value })
      setValue('')
      onSubmitted(r)
    } catch (e2) {
      setErr(e2.message || 'Submission failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + index * 0.1, duration: 0.8 }} className="card flex flex-col p-7" aria-labelledby={`v-${s.type}`}>
      <div className="mb-8 flex items-start justify-between">
        <span className="grid h-14 w-14 place-items-center rounded-full border border-line"><Icon className="h-6 w-6" aria-hidden="true" /></span>
        <StatusPill status={item.status} />
      </div>
      <h2 id={`v-${s.type}`} className="font-display text-2xl font-semibold">{s.title}</h2>
      <p className="mt-2 text-sm text-mute">{s.text}</p>

      <div className="mt-auto pt-8">
        {item.status === 'verified' && <p className="flex items-center gap-2 text-emerald-300"><ShieldCheck className="h-5 w-5" aria-hidden="true" /> All set. This check is complete.</p>}
        {item.status === 'pending' && <p className="flex items-center gap-3 text-accent"><Spinner /> Reviewing your submission…</p>}
        {canSubmit && (
          <form onSubmit={submit} noValidate className="space-y-4">
            {item.status === 'rejected' && <p role="alert" className="rounded-2xl border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-200">We could not verify this. Check the details and submit again.</p>}
            <Field
              label={s.label}
              type={s.kind === 'file' ? 'text' : s.kind}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              error={err}
              placeholder={s.kind === 'file' ? 'Document file name, e.g. passport.jpg' : s.kind === 'tel' ? '+1 555 000 0000' : '123 Main St'}
              hint={s.kind === 'file' ? 'Demo: type a file name. Include “reject” to preview a rejected result.' : undefined}
            />
            <button type="submit" disabled={busy} className="btn-accent w-full">
              {busy ? <Spinner /> : feePaid ? 'Submit for review' : `Pay ${money(fee)} & submit`}
            </button>
          </form>
        )}
      </div>
    </motion.section>
  )
}
