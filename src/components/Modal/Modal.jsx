import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import useScrollLock from '../../hooks/useScrollLock'
import { cn } from '../../utils/cn'

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'

export default function Modal({ open, onClose, title, eyebrow, children, size = 'md', side = 'center' }) {
  const panel = useRef(null)
  useScrollLock(open)

  useEffect(() => {
    if (!open) return undefined
    const previous = document.activeElement
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab' && panel.current) {
        const items = [...panel.current.querySelectorAll(FOCUSABLE)]
        if (!items.length) return
        const first = items[0]
        const last = items[items.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    const t = setTimeout(() => {
      const target = panel.current?.querySelector('input,select,textarea') || panel.current?.querySelector('button')
      target?.focus()
    }, 420)
    return () => {
      clearTimeout(t)
      document.removeEventListener('keydown', onKey)
      previous?.focus?.()
    }
  }, [open, onClose])

  const widths = { sm: 'sm:max-w-md', md: 'sm:max-w-2xl', lg: 'sm:max-w-4xl' }
  const drawer = side === 'right'

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className={cn('fixed inset-0 z-[70] flex', drawer ? 'items-end justify-end sm:items-stretch' : 'items-end justify-center sm:items-center sm:p-6')}>
          <motion.button
            type="button"
            aria-label="Close dialog"
            tabIndex={-1}
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            data-lenis-prevent
            initial={drawer ? { x: '100%' } : { y: '100%', opacity: 0.6 }}
            animate={drawer ? { x: 0 } : { y: 0, opacity: 1 }}
            exit={drawer ? { x: '100%' } : { y: '100%', opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              'relative flex max-h-[94dvh] w-full flex-col overflow-y-auto border border-line bg-surface shadow-2xl',
              drawer ? 'rounded-t-[2rem] sm:max-h-none sm:max-w-md sm:rounded-none sm:border-y-0 sm:border-r-0' : cn('rounded-t-[2rem] sm:rounded-[2rem]', widths[size]),
            )}
          >
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-line bg-surface/95 px-6 py-5 backdrop-blur-md sm:px-8">
              <div>
                {eyebrow && <p className="meta mb-1.5">{eyebrow}</p>}
                <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line transition-colors hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="px-6 py-6 sm:px-8 sm:py-8">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
