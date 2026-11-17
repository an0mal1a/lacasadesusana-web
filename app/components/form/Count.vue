<script setup lang="ts">
import { Minus, Plus } from 'lucide-vue-next'

/** A − value + counter: easier than typing a number on a phone. Empty means "any". */
const model = defineModel<string>({ required: true })
const props = withDefaults(defineProps<{ id: string; label: string; min?: number; max?: number; plus?: boolean; optional?: boolean }>(), { min: 1, max: 12, plus: false, optional: false })
const { t } = useI18n()
const n = computed(() => (model.value === '' ? null : Number(model.value)))
const dec = () => (model.value = n.value === null || n.value <= props.min ? '' : String(n.value - 1))
const inc = () => (model.value = String(n.value === null ? props.min : Math.min(props.max, n.value + 1)))
</script>

<template>
  <div role="group" :aria-labelledby="`${id}-l`">
    <p :id="`${id}-l`" class="mb-2 flex items-baseline justify-between gap-3 text-[0.875rem] font-medium">
      {{ label }}
      <span v-if="optional" class="text-[0.75rem] font-normal text-muted">{{ t('form.optional') }}</span>
    </p>
    <div class="flex h-[3.25rem] items-center justify-between rounded-[0.875rem] border border-line bg-white p-1.5">
      <button type="button" class="grid size-10 place-items-center rounded-full transition-colors hover:bg-stone disabled:opacity-30" :aria-label="t('form.decrease')" :disabled="n === null" @click="dec"><Minus class="size-4" :stroke-width="1.8" /></button>
      <output :id="id" class="tabular min-w-16 text-center text-[1rem]" aria-live="polite">{{ n === null ? t('form.any') : `${n}${plus ? '+' : ''}` }}</output>
      <button type="button" class="grid size-10 place-items-center rounded-full transition-colors hover:bg-stone disabled:opacity-30" :aria-label="t('form.increase')" :disabled="n !== null && n >= max" @click="inc"><Plus class="size-4" :stroke-width="1.8" /></button>
    </div>
  </div>
</template>
