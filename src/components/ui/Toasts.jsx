import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { cn } from '../../utils/cn'

const ICONS = { success: CheckCircle2, error: AlertTriangle, info: Info }

export default function Toasts() {
  const { toasts, dismissToast } = useApp()
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] z-[90] flex flex-col items-center gap-2 px-4"
      role="status"
      aria-live="polite"
    >
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = ICONS[t.type] || CheckCircle2
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 30, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              className="pointer-events-auto flex max-w-md items-center gap-3 rounded-full border border-line bg-surface2/95 py-2.5 pl-4 pr-2.5 text-sm shadow-2xl backdrop-blur-xl"
            >
              <Icon className={cn('h-4 w-4 shrink-0', t.type === 'error' ? 'text-red-400' : t.type === 'info' ? 'text-mute' : 'text-accent')} aria-hidden="true" />
              <span>{t.message}</span>
              <button
                type="button"
                onClick={() => dismissToast(t.id)}
                aria-label="Dismiss notification"
                className="grid h-7 w-7 place-items-center rounded-full text-mute hover:bg-white/10 hover:text-bone"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
