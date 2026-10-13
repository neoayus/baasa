import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ImagePlus, ShieldCheck, X } from 'lucide-react'
import Stepper from '../components/ui/Stepper'
import { Chip, Field, Switch } from '../components/ui/Field'
import { Spinner, SuccessMark } from '../components/ui/States'
import PropertyCard from '../components/PropertyCard/PropertyCard'
import { useApp } from '../context/AppContext'
import { createListing } from '../services/propertyService'
import { AMENITY_POOL } from '../data/properties'
import { PROPERTY_TYPES } from '../utils/propertyQuery'
import { validate } from '../utils/validate'
import { fileToDataUrl } from '../utils/image'
import { todayISO } from '../utils/format'
import useDocTitle from '../hooks/useDocTitle'

const STEPS = ['Property', 'Location', 'Photos', 'Amenities', 'Pricing', 'Availability', 'Verification', 'Publish']

const SAMPLES = [
  'photo-1600585154340-be6161a56a0c', 'photo-1600596542815-ffad4c1539a9', 'photo-1502672260266-1c1ef2d93688',
  'photo-1484154218962-a197022b5858', 'photo-1540518614846-7eded433c457', 'photo-1560448204-e02f11c3d0e2',
].map((id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=75`)

const RULES = [
  {
    name: { required: true, message: 'Give your property a name', min: 3 },
    propertyType: { required: true },
    description: { required: true, min: 30, message: 'Write at least a couple of sentences (30+ characters)' },
  },
  {
    address: { required: true, message: 'Enter the street address' },
    city: { required: true }, state: { required: true, custom: (s) => (s.length === 2 ? undefined : 'Use 2 letters, e.g. TX') },
    zip: { required: true, custom: (z) => (/^\d{5}$/.test(z) ? undefined : 'Enter a 5-digit ZIP') },
  },
  { images: { required: true, message: 'Add at least one photo' } },
  { amenities: { required: true, message: 'Pick at least one amenity' } },
  { price: { required: true, custom: (p) => (Number(p) >= 100 ? undefined : 'Enter a monthly rent of $100 or more') } },
  { availableFrom: { required: true, message: 'Choose when it is available' } },
  {},
  {},
]

export default function ListProperty() {
  useDocTitle('List your property')
  const { user, toast } = useApp()
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const [failure, setFailure] = useState('')
  const [published, setPublished] = useState(null)
  const fileRef = useRef(null)
  const [v, setV] = useState({
    name: '', propertyType: 'Apartment', description: '', bedrooms: 1, bathrooms: 1, sqft: '', furnished: false,
    address: '', city: '', state: '', zip: '', neighborhood: '',
    images: [], amenities: [],
    price: '', instantBooking: false,
    availableFrom: '', tourAvailable: true, requestVerification: true,
  })
  const set = (k) => (e) => setV((s) => ({ ...s, [k]: e.target.value }))
  const patch = (o) => setV((s) => ({ ...s, ...o }))

  const go = (to) => { setDir(to > step ? 1 : -1); setStep(to); setErrors({}) }

  const next = () => {
    const errs = validate(v, RULES[step])
    setErrors(errs)
    if (!Object.keys(errs).length) go(step + 1)
  }

  const addFiles = async (files) => {
    const list = [...files].slice(0, 6 - v.images.length)
    try {
      const urls = await Promise.all(list.map((f) => fileToDataUrl(f)))
      patch({ images: [...v.images, ...urls] })
      setErrors({})
    } catch (err) {
      setErrors({ images: err.message })
    }
  }
  const toggleSample = (url) => patch({ images: v.images.includes(url) ? v.images.filter((x) => x !== url) : [...v.images, url].slice(0, 6) })
  const toggleAmenity = (a) => patch({ amenities: v.amenities.includes(a) ? v.amenities.filter((x) => x !== a) : [...v.amenities, a] })

  const publish = async () => {
    setBusy(true)
    setFailure('')
    try {
      const listing = await createListing({ ...v, description: v.description, neighborhood: v.neighborhood || v.city }, user)
      setPublished(listing)
      toast('Property listed')
    } catch (err) {
      setFailure(err.message || 'We could not publish your listing')
    } finally {
      setBusy(false)
    }
  }

  const draft = {
    id: 'draft', name: v.name || 'Your property name', city: v.city || 'City', state: (v.state || 'ST').toUpperCase(), zip: v.zip || '00000',
    neighborhood: v.neighborhood || v.city || 'Neighbourhood', propertyType: v.propertyType, bedrooms: Number(v.bedrooms), bathrooms: Number(v.bathrooms),
    price: Number(v.price) || 0, currency: 'USD', distance: 1.5, rating: 4.5, verified: false, instantBooking: v.instantBooking, tourAvailable: v.tourAvailable,
    images: v.images.length ? v.images : [SAMPLES[0]], tags: v.amenities.slice(0, 3),
  }

  if (published) {
    return (
      <div className="container-x flex min-h-[80vh] flex-col items-center justify-center pb-12 pt-32 text-center">
        <SuccessMark />
        <h1 className="h-xl mt-8">It’s live.</h1>
        <p className="mt-4 max-w-md text-mute">{published.name} now appears in Explore and search. {v.requestVerification && 'Complete verification to earn the badge.'}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link to={`/property/${published.id}`} className="btn-accent">View listing</Link>
          {v.requestVerification && <Link to="/verification" className="btn-ghost">Start verification</Link>}
          <Link to="/profile" className="btn-ghost">Go to profile</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container-x pb-12 pt-28 lg:pt-36">
      <p className="meta mb-5">Owners — New listing</p>
      <h1 className="h-xl mb-10">List your property</h1>
      <Stepper steps={STEPS} current={step} onJump={go} />

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_24rem] lg:gap-16">
        <div className="min-w-0">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div key={step} custom={dir} variants={{ enter: (d) => ({ opacity: 0, x: 40 * d }), center: { opacity: 1, x: 0 }, exit: (d) => ({ opacity: 0, x: -40 * d }) }} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
              <h2 className="h-lg mb-8"><span className="mr-3 font-mono text-sm text-accent">{String(step + 1).padStart(2, '0')}</span>{STEPS[step]}</h2>

              {step === 0 && (
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Property name" required className="sm:col-span-2" value={v.name} onChange={set('name')} error={errors.name} placeholder="e.g. The Orchard House" />
                  <fieldset className="sm:col-span-2">
                    <legend className="meta mb-3">Property type</legend>
                    <div className="flex flex-wrap gap-2">{PROPERTY_TYPES.map((t) => <Chip key={t} active={v.propertyType === t} onClick={() => patch({ propertyType: t })}>{t}</Chip>)}</div>
                  </fieldset>
                  <Field as="textarea" label="Description" required className="sm:col-span-2" value={v.description} onChange={set('description')} error={errors.description} placeholder="What makes it special? Light, materials, neighbourhood, who it suits." />
                  <Field as="select" label="Bedrooms" value={v.bedrooms} onChange={set('bedrooms')}>{[0, 1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n === 0 ? 'Studio' : n}</option>)}</Field>
                  <Field as="select" label="Bathrooms" value={v.bathrooms} onChange={set('bathrooms')}>{[1, 1.5, 2, 2.5, 3, 4].map((n) => <option key={n} value={n}>{n}</option>)}</Field>
                  <Field label="Size (sq ft)" type="number" min="0" value={v.sqft} onChange={set('sqft')} placeholder="900" />
                  <div className="self-end"><Switch checked={v.furnished} onChange={(x) => patch({ furnished: x })} label="Furnished" /></div>
                </div>
              )}

              {step === 1 && (
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Street address" required className="sm:col-span-2" value={v.address} onChange={set('address')} error={errors.address} autoComplete="street-address" />
                  <Field label="City" required value={v.city} onChange={set('city')} error={errors.city} />
                  <Field label="Neighbourhood" value={v.neighborhood} onChange={set('neighborhood')} placeholder="Optional" />
                  <Field label="State" required maxLength={2} value={v.state} onChange={(e) => patch({ state: e.target.value.toUpperCase() })} error={errors.state} placeholder="TX" />
                  <Field label="ZIP" required inputMode="numeric" maxLength={5} value={v.zip} onChange={(e) => patch({ zip: e.target.value.replace(/\D/g, '') })} error={errors.zip} placeholder="78701" />
                </div>
              )}

              {step === 2 && (
                <div className="space-y-8">
                  <div>
                    <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => { addFiles(e.target.files); e.target.value = '' }} />
                    <button type="button" onClick={() => fileRef.current?.click()} disabled={v.images.length >= 6} className="flex w-full flex-col items-center gap-3 rounded-3xl border border-dashed border-line px-6 py-12 text-mute transition-colors hover:border-accent hover:text-bone disabled:opacity-50">
                      <ImagePlus className="h-8 w-8" aria-hidden="true" />
                      <span>Upload photos <span className="text-mute/70">({v.images.length}/6)</span></span>
                    </button>
                    {errors.images && <p role="alert" className="mt-2 text-xs text-red-300">{errors.images}</p>}
                  </div>
                  <div>
                    <p className="meta mb-3">Or choose sample photos</p>
                    <ul className="grid grid-cols-3 gap-3">
                      {SAMPLES.map((s, i) => (
                        <li key={s}>
                          <button type="button" aria-pressed={v.images.includes(s)} onClick={() => toggleSample(s)} className={`relative block aspect-[4/3] w-full overflow-hidden rounded-2xl border-2 transition-colors ${v.images.includes(s) ? 'border-accent' : 'border-transparent'}`}>
                            <img src={s.replace('w=1400', 'w=400')} alt={`Sample photo ${i + 1}`} loading="lazy" className="h-full w-full object-cover" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {v.images.length > 0 && (
                    <ul className="flex flex-wrap gap-3" aria-label="Selected photos">
                      {v.images.map((src, i) => (
                        <li key={src.slice(-40) + i} className="relative h-20 w-28 overflow-hidden rounded-xl">
                          <img src={src} alt={`Selected photo ${i + 1}`} className="h-full w-full object-cover" />
                          <button type="button" aria-label={`Remove photo ${i + 1}`} onClick={() => patch({ images: v.images.filter((_, j) => j !== i) })} className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-ink/80"><X className="h-3 w-3" /></button>
                          {i === 0 && <span className="absolute bottom-1 left-1 rounded bg-accent px-1.5 text-[0.6rem] font-medium text-ink">COVER</span>}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {step === 3 && (
                <div>
                  <div className="flex flex-wrap gap-2">{AMENITY_POOL.map((a) => <Chip key={a} active={v.amenities.includes(a)} onClick={() => toggleAmenity(a)}>{a}</Chip>)}</div>
                  {errors.amenities && <p role="alert" className="mt-3 text-xs text-red-300">{errors.amenities}</p>}
                </div>
              )}

              {step === 4 && (
                <div className="max-w-md space-y-6">
                  <Field label="Monthly rent (USD)" required type="number" min="0" inputMode="numeric" value={v.price} onChange={set('price')} error={errors.price} placeholder="2500" />
                  <div className="divide-y divide-line border-y border-line"><Switch checked={v.instantBooking} onChange={(x) => patch({ instantBooking: x })} label="Allow instant booking" description="Renters confirm without waiting for approval" /></div>
                  <p className="text-sm text-mute">Renters pay a one-month deposit plus a 3% service fee on top of your rent.</p>
                </div>
              )}

              {step === 5 && (
                <div className="max-w-md space-y-6">
                  <Field label="Available from" required type="date" min={todayISO()} value={v.availableFrom} onChange={set('availableFrom')} error={errors.availableFrom} />
                  <div className="divide-y divide-line border-y border-line"><Switch checked={v.tourAvailable} onChange={(x) => patch({ tourAvailable: x })} label="Offer tours" description="In person or live video" /></div>
                </div>
              )}

              {step === 6 && (
                <div className="card max-w-xl p-7">
                  <ShieldCheck className="mb-5 h-9 w-9 text-accent" aria-hidden="true" />
                  <h3 className="font-display text-2xl font-semibold">Earn the Verified badge</h3>
                  <p className="mt-3 text-mute">Verified listings rank higher and get 2× more inquiries. You will confirm your identity, contact details and ownership after publishing.</p>
                  <div className="mt-4 border-t border-line"><Switch checked={v.requestVerification} onChange={(x) => patch({ requestVerification: x })} label="Start verification after publishing" /></div>
                </div>
              )}

              {step === 7 && (
                <div className="space-y-6">
                  <p className="max-w-lg text-mute">This is how your listing will appear to renters. Edit any step before you publish.</p>
                  {failure && <p role="alert" className="rounded-2xl border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-200">{failure}</p>}
                  <div className="max-w-sm"><PropertyCard property={draft} reveal={false} /></div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 flex items-center justify-between border-t border-line pt-6">
            <button type="button" onClick={() => go(step - 1)} disabled={step === 0 || busy} className="btn-ghost"><ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back</button>
            {step < 7 ? (
              <button type="button" onClick={next} className="btn-accent min-w-40">Continue <ArrowRight className="h-4 w-4" aria-hidden="true" /></button>
            ) : (
              <button type="button" onClick={publish} disabled={busy} className="btn-accent min-w-40">{busy ? <Spinner /> : 'Publish listing'}</button>
            )}
          </div>
        </div>

        <aside className="hidden lg:block" aria-label="Live preview">
          <div className="sticky top-28">
            <p className="meta mb-4">Live preview</p>
            <PropertyCard property={draft} reveal={false} />
          </div>
        </aside>
      </div>
    </div>
  )
}
