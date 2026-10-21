import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { AlertTriangle, SearchX } from 'lucide-react'
import { LogoMark } from './Logo'
import { cn } from '../../utils/cn'

export function EmptyState({ title, text, action, to, onClick, icon: Icon = SearchX, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={cn('flex flex-col items-center rounded-[2rem] border border-dashed border-line px-6 py-20 text-center', className)}
    >
      <div className="relative mb-8 grid h-24 w-24 place-items-center rounded-t-full border border-line text-bone/70">
        <Icon className="h-8 w-8" aria-hidden="true" />
        <span className="absolute -bottom-px left-1/2 h-px w-32 -translate-x-1/2 bg-line" />
      </div>
      <h3 className="h-lg max-w-xl">{title}</h3>
      {text && <p className="mt-4 max-w-md text-mute">{text}</p>}
      {action && (to ? (
        <Link to={to} className="btn-accent mt-8">{action}</Link>
      ) : (
        <button type="button" onClick={onClick} className="btn-accent mt-8">{action}</button>
      ))}
    </motion.div>
  )
}

export function ErrorState({ title = 'Something went wrong', text = 'The request failed. Check your connection and try again.', onRetry }) {
  return (
    <EmptyState icon={AlertTriangle} title={title} text={text} action={onRetry ? 'Try again' : undefined} onClick={onRetry} />
  )
}

export function Spinner({ className }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn('inline-block h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent', className)}
    />
  )
}

export function SkeletonCard() {
  return (
    <div className="animate-pulse" aria-hidden="true">
      <div className="aspect-[4/5] rounded-[1.75rem] bg-surface sm:aspect-[5/6]" />
      <div className="mt-5 h-5 w-2/3 rounded bg-surface" />
      <div className="mt-3 h-3 w-1/2 rounded bg-surface" />
      <div className="mt-5 h-6 w-1/3 rounded bg-surface" />
    </div>
  )
}

export function PageFallback() {
  return (
    <div className="grid min-h-[60vh] place-items-center text-bone/40" role="status" aria-label="Loading page">
      <LogoMark className="h-12 w-12 animate-pulse" />
    </div>
  )
}

export function SuccessMark({ className }) {
  return (
    <motion.svg viewBox="0 0 96 96" className={cn('h-24 w-24', className)} fill="none" aria-hidden="true" initial="hidden" animate="show">
      <motion.circle
        cx="48" cy="48" r="44" stroke="#F4B03E" strokeWidth="2"
        variants={{ hidden: { pathLength: 0, opacity: 0 }, show: { pathLength: 1, opacity: 1, transition: { duration: 0.8 } } }}
      />
      <motion.path
        d="M28 50l14 14 27-30" stroke="#F4B03E" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
        variants={{ hidden: { pathLength: 0 }, show: { pathLength: 1, transition: { duration: 0.55, delay: 0.55 } } }}
      />
    </motion.svg>
  )
}
