/** List your property → email to the agency over SMTP (owner leads in Vestta can follow later). */
export default defineEventHandler(async (event) => {
  const { data: f, spam } = await readForm(event, sellSchema)
  if (spam) return { ok: true }
  const phone = toE164(f.dialCode, f.phone)
  const fmt = (n?: number, unit = '') => (n === undefined ? undefined : `${n.toLocaleString('es-ES')}${unit}`)

  try {
    const res = await notifyAgency(event, {
      subject: `New property to list — ${f.propertyType} in ${f.area}`,
      intro: `${f.name} would like La Casa de Susana to ${f.operation === 'alquiler' ? 'rent' : f.operation === 'ambas' ? 'sell or rent' : 'sell'} their property.`,
      replyTo: f.email,
      rows: [
        ['Owner', f.name],
        ['Email', f.email],
        ['Phone', phone],
        ['Operation', f.operation],
        ['Property type', f.propertyType],
        ['Area', f.area],
        ['Bedrooms', f.bedrooms],
        ['Built size', fmt(f.size, ' m²')],
        ['Plot', fmt(f.plot, ' m²')],
        ['Expected price', fmt(f.expectedPrice, ' €')],
        ['Timeline', f.timeline],
        ['Message', f.message],
        ['Language', f.locale],
        ['Page', f.page],
      ],
    })
    return { ok: true, channel: res.delivered ? 'email' : 'log' }
  } catch (e) {
    console.error('[mail] sell form failed', e)
    throw createError({ statusCode: 502, statusMessage: 'Mail delivery failed' })
  }
})
