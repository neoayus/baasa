import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowUpRight, BadgeCheck } from "lucide-react";
import SearchBar from "../SearchBar/SearchBar";
import SmartImage from "../ui/SmartImage";
import { HERO_IMAGE } from "../../data/properties";
import { bootDelay } from "../../utils/boot";
import { money } from "../../utils/format";

gsap.registerPlugin(ScrollTrigger);

const CITY_CHIPS = ["ISBT", "Rispana", "Rajpur", "Kargi Chawk", "Clemen Town"];

export default function Hero({ featured }) {
  const root = useRef(null);

  useLayoutEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const ctx = gsap.context(() => {
      if (reduce) return;
      const tl = gsap.timeline({
        delay: bootDelay(),
        defaults: { ease: "power4.out" },
      });
      tl.fromTo(
        ".hero-mask",
        { clipPath: "inset(14% 10% 14% 10% round 2rem)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 0rem)",
          duration: 1.7,
          ease: "expo.inOut",
        },
        0,
      )
        .fromTo(".hero-img", { scale: 1.4 }, { scale: 1.05, duration: 2.4 }, 0)
        .fromTo(
          ".hero-line",
          { yPercent: 118 },
          { yPercent: 0, duration: 1.25, stagger: 0.12 },
          0.55,
        )
        .fromTo(
          ".hero-fade",
          { autoAlpha: 0, y: 26 },
          { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.09 },
          1.1,
        );

      const trigger = {
        trigger: root.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      };
      gsap.to(".hero-parallax", {
        scale: 1.22,
        yPercent: 14,
        ease: "none",
        scrollTrigger: trigger,
      });
      gsap.to(".hero-title", {
        yPercent: -16,
        ease: "none",
        scrollTrigger: trigger,
      });
      gsap.to(".hero-float", {
        yPercent: -40,
        ease: "none",
        scrollTrigger: trigger,
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative flex min-h-[100svh] flex-col overflow-hidden"
      aria-label="Introduction"
    >
      <div className="hero-mask absolute inset-0">
        <div className="hero-parallax absolute inset-0">
          <SmartImage
            src={HERO_IMAGE}
            alt="A modern glass house glowing at dusk"
            eager
            className="absolute inset-0"
            imgClassName="hero-img"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/20 to-ink" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/60 to-transparent" />
      </div>

      <div className="container-x relative z-10 flex flex-1 flex-col justify-end pb-10 pt-28 md:pb-14 lg:pt-36">
        <div className="hero-fade mb-6 flex items-center justify-between md:mb-10">
          <p className="meta text-bone/80">Dehradun - Your Next Address</p>
          {/* <p className="meta hidden items-center gap-2 text-bone/80 sm:flex">
            Scroll <ArrowDown className="h-3 w-3" aria-hidden="true" />
          </p> */}
        </div>

        <div className="grid items-end gap-10 lg:grid-cols-[1fr_auto]">
          <div>
            <h1
              className="hero-title h-mega"
              aria-label="Find somewhere worth calling home."
            >
              {["Find a", "Place to Call", "your Own."].map((l) => (
                <span
                  key={l}
                  className="block overflow-hidden pb-[0.07em]"
                  aria-hidden="true"
                >
                  <span className="hero-line block">
                    {l === "home." ? (
                      <>
                        home<span className="text-accent">.</span>
                      </>
                    ) : (
                      l
                    )}
                  </span>
                </span>
              ))}
            </h1>

            <div className="hero-fade mt-8 max-w-3xl md:mt-12">
              <SearchBar variant="hero" placeholder="Search by Locality." />
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="meta mr-1">Popular</span>
                {CITY_CHIPS.map((c) => (
                  <Link
                    key={c}
                    to={`/search?q=${encodeURIComponent(c)}`}
                    className="chip bg-ink/40 backdrop-blur-md"
                  >
                    {c}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* featured listing */}
          {/* {featured && (
            <Link
              to={`/property/${featured.id}`}
              className="hero-fade hero-float group hidden w-[19rem] shrink-0 rounded-3xl border border-line bg-ink/60 p-3 backdrop-blur-xl transition-colors hover:border-accent/60 lg:block"
            >
              <SmartImage
                src={featured.images[1]}
                alt={`Interior of ${featured.name}`}
                className="aspect-[4/3] rounded-2xl"
                imgClassName="transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="flex items-start justify-between gap-3 px-2 pb-1 pt-4">
                <div>
                  <p className="meta mb-1 flex items-center gap-1.5 text-accent">
                    <BadgeCheck className="h-3 w-3" aria-hidden="true" />{" "}
                    Featured home
                  </p>
                  <p className="font-display text-xl font-semibold leading-tight">
                    {featured.name}
                  </p>
                  <p className="mt-1 text-sm text-mute">
                    {featured.city}, {featured.state} · {money(featured.price)}
                    /mo
                  </p>
                </div>
                <ArrowUpRight
                  className="mt-1 h-5 w-5 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </div>
            </Link>
          )} */}
        </div>
      </div>
    </section>
  );
}
