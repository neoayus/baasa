import { cn } from '../../utils/cn'

export default function Badge({ icon: Icon, children, tone = 'dark', className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-[0.12em] backdrop-blur-md',
        tone === 'accent' ? 'bg-accent text-ink' : 'bg-ink/65 text-bone ring-1 ring-white/15',
        className,
      )}
    >
      {Icon && <Icon className="h-3 w-3" aria-hidden="true" />}
      {children}
    </span>
  )
}
