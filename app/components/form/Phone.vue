<script setup lang="ts">
/** Country code + national number: foreign clients are the norm, and Vestta reads un-prefixed numbers as Spanish. */
const dial = defineModel<string>('dial', { required: true })
const phone = defineModel<string>('phone', { required: true })
defineProps<{ error?: string }>()
const { t } = useI18n()
</script>

<template>
  <FormField id="phone" :label="t('form.phone')" :error="error">
    <template #default="{ describedBy, invalid }">
      <div class="grid grid-cols-[7.5rem_1fr] gap-2">
        <select v-model="dial" class="input tabular" :aria-label="t('form.dialCode')" autocomplete="tel-country-code">
          <option v-for="d in DIAL_CODES" :key="d.code" :value="d.code">{{ d.label }}</option>
        </select>
        <input id="phone" v-model="phone" class="input tabular" type="tel" autocomplete="tel-national" inputmode="tel" :aria-invalid="invalid" :aria-describedby="describedBy" />
      </div>
    </template>
  </FormField>
</template>
