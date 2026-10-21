import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import SmartImage from '../components/ui/SmartImage'
import { Field } from '../components/ui/Field'
import { Spinner } from '../components/ui/States'
import { useApp } from '../context/AppContext'
import { DEMO_CREDENTIALS } from '../data/users'
import { validate } from '../utils/validate'
import useDocTitle from '../hooks/useDocTitle'

const IMAGE = 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1400&q=75'

export default function Login() {
  useDocTitle('Log in')
  const { user, login } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/'
  const [v, setV] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [failure, setFailure] = useState('')
  const [busy, setBusy] = useState(false)

  if (user && !busy) return <Navigate to={from} replace />

  const run = async (creds) => {
    setBusy(true)
    setFailure('')
    try {
      await login(creds)
      navigate(from, { replace: true })
    } catch (err) {
      setFailure(err.message || 'Could not log in')
      setBusy(false)
    }
  }

  const submit = (e) => {
    e.preventDefault()
    const errs = validate(v, { email: { required: true, email: true, message: 'Enter your email' }, password: { required: true, message: 'Enter your password' } })
    setErrors(errs)
    if (!Object.keys(errs).length) run(v)
  }

  return (
    <div className="grid min-h-[100dvh] lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <SmartImage src={IMAGE} alt="A modern house glowing at dusk" eager className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-ink/50" />
        <p className="h-xl absolute bottom-14 left-12 right-12">Welcome<br />back home.</p>
      </div>
      <div className="flex items-center px-5 pb-12 pt-28 sm:px-12 lg:px-20">
        <form onSubmit={submit} noValidate className="mx-auto w-full max-w-md space-y-5">
          <p className="meta">Account</p>
          <h1 className="h-xl !text-[clamp(2.4rem,5vw,4rem)]">Log in</h1>
          {failure && <p role="alert" className="rounded-2xl border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-200">{failure}</p>}
          <Field label="Email" type="email" required autoComplete="email" value={v.email} onChange={(e) => setV({ ...v, email: e.target.value })} error={errors.email} />
          <Field label="Password" type="password" required autoComplete="current-password" value={v.password} onChange={(e) => setV({ ...v, password: e.target.value })} error={errors.password} />
          <button type="submit" disabled={busy} className="btn-accent w-full !py-4">{busy ? <Spinner /> : 'Login'}</button>
          <button type="button" disabled={busy} onClick={() => { setV(DEMO_CREDENTIALS); run(DEMO_CREDENTIALS) }} className="btn-ghost w-full">Use the demo account</button>
          <p className="text-center text-sm text-mute">New to Alcove? <Link to="/signup" state={{ from }} className="text-accent underline-offset-4 hover:underline">Create an account</Link></p>
        </form>
      </div>
    </div>
  )
}
