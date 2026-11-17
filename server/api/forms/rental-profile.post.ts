/**
 * Rental profile → Vestta "Ingest a rental lead" with a structured tenant profile.
 * With `propertyId` the contact becomes a candidate for that rental; otherwise a general rental search is created.
 */
export default defineEventHandler(async (event) => {
  const { data: f, spam } = await readForm(event, rentalProfileSchema)
  if (spam) return { ok: true }
  const phone = toE164(f.dialCode, f.phone)
  const exitDate = f.moveIn && f.stayMonths
    ? (() => { const d = new Date(`${f.moveIn}T12:00:00Z`); d.setUTCMonth(d.getUTCMonth() + f.stayMonths!); return d.toISOString().slice(0, 10) })()
    : ''

  return deliverLead(event, {
    path: '/leads/ingest',
    body: {
      id: `web-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
      source: 'web',
      sourcePage: f.page || 'web',
      contact: { name: f.name, phone, phoneE164: phone, phoneRaw: f.phone },
      search: {
        budget: f.budget ? String(f.budget) : '',
        entryDate: f.moveIn,
        exitDate,
        people: f.occupants ? String(f.occupants) : '',
        area: f.area,
        habs: f.bedrooms !== undefined ? String(f.bedrooms) : '',
        pets: f.pets ? (f.petsDetail ? `Sí, ${f.petsDetail}` : 'Sí') : 'No',
        workSituation: f.employment,
        location: f.area ? { name: f.area } : {},
        freeText: [`Rental type: ${f.rentalType}`, `Email: ${f.email}`, f.message].filter(Boolean).join('\n'),
      },
      tenant: {
        ...(f.occupants ? { occupants: f.occupants } : {}),
        ...(f.monthlyIncome !== undefined ? { monthlyIncome: f.monthlyIncome } : {}),
        employment: f.employment,
        pets: f.pets,
        ...(f.petsDetail ? { petsDetail: f.petsDetail } : {}),
        smoker: f.smoker,
        guarantor: f.guarantor,
        ...(f.moveIn ? { moveIn: f.moveIn } : {}),
        ...(f.stayMonths ? { stayMonths: f.stayMonths } : {}),
        benchConsent: f.benchConsent,
      },
      ...(f.propertyId ? { propertyId: f.propertyId } : {}),
    },
    fallback: {
      subject: `Rental profile — ${f.name}`,
      intro: 'New tenant profile from the website.',
      replyTo: f.email,
      rows: [['Name', f.name], ['Email', f.email], ['Phone', phone], ['Rental type', f.rentalType], ['Budget / month', f.budget], ['Move-in', f.moveIn], ['Stay (months)', f.stayMonths], ['Occupants', f.occupants], ['Bedrooms', f.bedrooms], ['Employment', f.employment], ['Net monthly income', f.monthlyIncome], ['Pets', f.pets ? f.petsDetail || 'Yes' : 'No'], ['Smoker', f.smoker ? 'Yes' : 'No'], ['Guarantor', f.guarantor ? 'Yes' : 'No'], ['Area', f.area], ['Property Ref', f.propertyId], ['Message', f.message]],
    },
  })
})
