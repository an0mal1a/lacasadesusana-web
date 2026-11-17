/** Normalised property, as the website consumes it. Built server-side from the Vestta public catalogue. */
export interface PropertyImage {
  url: string
  alt: string
}

export interface PropertyFeature {
  key: string
  label: string
  value: string | number | boolean
}

export type Operation = 'venta' | 'alquiler' | 'traspaso'

export interface Property {
  id: number
  slug: string
  title: string
  summary: string
  descriptionHtml: string
  operations: Operation[]
  type?: string
  subtype?: string
  priceSale?: number
  priceRent?: number
  size?: number
  plot?: number
  bedrooms?: number
  bathrooms?: number
  city?: string
  province?: string
  country?: string
  address?: string
  lat?: number
  lon?: number
  addressPrivacy: 'public' | 'approximate' | 'hidden'
  images: PropertyImage[]
  videoEmbed?: string
  features: PropertyFeature[]
  facts: { key: string; value: string | number }[]
  featured: boolean
  luxury: boolean
  status?: string
  updatedAt?: string
}

export interface PropertyPage {
  items: Property[]
  count: number
  limit: number
  offset: number
  source: 'vestta' | 'fixtures'
}

export interface PropertyQuery {
  operation?: 'venta' | 'alquiler'
  type?: string
  city?: string
  min_price?: number
  max_price?: number
  min_bedrooms?: number
  sort?: 'price_asc' | 'price_desc'
  featured?: boolean
  limit?: number
  offset?: number
}
