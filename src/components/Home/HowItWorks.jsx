import { motion } from 'framer-motion'
import { RevealText } from '../../animations/Reveal'
import { pad } from '../../utils/format'

const STEPS = [
  { t: 'Search', d: 'Filter by city, budget, type and move-in date. Every result is a real, current listing.' },
  { t: 'Tour', d: 'Book an in-person or live video tour with the owner, or send an inquiry with your questions.' },
  { t: 'Verify', d: 'Confirm your identity once. Owners are verified too, so both sides know who they are dealing with.' },
  { t: 'Move in', d: 'Pick your dates, pay the first month and deposit securely, and collect your keys.' },
]

export default function HowItWorks() {
  return (
    <section className="container-x py-24 md:py-32" aria-labelledby="how-title">
      <p className="meta mb-4">How it works — Four steps</p>
      <RevealText as="h2" id="how-title" text={'From first search\nto first night.'} className="h-xl max-w-4xl" />
      <ol className="mt-16 grid gap-px overflow-hidden rounded-[2rem] border border-line bg-line md:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <motion.li
            key={s.t}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ delay: i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="group relative flex min-h-[18rem] flex-col justify-between bg-ink p-7 transition-colors hover:bg-surface md:min-h-[22rem] md:p-9"
          >
            <span className="font-display text-7xl font-semibold tracking-tighter text-bone/15 transition-colors duration-500 group-hover:text-accent md:text-8xl">{pad(i + 1)}</span>
            <div>
              <h3 className="font-display text-3xl font-semibold tracking-tight">{s.t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-mute">{s.d}</p>
            </div>
            <motion.span
              aria-hidden="true"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + i * 0.15, duration: 0.9 }}
              className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-accent"
            />
          </motion.li>
        ))}
      </ol>
    </section>
  )
}
