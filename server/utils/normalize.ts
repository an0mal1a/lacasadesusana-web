import type { Operation, Property, PropertyFeature } from '#shared/types/property'
import { slugify } from '#shared/utils/property'

/** Locale → key used in Vestta's `specs.translations`. */
const TRANSLATION_KEY: Record<string, string> = { en: 'en', es: '', de: 'de', fr: 'fr', it: 'it', pt: 'pt', ca: 'ca' }

/** Specs worth surfacing as "facts" on a listing, in display order. Values are rendered through i18n `facts.<key>`. */
const FACT_KEYS = [
  'size_built',
  'usable_area',
  'plot_size',
  'size_terraces',
  'suite_bathrooms',
  'num_parkings',
  'house_floors',
  'construction_year',
  'views',
  'orientation',
  'position',
  'conservation',
  'energy_certificate',
  'turistic_license',
] as const

/** Very small HTML allow-list for listing descriptions coming from the CRM. */
export function sanitizeHtml(html: string): string {
  return html
    .replace(/<\s*(script|style|iframe|object|embed|form|link|meta)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, '')
    .replace(/<\s*(script|style|iframe|object|embed|form|link|meta)[^>]*\/?>/gi, '')
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/(href|src)\s*=\s*("|')\s*javascript:[^"']*\2/gi, '')
    .replace(/\sstyle\s*=\s*("[^"]*"|'[^']*')/gi, '')
    // CRM subheads are written as a bold run at the start of a paragraph: promote them to real headings.
    .replace(/<p>\s*<(b|strong)>([^<]{1,80})<\/\1>\s*(?:<br\s*\/?>\s*)+/gi, '<h3>$2</h3><p>')
    .replace(/<p>\s*<(b|strong)>([^<]{1,80})<\/\1>\s*<\/p>/gi, '<h3>$2</h3>')
}

export function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/(p|div|li|h\d)>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
}

function summarise(text: string, max = 220): string {
  if (text.length <= max) return text
  const cut = text.slice(0, max)
  return `${cut.slice(0, Math.max(cut.lastIndexOf('. ') + 1, cut.lastIndexOf(' ')))}…`
}

function num(v: unknown): number | undefined {
  const n = typeof v === 'string' ? Number(v) : (v as number)
  return typeof n === 'number' && Number.isFinite(n) && n > 0 ? n : undefined
}

export function normalizeProperty(raw: any, locale = 'en'): Property {
  const specs = raw.specs ?? {}
  const tKey = TRANSLATION_KEY[locale] ?? 'en'
  const translated = tKey ? specs.translations?.[tKey] : undefined

  const title: string = (translated?.title || raw.title || '').trim()
  const descriptionHtml = sanitizeHtml(translated?.description || raw.description || '')
  const plain = stripHtml(descriptionHtml)
  const city: string | undefined = raw.city || undefined

  const operations = String(raw.operation ?? '')
    .split(',')
    .map(s => s.trim().toLowerCase())
    .filter((s): s is Operation => s === 'venta' || s === 'alquiler' || s === 'traspaso')

  const images = [...(raw.images ?? [])]
    .sort((a, b) => Number(b.is_primary) - Number(a.is_primary) || (a.order ?? 1) - (b.order ?? 1))
    .map((img: any) => ({ url: img.url as string, alt: img.title || [title, city].filter(Boolean).join(' — ') }))

  const features: PropertyFeature[] = (raw.features ?? [])
    .filter((f: any) => f && f.label && f.value !== false && f.value !== 0 && f.value !== '')
    .map((f: any) => ({ key: String(f.key), label: String(f.label), value: f.value }))

  const facts = FACT_KEYS.flatMap((key) => {
    const value = specs[key]
    if (value === undefined || value === null || value === '' || value === 0) return []
    return [{ key, value: typeof value === 'boolean' ? (value ? '✓' : '') : value }]
  }).filter(f => f.value !== '')

  const video = (raw.videos ?? []).find((v: any) => v.embed_url)

  const fallbackTitle = [raw.subtype && raw.subtype !== 'Sin Especificar' ? raw.subtype : raw.type, city].filter(Boolean).join(' · ')
  const finalTitle = title || fallbackTitle || `Ref ${raw.id}`

  return {
    id: raw.id,
    slug: `${raw.id}-${slugify(finalTitle) || 'property'}`,
    title: finalTitle,
    summary: summarise(plain),
    descriptionHtml,
    operations,
    type: raw.type,
    subtype: raw.subtype && raw.subtype !== 'Sin Especificar' ? raw.subtype : undefined,
    priceSale: num(raw.price),
    priceRent: num(specs.price_calc?.price_alq),
    size: num(specs.size_built) ?? num(raw.size_total),
    plot: num(specs.plot_size),
    bedrooms: num(raw.bedrooms),
    bathrooms: num(raw.bathrooms),
    city,
    province: raw.province,
    country: raw.country,
    address: raw.address,
    lat: typeof raw.lat === 'number' ? raw.lat : undefined,
    lon: typeof raw.lon === 'number' ? raw.lon : undefined,
    addressPrivacy: specs.address_privacy ?? (raw.address ? 'approximate' : 'hidden'),
    images,
    videoEmbed: video?.embed_url,
    features,
    facts,
    featured: Boolean(raw.is_featured),
    luxury: Boolean(specs.luxury_property),
    status: raw.status,
    updatedAt: raw.updated_at,
  }
}
