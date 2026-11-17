<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next'

const { t } = useI18n()
const localePath = useLocalePath()
const config = useRuntimeConfig()
const app = useAppConfig()
const year = new Date().getFullYear()
const props = defineProps<{ fixtures?: boolean }>()

const social = computed(() =>
  (['facebook', 'linkedin', 'instagram'] as const).filter(k => app.social[k]).map(k => ({ name: k, href: app.social[k] as string })),
)
const wa = computed(() => `https://wa.me/${config.public.phone.replace(/\D/g, '')}`)
</script>

<template>
  <footer class="px-2 pb-2 md:px-3 md:pb-3">
    <div class="overflow-hidden rounded-[var(--radius-hero)] bg-ink text-white">
      <div class="wrap grid gap-14 pb-16 pt-16 md:grid-cols-12 md:pb-20 md:pt-24">
        <div class="md:col-span-5">
          <div class="flex items-center gap-3">
            <span class="grid size-11 place-items-center rounded-xl bg-mar text-white"><LogoMark class="h-6 w-auto" /></span>
            <p class="font-display text-[1.6rem] leading-none">La Casa de Susana</p>
          </div>
          <p class="mt-8 max-w-sm font-display text-[1.9rem] font-light leading-[1.2] text-white/85">{{ t('footer.tagline') }}</p>
          <div class="mt-8 space-y-1.5 text-[1.0625rem]">
            <a :href="`tel:${config.public.phone}`" class="block tabular text-white/90 hover:text-white">+34 676 671 258</a>
            <a :href="`mailto:${config.public.email}`" class="link-under inline-block text-white/90 hover:text-white">{{ config.public.email }}</a>
          </div>
          <NuxtLink :to="localePath('private-search')" class="btn btn-light group mt-8 min-h-12 text-[0.875rem]">{{ t('nav.search') }} <ArrowUpRight class="nudge size-4" :stroke-width="1.8" /></NuxtLink>
          <ul class="mt-8 flex gap-2">
            <li>
              <a :href="wa" target="_blank" rel="noopener" class="grid size-11 place-items-center rounded-full ring-1 ring-white/20 transition-colors hover:bg-white hover:text-ink" aria-label="WhatsApp"><BrandIcon name="whatsapp" class="size-[18px]" /></a>
            </li>
            <li v-for="s in social" :key="s.name">
              <a :href="s.href" target="_blank" rel="noopener" class="grid size-11 place-items-center rounded-full ring-1 ring-white/20 transition-colors hover:bg-white hover:text-ink" :aria-label="s.name"><BrandIcon :name="s.name" class="size-[18px]" /></a>
            </li>
          </ul>
        </div>

        <nav class="grid grid-cols-2 gap-10 text-[0.9375rem] md:col-span-7 md:grid-cols-3" aria-label="Footer">
          <div>
            <p class="label mb-5 text-white/50">{{ t('footer.explore') }}</p>
            <ul class="space-y-3 text-white/85">
              <li><NuxtLink :to="localePath({ name: 'properties', query: { operation: 'venta' } })" class="link-under hover:text-white">{{ t('catalogue.titleBuy') }}</NuxtLink></li>
              <li><NuxtLink :to="localePath({ name: 'properties', query: { operation: 'alquiler' } })" class="link-under hover:text-white">{{ t('catalogue.titleRent') }}</NuxtLink></li>
              <li><NuxtLink :to="localePath({ name: 'properties', query: { type: 'casa' } })" class="link-under hover:text-white">{{ t('catalogue.types.casa') }}</NuxtLink></li>
              <li><NuxtLink :to="localePath({ name: 'properties', query: { type: 'apartamento' } })" class="link-under hover:text-white">{{ t('catalogue.types.apartamento') }}</NuxtLink></li>
            </ul>
          </div>
          <div>
            <p class="label mb-5 text-white/50">{{ t('footer.work') }}</p>
            <ul class="space-y-3 text-white/85">
              <li><NuxtLink :to="localePath('private-search')" class="link-under hover:text-white">{{ t('nav.search') }}</NuxtLink></li>
              <li><NuxtLink :to="localePath('rental-profile')" class="link-under hover:text-white">{{ t('nav.rental') }}</NuxtLink></li>
              <li><NuxtLink :to="localePath('sell')" class="link-under hover:text-white">{{ t('nav.sell') }}</NuxtLink></li>
              <li><NuxtLink :to="localePath('about')" class="link-under hover:text-white">{{ t('nav.about') }}</NuxtLink></li>
              <li><NuxtLink :to="localePath('contact')" class="link-under hover:text-white">{{ t('nav.contact') }}</NuxtLink></li>
            </ul>
          </div>
          <div class="col-span-2 md:col-span-1">
            <p class="label mb-5 text-white/50">{{ t('footer.legal') }}</p>
            <ul class="space-y-3 text-white/85">
              <li><NuxtLink :to="localePath('privacy')" class="link-under hover:text-white">{{ t('footer.privacy') }}</NuxtLink></li>
            </ul>
          </div>
        </nav>
      </div>
      <div class="border-t border-white/10">
        <div class="wrap flex flex-wrap items-center justify-between gap-3 py-5 text-[0.8125rem] text-white/50">
          <p>© {{ year }} La Casa de Susana · Ibiza. {{ t('footer.rights') }}</p>
          <p v-if="props.fixtures" class="text-white/70">{{ t('footer.fixtures') }}</p>
        </div>
      </div>
    </div>
  </footer>
</template>
