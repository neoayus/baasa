import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu } from 'lucide-react'
import Logo from '../ui/Logo'
import SearchBar from '../SearchBar/SearchBar'
import { useApp } from '../../context/AppContext'
import { cn } from '../../utils/cn'
import { initials } from '../../utils/format'

export default function Navbar() {
  const { user, menuOpen, setMenuOpen } = useApp()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 border-b pt-[env(safe-area-inset-top)] transition-[background-color,border-color,backdrop-filter] duration-500',
        scrolled ? 'border-line bg-ink/80 backdrop-blur-xl' : 'border-transparent',
      )}
    >
      <nav aria-label="Primary" className="container-x grid h-16 grid-cols-[auto_1fr_auto] items-center gap-4 lg:h-20 lg:gap-8">
        <Logo />
        <div className="hidden justify-center md:flex">
          <SearchBar variant="nav" />
        </div>
        <div className="col-start-3 flex items-center gap-2 md:gap-3">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            className="hidden items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm transition-colors hover:bg-white/5 md:inline-flex"
          >
            Menu <Menu className="h-4 w-4" aria-hidden="true" />
          </button>
          {user ? (
            <Link to="/profile" aria-label="Your profile" className="hidden h-11 w-11 place-items-center rounded-full bg-accent font-mono text-xs font-medium text-ink transition-colors hover:bg-bone md:grid">
              {initials(user.name)}
            </Link>
          ) : (
            <Link to="/login" className="btn-accent hidden !py-2.5 md:inline-flex">Login</Link>
          )}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            className="grid h-11 w-11 place-items-center rounded-full border border-line transition-colors hover:bg-white/5 md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>
    </header>
  )
}
