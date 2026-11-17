const URGENCY = { now: 'alta-urgencia', months: 'alta-urgencia', year: 'poca-urgencia', exploring: 'poca-urgencia' } as const

/**
 * Private search → Vestta "Create an inquiry" with structured `search_preferences`.
 * Creates the client in the CRM together with their request, so Vestta can match and follow up.
 */
export default defineEventHandler(async (event) => {
  const { data: f, spam } = await readForm(event, searchRequestSchema)
  if (spam) return { ok: true }
  const phone = toE164(f.dialCode, f.phone)
  const rent = f.operation === 'alquiler'

  const criteria = Object.fromEntries(
    Object.entries({
      [rent ? 'price_rent_min' : 'price_min']: f.priceMin,
      [rent ? 'price_rent_max' : 'price_max']: f.priceMax,
      bedrooms_min: f.bedroomsMin,
    }).filter(([, v]) => v !== undefined),
  )
  const perType = Object.fromEntries(f.types.filter(t => t !== 'terreno').map(t => [t, criteria]))
  if (f.types.includes('terreno')) {
    perType.terreno = Object.fromEntries(Object.entries(criteria).filter(([k]) => !k.startsWith('bedrooms')))
  }

  const summary = [
    f.mustHaves.length ? `Must-haves: ${f.mustHaves.join(', ')}` : '',
    `Timeline: ${f.timeline}`,
    `Email: ${f.email}`,
    f.message,
  ].filter(Boolean).join('\n')

  return deliverLead(event, {
    path: '/leads/inquiries',
    body: {
      name: f.name,
      type: rent ? 'tenant' : 'buyer',
      phone_number_1: phone,
      personal_email: f.email,
      preferred_language: vesttaLanguage(f.locale),
      urgency_profile: URGENCY[f.timeline],
      source: 'web',
      sourcePage: f.page,
      search_preferences: [
        {
          title: rent ? 'Web — rental search' : 'Web — private search',
          operations: [f.operation],
          property_types: f.types,
          ...perType,
          locations: f.areas.map(name => ({ name })),
          internal_notes: summary,
        },
      ],
    },
    fallback: {
      subject: `Private search — ${f.name}`,
      intro: 'New private search request from the website.',
      replyTo: f.email,
      rows: [['Name', f.name], ['Email', f.email], ['Phone', phone], ['Operation', f.operation], ['Types', f.types.join(', ')], ['Areas', f.areas.join(', ')], ['Budget', `${f.priceMin ?? '—'} – ${f.priceMax ?? '—'} €`], ['Bedrooms (min)', f.bedroomsMin], ['Must-haves', f.mustHaves.join(', ')], ['Timeline', f.timeline], ['Message', f.message]],
    },
  })
})
