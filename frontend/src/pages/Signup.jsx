import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import SmartImage from '../components/ui/SmartImage'
import { Field } from '../components/ui/Field'
import { Spinner } from '../components/ui/States'
import { useApp } from '../context/AppContext'
import { validate } from '../utils/validate'
import useDocTitle from '../hooks/useDocTitle'

const IMAGE = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=75'

export default function Signup() {
  useDocTitle('Create account')
  const { user, signup } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/'
  const [v, setV] = useState({ name: '', email: '', phone: '', password: '' })
  const [errors, setErrors] = useState({})
  const [failure, setFailure] = useState('')
  const [busy, setBusy] = useState(false)

  if (user && !busy) return <Navigate to={from} replace />

  const set = (k) => (e) => setV((s) => ({ ...s, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    const errs = validate(v, {
      name: { required: true, message: 'Tell us your name' },
      email: { required: true, email: true },
      phone: { required: true, phone: true },
      password: { required: true, min: 8, message: 'Choose a password' },
    })
    setErrors(errs)
    if (Object.keys(errs).length) return
    setBusy(true)
    setFailure('')
    try {
      await signup(v)
      navigate(from, { replace: true })
    } catch (err) {
      setFailure(err.message || 'Could not create your account')
      setBusy(false)
    }
  }

  return (
    <div className="grid min-h-[100dvh] lg:grid-cols-2">
      <div className="flex items-center px-5 pb-12 pt-28 sm:px-12 lg:px-20">
        <form onSubmit={submit} noValidate className="mx-auto w-full max-w-md space-y-5">
          <p className="meta">Join Alcove</p>
          <h1 className="h-xl !text-[clamp(2.4rem,5vw,4rem)]">Create account</h1>
          {failure && <p role="alert" className="rounded-2xl border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-200">{failure}</p>}
          <Field label="Name" required autoComplete="name" value={v.name} onChange={set('name')} error={errors.name} />
          <Field label="Email" type="email" required autoComplete="email" value={v.email} onChange={set('email')} error={errors.email} />
          <Field label="Phone" type="tel" required autoComplete="tel" value={v.phone} onChange={set('phone')} error={errors.phone} />
          <Field label="Password" type="password" required autoComplete="new-password" value={v.password} onChange={set('password')} error={errors.password} hint="At least 8 characters." />
          <button type="submit" disabled={busy} className="btn-accent w-full !py-4">{busy ? <Spinner /> : 'Create account'}</button>
          <p className="text-center text-sm text-mute">Already have an account? <Link to="/login" state={{ from }} className="text-accent underline-offset-4 hover:underline">Log in</Link></p>
        </form>
      </div>
      <div className="relative hidden lg:block">
        <SmartImage src={IMAGE} alt="A white modern house with a garden" eager className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-ink/50" />
        <p className="h-xl absolute bottom-14 left-12 right-12">Somewhere<br />to begin.</p>
      </div>
    </div>
  )
}
