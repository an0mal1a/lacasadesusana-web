<script setup lang="ts">
import { ArrowUpRight, Menu, Phone, X } from 'lucide-vue-next'

/** Fixed header. Over the home hero it is transparent with white type; once scrolled, or on any other page, it becomes a white bar. */
const { t, locale, locales } = useI18n()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()
const config = useRuntimeConfig()
const route = useRoute()
const open = ref(false)
const { y } = useWindowScroll()

const isHome = computed(() => String(route.name ?? '').startsWith('index'))
const overlay = computed(() => isHome.value && y.value < 40 && !open.value)

watch(() => route.fullPath, () => (open.value = false))
watch(open, (v) => {
  if (import.meta.client) document.documentElement.style.overflow = v ? 'hidden' : ''
})

const links = computed(() => [
  { to: localePath({ name: 'properties', query: { operation: 'venta' } }), label: t('nav.buy'), match: 'venta' },
  { to: localePath({ name: 'properties', query: { operation: 'alquiler' } }), label: t('nav.rent'), match: 'alquiler' },
  { to: localePath('sell'), label: t('nav.sell') },
  { to: localePath('private-search'), label: t('nav.search') },
  { to: localePath('about'), label: t('nav.about') },
])
const isActive = (l: { to: string; match?: string }) =>
  l.match ? route.path === l.to.split('?')[0] && route.query.operation === l.match : route.path === l.to

const allLocales = computed(() => locales.value as { code: string; name: string }[])
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-40 transition-[background-color,color,box-shadow] duration-500"
    :class="overlay ? 'text-white' : 'bg-white/90 text-ink shadow-[0_1px_0_var(--color-line)] backdrop-blur-xl'"
  >
    <a href="#main" class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-white">{{ t('skip') }}</a>
    <div class="wrap flex h-[4.5rem] items-center gap-6 lg:h-20">
      <NuxtLink :to="localePath('index')" class="flex shrink-0 items-center gap-3" :aria-label="t('brand')">
        <span class="grid size-9 place-items-center rounded-[0.6rem] bg-mar text-white"><LogoMark class="h-[1.3rem] w-auto" /></span>
        <span class="font-display text-[1.3rem] leading-none">La Casa de Susana</span>
      </NuxtLink>

      <nav class="mx-auto hidden xl:block" aria-label="Main">
        <ul class="flex items-center gap-8 text-[0.9375rem]">
          <li v-for="l in links" :key="l.to">
            <NuxtLink :to="l.to" class="link-under py-1.5 opacity-90 transition-opacity hover:opacity-100" :aria-current="isActive(l) ? 'page' : undefined">{{ l.label }}</NuxtLink>
          </li>
        </ul>
      </nav>

      <div class="ml-auto flex items-center gap-2 xl:ml-0">
        <div class="mr-2 hidden items-center text-[0.8125rem] font-medium sm:flex" role="group" :aria-label="t('nav.language')">
          <NuxtLink
            v-for="l in allLocales"
            :key="l.code"
            :to="switchLocalePath(l.code as 'en' | 'es')"
            :hreflang="l.code"
            :lang="l.code"
            class="rounded-full px-2.5 py-1.5 uppercase tracking-[0.06em] transition-opacity"
            :class="l.code === locale ? 'opacity-100' : 'opacity-55 hover:opacity-100'"
            :aria-current="l.code === locale ? 'true' : undefined"
          >{{ l.code }}</NuxtLink>
        </div>
        <NuxtLink
          :to="localePath('contact')"
          class="btn group hidden min-h-11 px-5 text-[0.875rem] sm:inline-flex"
          :class="overlay ? 'btn-light' : ''"
        >{{ t('nav.contact') }} <ArrowUpRight class="nudge size-4" :stroke-width="1.8" /></NuxtLink>
        <button
          type="button"
          class="grid size-11 place-items-center rounded-full xl:hidden"
          :aria-expanded="open"
          aria-controls="site-menu"
          :aria-label="open ? t('nav.close') : t('nav.menu')"
          @click="open = !open"
        >
          <X v-if="open" class="size-6" :stroke-width="1.5" />
          <Menu v-else class="size-6" :stroke-width="1.5" />
        </button>
      </div>
    </div>

    <!-- Teleported: the header's backdrop-filter would make it the containing block of this fixed panel and squeeze it to 72px. -->
    <Teleport to="body">
    <Transition name="drawer">
      <div v-if="open" id="site-menu" class="fixed inset-x-0 bottom-0 top-[4.5rem] z-30 overflow-y-auto overscroll-contain bg-white xl:hidden" data-lenis-prevent>
        <nav class="wrap flex min-h-full flex-col pb-10 pt-6" aria-label="Main">
          <ul>
            <li v-for="(l, i) in [...links, { to: localePath('contact'), label: t('nav.contact') }]" :key="l.to" class="drawer-item border-b border-line" :style="{ transitionDelay: `${80 + i * 45}ms` }">
              <NuxtLink :to="l.to" class="flex items-center justify-between py-4 font-display text-[2rem] leading-tight">
                {{ l.label }} <ArrowUpRight class="size-5 text-faint" :stroke-width="1.5" />
              </NuxtLink>
            </li>
          </ul>
          <div class="mt-auto space-y-4 pt-10">
            <a :href="`tel:${config.public.phone}`" class="btn w-full"><Phone class="size-4" :stroke-width="1.8" /> {{ t('nav.call') }}</a>
            <div class="flex gap-2">
              <NuxtLink
                v-for="l in allLocales"
                :key="l.code"
                :to="switchLocalePath(l.code as 'en' | 'es')"
                class="flex-1 rounded-full py-3 text-center text-sm font-medium"
                :class="l.code === locale ? 'bg-stone text-ink' : 'text-muted ring-1 ring-line'"
              >{{ l.name }}</NuxtLink>
            </div>
          </div>
        </nav>
      </div>
    </Transition>
    </Teleport>
  </header>
</template>

<style scoped>
.drawer-enter-active, .drawer-leave-active { transition: opacity 0.4s var(--ease-out); }
.drawer-enter-from, .drawer-leave-to { opacity: 0; }
.drawer-enter-active .drawer-item { transition: transform 0.7s var(--ease-out), opacity 0.7s var(--ease-out); }
.drawer-enter-from .drawer-item { transform: translateY(16px); opacity: 0; }
</style>
