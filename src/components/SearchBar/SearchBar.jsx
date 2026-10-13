import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Search } from 'lucide-react'
import useDebounce from '../../hooks/useDebounce'
import { searchProperties } from '../../services/propertyService'
import { cn } from '../../utils/cn'
import { money } from '../../utils/format'

/** Capsule search. variant: nav | hero | menu */
export default function SearchBar({ variant = 'nav', defaultValue = '', onSubmitted, placeholder = 'Search rooms, cities…' }) {
  const navigate = useNavigate()
  const [q, setQ] = useState(defaultValue)
  const [focus, setFocus] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const debounced = useDebounce(q, 160)
  const wrap = useRef(null)

  useEffect(() => {
    let live = true
    if (!debounced.trim()) {
      setSuggestions([])
      return undefined
    }
    searchProperties(debounced)
      .then((r) => live && setSuggestions(r.slice(0, 5)))
      .catch(() => live && setSuggestions([]))
    return () => {
      live = false
    }
  }, [debounced])

  useEffect(() => {
    const onDown = (e) => wrap.current && !wrap.current.contains(e.target) && setFocus(false)
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [])

  const submit = (e) => {
    e.preventDefault()
    const v = q.trim()
    setFocus(false)
    navigate(v ? `/search?q=${encodeURIComponent(v)}` : '/explore')
    onSubmitted?.()
  }

  const big = variant === 'hero'
  return (
    <div ref={wrap} className={cn('relative w-full', variant === 'nav' ? 'max-w-[34rem]' : big ? 'max-w-3xl' : 'max-w-xl')}>
      <motion.form
        role="search"
        aria-label="Search accommodation"
        onSubmit={submit}
        animate={{
          boxShadow: focus ? '0 0 0 1.5px #F4B03E, 0 12px 50px -12px rgba(244,176,62,0.4)' : '0 0 0 1px rgba(255,255,255,0.14)',
        }}
        transition={{ duration: 0.3 }}
        className={cn('flex items-center gap-3 rounded-full bg-ink2/80 pl-1.5 pr-5 backdrop-blur-xl', big ? 'h-16 md:h-[4.5rem]' : 'h-12')}
      >
        <motion.button
          type="submit"
          aria-label="Search"
          whileTap={{ scale: 0.9 }}
          animate={{ rotate: focus ? 90 : 0 }}
          className={cn('grid shrink-0 place-items-center rounded-full bg-accent text-ink transition-colors hover:bg-bone', big ? 'h-12 w-12 md:h-14 md:w-14' : 'h-9 w-9')}
        >
          <Search className={big ? 'h-5 w-5' : 'h-4 w-4'} />
        </motion.button>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setFocus(true)}
          placeholder={placeholder}
          aria-label="Search by city, neighbourhood, ZIP or property name"
          autoComplete="off"
          className={cn('min-w-0 flex-1 bg-transparent text-bone placeholder:text-mute focus:outline-none [&::-webkit-search-cancel-button]:hidden', big ? 'text-base md:text-lg' : 'text-sm')}
        />
      </motion.form>

      {focus && suggestions.length > 0 && (
        <motion.ul
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-50 overflow-hidden rounded-3xl border border-line bg-surface/95 p-2 shadow-2xl backdrop-blur-xl"
          aria-label="Suggestions"
        >
          {suggestions.map((p) => (
            <li key={p.id}>
              <Link
                to={`/property/${p.id}`}
                onClick={() => {
                  setFocus(false)
                  onSubmitted?.()
                }}
                className="flex items-center justify-between gap-4 rounded-2xl px-4 py-3 transition-colors hover:bg-white/5"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <MapPin className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                  <span className="truncate text-sm">{p.name}</span>
                  <span className="hidden truncate text-xs text-mute sm:inline">{p.city}, {p.state} {p.zip}</span>
                </span>
                <span className="shrink-0 font-mono text-xs text-mute">{money(p.price)}</span>
              </Link>
            </li>
          ))}
        </motion.ul>
      )}
    </div>
  )
}
