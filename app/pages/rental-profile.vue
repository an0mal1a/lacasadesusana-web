<script setup lang="ts">
definePageMeta({ i18n: { paths: { en: '/rental-profile', es: '/perfil-de-alquiler' } } })
const { t } = useI18n()
const route = useRoute()
const propertyId = Number(route.query.property) || undefined
const { form, errors, status, submit, reset, check } = useLeadForm('/api/forms/rental-profile', rentalProfileSchema, {
  rentalType: 'anual',
  budget: '',
  moveIn: '',
  stayMonths: '',
  occupants: '',
  bedrooms: '',
  employment: 'indefinido',
  monthlyIncome: '',
  pets: false,
  petsDetail: '',
  smoker: false,
  guarantor: false,
  area: '',
  message: '',
  benchConsent: true,
  propertyId: propertyId ?? '',
})
const EMPLOYMENT = ['indefinido', 'temporal', 'funcionario', 'autonomo', 'pensionista', 'estudiante', 'desempleado', 'otro'] as const
const steps = computed(() => [
  { title: t('rental.stepStay'), keys: ['rentalType', 'budget', 'moveIn', 'stayMonths', 'area', 'bedrooms'] },
  { title: t('rental.stepHousehold'), keys: ['occupants', 'monthlyIncome', 'employment', 'pets', 'petsDetail', 'smoker', 'guarantor'] },
])
useSeoMeta({ title: () => t('rental.metaTitle'), description: () => t('rental.metaDescription') })
</script>

<template>
  <FormPage :title="t('rental.title')" :lede="t('rental.lede')">
    <FormShell :form="form" :errors="errors" :status="status" :steps="steps" :check="check" :submit-label="t('rental.send')" :you-legend="t('rental.stepYou')" @submit="submit" @reset="reset">
      <template #step-0>
        <p v-if="propertyId" class="inline-block rounded-full bg-white px-4 py-2 text-[0.9375rem] tabular ring-1 ring-line">{{ t('rental.forProperty', { id: propertyId }) }}</p>
        <FormChoice v-model="form.rentalType" name="rentalType" :legend="t('rental.rentalType')" :options="[{ value: 'anual', label: t('rental.anual') }, { value: 'temporal', label: t('rental.temporal') }]" />
        <div class="grid gap-5 sm:grid-cols-2">
          <FormField id="budget" :label="t('rental.budget')" :error="errors.budget" optional>
            <template #default="{ describedBy, invalid }"><FormMoney id="budget" v-model="form.budget" placeholder="4.000" :suffix="t('search.perMonth')" :described-by="describedBy" :invalid="invalid" /></template>
          </FormField>
          <FormField id="moveIn" :label="t('rental.moveIn')" :error="errors.moveIn" optional>
            <template #default="{ describedBy, invalid }"><input id="moveIn" v-model="form.moveIn" class="input tabular" type="date" :aria-invalid="invalid" :aria-describedby="describedBy" /></template>
          </FormField>
        </div>
        <div class="grid gap-5 sm:grid-cols-2">
          <FormCount id="stayMonths" v-model="form.stayMonths" :label="t('rental.stayMonths')" :max="60" optional />
          <FormCount id="bedrooms" v-model="form.bedrooms" :label="t('rental.bedrooms')" plus optional />
        </div>
        <FormChoice v-model="form.area" name="area" optional :legend="t('rental.area')" :options="[{ value: '', label: t('search.anyArea') }, ...AREAS.map(a => ({ value: a, label: a }))]" />
      </template>
      <template #step-1>
        <div class="grid gap-5 sm:grid-cols-2">
          <FormCount id="occupants" v-model="form.occupants" :label="t('rental.occupants')" :max="12" optional />
          <FormField id="monthlyIncome" :label="t('rental.income')" :error="errors.monthlyIncome" :hint="t('rental.incomeHint')" optional>
            <template #default="{ describedBy, invalid }"><FormMoney id="monthlyIncome" v-model="form.monthlyIncome" :suffix="t('search.perMonth')" :described-by="describedBy" :invalid="invalid" /></template>
          </FormField>
        </div>
        <FormChoice v-model="form.employment" name="employment" :legend="t('rental.employment')" :options="EMPLOYMENT.map(e => ({ value: e, label: t(`rental.employments.${e}`) }))" />
        <div class="space-y-4 rounded-2xl bg-white p-5 ring-1 ring-line">
          <FormCheck id="pets" v-model="form.pets">{{ t('rental.pets') }}</FormCheck>
          <FormField v-if="form.pets" id="petsDetail" :label="t('rental.petsDetail')" optional class="pl-8">
            <template #default="{ describedBy }"><input id="petsDetail" v-model="form.petsDetail" class="input" maxlength="120" :aria-describedby="describedBy" /></template>
          </FormField>
          <FormCheck id="smoker" v-model="form.smoker">{{ t('rental.smoker') }}</FormCheck>
          <FormCheck id="guarantor" v-model="form.guarantor">{{ t('rental.guarantor') }}</FormCheck>
        </div>
      </template>
      <template #after-contact>
        <FormCheck id="benchConsent" v-model="form.benchConsent">{{ t('rental.benchConsent') }}</FormCheck>
      </template>
    </FormShell>
    <template #aside><SusanaAside /></template>
  </FormPage>
</template>
