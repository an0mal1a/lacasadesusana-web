import { z } from 'zod'

/**
 * Form contracts shared by the browser (instant validation) and the server
 * (authoritative validation before anything reaches Vestta or SMTP).
 * Error messages are i18n keys, resolved in the UI.
 */

const phone = z
  .string()
  .trim()
  .min(6, 'errors.phone')
  .max(24, 'errors.phone')
  .regex(/^[+\d][\d\s().-]+$/, 'errors.phone')

const base = {
  name: z.string().trim().min(2, 'errors.name').max(120, 'errors.name'),
  email: z.string().trim().email('errors.email').max(160),
  dialCode: z.string().regex(/^\+\d{1,4}$/, 'errors.phone'),
  phone,
  consent: z.literal(true, { error: 'errors.consent' }),
  locale: z.enum(['en', 'es']).default('en'),
  page: z.string().max(400).optional(),
  // Anti-spam: the honeypot must stay empty and the form must have been open > 2.5s.
  website: z.string().max(0).optional(),
  startedAt: z.number().optional(),
}

const optionalInt = (max: number) =>
  z.preprocess(
    (v) => {
      if (v === '' || v === null || v === undefined) return undefined
      // Accept "1.500.000", "1,500,000 €", "3000" — keep the digits.
      const n = typeof v === 'string' ? Number(v.replace(/[^\d]/g, '')) : Number(v)
      return v === '' || Number.isNaN(n) ? undefined : n
    },
    z.number({ error: 'errors.number' }).int().min(0).max(max).optional(),
  )

export const contactSchema = z.object({
  ...base,
  subject: z.enum(['buy', 'rent', 'sell', 'other']).default('other'),
  message: z.string().trim().min(10, 'errors.message').max(4000),
  propertyId: optionalInt(10_000_000),
})

export const searchRequestSchema = z.object({
  ...base,
  operation: z.enum(['venta', 'alquiler']),
  types: z.array(z.enum(['casa', 'apartamento', 'terreno'])).min(1, 'errors.types'),
  areas: z.array(z.string().max(60)).max(12).default([]),
  priceMin: optionalInt(100_000_000),
  priceMax: optionalInt(100_000_000),
  bedroomsMin: optionalInt(20),
  mustHaves: z.array(z.string().max(40)).max(12).default([]),
  timeline: z.enum(['now', 'months', 'year', 'exploring']).default('months'),
  message: z.string().trim().max(4000).default(''),
})

export const rentalProfileSchema = z.object({
  ...base,
  rentalType: z.enum(['anual', 'temporal']),
  budget: optionalInt(1_000_000),
  moveIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'errors.date').or(z.literal('')).default(''),
  stayMonths: optionalInt(600),
  occupants: optionalInt(20),
  bedrooms: optionalInt(20),
  employment: z
    .enum(['indefinido', 'temporal', 'funcionario', 'autonomo', 'pensionista', 'estudiante', 'desempleado', 'otro'])
    .default('otro'),
  monthlyIncome: optionalInt(1_000_000),
  pets: z.boolean().default(false),
  petsDetail: z.string().trim().max(120).default(''),
  smoker: z.boolean().default(false),
  guarantor: z.boolean().default(false),
  area: z.string().trim().max(120).default(''),
  message: z.string().trim().max(4000).default(''),
  benchConsent: z.boolean().default(true),
  propertyId: optionalInt(10_000_000),
})

export const sellSchema = z.object({
  ...base,
  operation: z.enum(['venta', 'alquiler', 'ambas']),
  propertyType: z.enum(['villa', 'finca', 'apartment', 'penthouse', 'townhouse', 'land', 'other']),
  area: z.string().trim().min(2, 'errors.area').max(120),
  bedrooms: optionalInt(40),
  size: optionalInt(100_000),
  plot: optionalInt(10_000_000),
  expectedPrice: optionalInt(500_000_000),
  timeline: z.enum(['now', 'months', 'year', 'exploring']).default('months'),
  message: z.string().trim().max(4000).default(''),
})

export type ContactForm = z.infer<typeof contactSchema>
export type SearchRequestForm = z.infer<typeof searchRequestSchema>
export type RentalProfileForm = z.infer<typeof rentalProfileSchema>
export type SellForm = z.infer<typeof sellSchema>

/** Ibiza areas offered in search forms. Kept as data so a Balearics-wide scope only extends this list. */
export const AREAS = [
  'Ibiza Town',
  'Jesús',
  'Talamanca',
  'Santa Eulària des Riu',
  'Santa Gertrudis',
  'Sant Josep de sa Talaia',
  'Cala Jondal',
  'Es Cubells',
  'Sant Antoni de Portmany',
  'Sant Joan de Labritja',
  'Sant Carles de Peralta',
  'Formentera',
] as const

export const DIAL_CODES = [
  { code: '+34', label: 'ES +34' },
  { code: '+44', label: 'UK +44' },
  { code: '+49', label: 'DE +49' },
  { code: '+33', label: 'FR +33' },
  { code: '+39', label: 'IT +39' },
  { code: '+31', label: 'NL +31' },
  { code: '+41', label: 'CH +41' },
  { code: '+32', label: 'BE +32' },
  { code: '+43', label: 'AT +43' },
  { code: '+46', label: 'SE +46' },
  { code: '+47', label: 'NO +47' },
  { code: '+45', label: 'DK +45' },
  { code: '+353', label: 'IE +353' },
  { code: '+351', label: 'PT +351' },
  { code: '+1', label: 'US/CA +1' },
  { code: '+971', label: 'AE +971' },
] as const

/** Join a dial code and a national number into E.164-ish form. Numbers already starting with + win. */
export function toE164(dialCode: string, raw: string): string {
  const cleaned = raw.replace(/[\s().-]/g, '')
  if (cleaned.startsWith('+')) return cleaned
  if (cleaned.startsWith('00')) return `+${cleaned.slice(2)}`
  return `${dialCode}${cleaned.replace(/^0+/, '')}`
}
