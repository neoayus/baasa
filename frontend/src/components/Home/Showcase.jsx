import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight, BedDouble, Bath, Ruler } from 'lucide-react'
import SmartImage from '../ui/SmartImage'
import { MaskReveal, Reveal } from '../../animations/Reveal'
import { bedLabel, imgW, money } from '../../utils/format'

export default function Showcase({ property: p }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const yBig = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])
  const ySmall = useTransform(scrollYProgress, [0, 1], ['14%', '-14%'])
  const word = useTransform(scrollYProgress, [0, 1], ['10%', '-30%'])
  if (!p) return null

  return (
    <section ref={ref} className="relative overflow-hidden border-y border-line bg-ink2 py-24 md:py-36" aria-labelledby="showcase-title">
      <motion.p aria-hidden="true" style={{ x: word }} className="outline-text pointer-events-none absolute left-0 top-10 whitespace-nowrap font-display text-[24vw] font-semibold uppercase leading-none">
        Spotlight · Spotlight
      </motion.p>

      <div className="container-x relative grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <MaskReveal direction="up">
            <div className="overflow-hidden rounded-[2rem]">
              <motion.div style={{ y: yBig, scale: 1.15 }}>
                <SmartImage src={imgW(p.images[0], 1600)} alt={`${p.name}, ${p.city}`} className="aspect-[4/5] md:aspect-[5/4]" />
              </motion.div>
            </div>
          </MaskReveal>
        </div>

        <div className="flex flex-col justify-between gap-12 lg:col-span-5 lg:pt-20">
          <div>
            <Reveal><p className="meta mb-5">Spotlight — Highest rated this month</p></Reveal>
            <Reveal delay={0.05}><h2 id="showcase-title" className="h-xl">{p.name}</h2></Reveal>
            <Reveal delay={0.1}><p className="mt-6 max-w-md leading-relaxed text-mute">{p.description}</p></Reveal>

            <Reveal delay={0.15}>
              <dl className="mt-10 grid grid-cols-3 border-y border-line py-6">
                {[
                  [BedDouble, bedLabel(p.bedrooms), 'Sleeps'],
                  [Bath, `${p.bathrooms} bath`, 'Bathrooms'],
                  [Ruler, `${p.sqft.toLocaleString()} sq ft`, 'Interior'],
                ].map(([Icon, v, l]) => (
                  <div key={l}>
                    <dt className="meta flex items-center gap-1.5"><Icon className="h-3.5 w-3.5" aria-hidden="true" />{l}</dt>
                    <dd className="mt-2 font-display text-xl font-semibold">{v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={0.2} className="mt-8 flex flex-wrap items-center gap-5">
              <p className="font-display text-4xl font-semibold tracking-tight">
                {money(p.price)}<span className="ml-1 text-base font-normal text-mute">/ month</span>
              </p>
              <Link to={`/property/${p.id}`} className="btn-accent group">
                View the home <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </Reveal>
          </div>

          <motion.div style={{ y: ySmall }} className="hidden w-2/3 self-end lg:block">
            <MaskReveal direction="left" delay={0.2}>
              <SmartImage src={imgW(p.images[2], 800)} alt={`Inside ${p.name}`} className="aspect-[4/5] rounded-[1.5rem]" />
            </MaskReveal>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
