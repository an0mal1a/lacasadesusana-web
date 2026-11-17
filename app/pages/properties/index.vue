<script setup lang="ts">
import { ArrowRight, ChevronDown, SlidersHorizontal, X } from 'lucide-vue-next'

definePageMeta({ i18n: { paths: { en: '/properties', es: '/propiedades' } } })

const { t, locale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const router = useRouter()
const { money } = useFormat()

const PAGE = 12
const q = computed(() => ({
  operation: (route.query.operation as string) || undefined,
  type: (route.query.type as string) || undefined,
  city: (route.query.city as string) || undefined,
  max_price: (route.query.max_price as string) || undefined,
  min_bedrooms: (route.query.min_bedrooms as string) || undefined,
  sort: (route.query.sort as string) || undefined,
}))
const pages = ref(1)
watch(q, () => (pages.value = 1))

const { data, status } = await useFetch('/api/properties', {
  key: () => `catalogue-${locale.value}-${JSON.stringify(q.value)}-${pages.value}`,
  query: computed(() => ({ ...q.value, limit: PAGE * pages.value, lang: locale.value })),
})
const { data: areas } = await useFetch('/api/areas', { key: 'areas', default: () => [] })

const items = computed(() => data.value?.items ?? [])
const count = computed(() => data.value?.count ?? 0)
const hasFilters = computed(() => Object.values(q.value).some(Boolean))

function set(key: string, value: string) {
  router.replace({ query: { ...route.query, [key]: value || undefined } })
}

const budgets = computed(() =>
  q.value.operation === 'alquiler' ? [2000, 3500, 5000, 8000, 12000, 20000] : [750000, 1000000, 1500000, 2000000, 3000000, 5000000, 10000000],
)
const types = ['casa', 'apartamento', 'terreno', 'local', 'edificio'] as const

const heading = computed(() => {
  const title = q.value.operation === 'venta' ? t('catalogue.titleBuy') : q.value.operation === 'alquiler' ? t('catalogue.titleRent') : t('catalogue.title')
  return q.value.city ? t('catalogue.in', { title, place: q.value.city }) : title
})
const showFilters = ref(false)

useSeoMeta({
  title: () => (q.value.city ? heading.value : t('catalogue.metaTitle')),
  description: () => t('catalogue.metaDescription'),
})
useSchemaOrg([
  defineItemList({
    itemListElement: () => items.value.map((p, i) => ({ position: i + 1, url: localePath({ name: 'properties-slug', params: { slug: p.slug } }), name: p.title })),
  }),
])

const sel = 'input h-12 min-h-0 rounded-full py-0 pl-5 text-[0.9375rem]'
</script>

<template>
  <div>
    <section class="wrap pb-10 pt-14 md:pb-14 md:pt-20">
      <h1 class="hero-in font-display text-display font-light tracking-[-0.025em]">{{ heading }}</h1>
      <p class="hero-in mt-4 text-[1.125rem] text-muted" style="--d: 100ms" aria-live="polite">
        <span class="tabular">{{ t('catalogue.count', { n: count }, count) }}</span>
      </p>
    </section>

    <!-- Filters -->
    <div class="sticky top-[4.5rem] z-30 border-y border-line bg-white/90 backdrop-blur-xl lg:top-20">
      <div class="wrap">
        <button type="button" class="flex w-full items-center justify-between py-4 lg:hidden" :aria-expanded="showFilters" aria-controls="filters" @click="showFilters = !showFilters">
          <span class="flex items-center gap-2 font-medium"><SlidersHorizontal class="size-4" :stroke-width="1.6" /> {{ t('catalogue.filters') }}</span>
          <ChevronDown class="size-4 transition-transform duration-300" :class="showFilters && 'rotate-180'" />
        </button>
        <div id="filters" class="grid-cols-2 gap-2.5 pb-4 lg:grid lg:grid-cols-[auto_repeat(5,minmax(0,1fr))_auto] lg:items-center lg:py-3.5" :class="showFilters ? 'grid' : 'hidden'">
          <fieldset class="relative col-span-2 grid grid-cols-3 rounded-full bg-stone p-1 lg:col-span-1">
            <legend class="sr-only">{{ t('search.operation') }}</legend>
            <button
              v-for="op in ([['', t('catalogue.all')], ['venta', t('search.buy')], ['alquiler', t('search.rent')]] as const)"
              :key="op[0]"
              type="button"
              class="h-10 rounded-full px-5 text-[0.9375rem] transition-colors duration-300"
              :class="(q.operation ?? '') === op[0] ? 'bg-ink text-white' : 'text-muted hover:text-ink'"
              :aria-pressed="(q.operation ?? '') === op[0]"
              @click="set('operation', op[0])"
            >{{ op[1] }}</button>
          </fieldset>
          <label class="block">
            <span class="sr-only">{{ t('search.area') }}</span>
            <select :value="q.city ?? ''" :class="sel" @change="set('city', ($event.target as HTMLSelectElement).value)">
              <option value="">{{ t('search.anyArea') }}</option>
              <option v-for="a in areas" :key="a.city" :value="a.city">{{ a.city }} ({{ a.count }})</option>
            </select>
          </label>
          <label class="block">
            <span class="sr-only">{{ t('catalogue.type') }}</span>
            <select :value="q.type ?? ''" :class="sel" @change="set('type', ($event.target as HTMLSelectElement).value)">
              <option value="">{{ t('catalogue.anyType') }}</option>
              <option v-for="ty in types" :key="ty" :value="ty">{{ t(`catalogue.types.${ty}`) }}</option>
            </select>
          </label>
          <label class="block">
            <span class="sr-only">{{ t('search.budget') }}</span>
            <select :value="q.max_price ?? ''" :class="sel" class="tabular" @change="set('max_price', ($event.target as HTMLSelectElement).value)">
              <option value="">{{ t('search.anyBudget') }}</option>
              <option v-for="b in budgets" :key="b" :value="String(b)">{{ money(b) }}</option>
            </select>
          </label>
          <label class="block">
            <span class="sr-only">{{ t('search.bedrooms') }}</span>
            <select :value="q.min_bedrooms ?? ''" :class="sel" @change="set('min_bedrooms', ($event.target as HTMLSelectElement).value)">
              <option value="">{{ t('search.bedrooms') }}: {{ t('search.anyBedrooms') }}</option>
              <option v-for="n in [2, 3, 4, 5, 6]" :key="n" :value="String(n)">{{ t('search.bedroomsN', { n }) }}</option>
            </select>
          </label>
          <label class="block">
            <span class="sr-only">{{ t('catalogue.sort') }}</span>
            <select :value="q.sort ?? ''" :class="sel" @change="set('sort', ($event.target as HTMLSelectElement).value)">
              <option value="">{{ t('catalogue.sortRecent') }}</option>
              <option value="price_asc">{{ t('catalogue.sortPriceAsc') }}</option>
              <option value="price_desc">{{ t('catalogue.sortPriceDesc') }}</option>
            </select>
          </label>
          <button v-if="hasFilters" type="button" class="col-span-2 flex h-12 items-center justify-center gap-2 rounded-full px-4 text-[0.9375rem] text-muted transition-colors hover:bg-stone hover:text-ink lg:col-span-1" @click="router.replace({ query: {} })">
            <X class="size-4" /> {{ t('catalogue.clear') }}
          </button>
        </div>
      </div>
    </div>

    <section class="wrap min-h-[50vh] pb-28 pt-12 md:pt-16">
      <div v-if="items.length" class="grid gap-x-6 gap-y-14 transition-opacity duration-300 sm:grid-cols-2 xl:grid-cols-3" :class="status === 'pending' && 'opacity-50'">
        <PropertyCard v-for="(p, i) in items" :key="p.id" :property="p" :eager="i < 3" :delay="(i % 3) * 100" />
      </div>

      <div v-else class="mx-auto max-w-3xl rounded-[var(--radius-hero)] bg-stone px-6 py-16 text-center sm:px-12">
        <p class="font-display text-[2rem] font-light leading-tight">{{ t('catalogue.empty') }}</p>
        <p class="mx-auto mt-4 max-w-xl text-[1.0625rem] text-muted">{{ t('catalogue.emptyBody') }}</p>
        <div class="mt-8 flex flex-wrap justify-center gap-3">
          <NuxtLink :to="localePath('private-search')" class="btn group">{{ t('nav.search') }} <ArrowRight class="nudge size-4" /></NuxtLink>
          <button v-if="hasFilters" type="button" class="btn btn-ghost" @click="router.replace({ query: {} })">{{ t('catalogue.clear') }}</button>
        </div>
      </div>

      <div v-if="items.length < count" class="mt-20 flex justify-center">
        <button type="button" class="btn btn-ghost" :disabled="status === 'pending'" @click="pages++">
          {{ t('catalogue.more') }} <span class="tabular">({{ count - items.length }})</span>
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero-in { animation: rise 1.1s var(--ease-out) both; animation-delay: var(--d, 0ms); }
@keyframes rise { from { opacity: 0; transform: translateY(20px); } }
</style>
