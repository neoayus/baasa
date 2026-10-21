import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import PropertyCard from '../PropertyCard/PropertyCard'
import { RevealText } from '../../animations/Reveal'
import { CITY_ORDER } from '../../data/extras'

export default function Nearby({ properties }) {
  const cities = useMemo(
    () => CITY_ORDER.filter((c) => properties.some((p) => p.city === c)).map((c) => ({ city: c, count: properties.filter((p) => p.city === c).length })),
    [properties],
  )
  const [picked, setPicked] = useState(null)
  const active = picked && cities.some((c) => c.city === picked) ? picked : cities[0]?.city
  const list = properties.filter((p) => p.city === active).slice(0, 3)

  return (
    <section className="container-x py-24 md:py-32" aria-labelledby="nearby-title">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="meta mb-4">Nearby — Around the city</p>
          <h2 id="nearby-title" className="sr-only">Places around {active}</h2>
          <div aria-hidden="true">
            <RevealText as="p" text="Places around" className="h-xl" />
            <AnimatePresence mode="wait">
              <motion.p key={active} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -30, opacity: 0 }} transition={{ duration: 0.4 }} className="h-xl text-accent">
                {active}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
        <Link to={`/search?q=${encodeURIComponent(active || '')}`} className="btn-ghost group">
          All in {active} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      </div>

      <div role="tablist" aria-label="Choose a city" className="no-scrollbar -mx-5 mb-12 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
        {cities.map((c) => (
          <button
            key={c.city}
            role="tab"
            type="button"
            aria-selected={active === c.city}
            onClick={() => setPicked(c.city)}
            className="chip shrink-0 !px-5 !py-2.5 aria-selected:border-accent aria-selected:bg-accent aria-selected:text-ink"
          >
            {c.city} <span className="font-mono text-[0.65rem] opacity-70">{c.count}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          role="tabpanel"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.4 }}
          className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
        >
          {list.map((p, i) => <PropertyCard key={p.id} property={p} index={i} reveal={false} />)}
        </motion.div>
      </AnimatePresence>
    </section>
  )
}
