import { motion } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { Reveal, RevealText } from '../../animations/Reveal'

const POINTS = ['A shortlist of verified homes within 24 hours', 'Help comparing neighbourhoods, commutes and budgets', 'No fee, no obligation, no spam']

export default function HousingExpert() {
  const { openExpert } = useApp()
  return (
    <section className="container-x py-12 md:py-20" aria-labelledby="expert-title">
      <div className="relative overflow-hidden rounded-[2.5rem] border border-line bg-surface px-6 py-14 md:px-16 md:py-24">
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-[28rem] w-[28rem] rounded-full border border-line" />
        <motion.div
          aria-hidden="true"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className="pointer-events-none absolute -right-10 -top-10 h-[20rem] w-[20rem] rounded-full border border-dashed border-accent/40"
        />
        <div className="relative grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <div>
            <p className="meta mb-5">Housing expert — Free</p>
            <RevealText as="h2" id="expert-title" text={'Not sure\nwhere to start?'} className="h-xl" />
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-lg text-lg text-mute">Connect with a housing expert for free personal assistance. Tell us what matters and we will do the searching.</p>
            </Reveal>
            <Reveal delay={0.15}>
              <button type="button" onClick={openExpert} className="btn-accent group mt-10 !px-8 !py-4">
                Talk to an expert <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </button>
            </Reveal>
          </div>
          <ul className="space-y-5">
            {POINTS.map((t, i) => (
              <Reveal as="li" key={t} delay={0.1 + i * 0.08} className="flex gap-4 border-t border-line pt-5">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent text-ink"><Check className="h-3.5 w-3.5" aria-hidden="true" /></span>
                <span>{t}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
