import { AnimatePresence, motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { cn } from '../../utils/cn'

export default function FavoriteButton({ active, onToggle, label, className }) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.82 }}
      onClick={onToggle}
      aria-pressed={active}
      aria-label={active ? `Remove ${label} from saved` : `Save ${label}`}
      className={cn(
        'relative grid h-11 w-11 place-items-center rounded-full bg-ink/60 text-bone ring-1 ring-white/20 backdrop-blur-md transition-colors hover:bg-ink/80',
        className,
      )}
    >
      <motion.span key={active ? 'on' : 'off'} initial={{ scale: 0.5 }} animate={{ scale: active ? [0.5, 1.35, 1] : 1 }} transition={{ duration: 0.45 }}>
        <Heart className={cn('h-5 w-5 transition-colors', active && 'fill-accent text-accent')} aria-hidden="true" />
      </motion.span>
      <AnimatePresence>
        {active && (
          <motion.span
            initial={{ scale: 0.7, opacity: 0.9 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="pointer-events-none absolute inset-0 rounded-full border border-accent"
          />
        )}
      </AnimatePresence>
    </motion.button>
  )
}
