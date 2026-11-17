import type { Property } from '#shared/types/property'

export function useFormat() {
  const { locale, t } = useI18n()
  const tag = computed(() => (locale.value === 'es' ? 'es-ES' : 'en-GB'))

  const money = (n?: number) =>
    n
      ? new Intl.NumberFormat(tag.value, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)
      : t('listing.onRequest')

  const area = (n?: number) => (n ? `${new Intl.NumberFormat(tag.value).format(n)} m²` : '')

  const price = (p: Property) => {
    const { amount, perMonth } = primaryPrice(p)
    return { text: money(amount), perMonth: perMonth && !!amount }
  }

  const place = (p: Property) => [p.city, p.city && /ibiza|eivissa/i.test(p.city) ? '' : island(p)].filter(Boolean).join(', ')

  /** Literal operation label: "For sale" / "For rent". */
  const op = (p: Property) => (p.operations.includes('venta') ? t('listing.forSale') : t('listing.forRent'))

  return { money, area, price, place, op }
}

/** Best-effort island from coordinates/province, so Mallorca listings never read as Ibiza. */
function island(p: Property): string {
  if (p.lat && p.lon) {
    if (p.lat < 39.15 && p.lon < 1.7) return p.lat < 38.8 ? 'Formentera' : 'Ibiza'
    if (p.lon > 2.2 && p.lon < 3.5) return 'Mallorca'
    if (p.lon > 3.7) return 'Menorca'
  }
  if (p.city && /santany|salines|llombards|palma|soller|pollen|andratx|deia/i.test(p.city)) return 'Mallorca'
  return p.province && !/balear/i.test(p.province) ? p.province : ''
}
