<script setup lang="ts">
import { ChevronDown, Euro, Home, MapPin, Search } from 'lucide-vue-next'

/** The working search: a white pill on desktop, a stacked card on phones. Routes to the catalogue with Vestta filters. */
const { t } = useI18n()
const localePath = useLocalePath()
const { money } = useFormat()
const { data: areas } = await useFetch('/api/areas', { key: 'areas', default: () => [] })

const operation = ref<'venta' | 'alquiler'>('venta')
const city = ref('')
const maxPrice = ref('')
const type = ref('')
const TYPES = ['casa', 'apartamento', 'terreno'] as const

const budgets = computed(() =>
  operation.value === 'venta'
    ? [750_000, 1_000_000, 1_500_000, 2_000_000, 3_000_000, 5_000_000, 10_000_000]
    : [2_000, 3_500, 5_000, 8_000, 12_000, 20_000],
)
watch(operation, () => (maxPrice.value = ''))

function search() {
  navigateTo(
    localePath({
      name: 'properties',
      query: Object.fromEntries(
        Object.entries({ operation: operation.value, city: city.value, max_price: maxPrice.value, type: type.value }).filter(([, v]) => v),
      ),
    }),
  )
}

const sel = 'peer absolute inset-0 size-full cursor-pointer appearance-none bg-transparent pl-[3.25rem] pr-10 pt-5 text-[0.9375rem] text-ink outline-none'
// One filter: a row of the framed list on phones, a rounded cell of the pill on desktop.
const row = 'field relative block h-[3.75rem] transition-colors hover:bg-stone lg:h-16 lg:rounded-full lg:border-0'
const icon = 'pointer-events-none absolute left-5 top-1/2 size-[1.15rem] -translate-y-1/2 text-muted'
const caption = 'label pointer-events-none absolute left-[3.25rem] top-2.5 text-muted lg:top-3'
const chevron = 'pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-faint'
</script>

<template>
  <!-- Phones and tablets: the operation toggle, then the three filters as rows of one framed list, then the button.
       Desktop: one white pill with everything in a row. -->
  <form
    class="grid gap-2.5 rounded-[1.75rem] bg-white p-2.5 text-ink shadow-[0_30px_60px_-30px_rgb(23_34_31/0.45)] lg:grid-cols-[auto_1.2fr_1fr_1fr_auto] lg:items-center lg:gap-1 lg:rounded-full lg:p-2"
    role="search"
    @submit.prevent="search"
  >
    <fieldset class="relative grid grid-cols-2 rounded-full bg-stone p-1">
      <legend class="sr-only">{{ t('search.operation') }}</legend>
      <span
        class="absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-ink transition-transform duration-500 ease-[var(--ease-out)]"
        :class="operation === 'alquiler' && 'translate-x-full'"
        aria-hidden="true"
      />
      <label v-for="op in (['venta', 'alquiler'] as const)" :key="op" class="relative z-10 flex cursor-pointer items-center justify-center px-6 py-2.5">
        <input v-model="operation" type="radio" name="operation" :value="op" class="peer sr-only" />
        <span class="text-[0.9375rem] font-medium transition-colors duration-300 peer-focus-visible:underline" :class="operation === op ? 'text-white' : 'text-muted'">
          {{ op === 'venta' ? t('search.buy') : t('search.rent') }}
        </span>
      </label>
    </fieldset>

    <div class="divide-y divide-line overflow-hidden rounded-[1.25rem] ring-1 ring-line lg:contents">
      <label :class="row">
        <MapPin :class="icon" :stroke-width="1.6" aria-hidden="true" />
        <span :class="caption">{{ t('search.area') }}</span>
        <select v-model="city" :class="sel">
          <option value="">{{ t('search.anyArea') }}</option>
          <option v-for="a in areas" :key="a.city" :value="a.city">{{ a.city }} ({{ a.count }})</option>
        </select>
        <ChevronDown :class="chevron" aria-hidden="true" />
      </label>
      <label :class="row">
        <Home :class="icon" :stroke-width="1.6" aria-hidden="true" />
        <span :class="caption">{{ t('search.type') }}</span>
        <select v-model="type" :class="sel">
          <option value="">{{ t('search.anyType') }}</option>
          <option v-for="ty in TYPES" :key="ty" :value="ty">{{ t(`catalogue.types.${ty}`) }}</option>
        </select>
        <ChevronDown :class="chevron" aria-hidden="true" />
      </label>
      <label :class="row">
        <Euro :class="icon" :stroke-width="1.6" aria-hidden="true" />
        <span :class="caption">{{ t('search.budget') }}</span>
        <select v-model="maxPrice" :class="sel" class="tabular">
          <option value="">{{ t('search.anyBudget') }}</option>
          <option v-for="b in budgets" :key="b" :value="String(b)">{{ money(b) }}{{ operation === 'alquiler' ? ` ${t('search.perMonth')}` : '' }}</option>
        </select>
        <ChevronDown :class="chevron" aria-hidden="true" />
      </label>
    </div>

    <button type="submit" class="btn h-14 px-8 lg:h-[3.75rem]">
      <Search class="size-[1.1rem]" :stroke-width="1.8" aria-hidden="true" />
      {{ t('search.submit') }}
    </button>
  </form>
</template>

<style scoped>
.field:has(select:focus-visible) { outline: 2px solid var(--color-ink); outline-offset: -2px; }
</style>
