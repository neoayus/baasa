import { useEffect, useMemo, useState } from 'react'
import Modal from '../Modal/Modal'
import { Chip, Field, Switch } from '../ui/Field'
import { properties as seed } from '../../data/properties'
import { applyQuery, defaultFilters, PRICE_MAX, PROPERTY_TYPES } from '../../utils/propertyQuery'
import { money } from '../../utils/format'

const COUNTS = [0, 1, 2, 3, 4]

export default function FilterDrawer({ open, onClose, filters, onApply, cities, query, source = seed }) {
  const [draft, setDraft] = useState(filters)

  useEffect(() => {
    if (open) setDraft(filters)
  }, [open, filters])

  const set = (patch) => setDraft((d) => ({ ...d, ...patch }))
  const matches = useMemo(() => applyQuery(source, { query, filters: draft }).length, [source, query, draft])
  const toggleType = (t) => set({ types: draft.types.includes(t) ? draft.types.filter((x) => x !== t) : [...draft.types, t] })

  return (
    <Modal open={open} onClose={onClose} side="right" eyebrow="Smart filter" title="Refine your search">
      <div className="space-y-9">
        <fieldset>
          <legend className="meta mb-4">Monthly price</legend>
          <p className="mb-4 font-display text-2xl font-semibold">{money(draft.priceMin)} – {money(draft.priceMax)}{draft.priceMax >= PRICE_MAX && '+'}</p>
          <div className="space-y-3">
            <label className="flex items-center gap-4 text-xs text-mute">
              <span className="w-8">Min</span>
              <input type="range" min="0" max={PRICE_MAX} step="100" value={draft.priceMin} aria-label="Minimum price" className="h-1 w-full"
                onChange={(e) => set({ priceMin: Math.min(Number(e.target.value), draft.priceMax - 100) })} />
            </label>
            <label className="flex items-center gap-4 text-xs text-mute">
              <span className="w-8">Max</span>
              <input type="range" min="0" max={PRICE_MAX} step="100" value={draft.priceMax} aria-label="Maximum price" className="h-1 w-full"
                onChange={(e) => set({ priceMax: Math.max(Number(e.target.value), draft.priceMin + 100) })} />
            </label>
          </div>
        </fieldset>

        <Field as="select" label="Location" value={draft.location} onChange={(e) => set({ location: e.target.value })}>
          <option value="">Any city</option>
          {cities.map((c) => <option key={c.city} value={c.city}>{c.city} ({c.count})</option>)}
        </Field>

        <fieldset>
          <legend className="meta mb-3">Property type</legend>
          <div className="flex flex-wrap gap-2">
            {PROPERTY_TYPES.map((t) => <Chip key={t} active={draft.types.includes(t)} onClick={() => toggleType(t)}>{t}</Chip>)}
          </div>
        </fieldset>

        <fieldset>
          <legend className="meta mb-3">Bedrooms (minimum)</legend>
          <div className="flex flex-wrap gap-2">
            {COUNTS.map((n) => <Chip key={n} active={draft.bedrooms === n} onClick={() => set({ bedrooms: n })}>{n === 0 ? 'Any' : `${n}+`}</Chip>)}
          </div>
        </fieldset>

        <fieldset>
          <legend className="meta mb-3">Bathrooms (minimum)</legend>
          <div className="flex flex-wrap gap-2">
            {[0, 1, 2, 3].map((n) => <Chip key={n} active={draft.bathrooms === n} onClick={() => set({ bathrooms: n })}>{n === 0 ? 'Any' : `${n}+`}</Chip>)}
          </div>
        </fieldset>

        <Field type="date" label="Available by" value={draft.availableBy} onChange={(e) => set({ availableBy: e.target.value })} hint="Show homes you can move into on or before this date." />

        <div className="divide-y divide-line border-y border-line">
          <Switch checked={draft.furnished} onChange={(v) => set({ furnished: v })} label="Furnished" />
          <Switch checked={draft.instantBooking} onChange={(v) => set({ instantBooking: v })} label="Instant booking" description="Confirm without waiting for the owner" />
          <Switch checked={draft.tourAvailable} onChange={(v) => set({ tourAvailable: v })} label="Tour available" />
          <Switch checked={draft.verified} onChange={(v) => set({ verified: v })} label="Verified only" />
        </div>
      </div>

      <div className="sticky bottom-0 -mx-6 mt-8 flex gap-3 border-t border-line bg-surface/95 px-6 py-4 backdrop-blur-md sm:-mx-8 sm:px-8">
        <button type="button" className="btn-ghost" onClick={() => setDraft(defaultFilters)}>Reset</button>
        <button type="button" className="btn-accent flex-1" onClick={() => { onApply(draft); onClose() }}>
          Show {matches} {matches === 1 ? 'place' : 'places'}
        </button>
      </div>
    </Modal>
  )
}
