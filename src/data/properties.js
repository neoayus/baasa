const U = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=75`

const EXT = [
  'photo-1564013799919-ab600027ffc6', 'photo-1512917774080-9991f1c4c750', 'photo-1600596542815-ffad4c1539a9',
  'photo-1600585154340-be6161a56a0c', 'photo-1613490493576-7fde63acd811', 'photo-1570129477492-45c003edd2be',
  'photo-1568605114967-8130f3a36994', 'photo-1600607687939-ce8a6c25118c', 'photo-1580587771525-78b9dba3b914',
  'photo-1449844908441-8829872d2607', 'photo-1600047509807-ba8f99d2cdde', 'photo-1545324418-cc1a3fa10c00',
]

const INT = [
  'photo-1502672260266-1c1ef2d93688', 'photo-1493809842364-78817add7ffb', 'photo-1522708323590-d24dbb6b0267',
  'photo-1505691938895-1758d7feb511', 'photo-1484154218962-a197022b5858', 'photo-1556909114-f6e7ad7d3136',
  'photo-1560448204-e02f11c3d0e2', 'photo-1536376072261-38c75010e6c9', 'photo-1540518614846-7eded433c457',
  'photo-1616594039964-ae9021a400a0', 'photo-1598928506311-c55ded91a20c', 'photo-1618221195710-dd6b41faaea6',
  'photo-1600566753190-17f0baa2a6c3', 'photo-1600210492486-724fe5c67fb0', 'photo-1554995207-c18c203602cb',
  'photo-1586023492125-27b2c045efd7',
]

export const HERO_IMAGE = U('photo-1613490493576-7fde63acd811').replace('w=1400', 'w=2400')

export const OWNERS = [
  { name: 'Elena Marquez', since: 2019, response: 'within an hour', listings: 6 },
  { name: 'Daniel Okoye', since: 2020, response: 'within 3 hours', listings: 3 },
  { name: 'Priya Raman', since: 2018, response: 'within an hour', listings: 9 },
  { name: 'Tomás Beltrán', since: 2021, response: 'same day', listings: 2 },
  { name: 'Hannah Lindqvist', since: 2017, response: 'within 2 hours', listings: 5 },
  { name: 'Marcus Webb', since: 2022, response: 'within 3 hours', listings: 4 },
  { name: 'Sofia Alvarez', since: 2019, response: 'within an hour', listings: 7 },
  { name: 'Kenji Aoki', since: 2020, response: 'same day', listings: 3 },
]

export const AMENITY_POOL = [
  'Wi-Fi', 'Air conditioning', 'Central heating', 'In-unit laundry', 'Dishwasher', 'Parking', 'EV charging',
  'Gym access', 'Rooftop access', 'Private garden', 'Balcony', 'Pool', 'Pet friendly', 'Dedicated workspace',
  'Smart lock', 'Fireplace', 'Bike storage', 'Concierge',
]

// n name · c city · s state · z zip · h neighbourhood · t type · b beds · ba baths · sq sqft · p monthly price
// d distance km · fu furnished · v verified · ib instant booking · tr tour · af available from · r rating · rv reviews
const raw = [
  { n: 'The Glass House', c: 'Austin', s: 'TX', z: '78701', h: 'Rainey Street', t: 'House', b: 3, ba: 2.5, sq: 2400, p: 4200, d: 1.2, fu: true, v: true, ib: true, tr: true, af: '2026-10-20', r: 4.9, rv: 128, li: '2026-09-28', tags: ['Architect-designed', 'Plunge pool', 'Skyline view'], desc: 'Floor-to-ceiling glass wraps a double-height living room above Rainey Street, with a plunge pool tucked into a walled courtyard.' },
  { n: 'Casa Mirador', c: 'Austin', s: 'TX', z: '78704', h: 'South Congress', t: 'Villa', b: 4, ba: 3, sq: 3100, p: 5900, d: 3.4, fu: true, v: true, ib: false, tr: true, af: '2026-11-01', r: 4.8, rv: 86, li: '2026-10-02', tags: ['Garden', 'Guest studio', 'Pet friendly'], desc: 'A white-stucco villa with a lemon-tree garden, an outdoor kitchen and a detached studio that works as an office or a guest room.' },
  { n: 'Clarksville Loft Nine', c: 'Austin', s: 'TX', z: '78703', h: 'Clarksville', t: 'Loft', b: 1, ba: 1, sq: 980, p: 2350, d: 2.1, fu: false, v: true, ib: true, tr: false, af: '2026-10-12', r: 4.6, rv: 54, li: '2026-09-10', tags: ['Exposed brick', 'Rooftop', 'Bike storage'], desc: 'Fourteen-foot ceilings, original brick and a steel-framed window wall in a converted print works a short ride from Lake Austin.' },
  { n: 'Palisade Terrace', c: 'Los Angeles', s: 'CA', z: '90272', h: 'Pacific Palisades', t: 'House', b: 4, ba: 3, sq: 3400, p: 7800, d: 5.6, fu: false, v: true, ib: false, tr: true, af: '2026-11-15', r: 4.9, rv: 61, li: '2026-10-05', tags: ['Ocean view', 'Gated', 'EV charging'], desc: 'Stepped terraces face the Pacific, with a sunken lounge, a lap pool and a gated drive on a quiet canyon road.' },
  { n: 'Silver Lake Atelier', c: 'Los Angeles', s: 'CA', z: '90026', h: 'Silver Lake', t: 'Studio', b: 0, ba: 1, sq: 520, p: 2150, d: 0.9, fu: true, v: true, ib: true, tr: true, af: '2026-10-10', r: 4.7, rv: 143, li: '2026-09-18', tags: ['Light-filled', 'Walk to cafés', 'Utilities included'], desc: 'A bright north-lit studio with a built-in oak bed platform, a proper kitchen and a shared courtyard with citrus trees.' },
  { n: 'Venice Canal Bungalow', c: 'Los Angeles', s: 'CA', z: '90291', h: 'Venice Canals', t: 'House', b: 2, ba: 2, sq: 1300, p: 5200, d: 4.0, fu: true, v: false, ib: false, tr: true, af: '2026-12-01', r: 4.8, rv: 37, li: '2026-09-02', tags: ['Canal front', 'Garden', 'Surfboard storage'], desc: 'A low-slung craftsman bungalow on the canal with a footbridge to the door and a deck made for long evenings.' },
  { n: 'Mission Dolores Flat', c: 'San Francisco', s: 'CA', z: '94114', h: 'Mission Dolores', t: 'Apartment', b: 2, ba: 1, sq: 1050, p: 4650, d: 1.6, fu: false, v: true, ib: false, tr: true, af: '2026-10-25', r: 4.5, rv: 72, li: '2026-08-30', tags: ['Victorian', 'Bay windows', 'Near BART'], desc: 'The top floor of a restored Victorian with bay windows, original plasterwork and a view over Dolores Park.' },
  { n: 'Embarcadero Sky Unit', c: 'San Francisco', s: 'CA', z: '94111', h: 'Embarcadero', t: 'Apartment', b: 1, ba: 1, sq: 760, p: 4100, d: 0.7, fu: true, v: true, ib: true, tr: false, af: '2026-10-09', r: 4.7, rv: 98, li: '2026-10-06', tags: ['Doorman', 'Gym', 'Bay view'], desc: 'A high-floor one-bedroom with the Bay Bridge in every window, a doorman downstairs and the Ferry Building around the corner.' },
  { n: 'Noe Valley Townhouse', c: 'San Francisco', s: 'CA', z: '94131', h: 'Noe Valley', t: 'Townhouse', b: 3, ba: 2.5, sq: 1900, p: 6400, d: 4.2, fu: false, v: true, ib: false, tr: true, af: '2026-11-08', r: 4.8, rv: 44, li: '2026-09-22', tags: ['Garage', 'Private yard', 'Quiet street'], desc: 'Three floors of warm timber and white walls, a private yard with a fig tree and a garage that actually fits a car.' },
  { n: 'Williamsburg Brick Loft', c: 'Brooklyn', s: 'NY', z: '11211', h: 'Williamsburg', t: 'Loft', b: 2, ba: 2, sq: 1500, p: 5300, d: 1.1, fu: false, v: true, ib: true, tr: true, af: '2026-10-18', r: 4.6, rv: 117, li: '2026-09-25', tags: ['Cast-iron windows', 'Rooftop', 'Laundry'], desc: 'A former biscuit factory floor with arched cast-iron windows, wide-plank pine and a roof deck facing Manhattan.' },
  { n: 'Heights Garden Suite', c: 'Brooklyn', s: 'NY', z: '11201', h: 'Brooklyn Heights', t: 'Apartment', b: 1, ba: 1, sq: 820, p: 3450, d: 2.5, fu: true, v: true, ib: false, tr: false, af: '2026-10-30', r: 4.9, rv: 29, li: '2026-10-01', tags: ['Garden access', 'Brownstone', 'Promenade nearby'], desc: 'The garden floor of a landmark brownstone, with a private terrace, marble fireplace and the Promenade two blocks away.' },
  { n: 'Capitol Hill Room Nº4', c: 'Seattle', s: 'WA', z: '98102', h: 'Capitol Hill', t: 'Private Room', b: 1, ba: 1, sq: 190, p: 1150, d: 1.8, fu: true, v: true, ib: true, tr: false, af: '2026-10-10', r: 4.4, rv: 63, li: '2026-09-14', tags: ['Shared kitchen', 'Bills included', 'Student friendly'], desc: 'A quiet, sunny room in a four-person house with a big shared kitchen, a reading nook and bills folded into the rent.' },
  { n: 'Fremont Cedar House', c: 'Seattle', s: 'WA', z: '98103', h: 'Fremont', t: 'House', b: 3, ba: 2, sq: 2050, p: 4950, d: 3.1, fu: false, v: true, ib: false, tr: true, af: '2026-11-12', r: 4.7, rv: 40, li: '2026-09-30', tags: ['Cedar cladding', 'Wood stove', 'Garden'], desc: 'Clad in dark cedar and lined in pale fir, with a wood stove, a deep porch and a garden that runs down to the canal path.' },
  { n: 'West Loop Foundry', c: 'Chicago', s: 'IL', z: '60607', h: 'West Loop', t: 'Loft', b: 2, ba: 2, sq: 1750, p: 3900, d: 1.4, fu: false, v: true, ib: true, tr: true, af: '2026-10-22', r: 4.6, rv: 81, li: '2026-09-08', tags: ['Timber beams', 'Concrete floors', 'Gym'], desc: 'Hand-hewn timber beams, polished concrete and a kitchen island long enough to seat eight, above the Fulton Market restaurants.' },
  { n: 'Logan Square Studio', c: 'Chicago', s: 'IL', z: '60647', h: 'Logan Square', t: 'Studio', b: 0, ba: 1, sq: 460, p: 1450, d: 2.9, fu: true, v: false, ib: true, tr: false, af: '2026-10-11', r: 4.3, rv: 52, li: '2026-08-26', tags: ['Boulevard views', 'Pets welcome', 'Bike room'], desc: 'A compact, well-planned studio on the boulevard with tall windows, a Murphy desk and a secure bike room downstairs.' },
  { n: 'Wynwood Colour House', c: 'Miami', s: 'FL', z: '33127', h: 'Wynwood', t: 'House', b: 3, ba: 2, sq: 1800, p: 4700, d: 2.2, fu: true, v: true, ib: false, tr: true, af: '2026-11-05', r: 4.7, rv: 58, li: '2026-09-19', tags: ['Mural facade', 'Plunge pool', 'Studio annex'], desc: 'A single-storey house behind a commissioned mural, with terrazzo floors, a plunge pool and a garden annex for work.' },
  { n: 'Coral Gables Courtyard Villa', c: 'Miami', s: 'FL', z: '33134', h: 'Coral Gables', t: 'Villa', b: 4, ba: 4, sq: 3600, p: 7950, d: 6.0, fu: true, v: true, ib: false, tr: true, af: '2026-12-10', r: 4.9, rv: 33, li: '2026-10-04', tags: ['Courtyard', 'Chef kitchen', 'Staff quarters'], desc: 'A Mediterranean Revival villa built around a tiled courtyard fountain, with a chef kitchen and shaded loggias all round.' },
  { n: 'RiNo Container Studio', c: 'Denver', s: 'CO', z: '80216', h: 'RiNo', t: 'Studio', b: 0, ba: 1, sq: 410, p: 1650, d: 1.5, fu: true, v: true, ib: true, tr: true, af: '2026-10-14', r: 4.6, rv: 47, li: '2026-09-29', tags: ['Steel and timber', 'Design district', 'EV charging'], desc: 'Two stacked shipping containers turned into a sharp studio with a skylight, a steel stair and a roof deck for Front Range sunsets.' },
  { n: 'Alberta Arts Cottage', c: 'Portland', s: 'OR', z: '97211', h: 'Alberta Arts', t: 'House', b: 2, ba: 1, sq: 1100, p: 2900, d: 3.6, fu: false, v: true, ib: false, tr: true, af: '2026-10-28', r: 4.7, rv: 36, li: '2026-09-16', tags: ['Deep porch', 'Vegetable garden', 'Bike friendly'], desc: 'A 1920s cottage with a deep porch, a working vegetable garden and a front room lined with built-in bookshelves.' },
  { n: 'East Nashville Modern', c: 'Nashville', s: 'TN', z: '37206', h: 'East Nashville', t: 'Townhouse', b: 3, ba: 3, sq: 1850, p: 3750, d: 2.7, fu: false, v: false, ib: true, tr: true, af: '2026-11-02', r: 4.5, rv: 49, li: '2026-10-03', tags: ['New build', 'Roof deck', 'Two-car garage'], desc: 'A new-build townhouse in black-stained cedar with a roof deck facing downtown and a two-car garage on the alley.' },
]

const pickAmenities = (i, type) => {
  const exclude = type === 'Private Room' ? ['Pool', 'EV charging', 'Private garden', 'Fireplace', 'Concierge'] : []
  const pool = AMENITY_POOL.filter((a) => !exclude.includes(a))
  const start = (i * 3) % pool.length
  return Array.from({ length: 8 }, (_, k) => pool[(start + k * 5) % pool.length])
}

const buildImages = (i, type) => {
  const interiorFirst = ['Studio', 'Private Room', 'Apartment'].includes(type)
  const first = interiorFirst ? INT[(i * 3) % INT.length] : EXT[i % EXT.length]
  const rest = Array.from({ length: 5 }, (_, k) => INT[(i * 3 + 5 * (k + 1)) % INT.length])
  return [first, ...rest].map(U)
}

export const properties = raw.map((r, i) => ({
  id: `alc-${String(i + 1).padStart(3, '0')}`,
  name: r.n,
  description: `${r.desc} The home is managed directly by its owner, comes with a clear lease and a documented move-in checklist, and sits in ${r.h} — one of the most liveable parts of ${r.c}.`,
  city: r.c,
  state: r.s,
  zip: r.z,
  neighborhood: r.h,
  location: `${r.h}, ${r.c}, ${r.s}`,
  distance: r.d,
  price: r.p,
  currency: 'USD',
  propertyType: r.t,
  bedrooms: r.b,
  bathrooms: r.ba,
  sqft: r.sq,
  furnished: r.fu,
  images: buildImages(i, r.t),
  amenities: pickAmenities(i, r.t),
  tags: r.tags,
  verified: r.v,
  instantBooking: r.ib,
  tourAvailable: r.tr,
  availableFrom: r.af,
  listedAt: r.li,
  rating: r.r,
  reviews: r.rv,
  owner: { id: `own-${(i % OWNERS.length) + 1}`, ...OWNERS[i % OWNERS.length], verified: r.v || i % 3 !== 0 },
}))

export const getHeroProperty = () => properties[0]
