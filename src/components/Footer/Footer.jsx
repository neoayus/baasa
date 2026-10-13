import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { ArrowUp } from 'lucide-react'
import { LogoMark } from '../ui/Logo'
import { getLenis } from '../../animations/lenis'

const LINKS = [
  ['Explore', '/explore'],
  ['List your property', '/list-property'],
  ['Partner with us', '/support#partner'],
  ['About', '/about'],
  ['Support', '/support'],
  ['Privacy', '/support#privacy'],
  ['Terms', '/support#terms'],
]

export default function Footer() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const x = useTransform(scrollYProgress, [0, 1], ['12%', '-4%'])

  const top = () => (getLenis() ? getLenis().scrollTo(0, { duration: 1.6 }) : window.scrollTo({ top: 0, behavior: 'smooth' }))

  return (
    <footer ref={ref} className="relative mt-24 overflow-hidden border-t border-line bg-ink2 pt-16 md:pt-24">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          <h2 className="h-mega" aria-label="Find your place.">
            {['Find', 'Your', 'Place.'].map((w, i) => (
              <motion.span
                key={w}
                className="block overflow-hidden pb-[0.06em]"
                initial="rest"
                whileHover="hover"
                whileInView="show"
                viewport={{ once: true, margin: '-10%' }}
              >
                <motion.span
                  className="block"
                  variants={{ rest: { y: '100%' }, show: { y: 0, transition: { duration: 1, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] } }, hover: { x: 18, transition: { duration: 0.4 } } }}
                >
                  {w === 'Place.' ? (
                    <>
                      Place<span className="text-accent">.</span>
                    </>
                  ) : (
                    w
                  )}
                </motion.span>
              </motion.span>
            ))}
          </h2>

          <nav aria-label="Footer" className="flex flex-col justify-end">
            <ul className="grid grid-cols-2 gap-x-6 border-t border-line lg:grid-cols-1">
              {LINKS.map(([label, to]) => (
                <li key={label} className="border-b border-line">
                  <Link to={to} className="group flex items-center justify-between py-3.5 text-lg transition-colors hover:text-accent">
                    {label}
                    <span className="translate-x-[-6px] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" aria-hidden="true">↗</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-line py-6">
          <p className="meta">© 2026 BAASA</p>
          <button type="button" onClick={top} className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm transition-colors hover:bg-white/5">
            Back to top <ArrowUp className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <motion.div style={{ x }} aria-hidden="true" className="flex items-center gap-6 whitespace-nowrap pb-4 leading-none">
        <span className="outline-text font-display text-[22vw] font-semibold uppercase tracking-[-0.04em]">BAASA</span>
        <LogoMark className="h-[14vw] w-[14vw] text-bone/20" />
        <span className="outline-text font-display text-[22vw] font-semibold uppercase tracking-[-0.04em]">BAASA</span>
      </motion.div>
    </footer>
  )
}
