import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '../../utils/cn'
import { pad } from '../../utils/format'

export default function Stepper({ steps, current, onJump }) {
  return (
    <nav aria-label="Progress">
      <div className="relative mb-4 h-px bg-line">
        <motion.div className="absolute inset-y-0 left-0 bg-accent" animate={{ width: `${(current / (steps.length - 1)) * 100}%` }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} />
      </div>
      <ol className="no-scrollbar flex justify-between gap-4 overflow-x-auto">
        {steps.map((s, i) => {
          const done = i < current
          const Tag = onJump && done ? 'button' : 'div'
          return (
            <li key={s} className="shrink-0" aria-current={i === current ? 'step' : undefined}>
              <Tag {...(Tag === 'button' ? { type: 'button', onClick: () => onJump(i) } : {})} className={cn('flex flex-col items-start text-left', i > current && 'opacity-40')}>
                <span className={cn('font-mono text-xs', i === current ? 'text-accent' : 'text-mute')}>
                  {done ? <Check className="inline h-3.5 w-3.5" aria-label="completed" /> : pad(i + 1)}
                </span>
                <span className={cn('meta mt-1', i === current && '!text-bone')}>{s}</span>
              </Tag>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
