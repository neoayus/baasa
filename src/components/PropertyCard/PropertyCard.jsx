import { memo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, BadgeCheck, Eye, MapPin, Star, Zap } from 'lucide-react'
import SmartImage from '../ui/SmartImage'
import Badge from '../ui/Badge'
import FavoriteButton from '../ui/FavoriteButton'
import { useApp } from '../../context/AppContext'
import { cn } from '../../utils/cn'
import { bedLabel, imgW, km, money, pad } from '../../utils/format'
import { EASE } from '../../animations/variants'

function PropertyCard({ property: p, index = 0, reveal = true, className }) {
  const { favorites, toggleFavorite, openInquiry } = useApp()
  const saved = favorites.includes(p.id)
  const Wrapper = reveal ? motion.article : 'article'
  const motionProps = reveal
    ? {
        initial: { opacity: 0, y: 44 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-60px' },
        transition: { duration: 0.85, ease: EASE, delay: (index % 3) * 0.08 },
      }
    : {}

  return (
    <Wrapper {...motionProps} className={cn('group', className)}>
      <div className="transition-transform duration-500 ease-out md:group-hover:-translate-y-1.5">
        <div className="relative overflow-hidden rounded-[1.75rem] bg-surface">
          <Link to={`/property/${p.id}`} aria-label={`View ${p.name}`} className="block">
            <SmartImage
              src={imgW(p.images[0], 900)}
              alt={`${p.name}, ${p.propertyType.toLowerCase()} in ${p.neighborhood}, ${p.city}`}
              className="aspect-[4/5] sm:aspect-[5/6]"
              imgClassName="transition-transform duration-[1400ms] ease-out md:group-hover:scale-[1.07]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/75 via-transparent to-ink/35" />
          </Link>

          <div className="pointer-events-none absolute left-4 right-16 top-4 flex flex-wrap gap-2">
            {p.verified && <Badge icon={BadgeCheck} tone="accent">Verified</Badge>}
            {p.instantBooking && <Badge icon={Zap}>Instant book</Badge>}
          </div>
          <FavoriteButton className="absolute right-4 top-4" active={saved} label={p.name} onToggle={() => toggleFavorite(p.id)} />

          <div className="pointer-events-none absolute inset-x-4 bottom-4 flex items-end justify-between">
            <span className="meta text-bone/80">N° {pad(index + 1)}</span>
            <div className="flex items-center gap-2">
              {p.tourAvailable && <Badge icon={Eye}>Tour</Badge>}
              <Badge icon={Star}>{p.rating.toFixed(1)}</Badge>
            </div>
          </div>
        </div>

        <div className="pt-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="font-display text-2xl font-semibold leading-tight tracking-tight">
                <Link to={`/property/${p.id}`} className="transition-colors hover:text-accent">{p.name}</Link>
              </h3>
              <p className="mt-1.5 flex items-center gap-1.5 text-sm text-mute">
                <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">{p.city}, {p.state} · {p.zip}</span>
              </p>
              <p className="meta mt-2">{km(p.distance)} · {p.propertyType} · {bedLabel(p.bedrooms)}</p>
            </div>
          </div>

          {p.tags?.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Highlights">
              {p.tags.slice(0, 3).map((t) => (
                <li key={t} className="rounded-full border border-line px-2.5 py-1 text-[0.72rem] text-mute">{t}</li>
              ))}
            </ul>
          )}

          <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4">
            <p className="font-display text-2xl font-semibold tracking-tight">
              {money(p.price, p.currency)}
              <span className="ml-1 text-sm font-normal text-mute">/ month</span>
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => openInquiry(p)}
                className="rounded-full border border-line px-4 py-2.5 text-sm transition-all duration-300 md:group-hover:border-accent md:group-hover:bg-accent md:group-hover:text-ink"
              >
                Inquire
              </button>
              <Link
                to={`/property/${p.id}`}
                aria-label={`Open ${p.name}`}
                className="grid h-10 w-10 place-items-center rounded-full border border-line transition-all duration-300 hover:bg-bone hover:text-ink"
              >
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  )
}

export default memo(PropertyCard)
