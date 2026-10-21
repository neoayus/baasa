import { lazy, Suspense, useEffect, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from './components/Navbar/Navbar'
import MenuOverlay from './components/Navbar/MenuOverlay'
import Footer from './components/Footer/Footer'
import Toasts from './components/ui/Toasts'
import Loader from './components/Layout/Loader'
import RequireAuth from './components/Layout/RequireAuth'
import InquiryModal from './components/Modal/InquiryModal'
import ExpertModal from './components/Modal/ExpertModal'
import { PageFallback } from './components/ui/States'
import { useApp } from './context/AppContext'
import { destroyLenis, initLenis, scrollToTop } from './animations/lenis'
import { pageVariants } from './animations/variants'
import { isBooted } from './utils/boot'

const Home = lazy(() => import('./pages/Home'))
const Explore = lazy(() => import('./pages/Explore'))
const Search = lazy(() => import('./pages/Search'))
const PropertyDetails = lazy(() => import('./pages/PropertyDetails'))
const Booking = lazy(() => import('./pages/Booking'))
const Verification = lazy(() => import('./pages/Verification'))
const ListProperty = lazy(() => import('./pages/ListProperty'))
const Profile = lazy(() => import('./pages/Profile'))
const Saved = lazy(() => import('./pages/Saved'))
const Bookings = lazy(() => import('./pages/Bookings'))
const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))
const About = lazy(() => import('./pages/About'))
const Support = lazy(() => import('./pages/Support'))
const NotFound = lazy(() => import('./pages/NotFound'))

export default function App() {
  const location = useLocation()
  const { setMenuOpen } = useApp()
  const [loading, setLoading] = useState(() => !isBooted())

  useEffect(() => {
    initLenis()
    return destroyLenis
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname, setMenuOpen])

  return (
    <>
      <a href="#main" className="sr-only z-[200] rounded-full bg-accent px-4 py-2 text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      {loading && <Loader onDone={() => setLoading(false)} />}
      <Navbar />
      <MenuOverlay />
      <AnimatePresence
        mode="wait"
        initial={false}
        onExitComplete={() => {
          if (!window.location.hash) scrollToTop()
          ScrollTrigger.refresh()
        }}
      >
        <motion.main
          id="main"
          key={location.pathname}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          onAnimationComplete={() => ScrollTrigger.refresh()}
          className="min-h-[100dvh]"
        >
          <Suspense fallback={<PageFallback />}>
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/search" element={<Search />} />
              <Route path="/property/:id" element={<PropertyDetails />} />
              <Route path="/book/:id" element={<RequireAuth><Booking /></RequireAuth>} />
              {/* No use of verification yet :3 */}
              {/* <Route path="/verification" element={<RequireAuth><Verification /></RequireAuth>} /> */}
              <Route path="/list-property" element={<RequireAuth><ListProperty /></RequireAuth>} />
              <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
              <Route path="/saved" element={<Saved />} />
              <Route path="/bookings" element={<RequireAuth><Bookings /></RequireAuth>} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/about" element={<About />} />
              <Route path="/support" element={<Support />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <Footer />
        </motion.main>
      </AnimatePresence>
      <InquiryModal />
      <ExpertModal />
      <Toasts />
    </>
  )
}
