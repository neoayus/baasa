import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogoMark } from '../components/ui/Logo'
import useDocTitle from '../hooks/useDocTitle'

export default function NotFound() {
  useDocTitle('Page not found')
  return (
    <div className="container-x flex min-h-[100dvh] flex-col items-center justify-center pb-12 pt-28 text-center">
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="relative">
        <p className="outline-text font-display text-[34vw] font-semibold leading-[0.8] tracking-tighter md:text-[22rem]" aria-hidden="true">404</p>
        <LogoMark className="absolute left-1/2 top-1/2 h-[18vw] w-[18vw] -translate-x-1/2 -translate-y-1/2 text-bone md:h-40 md:w-40" />
      </motion.div>
      <h1 className="h-lg mt-10">This room doesn’t exist.</h1>
      <p className="mt-4 max-w-md text-mute">The page may have moved or never existed. Let’s get you back to somewhere worth calling home.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/" className="btn-accent">Back home</Link>
        <Link to="/explore" className="btn-ghost">Explore places</Link>
      </div>
    </div>
  )
}
