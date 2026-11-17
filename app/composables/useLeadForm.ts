import type { z } from 'zod'

type Status = 'idle' | 'sending' | 'success' | 'known' | 'error'

/**
 * Shared behaviour for every lead form: client-side validation with the same zod schema
 * the server uses, anti-spam fields, submission and the resulting state.
 */
export function useLeadForm<S extends z.ZodObject<any>>(endpoint: string, schema: S, initial: Partial<z.input<S>>) {
  const { locale } = useI18n()
  const route = useRoute()
  const config = useRuntimeConfig()

  const blank = () => ({
    name: '',
    email: '',
    dialCode: locale.value === 'es' ? '+34' : '+44',
    phone: '',
    consent: false,
    website: '',
    ...initial,
  })

  const form = reactive<Record<string, any>>(blank())
  const errors = ref<Record<string, string>>({})
  const status = ref<Status>('idle')
  const startedAt = ref(0)
  onMounted(() => (startedAt.value = Date.now()))

  function validate(): boolean {
    const parsed = schema.safeParse({ ...form, locale: locale.value })
    errors.value = {}
    if (parsed.success) return true
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? 'form')
      if (!errors.value[key]) errors.value[key] = issue.message
    }
    return false
  }

  /** Validate only some fields (one step of a multi-step form). Errors outside `keys` are left untouched. */
  function check(keys: string[]): boolean {
    const parsed = schema.safeParse({ ...form, locale: locale.value })
    const next = Object.fromEntries(Object.entries(errors.value).filter(([k]) => !keys.includes(k)))
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? 'form')
        if (keys.includes(key) && !next[key]) next[key] = issue.message
      }
    }
    errors.value = next
    const ok = keys.every(k => !next[k])
    if (!ok) nextTick(() => document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus())
    return ok
  }

  async function submit() {
    if (status.value === 'sending') return
    if (!validate()) {
      status.value = 'idle'
      nextTick(() => document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus())
      return
    }
    status.value = 'sending'
    try {
      const res = await $fetch<{ ok: boolean; known?: boolean }>(endpoint, {
        method: 'POST',
        body: { ...form, locale: locale.value, page: `${config.public.siteUrl}${route.fullPath}`, startedAt: startedAt.value },
      })
      status.value = res.known ? 'known' : 'success'
    } catch (e: any) {
      const fields = e?.data?.data?.fields as { path: string; message: string }[] | undefined
      if (e?.statusCode === 422 && fields?.length) {
        errors.value = Object.fromEntries(fields.map(f => [f.path.split('.')[0], f.message]))
        status.value = 'idle'
      } else {
        status.value = 'error'
      }
    }
  }

  function reset() {
    Object.assign(form, blank())
    errors.value = {}
    status.value = 'idle'
    startedAt.value = Date.now()
  }

  return { form, errors, status, submit, reset, check }
}
