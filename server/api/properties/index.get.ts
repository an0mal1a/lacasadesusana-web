import { z } from 'zod'
import type { PropertyQuery } from '#shared/types/property'

const querySchema = z.object({
  lang: z.enum(['en', 'es']).default('en'),
  operation: z.enum(['venta', 'alquiler']).optional(),
  type: z.string().max(30).optional(),
  city: z.string().max(80).optional(),
  min_price: z.coerce.number().int().min(0).optional(),
  max_price: z.coerce.number().int().min(0).optional(),
  min_bedrooms: z.coerce.number().int().min(0).max(20).optional(),
  sort: z.enum(['price_asc', 'price_desc']).optional(),
  featured: z.coerce.boolean().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(12),
  offset: z.coerce.number().int().min(0).default(0),
})

/** Public catalogue, cached 5 minutes and served stale while revalidating. */
export default defineCachedEventHandler(
  async (event) => {
    const q = await getValidatedQuery(event, querySchema.parse)
    const { lang, ...filters } = q
    return listProperties(event, filters as PropertyQuery, lang)
  },
  { maxAge: 300, swr: true, name: 'properties-v2', getKey: event => JSON.stringify(getQuery(event)) },
)
