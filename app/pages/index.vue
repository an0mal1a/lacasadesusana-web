<script setup lang="ts">
import { ArrowRight, ArrowUpRight, Handshake, KeyRound, Mail, Phone, Sun } from 'lucide-vue-next'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const config = useRuntimeConfig()
const app = useAppConfig()
const { price, place } = useFormat()

const { data: featured } = await useFetch('/api/properties', {
  key: () => `featured-${locale.value}`,
  query: { featured: true, limit: 6, lang: locale },
})
const { data: latest } = await useFetch('/api/properties', {
  key: () => `latest-${locale.value}`,
  query: { limit: 6, lang: locale },
})
const { data: areas } = await useFetch('/api/areas', { key: 'areas', default: () => [] })

/** Featured first; top up with the latest so the selection is never thin. */
const selection = computed(() => {
  const seen = new Set<number>()
  return [...(featured.value?.items ?? []), ...(latest.value?.items ?? [])].filter(p => !seen.has(p.id) && seen.add(p.id)).slice(0, 6)
})
/** Break the headline after its comma on wide screens, so "chosen one by one" stays whole. */
const titleParts = computed(() => {
  const s = t('home.title')
  const i = s.indexOf(', ')
  return i > 0 ? [s.slice(0, i + 1), s.slice(i + 2)] : [s, '']
})
const total = computed(() => latest.value?.count ?? 0)

/* Hero: a slow cross-fade between featured homes */
const slides = computed(() => selection.value.filter(p => p.images[0]).slice(0, 4))
const active = ref(0)
const slide = computed(() => slides.value[active.value])
let timer: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || slides.value.length < 2) return
  timer = setInterval(() => (active.value = (active.value + 1) % slides.value.length), 7000)
})
onBeforeUnmount(() => clearInterval(timer))
function goTo(i: number) {
  active.value = i
  clearInterval(timer)
}

/** Second photos of the selection dress the three ways of working, so no image repeats a card above. */
const wayImage = (i: number) => {
  const p = selection.value[(i + 1) % Math.max(selection.value.length, 1)]
  return p?.images[1] ?? p?.images[0]
}
const ways = computed(() => [
  { to: localePath('private-search'), title: t('home.waySearchTitle'), body: t('home.waySearchBody'), img: wayImage(0) },
  { to: localePath('rental-profile'), title: t('home.wayRentalTitle'), body: t('home.wayRentalBody'), img: wayImage(1) },
  { to: localePath('sell'), title: t('home.waySellTitle'), body: t('home.waySellBody'), img: wayImage(2) },
])
const topAreas = computed(() => [...areas.value].sort((a, b) => b.count - a.count).slice(0, 8))
const introImage = computed(() => {
  const p = selection.value[2] ?? selection.value[0]
  return p?.images[1] ?? p?.images[0]
})
const facts = computed(() => [
  { icon: Sun, title: t('home.fact1Title', { year: app.since }), body: t('home.fact1Body') },
  { icon: KeyRound, title: t('home.fact2Title', { year: app.founded }), body: t('home.fact2Body') },
  { icon: Handshake, title: t('home.fact3Title'), body: t('home.fact3Body') },
])
const closeImage = computed(() => selection.value.at(-1)?.images[2] ?? selection.value.at(-1)?.images[0])

const wa = computed(() => `https://wa.me/${config.public.phone.replace(/\D/g, '')}`)

useSeoMeta({
  title: () => t('home.metaTitle'),
  description: () => t('home.metaDescription'),
  ogTitle: () => `${t('home.metaTitle')} · La Casa de Susana`,
  ogDescription: () => t('home.metaDescription'),
})
</script>

<template>
  <div>
    <!-- ── Hero: the houses first ── -->
    <!-- On phones the photo runs edge to edge under the header (rounded only at its foot) and the search card rises into it. -->
    <section class="relative z-10 md:p-3" :aria-label="t('home.featured')">
      <div class="relative isolate flex h-[74svh] min-h-[32rem] flex-col justify-end overflow-hidden rounded-b-[var(--radius-hero)] bg-ink md:h-[64svh] md:rounded-[var(--radius-hero)] lg:h-[calc(100svh-1.5rem)] lg:min-h-[44rem]">
        <div class="absolute inset-0 -z-10">
          <div
            v-for="(s, i) in slides"
            :key="s.id"
            class="slide absolute inset-0"
            :class="{ on: i === active }"
            :aria-hidden="i !== active"
          >
            <NuxtImg
              :src="s.images[0]!.url"
              :alt="s.images[0]!.alt"
              :width="2400"
              :height="1500"
                :sizes="vw(230, { md: 140, lg: 100 })"
              :loading="i === 0 ? 'eager' : 'lazy'"
              :fetchpriority="i === 0 ? 'high' : 'low'"
              :preload="i === 0"
              class="kb size-full object-cover"
            />
          </div>
          <div class="absolute inset-0 bg-[linear-gradient(180deg,rgb(10_16_14/0.45)_0%,transparent_22%,transparent_45%,rgb(10_16_14/0.62)_100%)]" />
        </div>

        <div class="wrap pb-20 text-white md:pb-12 lg:pb-36">
          <div class="flex flex-wrap items-end justify-between gap-8">
            <div class="max-w-[52rem]">
              <h1 class="hero-in font-display text-display font-light tracking-[-0.025em] [text-wrap:pretty]">{{ titleParts[0] }}<br v-if="titleParts[1]" class="hidden md:block" /> {{ titleParts[1] }}</h1>
              <p class="hero-in mt-4 max-w-[36rem] text-[1rem] leading-relaxed text-white/85 md:mt-5 md:text-[1.125rem]" style="--d: 120ms"><span class="md:hidden">{{ t('home.ledeShort') }}</span><span class="hidden md:inline">{{ t('home.lede') }}</span></p>
            </div>
            <NuxtLink
              v-if="slide"
              :to="localePath({ name: 'properties-slug', params: { slug: slide.slug } })"
              class="hero-in group hidden w-[22rem] items-center gap-4 rounded-2xl bg-white/12 p-3 pr-5 ring-1 ring-white/25 backdrop-blur-md transition-colors hover:bg-white/20 lg:flex"
              style="--d: 240ms"
            >
              <Transition name="swap" mode="out-in">
                <span :key="slide.id" class="flex min-w-0 flex-1 items-center gap-4">
                  <NuxtImg :src="slide.images[1]?.url ?? slide.images[0]!.url" alt="" width="128" height="128" class="size-16 shrink-0 rounded-xl object-cover" />
                  <span class="min-w-0">
                    <span class="line-clamp-2 font-display text-[1.05rem] leading-snug">{{ slide.title }}</span>
                    <span class="block text-[0.875rem] text-white/75"><span class="tabular">{{ price(slide).text }}</span> · {{ place(slide) }}</span>
                  </span>
                </span>
              </Transition>
              <ArrowUpRight class="nudge size-5 shrink-0" :stroke-width="1.6" />
            </NuxtLink>
          </div>
          <div v-if="slides.length > 1" class="-ml-1 mt-4 flex md:mt-6" role="group" :aria-label="t('home.featured')">
            <button
              v-for="(s, i) in slides"
              :key="s.id"
              type="button"
              class="grid h-11 w-12 place-items-center px-1 md:w-16"
              :aria-label="s.title"
              :aria-current="i === active ? 'true' : undefined"
              @click="goTo(i)"
            >
              <span class="relative h-1 w-full overflow-hidden rounded-full bg-white/30">
                <span class="bar absolute inset-0 origin-left rounded-full bg-white" :class="{ run: i === active, done: i < active }" />
              </span>
            </button>
          </div>
        </div>

        <div class="absolute inset-x-0 bottom-6 hidden lg:block">
          <div class="wrap"><HeroSearch /></div>
        </div>
      </div>
      <div class="wrap relative z-10 -mt-14 md:-mt-8 lg:hidden"><HeroSearch /></div>
    </section>

    <!-- ── Intro: one photo, the promise, three facts ── -->
    <section class="pb-20 pt-16 md:pb-32 lg:bg-stone lg:pt-32" aria-labelledby="intro-h">
      <svg width="0" height="0" class="absolute" aria-hidden="true">
        <clipPath id="intro-clip" clipPathUnits="objectBoundingBox">
          <path d="M0,0 H0.8 C0.93,0 1,0.08 1,0.2 V0.72 C1,0.9 0.93,0.98 0.8,0.99 C0.58,1.01 0.36,0.95 0.16,0.975 C0.08,0.985 0.03,1 0,1 Z" />
        </clipPath>
      </svg>
      <div class="wrap grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
        <div class="-ml-4 md:-ml-8 lg:col-span-5 xl:-ml-12">
          <div class="[clip-path:url(#intro-clip)]">
            <RevealImage
              v-if="introImage"
              :src="introImage.url"
              :alt="introImage.alt"
              :width="1100"
              :height="880"
              :sizes="vw(100, { lg: 44 })"
              class="aspect-[5/4]"
            />
          </div>
        </div>
        <div class="lg:col-span-4">
          <h2 id="intro-h" v-reveal class="font-display text-[clamp(2.1rem,1.6rem+1.8vw,3.25rem)] font-light leading-[1.06] tracking-[-0.02em]">{{ t('home.introTitle') }}</h2>
          <p v-reveal="100" class="mt-5 text-[1.0625rem] leading-relaxed text-muted">{{ t('home.introBody') }}</p>
          <NuxtLink v-reveal="160" :to="localePath('about')" class="btn group mt-8">{{ t('home.aboutLink') }} <ArrowRight class="nudge size-4" :stroke-width="1.8" /></NuxtLink>
        </div>
        <ul class="grid gap-7 border-line sm:grid-cols-3 lg:col-span-3 lg:grid-cols-1 lg:border-l lg:py-4 lg:pl-8">
          <li v-for="(f, i) in facts" :key="f.title" v-reveal="i * 110" class="flex items-center gap-4">
            <span class="grid size-14 shrink-0 place-items-center rounded-full bg-white text-ink"><component :is="f.icon" class="size-[1.35rem]" :stroke-width="1.4" /></span>
            <span class="min-w-0">
              <span class="block font-medium leading-snug">{{ f.title }}</span>
              <span class="mt-0.5 block text-[0.875rem] leading-snug text-muted [text-wrap:pretty]">{{ f.body }}</span>
            </span>
          </li>
        </ul>
      </div>
    </section>

    <!-- ── Selected properties ── -->
    <section class="py-20 md:py-32" aria-labelledby="featured-h">
      <div class="wrap">
        <div class="flex flex-wrap items-end justify-between gap-6">
          <h2 id="featured-h" v-reveal class="font-display text-title font-light tracking-[-0.02em]">{{ t('home.featured') }}</h2>
          <NuxtLink v-reveal="80" :to="localePath('properties')" class="btn btn-ghost group">
            {{ t('home.allProperties') }} <span class="tabular text-muted group-hover:text-white/70">{{ total }}</span> <ArrowRight class="nudge size-4" :stroke-width="1.8" />
          </NuxtLink>
        </div>
        <div class="rail mt-10 md:mt-14">
          <div v-for="(p, i) in selection" :key="p.id" class="rail-item">
            <PropertyCard :property="p" tall :delay="(i % 3) * 120" />
          </div>
        </div>
      </div>
    </section>

    <!-- ── Susana ── -->
    <section class="bg-stone py-20 md:py-32" aria-labelledby="about-h">
      <div class="wrap grid items-center gap-12 md:grid-cols-12 lg:gap-20">
        <figure class="md:col-span-5">
          <RevealImage src="/media/susana-rodrigo.webp" alt="Susana Rodrigo" :width="768" :height="801" :sizes="vw(100, { md: 42, lg: 36 })" class="aspect-[4/5] rounded-[var(--radius-hero)]" img-class="object-top" />
          <figcaption class="mt-4 text-[0.875rem] text-muted">Susana Rodrigo, La Casa de Susana</figcaption>
        </figure>
        <div class="md:col-span-7">
          <h2 id="about-h" v-reveal class="max-w-[16ch] font-display text-title font-light tracking-[-0.02em]">{{ t('home.aboutTitle') }}</h2>
          <div class="mt-8 max-w-[58ch] space-y-5 text-[1.0625rem] leading-relaxed text-muted md:text-[1.125rem]">
            <p v-reveal="80">{{ t('home.aboutBody') }}</p>
            <p v-reveal="140">{{ t('home.aboutBody2') }}</p>
          </div>
          <NuxtLink v-reveal="200" :to="localePath('about')" class="btn group mt-10">{{ t('home.aboutLink') }} <ArrowRight class="nudge size-4" :stroke-width="1.8" /></NuxtLink>
        </div>
      </div>
    </section>

    <!-- ── Three ways ── -->
    <section class="py-20 md:py-32" aria-labelledby="ways-h">
      <div class="wrap">
        <h2 id="ways-h" v-reveal class="max-w-[20ch] font-display text-title font-light tracking-[-0.02em]">{{ t('home.waysTitle') }}</h2>
        <ul class="mt-10 grid gap-4 md:mt-14 md:grid-cols-3 md:gap-6">
          <li v-for="(w, i) in ways" :key="w.to" v-reveal="i * 120">
            <NuxtLink :to="w.to" class="group relative isolate flex aspect-[5/4] flex-col justify-end overflow-hidden rounded-[var(--radius-card)] bg-ink p-7 text-white md:aspect-[3/4] lg:p-9">
              <NuxtImg v-if="w.img" :src="w.img.url" alt="" :width="900" :height="1200" :sizes="vw(100, { md: 40 })" loading="lazy" class="absolute inset-0 -z-10 size-full object-cover opacity-80 transition-transform duration-[2.2s] ease-[var(--ease-soft)] group-hover:scale-[1.025]" />
              <span class="absolute inset-0 -z-10 bg-[linear-gradient(180deg,transparent_30%,rgb(10_16_14/0.78))]" />
              <span class="absolute right-6 top-6 grid size-12 place-items-center rounded-full bg-white text-ink transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <ArrowUpRight class="size-5" :stroke-width="1.6" />
              </span>
              <span class="font-display text-[2rem] leading-tight">{{ w.title }}</span>
              <span class="mt-3 max-w-[36ch] text-[1rem] leading-relaxed text-white/80">{{ w.body }}</span>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </section>

    <!-- ── By area ── -->
    <section v-if="areas.length" class="bg-stone py-20 md:py-32" aria-labelledby="areas-h">
      <div class="wrap grid gap-12 lg:grid-cols-12">
        <h2 id="areas-h" v-reveal class="font-display text-title font-light tracking-[-0.02em] lg:col-span-4">{{ t('home.areasTitle') }}</h2>
        <ul class="border-t border-line lg:col-span-8">
          <li v-for="(a, i) in topAreas" :key="a.city" v-reveal="i * 60" class="border-b border-line">
            <NuxtLink :to="localePath({ name: 'properties', query: { city: a.city } })" class="group flex items-center justify-between gap-6 py-6 md:py-7">
              <span class="min-w-0 font-display text-[1.6rem] font-light leading-tight transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-2 md:text-[2.6rem]">{{ a.city }}</span>
              <span class="flex shrink-0 items-center gap-3 text-muted sm:gap-5">
                <span class="tabular whitespace-nowrap text-[0.875rem] sm:text-[0.9375rem]">{{ t('catalogue.count', { n: a.count }, a.count) }}</span>
                <span class="grid size-11 place-items-center rounded-full ring-1 ring-line transition-colors duration-300 group-hover:bg-ink group-hover:text-white group-hover:ring-ink"><ArrowRight class="size-4" :stroke-width="1.8" /></span>
              </span>
            </NuxtLink>
          </li>
          <li v-if="areas.length > topAreas.length" class="pt-8">
            <NuxtLink :to="localePath('properties')" class="btn btn-ghost group">{{ t('home.allProperties') }} <ArrowRight class="nudge size-4" :stroke-width="1.8" /></NuxtLink>
          </li>
        </ul>
      </div>
    </section>

    <!-- ── Close ── -->
    <section class="p-2 md:p-3" aria-labelledby="close-h">
      <div class="relative isolate overflow-hidden rounded-[var(--radius-hero)] bg-ink text-white">
        <NuxtImg v-if="closeImage" :src="closeImage.url" alt="" :width="2000" :height="1100" :sizes="vw(100)" loading="lazy" class="absolute inset-0 -z-10 size-full object-cover opacity-45" />
        <div class="wrap flex min-h-[34rem] flex-col items-center justify-center py-24 text-center">
          <h2 id="close-h" v-reveal class="max-w-[16ch] font-display text-title font-light tracking-[-0.02em]">{{ t('home.closeTitle') }}</h2>
          <p v-reveal="100" class="mt-5 max-w-[46ch] text-[1.125rem] text-white/80">{{ t('home.closeBody') }}</p>
          <div v-reveal="180" class="mt-10 flex flex-wrap justify-center gap-3">
            <a :href="`tel:${config.public.phone}`" class="btn btn-light"><Phone class="size-4" :stroke-width="1.8" /> <span class="tabular">+34 676 671 258</span></a>
            <a :href="wa" target="_blank" rel="noopener" class="btn btn-ghost btn-ghost-light"><BrandIcon name="whatsapp" class="size-4" /> WhatsApp</a>
            <NuxtLink :to="localePath('contact')" class="btn btn-ghost btn-ghost-light"><Mail class="size-4" :stroke-width="1.8" /> Email</NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.slide { opacity: 0; transition: opacity 1.8s var(--ease-soft); }
.slide.on { opacity: 1; }
.kb { transform: scale(1.08); transition: transform 9s linear; }
.on .kb { transform: scale(1); }

.bar { transform: scaleX(0); }
.bar.done { transform: scaleX(1); }
.bar.run { animation: bar 7s linear forwards; }
@keyframes bar { to { transform: scaleX(1); } }

.hero-in { animation: rise 1.2s var(--ease-out) both; animation-delay: var(--d, 0ms); }
@keyframes rise { from { opacity: 0; transform: translateY(24px); } }

.swap-enter-active, .swap-leave-active { transition: opacity 0.5s var(--ease-soft), transform 0.5s var(--ease-soft); }
.swap-enter-from { opacity: 0; transform: translateY(8px); }
.swap-leave-to { opacity: 0; transform: translateY(-8px); }

@media (prefers-reduced-motion: reduce) {
  .bar.run { animation: none; transform: scaleX(1); }
  .kb, .on .kb { transition: none; transform: none; }
  .hero-in { animation: none; }
}
</style>
