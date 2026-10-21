import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Modal from './Modal'
import { Field } from '../ui/Field'
import { Spinner, SuccessMark } from '../ui/States'
import { useApp } from '../../context/AppContext'
import { createExpertRequest } from '../../services/inquiryService'
import { validate } from '../../utils/validate'
import { todayISO } from '../../utils/format'

const RULES = {
  name: { required: true, message: 'Tell us your name' },
  email: { required: true, email: true },
  phone: { required: true, phone: true },
  location: { required: true, message: 'Where would you like to live?' },
  budget: { required: true, message: 'Add a monthly budget', custom: (v) => (Number(v) > 0 ? undefined : 'Enter a number greater than 0') },
  moveIn: { required: true, message: 'Pick a rough move-in date' },
}

const blank = (user) => ({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '', location: '', budget: '', moveIn: '', message: '' })

export default function ExpertModal() {
  const { expertOpen, closeExpert, user, toast } = useApp()
  const [values, setValues] = useState(blank(user))
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [failure, setFailure] = useState('')

  useEffect(() => {
    if (expertOpen) {
      setValues(blank(user))
      setErrors({})
      setStatus('idle')
      setFailure('')
    }
  }, [expertOpen, user])

  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    const errs = validate(values, RULES)
    setErrors(errs)
    if (Object.keys(errs).length) return
    setStatus('sending')
    setFailure('')
    try {
      await createExpertRequest({ ...values, type: 'expert', userId: user?.id })
      setStatus('done')
      toast('Request sent to a housing expert')
    } catch (err) {
      setFailure(err.message || 'Could not send your request')
      setStatus('idle')
    }
  }

  return (
    <Modal open={expertOpen} onClose={closeExpert} eyebrow="Free housing expert" title="Tell us what you need">
      {status === 'done' ? (
        <div className="flex flex-col items-center py-8 text-center">
          <SuccessMark />
          <motion.h3 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="h-lg mt-6">We have your brief.</motion.h3>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} className="mt-3 max-w-sm text-mute">
            A housing expert will email you at {values.email} within one working day with a shortlist.
          </motion.p>
          <button type="button" className="btn-accent mt-8" onClick={closeExpert}>Done</button>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="grid gap-5 sm:grid-cols-2">
          {failure && <p role="alert" className="rounded-2xl border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-200 sm:col-span-2">{failure}</p>}
          <Field label="Name" required value={values.name} onChange={set('name')} error={errors.name} autoComplete="name" />
          <Field label="Email" required type="email" value={values.email} onChange={set('email')} error={errors.email} autoComplete="email" />
          <Field label="Phone" required type="tel" value={values.phone} onChange={set('phone')} error={errors.phone} autoComplete="tel" />
          <Field label="Desired location" required value={values.location} onChange={set('location')} error={errors.location} placeholder="City or neighbourhood" />
          <Field label="Monthly budget (USD)" required type="number" min="0" inputMode="numeric" value={values.budget} onChange={set('budget')} error={errors.budget} placeholder="3000" />
          <Field label="Move-in date" required type="date" min={todayISO()} value={values.moveIn} onChange={set('moveIn')} error={errors.moveIn} />
          <Field as="textarea" label="Message" className="sm:col-span-2" value={values.message} onChange={set('message')} placeholder="Anything that matters: pets, commute, light, quiet, lease length…" />
          <div className="flex justify-end sm:col-span-2">
            <button type="submit" disabled={status === 'sending'} className="btn-accent min-w-44">{status === 'sending' ? <Spinner /> : 'Request an expert'}</button>
          </div>
        </form>
      )}
    </Modal>
  )
}
