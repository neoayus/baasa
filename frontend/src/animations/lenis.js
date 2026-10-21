import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let lenis = null
let tick = null

export function initLenis() {
  if (lenis) return lenis
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null
  lenis = new Lenis({
    duration: 1.05,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  })
  lenis.on('scroll', ScrollTrigger.update)
  tick = (time) => lenis && lenis.raf(time * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)
  return lenis
}

export function destroyLenis() {
  if (tick) gsap.ticker.remove(tick)
  tick = null
  if (lenis) lenis.destroy()
  lenis = null
}

export const getLenis = () => lenis

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true })
  else window.scrollTo(0, 0)
}

export function scrollToEl(el) {
  if (!el) return
  if (lenis) lenis.scrollTo(el, { offset: -100 })
  else el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
