<script setup lang="ts">
/** Choice chips: single (radio) or multiple (checkbox). The chosen chip turns ink. */
const props = withDefaults(
  defineProps<{ name: string; legend: string; options: { value: string; label: string }[]; multiple?: boolean; error?: string; hint?: string; optional?: boolean }>(),
  { multiple: false },
)
const model = defineModel<string | string[]>({ required: true })
const { t } = useI18n()

function toggle(v: string) {
  if (!props.multiple) return (model.value = v)
  const cur = Array.isArray(model.value) ? model.value : []
  model.value = cur.includes(v) ? cur.filter(x => x !== v) : [...cur, v]
}
const checked = (v: string) => (Array.isArray(model.value) ? model.value.includes(v) : model.value === v)
</script>

<template>
  <fieldset :aria-invalid="!!error" :aria-describedby="error ? `${name}-err` : hint ? `${name}-hint` : undefined">
    <legend class="mb-2 flex w-full items-baseline justify-between text-[0.875rem] font-medium text-ink">
      {{ legend }}
      <span v-if="optional" class="text-[0.75rem] font-normal text-muted">{{ t('form.optional') }}</span>
    </legend>
    <div class="flex flex-wrap gap-2">
      <label v-for="o in options" :key="o.value" class="chip" :class="{ on: checked(o.value) }">
        <input
          :type="multiple ? 'checkbox' : 'radio'"
          :name="name"
          :value="o.value"
          :checked="checked(o.value)"
          class="sr-only"
          @change="toggle(o.value)"
        />
        {{ o.label }}
      </label>
    </div>
    <p v-if="hint && !error" :id="`${name}-hint`" class="mt-1.5 text-[0.8125rem] text-muted">{{ hint }}</p>
    <p v-if="error" :id="`${name}-err`" class="mt-1.5 text-[0.8125rem] font-medium text-alert" role="alert">{{ t(error) }}</p>
  </fieldset>
</template>

<style scoped>
.chip {
  position: relative; display: inline-flex; align-items: center; min-height: 2.75rem; padding: 0.55rem 1.1rem;
  border: 1px solid var(--color-line); background: var(--color-paper); color: var(--color-ink);
  font-size: 0.9375rem; cursor: pointer; border-radius: 999px; user-select: none;
  transition: background-color 0.3s var(--ease-soft), color 0.3s var(--ease-soft), border-color 0.3s;
}
.chip:hover { border-color: #cfcac1; }
.chip.on { background: var(--color-ink); border-color: var(--color-ink); color: var(--color-paper); }
.chip:has(input:focus-visible) { outline: 2px solid var(--color-ink); outline-offset: 2px; }
</style>
