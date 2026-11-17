<script setup lang="ts">
import { ArrowLeft, ArrowRight, Bath, BedDouble, ChevronLeft, ChevronRight, Grid2x2, Maximize, MapPin, Share2, Trees, X } from 'lucide-vue-next'

definePageMeta({ i18n: { paths: { en: '/properties/[slug]', es: '/propiedades/[slug]' } } })

const { t, locale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const config = useRuntimeConfig()
const { price, place, area, op } = useFormat()

const slug = computed(() => String(route.params.slug))
const { data: p, error } = await useFetch(() => `/api/properties/${slug.value}`, {
  key: () => `property-${slug.value}-${locale.value}`,
  query: { lang: locale },
})
if (error.value || !p.value) throw createError({ statusCode: 404, statusMessage: t('listing.notFound'), fatal: true })

// One canonical URL per listing: a bare Ref or an old slug redirects to the current one.
if (p.value.slug !== slug.value) await navigateTo(localePath({ name: 'properties-slug', params: { slug: p.value.slug } }), { redirectCode: 301, replace: true })

const prop = computed(() => p.value!)
const pr = computed(() => price(prop.value))
const isRental = computed(() => prop.value.operations.includes('alquiler'))

const { data: similar } = await useFetch('/api/properties', {
  key: () => `similar-${prop.value.id}-${locale.value}`,
  query: computed(() => ({ operation: prop.value.operations[0], limit: 4, lang: locale.value })),
  transform: d => d.items.filter(x => x.id !== prop.value.id).slice(0, 3),
})

/* Gallery */
const current = ref(0)
const images = computed(() => prop.value.images)
const lightbox = ref<HTMLDialogElement | null>(null)
const go = (d: number) => (current.value = (current.value + d + images.value.length) % images.value.length)
const openLightbox = (i: number) => {
  current.value = i
  lightbox.value?.showModal()
}
function onKey(e: KeyboardEvent) {
  if (!lightbox.value?.open) return
  if (e.key === 'ArrowRight') go(1)
  if (e.key === 'ArrowLeft') go(-1)
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))

/* Phone gallery: a swipeable strip; the counter follows the scroll position */
const strip = ref<HTMLElement | null>(null)
const stripIndex = ref(0)
function onStrip() {
  const el = strip.value
  if (el) stripIndex.value = Math.round(el.scrollLeft / el.clientWidth)
}

/* Long CRM descriptions fold after a few paragraphs */
const expanded = ref(false)
const longText = computed(() => (prop.value.descriptionHtml?.match(/<(p|h\d|ul)\b/g)?.length ?? 0) > 5)

/* Map: approximate listings show an area, never a pin */
const showMap = computed(() => !!prop.value.lat && !!prop.value.lon && prop.value.addressPrivacy !== 'hidden')

/* Enquiry */
const enquiry = useLeadForm('/api/forms/contact', contactSchema, {
  subject: isRental.value && !prop.value.operations.includes('venta') ? 'rent' : 'buy',
  propertyId: prop.value.id,
  message: t('listing.enquire') + ` — ${prop.value.title} (Ref ${prop.value.id})`,
})

const copied = ref(false)
async function share() {
  const url = `${config.public.siteUrl}${route.fullPath}`
  if (navigator.share) return navigator.share({ title: prop.value.title, url }).catch(() => {})
  await navigator.clipboard.writeText(url)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}

const specs = computed(() =>
  [
    prop.value.bedrooms && { label: t('listing.beds'), value: String(prop.value.bedrooms), icon: BedDouble },
    prop.value.bathrooms && { label: t('listing.baths'), value: String(prop.value.bathrooms), icon: Bath },
    prop.value.size && { label: t('listing.built'), value: area(prop.value.size), icon: Maximize },
    prop.value.plot && { label: t('listing.plot'), value: area(prop.value.plot), icon: Trees },
  ].filter(Boolean) as { label: string; value: string; icon: typeof Bath }[],
)
const facts = computed(() => prop.value.facts.filter(f => !['size_built', 'plot_size'].includes(f.key)))
const factValue = (f: { key: string; value: string | number }) =>
  ['size_built', 'usable_area', 'plot_size', 'size_terraces'].includes(f.key) ? area(Number(f.value)) : String(f.value)

useSeoMeta({
  title: () => `${prop.value.title} — ${pr.value.text}`,
  description: () => prop.value.summary || t('catalogue.metaDescription'),
  ogTitle: () => prop.value.title,
  ogDescription: () => prop.value.summary,
  ogImage: () => (prop.value.images[0]?.url.startsWith('http') ? prop.value.images[0]?.url : `${config.public.siteUrl}${prop.value.images[0]?.url ?? ''}`),
  ogType: 'article',
})
useSchemaOrg([
  {
    '@type': 'RealEstateListing',
    name: () => prop.value.title,
    description: () => prop.value.summary,
    url: () => `${config.public.siteUrl}${route.path}`,
    image: () => prop.value.images.slice(0, 6).map(i => i.url),
    dateModified: () => prop.value.updatedAt,
    offers: () => ({
      '@type': 'Offer',
      price: primaryPrice(prop.value).amount,
      priceCurrency: 'EUR',
      businessFunction: isRental.value && !prop.value.operations.includes('venta') ? 'http://purl.org/goodrelations/v1#LeaseOut' : 'http://purl.org/goodrelations/v1#Sell',
      availability: 'https://schema.org/InStock',
    }),
    about: () => ({
      '@type': prop.value.type === 'apartamento' ? 'Apartment' : 'SingleFamilyResidence',
      numberOfRooms: prop.value.bedrooms,
      numberOfBathroomsTotal: prop.value.bathrooms,
      floorSize: prop.value.size ? { '@type': 'QuantitativeValue', value: prop.value.size, unitCode: 'MTK' } : undefined,
      address: { '@type': 'PostalAddress', addressLocality: prop.value.city, addressRegion: prop.value.province, addressCountry: 'ES' },
    }),
  },
  defineBreadcrumb({
    itemListElement: [
      { name: t('nav.properties'), item: localePath('properties') },
      { name: () => prop.value.title },
    ],
  }),
])
</script>

<template>
  <div>
    <!-- Phone: the photos come first, as a swipeable strip -->
    <section v-if="images.length" class="relative md:hidden" :aria-label="t('listing.openGallery', { n: images.length })">
      <div ref="strip" class="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none]" data-lenis-prevent @scroll.passive="onStrip">
        <button v-for="(img, i) in images" :key="img.url" type="button" class="relative aspect-[4/3] w-full shrink-0 snap-center" @click="openLightbox(i)">
          <NuxtImg
            :src="img.url"
            :alt="img.alt"
            :width="900"
            :height="675"
            :sizes="vw(100)"
            :loading="i === 0 ? 'eager' : 'lazy'"
            :fetchpriority="i === 0 ? 'high' : 'auto'"
            :preload="i === 0"
            class="size-full object-cover"
            :style="i === 0 ? { viewTransitionName: `listing-${prop.id}` } : undefined"
          />
        </button>
      </div>
      <p class="tabular pointer-events-none absolute bottom-3 left-3 rounded-full bg-ink/70 px-3 py-1.5 text-[0.8125rem] text-white backdrop-blur" aria-live="polite">{{ stripIndex + 1 }} / {{ images.length }}</p>
      <button type="button" class="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[0.8125rem] font-medium shadow-[0_8px_24px_-10px_rgb(23_34_31/0.5)]" @click="openLightbox(stripIndex)">
        <Grid2x2 class="size-4" :stroke-width="1.6" /> {{ t('listing.openGallery', { n: images.length }) }}
      </button>
    </section>

    <div class="wrap pt-6 md:pt-8">
      <div class="flex items-center justify-between gap-4 text-[0.9375rem]">
        <NuxtLink :to="localePath('properties')" class="group inline-flex items-center gap-2 text-muted transition-colors hover:text-ink">
          <ArrowLeft class="size-4 transition-transform duration-300 group-hover:-translate-x-1" :stroke-width="1.6" /> {{ t('listing.back') }}
        </NuxtLink>
        <button type="button" class="inline-flex items-center gap-2 rounded-full px-4 py-2 ring-1 ring-line transition-colors hover:bg-stone" @click="share">
          <Share2 class="size-4" :stroke-width="1.6" /> {{ copied ? t('listing.copied') : t('listing.share') }}
        </button>
      </div>

      <div class="mt-8 grid gap-6 md:mt-10 lg:grid-cols-12 lg:items-end">
        <div class="lg:col-span-8">
          <h1 class="hero-in max-w-[24ch] font-display text-[clamp(2.3rem,1.5rem+3vw,4.25rem)] font-light leading-[1.04] tracking-[-0.025em]">{{ prop.title }}</h1>
          <p class="hero-in mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.9375rem] text-muted" style="--d: 80ms">
            <span class="rounded-full bg-stone px-3 py-1 text-ink">{{ op(prop) }}</span>
            <span v-if="place(prop)" class="inline-flex items-center gap-1.5"><MapPin class="size-4" :stroke-width="1.6" /> {{ place(prop) }}</span>
            <span class="tabular">{{ t('listing.ref', { id: prop.id }) }}</span>
          </p>
        </div>
        <p class="hero-in tabular font-display text-[clamp(2rem,1.6rem+1.4vw,3rem)] leading-none lg:col-span-4 lg:text-right" style="--d: 140ms">
          {{ pr.text }}<span v-if="pr.perMonth" class="font-sans text-[1rem] text-muted"> {{ t('listing.perMonth') }}</span>
        </p>
      </div>
    </div>

    <!-- Gallery -->
    <section class="wrap mt-10 hidden md:block" :aria-label="t('listing.openGallery', { n: images.length })">
      <div v-if="images.length" class="relative grid h-[min(68vh,40rem)] grid-cols-4 grid-rows-2 gap-2">
        <button type="button" class="group relative col-span-2 row-span-2 overflow-hidden rounded-[var(--radius-card)]" @click="openLightbox(0)">
          <RevealImage
            :src="images[0]!.url"
            :alt="images[0]!.alt"
            eager
            :width="1600"
            :height="1067"
            :sizes="vw(100, { md: 50 })"
            :vt-name="`listing-${prop.id}`"
            class="size-full rounded-[var(--radius-card)]"
            img-class="transition-transform duration-[2.2s] ease-[var(--ease-soft)] group-hover:scale-[1.025]"
          />
        </button>
        <button
          v-for="(img, i) in images.slice(1, 5)"
          :key="img.url"
          type="button"
          class="group relative overflow-hidden rounded-[var(--radius-card)]"
          @click="openLightbox(i + 1)"
        >
          <RevealImage :src="img.url" :alt="img.alt" :delay="120 + i * 90" :width="800" :height="600" :sizes="vw(50, { md: 25 })" class="size-full rounded-[var(--radius-card)]" img-class="transition-transform duration-[2.2s] ease-[var(--ease-soft)] group-hover:scale-[1.025]" />
        </button>
        <button type="button" class="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-[0.875rem] font-medium shadow-[0_10px_30px_-12px_rgb(23_34_31/0.5)] transition-colors hover:bg-stone" @click="openLightbox(0)">
          <Grid2x2 class="size-4" :stroke-width="1.6" /> {{ t('listing.openGallery', { n: images.length }) }}
        </button>
      </div>
    </section>

    <!-- Body + enquiry -->
    <section class="wrap py-10 md:py-20">
      <div class="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
        <article class="lg:col-span-7">
          <dl v-if="specs.length" class="grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-card)] bg-line ring-1 ring-line sm:grid-cols-4">
            <div v-for="s in specs" :key="s.label" class="bg-white px-5 py-5">
              <dt class="flex items-center gap-2 text-[0.875rem] text-muted"><component :is="s.icon" class="size-4" :stroke-width="1.5" /> {{ s.label }}</dt>
              <dd class="tabular mt-2 font-display text-[1.75rem] leading-none">{{ s.value }}</dd>
            </div>
          </dl>

          <h2 class="mt-14 font-display text-[2rem] font-light leading-tight">{{ t('listing.description') }}</h2>
          <!-- eslint-disable-next-line vue/no-v-html -- sanitised server-side in normalizeProperty() -->
          <div class="relative">
            <div class="prose-listing mt-6 overflow-hidden transition-[max-height] duration-700 ease-[var(--ease-out)]" :class="longText && !expanded ? 'max-h-[26rem]' : 'max-h-none'" v-html="prop.descriptionHtml" />
            <div v-if="longText && !expanded" class="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white" aria-hidden="true" />
          </div>
          <button v-if="longText" type="button" class="btn btn-ghost mt-6 min-h-11 text-[0.875rem]" :aria-expanded="expanded" @click="expanded = !expanded">{{ expanded ? t('listing.readLess') : t('listing.readMore') }}</button>

          <template v-if="prop.features.length">
            <h2 class="mt-14 border-t border-line pt-12 font-display text-[1.75rem] font-light">{{ t('listing.features') }}</h2>
            <ul class="mt-6 flex flex-wrap gap-2">
              <li v-for="f in prop.features" :key="f.key" class="rounded-full bg-stone px-4 py-2 text-[0.9375rem]">
                {{ f.label }}<template v-if="typeof f.value !== 'boolean'">: <span class="tabular">{{ f.value }}</span></template>
              </li>
            </ul>
          </template>

          <template v-if="facts.length">
            <h2 class="mt-14 border-t border-line pt-12 font-display text-[1.75rem] font-light">{{ t('listing.facts') }}</h2>
            <dl class="mt-6 grid gap-x-10 sm:grid-cols-2">
              <div v-for="f in facts" :key="f.key" class="flex justify-between gap-4 border-b border-line py-3.5 text-[0.9375rem]">
                <dt class="text-muted">{{ t(`facts.${f.key}`) }}</dt>
                <dd class="tabular text-right font-medium">{{ factValue(f) }}</dd>
              </div>
            </dl>
          </template>

          <div v-if="prop.videoEmbed" class="mt-14 border-t border-line pt-12">
            <h2 class="font-display text-[1.75rem] font-light">{{ t('listing.video') }}</h2>
            <div class="mt-6 aspect-video overflow-hidden rounded-[var(--radius-card)] bg-ink">
              <iframe :src="prop.videoEmbed" :title="`${t('listing.video')} — ${prop.title}`" class="size-full" loading="lazy" allow="fullscreen; picture-in-picture" />
            </div>
          </div>

          <div class="mt-14 border-t border-line pt-12">
            <h2 class="font-display text-[1.75rem] font-light">{{ t('listing.location') }}</h2>
            <p class="mt-3 text-[1rem]">{{ [prop.address, prop.city, prop.province].filter(Boolean).join(', ') }}</p>
            <p class="mt-1 text-[0.875rem] text-muted">{{ prop.addressPrivacy === 'hidden' ? t('listing.locationHidden') : prop.addressPrivacy === 'approximate' ? t('listing.locationApprox') : '' }}</p>
            <div v-if="showMap" class="relative z-0 mt-6 aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] bg-stone-2 sm:aspect-[16/9]">
              <ListingMap :id="prop.id" :lat="prop.lat!" :lon="prop.lon!" :privacy="prop.addressPrivacy" :label="`${t('listing.location')} — ${prop.city}`" />
            </div>
          </div>
        </article>

        <aside class="lg:sticky lg:top-28 lg:col-span-5">
          <div class="px-1 pb-6">
            <h2 class="font-display text-[1.9rem] font-light leading-tight">{{ t('listing.enquire') }}</h2>
            <p class="mt-2 text-muted">{{ t('listing.enquireBody') }}</p>
            <NuxtLink v-if="isRental" :to="localePath({ name: 'rental-profile', query: { property: prop.id } })" class="group mt-4 inline-flex items-center gap-2 font-medium">
              <span class="link-under">{{ t('listing.applyRental') }}</span> <ArrowRight class="nudge size-4" />
            </NuxtLink>
          </div>

          <FormShell
            :form="enquiry.form"
            :errors="enquiry.errors.value"
            :status="enquiry.status.value"
            :submit-label="t('form.send')"
            :message-label="t('form.message')"
            message-required
            @submit="enquiry.submit"
            @reset="enquiry.reset"
          />
        </aside>
      </div>
    </section>

    <!-- Also on the island -->
    <section v-if="similar?.length" class="bg-stone py-20 md:py-28">
      <div class="wrap">
        <h2 v-reveal class="font-display text-title font-light tracking-[-0.02em]">{{ t('listing.similar') }}</h2>
        <div class="rail mt-10 md:mt-12">
          <div v-for="(s, i) in similar" :key="s.id" class="rail-item"><PropertyCard :property="s" :delay="i * 100" /></div>
        </div>
      </div>
    </section>

    <dialog ref="lightbox" class="lightbox m-0 h-dvh max-h-none w-screen max-w-none bg-ink p-0 text-white" :aria-label="prop.title" data-lenis-prevent>
      <div class="flex h-full flex-col">
        <div class="flex items-center justify-between px-4 py-3 md:px-8">
          <p class="tabular text-[0.9375rem] text-white/70">{{ t('listing.gallery', { n: current + 1, total: images.length }) }}</p>
          <button type="button" class="grid size-11 place-items-center rounded-full transition-colors hover:bg-white/10" :aria-label="t('nav.close')" @click="lightbox?.close()"><X class="size-6" :stroke-width="1.5" /></button>
        </div>
        <div class="relative min-h-0 flex-1">
          <Transition name="fade" mode="out-in">
            <NuxtImg :key="images[current]?.url" :src="images[current]?.url" :alt="images[current]?.alt" :sizes="vw(100)" class="absolute inset-0 size-full object-contain" />
          </Transition>
          <button type="button" class="absolute left-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 backdrop-blur transition-colors hover:bg-white hover:text-ink md:left-6" aria-label="←" @click="go(-1)"><ChevronLeft class="size-6" :stroke-width="1.5" /></button>
          <button type="button" class="absolute right-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 backdrop-blur transition-colors hover:bg-white hover:text-ink md:right-6" aria-label="→" @click="go(1)"><ChevronRight class="size-6" :stroke-width="1.5" /></button>
        </div>
        <div class="flex gap-2 overflow-x-auto px-4 py-4 md:px-8">
          <button v-for="(img, i) in images" :key="img.url" type="button" class="h-16 w-24 shrink-0 overflow-hidden rounded-lg transition-opacity" :class="i === current ? 'ring-2 ring-white' : 'opacity-50 hover:opacity-100'" :aria-label="t('listing.gallery', { n: i + 1, total: images.length })" @click="current = i">
            <NuxtImg :src="img.url" alt="" width="192" height="128" class="size-full object-cover" loading="lazy" />
          </button>
        </div>
      </div>
    </dialog>
  </div>
</template>

<style scoped>
.lightbox::backdrop { background: rgb(10 16 14 / 0.92); }
.lightbox[open] { animation: lb-in 0.45s var(--ease-out); }
@keyframes lb-in { from { opacity: 0; transform: scale(0.98); } }
.fade-enter-active { transition: opacity 0.45s var(--ease-soft), transform 0.6s var(--ease-out); }
.fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from { opacity: 0; transform: scale(1.02); }
.fade-leave-to { opacity: 0; }
.hero-in { animation: rise 1.1s var(--ease-out) both; animation-delay: var(--d, 0ms); }
@keyframes rise { from { opacity: 0; transform: translateY(20px); } }
</style>
