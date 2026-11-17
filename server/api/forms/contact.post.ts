const TYPE = { buy: 'buyer', rent: 'tenant', sell: 'owner', other: 'demandante' } as const

/** /contact → Vestta "Create an inquiry" (contact details + message, no search preferences). */
export default defineEventHandler(async (event) => {
  const { data: f, spam } = await readForm(event, contactSchema)
  if (spam) return { ok: true }
  const phone = toE164(f.dialCode, f.phone)

  return deliverLead(event, {
    path: '/leads/inquiries',
    body: {
      name: f.name,
      type: TYPE[f.subject],
      phone_number_1: phone,
      personal_email: f.email,
      preferred_language: vesttaLanguage(f.locale),
      source: 'web',
      sourcePage: f.page,
      notes: [f.propertyId ? `Property Ref ${f.propertyId}` : '', `Email: ${f.email}`, f.message].filter(Boolean).join('\n'),
    },
    fallback: {
      subject: `Web enquiry — ${f.name}`,
      intro: 'New enquiry from the website.',
      replyTo: f.email,
      rows: [['Name', f.name], ['Email', f.email], ['Phone', phone], ['Subject', f.subject], ['Property Ref', f.propertyId], ['Message', f.message], ['Page', f.page], ['Language', f.locale]],
    },
  })
})
