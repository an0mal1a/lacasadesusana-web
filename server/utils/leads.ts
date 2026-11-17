import type { H3Event } from 'h3'
import { VesttaError, vestta, vesttaConfigured } from './vestta'
import { notifyAgency } from './mailer'

export interface LeadResult {
  ok: true
  /** The phone was already in Vestta with a name: nothing new was created. */
  known?: boolean
  leadId?: number
  channel: 'vestta' | 'email' | 'log'
}

/**
 * Send a lead to Vestta. If Vestta is not configured or is down, the lead is never lost:
 * it falls back to an email to the agency with the same data.
 */
export async function deliverLead(
  event: H3Event,
  opts: { path: '/leads/inquiries' | '/leads/ingest'; body: Record<string, unknown>; fallback: Parameters<typeof notifyAgency>[1] },
): Promise<LeadResult> {
  if (vesttaConfigured(event)) {
    try {
      const res = await vestta<{ lead_id?: number }>(event, opts.path, { method: 'POST', body: opts.body })
      return { ok: true, leadId: res?.lead_id, channel: 'vestta' }
    } catch (e) {
      if (e instanceof VesttaError && e.status === 409) return { ok: true, known: true, channel: 'vestta' }
      if (e instanceof VesttaError && e.status === 422) {
        console.error('[vestta] 422', JSON.stringify(e.detail))
        throw createError({ statusCode: 422, statusMessage: 'Invalid form', data: { fields: [{ path: 'phone', message: 'errors.phone' }] } })
      }
      console.error('[vestta] lead failed, falling back to email', e)
    }
  }
  const sent = await notifyAgency(event, opts.fallback)
  return { ok: true, channel: sent.delivered ? 'email' : 'log' }
}
