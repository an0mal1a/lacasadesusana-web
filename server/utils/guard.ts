import type { H3Event } from 'h3'
import type { z } from 'zod'

const hits = new Map<string, number[]>()

/** Best-effort per-instance rate limit (serverless instances each keep their own window). */
function rateLimit(event: H3Event, max = 6, windowMs = 10 * 60_000) {
  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter(t => now - t < windowMs)
  if (recent.length >= max) throw createError({ statusCode: 429, statusMessage: 'Too many requests' })
  recent.push(now)
  hits.set(ip, recent)
}

/**
 * Validate a form body and run anti-spam checks.
 * Bots get a fake success (`{ spam: true }`) so they don't learn to adapt.
 */
export async function readForm<S extends z.ZodType>(event: H3Event, schema: S): Promise<{ data: z.infer<S>; spam: boolean }> {
  rateLimit(event)
  const body = await readBody(event)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Invalid form',
      data: { fields: parsed.error.issues.map(i => ({ path: i.path.join('.'), message: i.message })) },
    })
  }
  const data = parsed.data as any
  const tooFast = typeof data.startedAt === 'number' && Date.now() - data.startedAt < 2500
  const spam = Boolean(data.website) || tooFast
  return { data: parsed.data, spam }
}

export const vesttaLanguage = (locale: string) => ({ en: 'gb', es: 'es', de: 'ge', fr: 'fr', it: 'it' } as Record<string, string>)[locale] ?? 'gb'
