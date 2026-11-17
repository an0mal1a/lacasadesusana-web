import type { H3Event } from 'h3'

/**
 * Thin server-side client for the Vestta public API (https://api-docs.vestta.io).
 * The API key never leaves the server: browsers only talk to our own /api routes.
 * Scopes required: properties:read, leads:ingest.
 */
export class VesttaError extends Error {
  constructor(
    public status: number,
    public detail: unknown,
  ) {
    super(`Vestta ${status}`)
  }
}

export function vesttaConfigured(event?: H3Event): boolean {
  return Boolean(useRuntimeConfig(event).vestta.apiKey)
}

export async function vestta<T = any>(
  event: H3Event | undefined,
  path: string,
  opts: { method?: 'GET' | 'POST' | 'PATCH' | 'PUT'; query?: Record<string, unknown>; body?: unknown; idempotencyKey?: string } = {},
): Promise<T> {
  const { apiKey, baseUrl, watermark } = useRuntimeConfig(event).vestta
  if (!apiKey) throw new VesttaError(503, 'Vestta API key not configured')

  // Listing photos come without the agency watermark unless NUXT_VESTTA_WATERMARK asks for it (the API's `watermark` flag,
  // on the list and on the detail). Vestta prepares the clean copies on the first request and caches them.
  const listing = (opts.method ?? 'GET') === 'GET' && /^\/properties(\/|$)/.test(path)
  // Drop empty query values: Vestta treats unknown params as noise, but empty strings as filters.
  const query = Object.fromEntries(
    Object.entries({ ...opts.query, ...(listing ? { watermark: String(watermark) === 'true' } : {}) })
      .filter(([, v]) => v !== undefined && v !== null && v !== ''),
  )

  try {
    return await $fetch<T>(path, {
      baseURL: baseUrl,
      method: opts.method ?? 'GET',
      query,
      body: opts.body as Record<string, unknown> | undefined,
      headers: {
        'X-Api-Key': apiKey,
        Accept: 'application/json',
        ...(opts.idempotencyKey ? { 'Idempotency-Key': opts.idempotencyKey } : {}),
      },
      timeout: 12_000,
      retry: opts.method && opts.method !== 'GET' ? 0 : 1,
    })
  } catch (err: any) {
    const status = err?.response?.status ?? err?.statusCode ?? 502
    throw new VesttaError(status, err?.data?.detail ?? err?.data ?? err?.message)
  }
}
