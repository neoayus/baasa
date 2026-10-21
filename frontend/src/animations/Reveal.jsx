import { motion } from 'framer-motion'
import { EASE } from './variants'

/** Fade + rise when scrolled into view. */
export function Reveal({ children, delay = 0, y = 32, className, as = 'div', once = true }) {
  const Tag = motion[as] || motion.div
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-8% 0px' }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </Tag>
  )
}

/** Word-by-word masked text reveal. `text` is a plain string; use "\n" for line breaks. */
export function RevealText({ text, className, id, as = 'h2', delay = 0, stagger = 0.045 }) {
  const Tag = motion[as] || motion.h2
  const lines = text.split('\n')
  let n = 0
  return (
    <Tag
      id={id}
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-10% 0px' }}
      aria-label={text.replace(/\n/g, ' ')}
    >
      {lines.map((line, li) => (
        <span key={li} className="block" aria-hidden="true">
          {line.split(' ').map((w, wi) => (
            <span key={wi} className="inline-block overflow-hidden pb-[0.1em] align-bottom">
              <motion.span
                className="inline-block"
                variants={{ hidden: { y: '110%' }, show: { y: 0 } }}
                transition={{ duration: 0.9, ease: EASE, delay: delay + stagger * n++ }}
              >
                {w}&nbsp;
              </motion.span>
            </span>
          ))}
        </span>
      ))}
    </Tag>
  )
}

/** Image/block unveiled through a clip-path mask. */
export function MaskReveal({ children, className, direction = 'up', delay = 0 }) {
  const from = {
    up: 'inset(100% 0% 0% 0%)',
    down: 'inset(0% 0% 100% 0%)',
    left: 'inset(0% 100% 0% 0%)',
    right: 'inset(0% 0% 0% 100%)',
  }[direction]
  return (
    <motion.div
      className={className}
      initial={{ clipPath: from }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay }}
    >
      {children}
    </motion.div>
  )
}
