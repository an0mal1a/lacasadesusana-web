<script setup lang="ts">
definePageMeta({ i18n: { paths: { en: '/sell-your-home', es: '/vender-tu-casa' } } })
const { t } = useI18n()
const { form, errors, status, submit, reset, check } = useLeadForm('/api/forms/sell', sellSchema, {
  operation: 'venta',
  propertyType: 'villa',
  area: '',
  bedrooms: '',
  size: '',
  plot: '',
  expectedPrice: '',
  timeline: 'months',
  message: '',
})
const PTYPES = ['villa', 'finca', 'apartment', 'penthouse', 'townhouse', 'land', 'other'] as const
const steps = computed(() => [
  { title: t('sell.stepProperty'), keys: ['operation', 'propertyType', 'area'] },
  { title: t('sell.stepDetails'), keys: ['bedrooms', 'size', 'plot', 'expectedPrice', 'timeline'] },
])
useSeoMeta({ title: () => t('sell.metaTitle'), description: () => t('sell.metaDescription') })
</script>

<template>
  <FormPage :title="t('sell.title')" :lede="t('sell.lede')">
    <FormShell :form="form" :errors="errors" :status="status" :steps="steps" :check="check" :submit-label="t('sell.send')" :you-legend="t('sell.stepYou')" @submit="submit" @reset="reset">
      <template #step-0>
        <FormChoice v-model="form.operation" name="operation" :legend="t('sell.operation')" :options="(['venta', 'alquiler', 'ambas'] as const).map(o => ({ value: o, label: t(`sell.ops.${o}`) }))" />
        <FormChoice v-model="form.propertyType" name="propertyType" :legend="t('sell.propertyType')" :options="PTYPES.map(p => ({ value: p, label: t(`sell.ptypes.${p}`) }))" />
        <FormField id="area" :label="t('sell.area')" :error="errors.area">
          <template #default="{ describedBy, invalid }"><input id="area" v-model="form.area" class="input" list="areas-list" autocomplete="off" enterkeyhint="next" :placeholder="t('sell.areaPlaceholder')" :aria-invalid="invalid" :aria-describedby="describedBy" /></template>
        </FormField>
        <datalist id="areas-list"><option v-for="a in AREAS" :key="a" :value="a" /></datalist>
      </template>
      <template #step-1>
        <div class="grid gap-5 sm:grid-cols-2">
          <FormCount id="bedrooms" v-model="form.bedrooms" :label="t('sell.bedrooms')" :max="20" optional />
          <FormField id="expectedPrice" :label="t('sell.expectedPrice')" :error="errors.expectedPrice" optional>
            <template #default="{ describedBy, invalid }"><FormMoney id="expectedPrice" v-model="form.expectedPrice" :described-by="describedBy" :invalid="invalid" /></template>
          </FormField>
          <FormField id="size" :label="t('sell.size')" :error="errors.size" optional>
            <template #default="{ describedBy, invalid }"><input id="size" v-model="form.size" class="input tabular" inputmode="numeric" enterkeyhint="next" :aria-invalid="invalid" :aria-describedby="describedBy" /></template>
          </FormField>
          <FormField id="plot" :label="t('sell.plot')" :error="errors.plot" optional>
            <template #default="{ describedBy, invalid }"><input id="plot" v-model="form.plot" class="input tabular" inputmode="numeric" enterkeyhint="next" :aria-invalid="invalid" :aria-describedby="describedBy" /></template>
          </FormField>
        </div>
        <FormChoice v-model="form.timeline" name="timeline" :legend="t('sell.timeline')" :options="(['now', 'months', 'year', 'exploring'] as const).map(v => ({ value: v, label: t(`searchRequest.timelines.${v}`) }))" />
      </template>
    </FormShell>
    <template #aside>
      <SusanaAside>
        <div class="border-t border-line px-6 py-6">
          <p class="font-display text-[1.4rem]">{{ t('sell.promise') }}</p>
          <ol class="mt-4 space-y-3 text-[0.9375rem] text-muted">
            <li v-for="n in 3" :key="n" class="flex gap-3"><span class="tabular grid size-6 shrink-0 place-items-center rounded-full bg-stone text-[0.75rem] font-medium text-ink">{{ n }}</span>{{ t(`sell.promise${n}`) }}</li>
          </ol>
        </div>
      </SusanaAside>
    </template>
  </FormPage>
</template>
