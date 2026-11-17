<script setup lang="ts">
/** Label + control slot + hint/error, wired for accessibility.  */
const props = defineProps<{ id: string; label: string; error?: string; hint?: string; optional?: boolean }>()
const { t } = useI18n()
const describedBy = computed(() => [props.hint && `${props.id}-hint`, props.error && `${props.id}-err`].filter(Boolean).join(' ') || undefined)
</script>

<template>
  <div class="field" :class="{ 'has-error': !!error }">
    <label :for="id" class="mb-2 flex items-baseline justify-between gap-3 text-[0.875rem] font-medium text-ink">
      {{ label }}
      <span v-if="optional" class="text-[0.75rem] font-normal text-muted">{{ t('form.optional') }}</span>
    </label>
    <slot :id="id" :described-by="describedBy" :invalid="!!error" />
    <p v-if="hint && !error" :id="`${id}-hint`" class="mt-1.5 text-[0.8125rem] text-muted">{{ hint }}</p>
    <p v-if="error" :id="`${id}-err`" class="mt-1.5 text-[0.8125rem] font-medium text-alert" role="alert">{{ t(error) }}</p>
  </div>
</template>
