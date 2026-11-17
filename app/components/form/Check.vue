<script setup lang="ts">
const model = defineModel<boolean>({ required: true })
defineProps<{ id: string; error?: string }>()
const { t } = useI18n()
</script>

<template>
  <div>
    <label :for="id" class="flex cursor-pointer items-start gap-3 text-[0.9375rem] leading-snug text-ink">
      <input :id="id" v-model="model" type="checkbox" class="check mt-0.5" :aria-invalid="!!error" :aria-describedby="error ? `${id}-err` : undefined" />
      <span><slot /></span>
    </label>
    <p v-if="error" :id="`${id}-err`" class="mt-1.5 pl-8 text-[0.8125rem] font-medium text-alert" role="alert">{{ t(error) }}</p>
  </div>
</template>

<style scoped>
.check {
  appearance: none; flex: none; width: 1.25rem; height: 1.25rem; border: 1px solid #cfcac1; background: var(--color-paper); border-radius: 6px; display: grid; place-content: center;
  transition: background-color 0.2s, border-color 0.2s;
}
.check::after { content: ''; width: 0.85rem; height: 0.85rem; background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23FFFFFF' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 6 9 17l-5-5'/%3E%3C/svg%3E") center / contain no-repeat; transform: scale(0); transition: transform 0.2s var(--ease-out); }
.check:checked { background: var(--color-ink); border-color: var(--color-ink); }
.check:checked::after { transform: scale(1); }
.check[aria-invalid='true'] { border-color: var(--color-alert); }
</style>
