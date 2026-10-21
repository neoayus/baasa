import { useId, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { cn } from '../../utils/cn'
import { pad } from '../../utils/format'

export default function FAQ({ items, className, defaultOpen = 0 }) {
  const [open, setOpen] = useState(defaultOpen)
  const uid = useId()
  return (
    <div className={cn('divide-y divide-line border-y border-line', className)}>
      {items.map((it, i) => {
        const isOpen = open === i
        return (
          <div key={it.q}>
            <h3>
              <button
                type="button"
                id={`${uid}-b${i}`}
                aria-expanded={isOpen}
                aria-controls={`${uid}-p${i}`}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="group flex w-full items-start gap-4 py-5 text-left md:gap-10 md:py-7"
              >
                <span className="meta w-6 shrink-0 pt-1.5 md:w-8 md:pt-3">{pad(i + 1)}</span>
                <span className="flex-1 font-display text-lg font-medium leading-snug tracking-tight transition-colors group-hover:text-accent md:text-2xl">{it.q}</span>
                <motion.span animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.3 }} className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line">
                  <Plus className="h-4 w-4" aria-hidden="true" />
                </motion.span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`${uid}-p${i}`}
                  role="region"
                  aria-labelledby={`${uid}-b${i}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-3xl pb-7 pl-10 pr-4 leading-relaxed text-mute md:pl-[4.5rem]">{it.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
