<script setup lang="ts">
/** Euro amount typed as digits, shown with thousands separators as you type. The model keeps the formatted string; the schema strips non-digits. */
const model = defineModel<string>({ required: true })
const props = defineProps<{ id: string; placeholder?: string; describedBy?: string; invalid?: boolean; suffix?: string }>()
const { locale } = useI18n()

const ph = computed(() => {
  const d = props.placeholder?.replace(/\D/g, '')
  return d ? new Intl.NumberFormat(locale.value === 'es' ? 'es-ES' : 'en-GB').format(Number(d)) : props.placeholder
})

function onInput(e: Event) {
  const el = e.target as HTMLInputElement
  const digits = el.value.replace(/\D/g, '').slice(0, 10)
  const formatted = digits ? new Intl.NumberFormat(locale.value === 'es' ? 'es-ES' : 'en-GB').format(Number(digits)) : ''
  model.value = formatted
  el.value = formatted
}
</script>

<template>
  <div class="relative">
    <input
      :id="id"
      :value="model"
      class="input tabular pr-16"
      inputmode="numeric"
      autocomplete="off"
      enterkeyhint="next"
      :placeholder="ph"
      :aria-describedby="describedBy"
      :aria-invalid="invalid"
      @input="onInput"
    />
    <span class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[0.9375rem] text-muted">€{{ suffix ? ` ${suffix}` : '' }}</span>
  </div>
</template>
