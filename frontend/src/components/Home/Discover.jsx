import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import SmartImage from '../ui/SmartImage'
import { MaskReveal, RevealText } from '../../animations/Reveal'
import { imgW, pad } from '../../utils/format'

const TILES = [
  { type: 'House', blurb: 'Gardens, pools and space to spread out.', span: 'lg:col-span-7 lg:row-span-2', ratio: 'aspect-[4/5] lg:aspect-auto lg:h-full lg:min-h-[44rem]' },
  { type: 'Loft', blurb: 'Brick, beams and enormous windows.', span: 'lg:col-span-5', ratio: 'aspect-[16/11]' },
  { type: 'Studio', blurb: 'Small footprint, considered design.', span: 'lg:col-span-5', ratio: 'aspect-[16/11]' },
]

export default function Discover({ properties }) {
  const tiles = TILES.map((t) => {
    const list = properties.filter((p) => p.propertyType === t.type)
    return { ...t, count: list.length, cover: list[0] }
  })

  return (
    <section className="container-x py-24 md:py-36" aria-labelledby="discover-title">
      <div className="mb-12 grid gap-6 md:mb-16 md:grid-cols-[1fr_20rem] md:items-end">
        <div>
          <p className="meta mb-4">Discover — Browse by type</p>
          <RevealText as="h2" id="discover-title" text={'Every kind of\nfront door.'} className="h-xl" />
        </div>
        <p className="text-mute">Start with how you want to live, then narrow by city, budget and move-in date.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-12 lg:gap-6">
        {tiles.map((t, i) => (
          <MaskReveal key={t.type} className={t.span} delay={i * 0.08}>
            <Link
              to={`/explore?type=${encodeURIComponent(t.type)}`}
              className="group relative block h-full overflow-hidden rounded-[2rem]"
              aria-label={`Browse ${t.type} listings (${t.count})`}
            >
              {t.cover && (
                <SmartImage
                  src={imgW(t.cover.images[0], 1200)}
                  alt={`${t.type} — ${t.cover.name}`}
                  className={t.ratio}
                  imgClassName="transition-transform duration-[1600ms] ease-out group-hover:scale-[1.06]"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-ink/30" />
              <div className="absolute inset-x-6 bottom-6 flex items-end justify-between gap-4 md:inset-x-8 md:bottom-8">
                <div>
                  <p className="meta mb-2 text-bone/80">{pad(i + 1)} — {t.count} places</p>
                  <h3 className="h-lg">{t.type}s</h3>
                  <p className="mt-2 hidden max-w-xs text-sm text-bone/70 sm:block">{t.blurb}</p>
                </div>
                <motion.span whileHover={{ rotate: 45 }} className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-bone text-ink transition-colors group-hover:bg-accent">
                  <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
                </motion.span>
              </div>
            </Link>
          </MaskReveal>
        ))}
      </div>
    </section>
  )
}
