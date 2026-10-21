import { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDownUp, Check, ChevronDown } from 'lucide-react'
import { SORT_OPTIONS } from '../../utils/propertyQuery'
import { cn } from '../../utils/cn'

export default function SortMenu({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const wrap = useRef(null)
  const listId = useId()
  const current = SORT_OPTIONS.find((o) => o.id === value) || SORT_OPTIONS[0]

  useEffect(() => {
    if (!open) return undefined
    const onDown = (e) => wrap.current && !wrap.current.contains(e.target) && setOpen(false)
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [open])

  const choose = (id) => {
    onChange(id)
    setOpen(false)
  }

  const onKeyDown = (e) => {
    if (e.key === 'Escape') setOpen(false)
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (!open) setOpen(true)
      setActive((a) => (a + 1) % SORT_OPTIONS.length)
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => (a - 1 + SORT_OPTIONS.length) % SORT_OPTIONS.length)
    }
    if ((e.key === 'Enter' || e.key === ' ') && open) {
      e.preventDefault()
      choose(SORT_OPTIONS[active].id)
    }
  }

  return (
    <div ref={wrap} className="relative" onKeyDown={onKeyDown}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => {
          setActive(SORT_OPTIONS.findIndex((o) => o.id === current.id))
          setOpen((o) => !o)
        }}
        className="inline-flex h-12 items-center gap-2.5 rounded-full border border-line px-5 text-sm transition-colors hover:bg-white/5"
      >
        <ArrowDownUp className="h-4 w-4 text-accent" aria-hidden="true" />
        <span className="meta !text-bone">Sort</span>
        <span className="hidden text-mute sm:inline">{current.label}</span>
        <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} aria-hidden="true" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            id={listId}
            role="listbox"
            aria-label="Sort properties"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 top-[calc(100%+0.5rem)] z-30 w-64 overflow-hidden rounded-3xl border border-line bg-surface2 p-2 shadow-2xl"
          >
            {SORT_OPTIONS.map((o, i) => (
              <li key={o.id} role="option" aria-selected={o.id === value}>
                <button
                  type="button"
                  onClick={() => choose(o.id)}
                  onMouseEnter={() => setActive(i)}
                  className={cn('flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm transition-colors', active === i && 'bg-white/5', o.id === value && 'text-accent')}
                >
                  {o.label}
                  {o.id === value && <Check className="h-4 w-4" aria-hidden="true" />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
