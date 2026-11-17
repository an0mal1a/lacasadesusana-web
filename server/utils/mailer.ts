import type { H3Event } from 'h3'
import nodemailer from 'nodemailer'

let transport: nodemailer.Transporter | null = null

export function mailConfigured(event?: H3Event) {
  const { smtp, mail } = useRuntimeConfig(event)
  return Boolean(smtp.host && mail.to)
}

function getTransport(event?: H3Event) {
  if (transport) return transport
  const { smtp } = useRuntimeConfig(event)
  transport = nodemailer.createTransport({
    host: smtp.host,
    port: Number(smtp.port) || 587,
    secure: String(smtp.secure) === 'true',
    auth: smtp.user ? { user: smtp.user, pass: smtp.pass } : undefined,
  })
  return transport
}

const esc = (s: unknown) =>
  String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

/** Send a plain, readable notification to the agency. `rows` render as a two-column table. */
export async function notifyAgency(
  event: H3Event,
  opts: { subject: string; intro: string; rows: [string, unknown][]; replyTo?: string },
) {
  const { mail } = useRuntimeConfig(event)
  const rows = opts.rows.filter(([, v]) => v !== undefined && v !== null && v !== '')
  const text = [opts.intro, '', ...rows.map(([k, v]) => `${k}: ${v}`)].join('\n')
  const html = `<div style="font-family:Georgia,serif;color:#2E2822;max-width:640px">
  <p style="font-size:16px">${esc(opts.intro)}</p>
  <table cellpadding="8" style="border-collapse:collapse;font-family:Helvetica,Arial,sans-serif;font-size:14px;width:100%">
  ${rows.map(([k, v]) => `<tr style="border-bottom:1px solid #E9E5DA"><td style="color:#7A6F5F;width:38%;vertical-align:top">${esc(k)}</td><td style="white-space:pre-wrap">${esc(v)}</td></tr>`).join('')}
  </table></div>`

  if (!mailConfigured(event)) {
    // Development without SMTP: log instead of failing, so forms can be tested end to end.
    console.warn('[mail] SMTP not configured — would have sent:\n', opts.subject, '\n', text)
    return { delivered: false }
  }
  await getTransport(event).sendMail({
    from: mail.from || mail.to,
    to: mail.to,
    replyTo: opts.replyTo,
    subject: opts.subject,
    text,
    html,
  })
  return { delivered: true }
}
