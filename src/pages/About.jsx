import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import SmartImage from "../components/ui/SmartImage";
import { MaskReveal, Reveal, RevealText } from "../animations/Reveal";
import useDocTitle from "../hooks/useDocTitle";

const PRINCIPLES = [
  [
    "Real owners",
    "Every listing is posted by the person who controls the property. No agents, no duplicates, no bait.",
  ],
  [
    "Honest photography",
    "We ask owners for unedited photos and a floor plan. What you see is what you get.",
  ],
  [
    "Trust, both ways",
    "Renters and owners are verified, so everyone knows who is on the other side of the door.",
  ],
];
const STATS = [
  ["20", "curated homes"],
  ["10", "cities"],
  ["4.7", "average rating"],
  ["< 1h", "median owner reply"],
];

export default function About() {
  useDocTitle(
    "About",
    "Alcove is a curated marketplace for verified homes and the people who rent them.",
  );
  return (
    <div className="pb-12 pt-28 lg:pt-40">
      <div className="container-x">
        <p className="meta mb-5">About — Manifesto</p>
        <RevealText
          as="h1"
          text={
            "Finding a room \nshould feel like \nfinding a place \nto belong : ) "
          }
          className="h-mega !text-[clamp(2.6rem,8.6vw,9rem)]"
        />
        <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_1fr]">
          <MaskReveal>
            <SmartImage
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=75"
              alt="A sunlit modern living room"
              className="aspect-[4/3] rounded-[2rem]"
            />
          </MaskReveal>
          <div className="flex flex-col justify-end gap-6 text-lg leading-relaxed text-mute">
            <Reveal>
              <p>
                Finding a room in Dehradun shouldn't mean spending days
                wandering through unfamiliar lanes, knocking on doors, making
                endless calls, or relying entirely on word of mouth.
              </p>
            </Reveal>
            <Reveal>
              <p>That's where BAASA comes in.</p>
            </Reveal>
            <Reveal delay={0.1}>
              <p>
                We're building a simpler way to discover rooms and accommodation
                across Dehradun, bringing property owners and people looking for
                a place to stay closer together. Whether you're a student moving
                to the city, a working professional starting a new chapter, or
                someone simply looking for a place to call home, BAASA helps
                make the search easier, more accessible, and less
                time-consuming.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p>
                Our idea is simple: bring the offline way of finding rooms into
                one convenient online space. Discover available places, explore
                your options, save the ones you like, and connect with property
                owners — without having to search every street yourself.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <p>
                Because finding a home shouldn't depend on who you know or which
                lane you happen to walk into.
              </p>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Numbers */}
{/*       <section className="container-x mt-24 md:mt-36" aria-label="Numbers">
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[2rem] border border-line bg-line lg:grid-cols-4">
          {STATS.map(([n, l]) => (
            <Reveal key={l} className="bg-ink p-7 md:p-10">
              <dt className="meta">{l}</dt>
              <dd className="mt-4 font-display text-6xl font-semibold tracking-tighter md:text-7xl">
                {n}
              </dd>
            </Reveal>
          ))}
        </dl>
      </section> */}

      <section
        className="container-x mt-24 md:mt-36"
        aria-labelledby="principles"
      >
        <h2 id="principles" className="h-xl mb-12">
          What we believe
        </h2>
        <ul className="border-t border-line">
          {PRINCIPLES.map(([t, d], i) => (
            <Reveal
              as="li"
              key={t}
              delay={i * 0.05}
              className="grid gap-4 border-b border-line py-8 md:grid-cols-[8rem_1fr_1.2fr] md:py-12"
            >
              <span className="meta pt-2">0{i + 1}</span>
              <h3 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
                {t}
              </h3>
              <p className="text-mute">{d}</p>
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="container-x mt-24 text-center md:mt-36">
        <h2 className="h-xl">Come and look around.</h2>
        <Link to="/explore" className="btn-accent group mt-10 !px-8 !py-4">
          Explore places{" "}
          <ArrowUpRight
            className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </section>
    </div>
  );
}
