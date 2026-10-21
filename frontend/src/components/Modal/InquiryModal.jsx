import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Modal from './Modal'
import { Chip, Field } from '../ui/Field'
import { Spinner, SuccessMark } from '../ui/States'
import { useApp } from '../../context/AppContext'
import { createInquiry } from '../../services/inquiryService'
import { validate } from '../../utils/validate'
import { todayISO } from '../../utils/format'

const RULES = {
  name: { required: true, message: 'Tell the owner your name' },
  email: { required: true, email: true, message: 'Add an email so the owner can reply' },
  phone: { required: true, phone: true, message: 'Add a phone number' },
  moveIn: { required: true, message: 'Pick a move-in date' },
  message: { required: true, min: 10, message: 'Write a short message (10+ characters)' },
}

const blank = (user) => ({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '', moveIn: '', message: '', contactPreference: 'Email' })

export default function InquiryModal() {
  const { inquiryFor: property, closeInquiry, user, toast } = useApp()
  const [values, setValues] = useState(blank(user))
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | done
  const [failure, setFailure] = useState('')

  useEffect(() => {
    if (property) {
      setValues(blank(user))
      setErrors({})
      setStatus('idle')
      setFailure('')
    }
  }, [property, user])

  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    const errs = validate(values, RULES)
    setErrors(errs)
    if (Object.keys(errs).length) return
    setStatus('sending')
    setFailure('')
    try {
      await createInquiry({ ...values, propertyId: property.id, propertyName: property.name, userId: user?.id })
      setStatus('done')
      toast('Inquiry submitted')
    } catch (err) {
      setFailure(err.message || 'Could not send your inquiry')
      setStatus('idle')
    }
  }

  return (
    <Modal open={!!property} onClose={closeInquiry} eyebrow="Inquiry" title={property ? `Ask about ${property.name}` : 'Inquiry'}>
      {status === 'done' ? (
        <div className="flex flex-col items-center py-8 text-center">
          <SuccessMark />
          <motion.h3 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="h-lg mt-6">
            Message sent.
          </motion.h3>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} className="mt-3 max-w-sm text-mute">
            {property?.owner?.name} usually replies {property?.owner?.response}. We will reach you by {values.contactPreference.toLowerCase()}.
          </motion.p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button type="button" className="btn-accent" onClick={closeInquiry}>Keep browsing</button>
            <Link to="/profile" onClick={closeInquiry} className="btn-ghost">View my inquiries</Link>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="grid gap-5 sm:grid-cols-2">
          {failure && (
            <p role="alert" className="rounded-2xl border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-200 sm:col-span-2">{failure}</p>
          )}
          <Field label="Name" required value={values.name} onChange={set('name')} error={errors.name} autoComplete="name" placeholder="Your full name" />
          <Field label="Email" required type="email" value={values.email} onChange={set('email')} error={errors.email} autoComplete="email" placeholder="you@email.com" />
          <Field label="Phone" required type="tel" value={values.phone} onChange={set('phone')} error={errors.phone} autoComplete="tel" placeholder="+1 555 000 0000" />
          <Field label="Move-in date" required type="date" min={todayISO()} value={values.moveIn} onChange={set('moveIn')} error={errors.moveIn} />
          <Field as="textarea" label="Message" required className="sm:col-span-2" value={values.message} onChange={set('message')} error={errors.message} placeholder="Tell the owner about your plans, lease length and anything you would like to know." />
          <fieldset className="sm:col-span-2">
            <legend className="meta mb-2">Contact preference</legend>
            <div className="flex flex-wrap gap-2">
              {['Email', 'Phone', 'Text message'].map((o) => (
                <Chip key={o} active={values.contactPreference === o} onClick={() => setValues((v) => ({ ...v, contactPreference: o }))}>{o}</Chip>
              ))}
            </div>
          </fieldset>
          <div className="flex items-center justify-between gap-4 sm:col-span-2">
            <p className="text-xs text-mute">Your details are only shared with this owner.</p>
            <button type="submit" disabled={status === 'sending'} className="btn-accent min-w-40">
              {status === 'sending' ? <Spinner /> : 'Send inquiry'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  )
}
