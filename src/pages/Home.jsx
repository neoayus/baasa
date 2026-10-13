import { useEffect, useState } from 'react'
import Hero from '../components/Hero/Hero'
import Marquee from '../components/ui/Marquee'
import HorizontalFeatured from '../components/Home/HorizontalFeatured'
import Discover from '../components/Home/Discover'
import Showcase from '../components/Home/Showcase'
import Nearby from '../components/Home/Nearby'
import HousingExpert from '../components/Home/HousingExpert'
import HowItWorks from '../components/Home/HowItWorks'
import FinalCTA from '../components/Home/FinalCTA'
import FAQ from '../components/FAQ/FAQ'
import { ErrorState } from '../components/ui/States'
import { RevealText } from '../animations/Reveal'
import { faqs } from '../data/faqs'
import { getProperties } from '../services/propertyService'
import useDocTitle from '../hooks/useDocTitle'

const MARQUEE = ['Austin', 'Los Angeles', 'San Francisco', 'Brooklyn', 'Seattle', 'Chicago', 'Miami', 'Denver', 'Portland', 'Nashville']

export default function Home() {
  useDocTitle(null, 'Alcove is a curated marketplace for verified homes, lofts and rooms. Search, tour, inquire and book with owners you can trust.')
  const [properties, setProperties] = useState([])
  const [error, setError] = useState(null)
  const [nonce, setNonce] = useState(0)

  useEffect(() => {
    let live = true
    setError(null)
    getProperties()
      .then((r) => live && setProperties(r))
      .catch((e) => live && setError(e.message))
    return () => {
      live = false
    }
  }, [nonce])

  const ranked = [...properties].sort((a, b) => b.rating - a.rating || b.reviews - a.reviews)
  const featured = ranked.filter((p) => p.verified).slice(0, 8)
  const spotlight = ranked.find((p) => p.id === 'alc-017') || ranked[0]

  return (
    <>
      <Hero featured={properties[0]} />
      {/* <Marquee items={MARQUEE} /> */}
      {error ? (
        <div className="container-x py-24"><ErrorState text={error} onRetry={() => setNonce((n) => n + 1)} /></div>
      ) : (
        <>
          <HorizontalFeatured properties={featured} />
          <Discover properties={properties} />
          <Showcase property={spotlight} />
          <Nearby properties={properties} />
        </>
      )}
      <HousingExpert />
      <HowItWorks />
      <section className="container-x py-12 md:py-24" aria-labelledby="faq-title">
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
          <div>
            <p className="meta mb-4">FAQ — Good to know</p>
            <RevealText as="h2" id="faq-title" text={'Questions,\nanswered.'} className="h-xl" />
          </div>
          <FAQ items={faqs} />
        </div>
      </section>
      <FinalCTA />
    </>
  )
}
