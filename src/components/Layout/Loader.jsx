import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { markBooted } from '../../utils/boot'
import { LogoMark } from '../ui/Logo'

export default function Loader({ onDone }) {
  const root = useRef(null)

  useLayoutEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          markBooted()
          onDone()
        },
      })
      if (reduce) {
        tl.to(root.current, { autoAlpha: 0, duration: 0.2, delay: 0.15 })
        return
      }
      tl.fromTo('.ld-char', { yPercent: 115 }, { yPercent: 0, duration: 0.6, stagger: 0.05, ease: 'power4.out' })
        .fromTo('.ld-sub', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.45 }, '-=0.35')
        .fromTo('.ld-bar', { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'power2.inOut' }, '-=0.6')
        .to(root.current, { clipPath: 'inset(0 0 100% 0)', duration: 0.7, ease: 'expo.inOut' }, '+=0.05')
    }, root)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      ref={root}
      role="status"
      aria-label="Loading Alcove"
      className="fixed inset-0 z-[100] grid place-items-center bg-ink"
      style={{ clipPath: 'inset(0 0 0% 0)' }}
    >
      <div className="flex flex-col items-center gap-6">
        <LogoMark className="h-10 w-10 text-bone" />
        <div className="flex gap-[0.04em] font-display text-[clamp(2.4rem,9vw,5.5rem)] font-semibold uppercase leading-none tracking-[0.18em]">
          {'ALCOVE'.split('').map((c, i) => (
            <span key={i} className="inline-block overflow-hidden pb-[0.08em]">
              <span className="ld-char inline-block">{c}</span>
            </span>
          ))}
        </div>
        <p className="ld-sub meta">finding your next place…</p>
        <div className="h-px w-40 overflow-hidden bg-line">
          <div className="ld-bar h-full origin-left bg-accent" />
        </div>
      </div>
    </div>
  )
}
