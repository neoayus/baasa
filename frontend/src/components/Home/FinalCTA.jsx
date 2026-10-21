import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { RevealText, Reveal } from '../../animations/Reveal'

export default function FinalCTA() {
  return (
    <section className="container-x py-12 md:py-20" aria-labelledby="cta-title">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-accent px-6 py-16 text-ink md:px-16 md:py-28">
        <p className="meta mb-6 !text-ink/60">Ready when you are</p>
        <RevealText as="h2" id="cta-title" text={'Your next chapter\nstarts with a key.'} className="h-mega !text-[clamp(2.6rem,8.4vw,8.5rem)]" />
        <Reveal delay={0.2} className="mt-10 flex flex-wrap gap-3">
          <Link to="/explore" className="inline-flex items-center gap-2 rounded-full bg-ink px-8 py-4 text-sm font-medium text-bone transition-colors hover:bg-bone hover:text-ink">
            Explore places <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link to="/list-property" className="inline-flex items-center gap-2 rounded-full border border-ink/30 px-8 py-4 text-sm font-medium transition-colors hover:bg-ink/10">
            List your property
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
