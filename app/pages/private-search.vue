<script setup lang="ts">
definePageMeta({ i18n: { paths: { en: '/private-search', es: '/busqueda-privada' } } })
const { t } = useI18n()
const route = useRoute()
const { form, errors, status, submit, reset, check } = useLeadForm('/api/forms/search-request', searchRequestSchema, {
  operation: route.query.operation === 'alquiler' ? 'alquiler' : 'venta',
  types: ['casa'],
  areas: [],
  priceMin: '',
  priceMax: '',
  bedroomsMin: '',
  mustHaves: [],
  timeline: 'months',
  message: '',
})
const MUST = ['sea-view', 'pool', 'walk-beach', 'privacy', 'tourist-licence', 'guest-house', 'near-town', 'new-build']
const steps = computed(() => [
  { title: t('searchRequest.stepWhat'), keys: ['operation', 'types'] },
  { title: t('searchRequest.stepWhere'), keys: ['areas'] },
  { title: t('searchRequest.stepBudget'), keys: ['priceMin', 'priceMax', 'bedroomsMin', 'mustHaves', 'timeline'] },
])
useSeoMeta({ title: () => t('searchRequest.metaTitle'), description: () => t('searchRequest.metaDescription') })
</script>

<template>
  <FormPage :title="t('searchRequest.title')" :lede="t('searchRequest.lede')">
    <FormShell :form="form" :errors="errors" :status="status" :steps="steps" :check="check" :submit-label="t('searchRequest.send')" :you-legend="t('searchRequest.stepYou')" @submit="submit" @reset="reset">
      <template #step-0>
        <FormChoice v-model="form.operation" name="operation" :legend="t('searchRequest.operation')" :options="[{ value: 'venta', label: t('searchRequest.buy') }, { value: 'alquiler', label: t('searchRequest.rent') }]" />
        <FormChoice v-model="form.types" name="types" multiple :error="errors.types" :legend="t('searchRequest.types')" :options="[{ value: 'casa', label: t('searchRequest.typeCasa') }, { value: 'apartamento', label: t('searchRequest.typeApartamento') }, { value: 'terreno', label: t('searchRequest.typeTerreno') }]" />
      </template>
      <template #step-1>
        <FormChoice v-model="form.areas" name="areas" multiple optional :hint="t('searchRequest.areasHint')" :legend="t('searchRequest.areas')" :options="AREAS.map(a => ({ value: a, label: a }))" />
      </template>
      <template #step-2>
        <div class="grid gap-5 sm:grid-cols-2">
          <FormField id="priceMin" :label="t('searchRequest.priceMin')" :error="errors.priceMin" optional>
            <template #default="{ describedBy, invalid }"><FormMoney id="priceMin" v-model="form.priceMin" :placeholder="form.operation === 'venta' ? '1.000.000' : '3.000'" :suffix="form.operation === 'alquiler' ? t('search.perMonth') : ''" :described-by="describedBy" :invalid="invalid" /></template>
          </FormField>
          <FormField id="priceMax" :label="t('searchRequest.priceMax')" :error="errors.priceMax" optional>
            <template #default="{ describedBy, invalid }"><FormMoney id="priceMax" v-model="form.priceMax" :placeholder="form.operation === 'venta' ? '3.000.000' : '8.000'" :suffix="form.operation === 'alquiler' ? t('search.perMonth') : ''" :described-by="describedBy" :invalid="invalid" /></template>
          </FormField>
        </div>
        <FormCount id="bedroomsMin" v-model="form.bedroomsMin" :label="t('searchRequest.bedroomsMin')" plus optional class="sm:max-w-xs" />
        <FormChoice v-model="form.mustHaves" name="mustHaves" multiple optional :legend="t('searchRequest.mustHaves')" :options="MUST.map(m => ({ value: m, label: t(`searchRequest.must.${m}`) }))" />
        <FormChoice v-model="form.timeline" name="timeline" :legend="t('searchRequest.timeline')" :options="(['now', 'months', 'year', 'exploring'] as const).map(v => ({ value: v, label: t(`searchRequest.timelines.${v}`) }))" />
      </template>
    </FormShell>
    <template #aside><SusanaAside /></template>
  </FormPage>
</template>
