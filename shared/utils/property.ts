import type { Property } from '../types/property'

export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

/**
 * The Vestta ID always closes the URL (`villa-in-jesus-1355` → 1355), which the CRM's bot rules rely on.
 * A bare ID (`1355`) also resolves and is redirected to the canonical slug.
 */
export function idFromSlug(slug: string): number | null {
  const m = /(?:^|-)(\d+)$/.exec(slug)
  return m ? Number(m[1]) : null
}

export function listingSlug(id: number, title: string): string {
  return `${slugify(title).slice(0, 72).replace(/-+$/, '') || 'property'}-${id}`
}

export function primaryPrice(p: Property): { amount?: number; perMonth: boolean } {
  if (p.operations.includes('venta') && p.priceSale) return { amount: p.priceSale, perMonth: false }
  if (p.operations.includes('alquiler') && p.priceRent) return { amount: p.priceRent, perMonth: true }
  return { amount: p.priceSale || p.priceRent, perMonth: !p.priceSale && !!p.priceRent }
}
