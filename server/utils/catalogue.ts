import type { H3Event } from 'h3'
import type { Property, PropertyPage, PropertyQuery } from '#shared/types/property'
import { FIXTURES } from './fixtures'
import { normalizeProperty } from './normalize'
import { vestta, vesttaConfigured } from './vestta'

function filterFixtures(q: PropertyQuery): any[] {
  let list = [...FIXTURES]
  const price = (r: any) => (q.operation === 'alquiler' ? r.specs?.price_calc?.price_alq : r.price) ?? 0
  if (q.operation) list = list.filter(r => String(r.operation).includes(q.operation!))
  if (q.type) list = list.filter(r => r.type === q.type)
  if (q.city) list = list.filter(r => String(r.city).toLowerCase() === q.city!.toLowerCase())
  if (q.min_bedrooms) list = list.filter(r => (r.bedrooms ?? 0) >= q.min_bedrooms!)
  if (q.min_price) list = list.filter(r => price(r) >= q.min_price!)
  if (q.max_price) list = list.filter(r => price(r) <= q.max_price!)
  if (q.featured) list = list.filter(r => r.is_featured)
  if (q.sort === 'price_asc') list.sort((a, b) => price(a) - price(b))
  if (q.sort === 'price_desc') list.sort((a, b) => price(b) - price(a))
  return list
}

export async function listProperties(event: H3Event, q: PropertyQuery, locale: string): Promise<PropertyPage> {
  const limit = Math.min(Math.max(q.limit ?? 12, 1), 100)
  const offset = Math.max(q.offset ?? 0, 0)

  if (!vesttaConfigured(event)) {
    const all = filterFixtures(q)
    return {
      items: all.slice(offset, offset + limit).map(r => normalizeProperty(r, locale)),
      count: all.length,
      limit,
      offset,
      source: 'fixtures',
    }
  }

  const res = await vestta<{ data: any[]; count: number }>(event, '/properties', {
    query: {
      limit,
      offset,
      operation: q.operation,
      type: q.type,
      city: q.city,
      min_price: q.min_price,
      max_price: q.max_price,
      min_bedrooms: q.min_bedrooms,
      is_featured: q.featured ? 'true' : undefined,
      sort: q.sort,
    },
  })
  return { items: res.data.map(r => normalizeProperty(r, locale)), count: res.count, limit, offset, source: 'vestta' }
}

export async function getProperty(event: H3Event, id: number, locale: string): Promise<Property | null> {
  if (!vesttaConfigured(event)) {
    const raw = FIXTURES.find(f => f.id === id)
    return raw ? normalizeProperty(raw, locale) : null
  }
  try {
    const res = await vestta<{ data: any }>(event, `/properties/${id}`)
    return normalizeProperty(res.data, locale)
  } catch (e: any) {
    if (e?.status === 404) return null
    throw e
  }
}

/** Distinct cities with listing counts — powers the "Areas" course and the area filter. */
export async function listAreas(event: H3Event): Promise<{ city: string; count: number }[]> {
  const raw = vesttaConfigured(event)
    ? (await vestta<{ data: any[] }>(event, '/properties', { query: { limit: 1000 } })).data
    : FIXTURES
  const counts = new Map<string, number>()
  for (const r of raw) if (r.city) counts.set(r.city, (counts.get(r.city) ?? 0) + 1)
  return [...counts.entries()].map(([city, count]) => ({ city, count })).sort((a, b) => b.count - a.count)
}
