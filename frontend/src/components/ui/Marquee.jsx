export default function Marquee({ items, className = '' }) {
  const row = [...items, ...items]
  return (
    <div className={`overflow-hidden border-y border-line ${className}`} aria-hidden="true">
      <div className="flex w-max animate-marquee whitespace-nowrap py-5 hover:[animation-play-state:paused]">
        {row.map((t, i) => (
          <span key={i} className="flex items-center font-display text-2xl font-medium uppercase tracking-tight text-bone/80 md:text-4xl">
            {t}
            <span className="mx-8 inline-block h-2 w-2 rounded-full bg-accent md:mx-12" />
          </span>
        ))}
      </div>
    </div>
  )
}
