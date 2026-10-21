import { useId } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

export function Field({ label, error, hint, as: Tag = 'input', className, children, id, ...rest }) {
  const auto = useId()
  const fid = id || auto
  return (
    <div className={className}>
      <label htmlFor={fid} className="meta mb-2 block">
        {label}
        {rest.required && <span className="text-accent"> *</span>}
      </label>
      <motion.div key={error || 'ok'} animate={error ? { x: [0, -7, 7, -5, 5, 0] } : { x: 0 }} transition={{ duration: 0.4 }}>
        <Tag
          id={fid}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${fid}-err` : hint ? `${fid}-hint` : undefined}
          className={cn(
            'w-full rounded-2xl border bg-ink2 px-4 py-3.5 text-[0.95rem] text-bone transition-colors placeholder:text-mute/60 focus:border-accent focus:outline-none',
            error ? 'border-red-400/70' : 'border-line hover:border-white/25',
            Tag === 'textarea' && 'min-h-[7rem] resize-y',
          )}
          {...rest}
        >
          {children}
        </Tag>
      </motion.div>
      {error && (
        <p id={`${fid}-err`} role="alert" className="mt-1.5 text-xs text-red-300">
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={`${fid}-hint`} className="mt-1.5 text-xs text-mute">
          {hint}
        </p>
      )}
    </div>
  )
}

export function Chip({ active, onClick, children, className }) {
  return (
    <button type="button" aria-pressed={!!active} onClick={onClick} className={cn('chip', className)}>
      {children}
    </button>
  )
}

export function Switch({ checked, onChange, label, description }) {
  const id = useId()
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <label htmlFor={id} className="text-sm text-bone">
          {label}
        </label>
        {description && <p className="text-xs text-mute">{description}</p>}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={!!checked}
        onClick={() => onChange(!checked)}
        className={cn('relative h-7 w-12 shrink-0 rounded-full border transition-colors', checked ? 'border-accent bg-accent' : 'border-line bg-surface2')}
      >
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 32 }}
          className={cn('absolute top-0.5 h-5 w-5 rounded-full', checked ? 'right-0.5 bg-ink' : 'left-0.5 bg-bone')}
        />
      </button>
    </div>
  )
}
