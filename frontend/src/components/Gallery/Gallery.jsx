import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react'
import SmartImage from '../ui/SmartImage'
import { MaskReveal } from '../../animations/Reveal'
import useScrollLock from '../../hooks/useScrollLock'
import { cn } from '../../utils/cn'
import { imgW, pad } from '../../utils/format'

function Lightbox({ images, name, index, onIndex, onClose }) {
  const open = index !== null
  useScrollLock(open)
  const count = images.length
  const go = useCallback((d) => onIndex((i) => (i + d + count) % count), [count, onIndex])
  const closeRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    document.addEventListener('keydown', onKey)
    closeRef.current?.focus()
    return () => document.removeEventListener('keydown', onKey)
  }, [open, go, onClose])

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`${name} photo gallery`}
          className="fixed inset-0 z-[85] flex flex-col bg-ink/95 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between px-5 py-4 sm:px-8">
            <p className="meta !text-bone">{pad(index + 1)} / {pad(count)}</p>
            <button ref={closeRef} type="button" onClick={onClose} aria-label="Close gallery" className="grid h-11 w-11 place-items-center rounded-full border border-line hover:bg-white/10">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-20">
            <AnimatePresence mode="wait">
              <motion.img
                key={index}
                src={imgW(images[index], 1800)}
                alt={`${name} — photo ${index + 1} of ${count}`}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -80) go(1)
                  if (info.offset.x > 80) go(-1)
                }}
                className="max-h-full max-w-full rounded-2xl object-contain"
              />
            </AnimatePresence>
            {[-1, 1].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => go(d)}
                aria-label={d < 0 ? 'Previous photo' : 'Next photo'}
                className={cn('absolute top-1/2 hidden h-14 w-14 -translate-y-1/2 place-items-center rounded-full border border-line bg-ink/60 transition-colors hover:bg-bone hover:text-ink sm:grid', d < 0 ? 'left-5' : 'right-5')}
              >
                {d < 0 ? <ChevronLeft /> : <ChevronRight />}
              </button>
            ))}
          </div>

          <div className="no-scrollbar flex justify-start gap-2 overflow-x-auto px-5 py-4 sm:justify-center">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => onIndex(i)}
                aria-label={`Show photo ${i + 1}`}
                aria-current={i === index}
                className={cn('h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition-all', i === index ? 'border-accent' : 'border-transparent opacity-50 hover:opacity-100')}
              >
                <SmartImage src={imgW(src, 300)} alt="" className="h-full w-full" />
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

export default function Gallery({ images, name }) {
  const [index, setIndex] = useState(null)
  const [slide, setSlide] = useState(0)
  const open = (i) => setIndex(i)
  const close = useCallback(() => setIndex(null), [])
  const extra = Math.max(0, images.length - 3)

  return (
    <>
      {/* Desktop: editorial mosaic */}
      <div className="hidden h-[70vh] min-h-[28rem] grid-cols-4 grid-rows-2 gap-3 md:grid">
        {images.slice(0, 3).map((src, i) => (
          <MaskReveal key={src} direction={i === 0 ? 'left' : 'up'} delay={i * 0.12} className={cn('relative min-h-0', i === 0 ? 'col-span-2 row-span-2' : i === 1 ? 'col-span-2' : 'col-span-1')}>
            <button type="button" onClick={() => open(i)} aria-label={`Open photo ${i + 1} of ${name}`} className="group relative block h-full w-full overflow-hidden rounded-3xl">
              <SmartImage src={imgW(src, i === 0 ? 1600 : 1000)} alt={`${name} — photo ${i + 1}`} eager={i === 0} className="h-full w-full" imgClassName="transition-transform duration-[1400ms] group-hover:scale-105" />
              {i === 0 && (
                <span className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full bg-ink/70 px-4 py-2 text-xs backdrop-blur-md">
                  <Expand className="h-3.5 w-3.5" aria-hidden="true" /> Fullscreen
                </span>
              )}
            </button>
          </MaskReveal>
        ))}
        <MaskReveal direction="up" delay={0.4} className="relative col-span-1 min-h-0">
          <button type="button" onClick={() => open(3 % images.length)} aria-label={`View all ${images.length} photos`} className="group relative block h-full w-full overflow-hidden rounded-3xl">
            <SmartImage src={imgW(images[3] || images[0], 800)} alt={`${name} — more photos`} className="h-full w-full" imgClassName="transition-transform duration-[1400ms] group-hover:scale-105" />
            <span className="absolute inset-0 grid place-items-center bg-ink/55 transition-colors group-hover:bg-ink/35">
              <span className="text-center">
                <span className="block font-display text-4xl font-semibold">{extra > 0 ? `+${extra}` : "All"}</span>
                <span className="meta !text-bone">View all photos</span>
              </span>
            </span>
          </button>
        </MaskReveal>
      </div>

      {/* Mobile: swipeable strip */}
      <div className="md:hidden">
        <div
          className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5"
          onScroll={(e) => {
            const el = e.currentTarget
            const child = el.firstElementChild
            if (child) setSlide(Math.round(el.scrollLeft / (child.clientWidth + 12)))
          }}
          aria-label="Photo carousel"
        >
          {images.map((src, i) => (
            <button key={src} type="button" onClick={() => open(i)} aria-label={`Open photo ${i + 1} fullscreen`} className="w-[86vw] shrink-0 snap-center overflow-hidden rounded-3xl">
              <SmartImage src={imgW(src, 900)} alt={`${name} — photo ${i + 1}`} eager={i === 0} className="aspect-[4/5] w-full" />
            </button>
          ))}
        </div>
        <p className="meta mt-3 text-center" aria-hidden="true">{pad(Math.min(slide, images.length - 1) + 1)} / {pad(images.length)} — swipe</p>
      </div>

      <Lightbox images={images} name={name} index={index} onIndex={setIndex} onClose={close} />
    </>
  )
}
