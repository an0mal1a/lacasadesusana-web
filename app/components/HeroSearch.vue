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

const sel = 'peer absolute inset-0 size-full cursor-pointer appearance-none bg-transparent pl-[3.25rem] pr-8 pt-5 text-[0.9375rem] text-ink outline-none'
</script>

<template>
  <form
    class="grid gap-1 rounded-[1.5rem] bg-white p-2 text-ink shadow-[0_30px_60px_-30px_rgb(23_34_31/0.45)] lg:grid-cols-[auto_1.2fr_1fr_1fr_auto] lg:items-center lg:rounded-full"
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

    <label class="field relative block h-16 rounded-full transition-colors hover:bg-stone">
      <MapPin class="pointer-events-none absolute left-5 top-1/2 size-[1.15rem] -translate-y-1/2 text-muted" :stroke-width="1.6" aria-hidden="true" />
      <span class="label pointer-events-none absolute left-[3.25rem] top-3 text-muted">{{ t('search.area') }}</span>
      <select v-model="city" :class="sel">
        <option value="">{{ t('search.anyArea') }}</option>
        <option v-for="a in areas" :key="a.city" :value="a.city">{{ a.city }} ({{ a.count }})</option>
      </select>
      <ChevronDown class="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-faint" aria-hidden="true" />
    </label>

    <div class="grid grid-cols-2 gap-1 lg:contents">
      <label class="field relative block h-16 rounded-full transition-colors hover:bg-stone">
        <Home class="pointer-events-none absolute left-5 top-1/2 size-[1.15rem] -translate-y-1/2 text-muted" :stroke-width="1.6" aria-hidden="true" />
        <span class="label pointer-events-none absolute left-[3.25rem] top-3 text-muted">{{ t('search.type') }}</span>
        <select v-model="type" :class="sel">
          <option value="">{{ t('search.anyType') }}</option>
          <option v-for="ty in TYPES" :key="ty" :value="ty">{{ t(`catalogue.types.${ty}`) }}</option>
        </select>
        <ChevronDown class="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-faint" aria-hidden="true" />
      </label>
      <label class="field relative block h-16 rounded-full transition-colors hover:bg-stone">
        <Euro class="pointer-events-none absolute left-5 top-1/2 size-[1.15rem] -translate-y-1/2 text-muted" :stroke-width="1.6" aria-hidden="true" />
        <span class="label pointer-events-none absolute left-[3.25rem] top-3 text-muted">{{ t('search.budget') }}</span>
        <select v-model="maxPrice" :class="sel" class="tabular">
          <option value="">{{ t('search.anyBudget') }}</option>
          <option v-for="b in budgets" :key="b" :value="String(b)">{{ money(b) }}{{ operation === 'alquiler' ? ` ${t('search.perMonth')}` : '' }}</option>
        </select>
        <ChevronDown class="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-faint" aria-hidden="true" />
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
