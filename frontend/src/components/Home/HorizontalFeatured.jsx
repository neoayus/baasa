import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight } from 'lucide-react'
import PropertyCard from '../PropertyCard/PropertyCard'
import { RevealText } from '../../animations/Reveal'

gsap.registerPlugin(ScrollTrigger)

/** Pinned horizontal scroll on large screens; native swipe carousel everywhere else. */
export default function HorizontalFeatured({ properties }) {
  const section = useRef(null)
  const track = useRef(null)

  useLayoutEffect(() => {
    if (!properties.length) return undefined
    const mm = gsap.matchMedia()
    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const distance = () => Math.max(0, track.current.scrollWidth - section.current.clientWidth)
      gsap.to(track.current, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      })
      gsap.fromTo('.feat-progress', { scaleX: 0 }, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { trigger: section.current, start: 'top top', end: () => `+=${distance()}`, scrub: true, invalidateOnRefresh: true },
      })
    })
    return () => mm.revert()
  }, [properties])

  return (
    <section ref={section} className="relative flex flex-col justify-center overflow-hidden py-20 lg:min-h-screen lg:py-12" aria-labelledby="featured-title">
      <div className="container-x mb-10 flex flex-wrap items-end justify-between gap-6 lg:mb-8">
        <div>
          <p className="meta mb-4">Featured — Selected this week</p>
          <RevealText as="h2" id="featured-title" text={'Eight homes we\nwould move into.'} className="h-xl" />
        </div>
        <Link to="/explore" className="btn-ghost group">
          View all places <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      </div>

      <div
        ref={track}
        className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-2 sm:px-8 lg:w-max lg:snap-none lg:gap-8 lg:overflow-visible lg:px-12"
      >
        {properties.map((p, i) => (
          <div key={p.id} className="w-[80vw] shrink-0 snap-center sm:w-[22rem] lg:w-[25rem]">
            <PropertyCard property={p} index={i} reveal={false} />
          </div>
        ))}
        <Link
          to="/explore"
          className="group hidden w-[18rem] shrink-0 flex-col items-start justify-end rounded-[1.75rem] border border-line p-8 transition-colors hover:border-accent lg:flex"
        >
          <span className="h-lg">See every place</span>
          <span className="mt-6 grid h-14 w-14 place-items-center rounded-full bg-accent text-ink transition-transform group-hover:translate-x-2">
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </span>
        </Link>
      </div>

      <div className="container-x mt-10 hidden lg:block" aria-hidden="true">
        <div className="h-px w-full bg-line">
          <div className="feat-progress h-full origin-left bg-accent" />
        </div>
      </div>
    </section>
  )
}
