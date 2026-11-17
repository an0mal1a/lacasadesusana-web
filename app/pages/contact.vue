<script setup lang="ts">
definePageMeta({ i18n: { paths: { en: '/contact', es: '/contacto' } } })
const { t } = useI18n()
const route = useRoute()
const subjects = ['buy', 'rent', 'sell', 'other'] as const
const initialSubject = subjects.includes(route.query.subject as any) ? (route.query.subject as (typeof subjects)[number]) : 'buy'
const { form, errors, status, submit, reset } = useLeadForm('/api/forms/contact', contactSchema, { subject: initialSubject, message: '' })
useSeoMeta({ title: () => t('contact.metaTitle'), description: () => t('contact.metaDescription') })
</script>

<template>
  <FormPage :title="t('contact.title')" :lede="t('contact.lede')">
    <FormShell :form="form" :errors="errors" :status="status" :submit-label="t('form.send')" :message-label="t('form.message')" message-required @submit="submit" @reset="reset">
      <FormChoice v-model="form.subject" name="subject" :legend="t('contact.subject')" :options="subjects.map(s => ({ value: s, label: t(`contact.subjects.${s}`) }))" />
    </FormShell>
    <template #aside><SusanaAside /></template>
  </FormPage>
</template>
