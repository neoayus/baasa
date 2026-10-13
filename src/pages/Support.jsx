import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Check, Copy } from 'lucide-react'
import FAQ from '../components/FAQ/FAQ'
import { Field } from '../components/ui/Field'
import { Spinner, SuccessMark } from '../components/ui/States'
import { useApp } from '../context/AppContext'
import { createExpertRequest } from '../services/inquiryService'
import { faqs } from '../data/faqs'
import { validate } from '../utils/validate'
import { scrollToEl } from '../animations/lenis'
import useDocTitle from '../hooks/useDocTitle'

function RequestForm({ type, fields, button, doneTitle, doneText }) {
  const { user, toast } = useApp()
  const [v, setV] = useState(() => Object.fromEntries(fields.map((f) => [f.k, f.k === 'name' ? user?.name || '' : f.k === 'email' ? user?.email || '' : ''])))
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [failure, setFailure] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    const rules = Object.fromEntries(fields.filter((f) => f.required).map((f) => [f.k, { required: true, email: f.type === 'email', min: f.min }]))
    const errs = validate(v, rules)
    setErrors(errs)
    if (Object.keys(errs).length) return
    setStatus('sending')
    setFailure('')
    try {
      await createExpertRequest({ ...v, type, userId: user?.id })
      setStatus('done')
      toast(doneTitle)
    } catch (err) {
      setFailure(err.message || 'Could not send. Try again.')
      setStatus('idle')
    }
  }

  if (status === 'done') {
    return (
      <div className="card flex flex-col items-center p-10 text-center"><SuccessMark className="h-20 w-20" /><h3 className="h-lg mt-6">{doneTitle}</h3><p className="mt-3 text-mute">{doneText}</p></div>
    )
  }
  return (
    <form onSubmit={submit} noValidate className="grid gap-5">
      {failure && <p role="alert" className="rounded-2xl border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-200">{failure}</p>}
      {fields.map((f) => (
        <Field key={f.k} label={f.label} type={f.type || 'text'} as={f.area ? 'textarea' : 'input'} required={f.required} value={v[f.k]} onChange={(e) => setV({ ...v, [f.k]: e.target.value })} error={errors[f.k]} />
      ))}
      <button type="submit" disabled={status === 'sending'} className="btn-accent justify-self-start">{status === 'sending' ? <Spinner /> : button}</button>
    </form>
  )
}

export default function Support() {
  useDocTitle('Help & support')
  const { hash } = useLocation()
  const { user, toast } = useApp()
  const [copied, setCopied] = useState(false)
  const code = `ALCOVE-${(user?.name || 'FRIEND').split(' ')[0].toUpperCase().slice(0, 6)}25`

  useEffect(() => {
    if (!hash) return undefined
    const t = setTimeout(() => scrollToEl(document.getElementById(hash.slice(1))), 650)
    return () => clearTimeout(t)
  }, [hash])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`https://alcove.house/join?ref=${code}`)
      setCopied(true)
      toast('Referral link copied')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast('Could not copy — select the code and copy it manually', 'error')
    }
  }

  return (
    <div className="container-x pb-12 pt-28 lg:pt-40">
      <p className="meta mb-5">Support — We reply within a day</p>
      <h1 className="h-mega">Help</h1>

      <section className="mt-16 grid gap-10 lg:grid-cols-[1fr_2fr]" aria-labelledby="faq-h">
        <h2 id="faq-h" className="h-lg">Common questions</h2>
        <FAQ items={faqs} />
      </section>

      {/* talk to a person */}
      {/* <section className="mt-24 grid gap-10 lg:grid-cols-[1fr_2fr]" aria-labelledby="contact-h">
        <div><h2 id="contact-h" className="h-lg">Talk to a person</h2><p className="mt-4 text-mute">Tell us what is going on and we will get back to you by email.</p></div>
        <RequestForm type="support" button="Send message" doneTitle="Message sent" doneText="Our team will reply by email within one working day."
          fields={[{ k: 'name', label: 'Name', required: true }, { k: 'email', label: 'Email', type: 'email', required: true }, { k: 'message', label: 'How can we help?', area: true, required: true, min: 10 }]} />
      </section> */}


      {/* refer a friend */}
      {/* <section id="refer" className="mt-24 scroll-mt-28 grid gap-10 border-t border-line pt-16 lg:grid-cols-[1fr_2fr]" aria-labelledby="refer-h">
        <div><h2 id="refer-h" className="h-lg">Refer a friend</h2><p className="mt-4 text-mute">Give a friend $50 off their service fee. You get $50 when they book.</p></div>
        <div className="card flex flex-wrap items-center justify-between gap-5 p-7">
          <div><p className="meta mb-2">Your code</p><p className="font-display text-3xl font-semibold tracking-wider text-accent">{code}</p></div>
          <button type="button" onClick={copy} className="btn-ghost">{copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}{copied ? 'Copied' : 'Copy invite link'}</button>
        </div>
      </section> */}

      {/* partner with us */}
      {/* <section id="partner" className="mt-24 scroll-mt-28 grid gap-10 border-t border-line pt-16 lg:grid-cols-[1fr_2fr]" aria-labelledby="partner-h">
        <div><h2 id="partner-h" className="h-lg">Partner with us</h2><p className="mt-4 text-mute">Property managers, relocation companies and universities — let’s work together.</p></div>
        <RequestForm type="partner" button="Start the conversation" doneTitle="Thanks — we will be in touch" doneText="A partnerships lead will contact you this week."
          fields={[{ k: 'name', label: 'Name', required: true }, { k: 'email', label: 'Work email', type: 'email', required: true }, { k: 'company', label: 'Company', required: true }, { k: 'message', label: 'What would you like to build together?', area: true }]} />
      </section> */}

      <section id="privacy" className="mt-24 scroll-mt-28 grid gap-10 border-t border-line pt-16 lg:grid-cols-[1fr_2fr]" aria-labelledby="privacy-h">
        <h2 id="privacy-h" className="h-lg">Privacy</h2>
        <p className="max-w-2xl text-mute"> BAASA currently stores your account details, saved homes, bookings, and inquiries locally in your browser. No data is sent to a server at this stage. Clearing your browser's site data will permanently remove this locally stored information. </p>
      </section>
      <section id="terms" className="mt-16 scroll-mt-28 grid gap-10 border-t border-line pt-16 lg:grid-cols-[1fr_2fr]" aria-labelledby="terms-h">
        <h2 id="terms-h" className="h-lg">Terms</h2>
        <p className="max-w-2xl text-mute"> Your BAASA experience is currently powered by browser storage. Account information, saved properties, bookings, and inquiries remain on your device and are not transmitted to a server. Clearing your browser's site data will erase this information. </p>
      </section>
    </div>
  )
}
