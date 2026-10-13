import { Link } from 'react-router-dom'
import { cn } from '../../utils/cn'

export function LogoMark({ className = 'h-7 w-7' }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden="true">
      <path d="M5 29V15a11 11 0 0 1 22 0v14" stroke="currentColor" strokeWidth="2" />
      <path d="M10.5 29V16a5.5 5.5 0 0 1 11 0v13" stroke="currentColor" strokeWidth="2" opacity=".4" />
      <circle cx="16" cy="21" r="2.6" fill="#F4B03E" />
    </svg>
  )
}

export default function Logo({ className }) {
  return (
    <Link to="/" aria-label="Alcove — home" className={cn('group inline-flex items-center gap-2.5', className)}>
      <LogoMark className="h-7 w-7 transition-transform duration-500 group-hover:-translate-y-0.5" />
      <span className="font-display text-[1.1rem] font-semibold uppercase tracking-[0.28em]">BAASA</span>
    </Link>
  )
}
