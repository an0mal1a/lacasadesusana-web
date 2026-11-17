<script setup lang="ts">
import { ArrowUpRight, Mail, Phone } from 'lucide-vue-next'
const { t } = useI18n()
const config = useRuntimeConfig()
const wa = computed(() => `https://wa.me/${config.public.phone.replace(/\D/g, '')}`)
const row = 'group flex items-center gap-3 px-6 py-4 transition-colors hover:bg-stone'
</script>

<template>
  <div class="overflow-hidden rounded-[var(--radius-hero)] bg-white ring-1 ring-line">
    <div class="flex items-center gap-4 p-6">
      <NuxtImg src="/media/susana-rodrigo.webp" alt="Susana Rodrigo" width="128" height="133" class="size-16 rounded-full object-cover object-top" />
      <div>
        <p class="font-display text-[1.4rem] leading-tight">Susana Rodrigo</p>
        <p class="text-[0.875rem] text-muted">La Casa de Susana · Ibiza</p>
      </div>
    </div>
    <slot />
    <div class="divide-y divide-line border-t border-line text-[0.9375rem]">
      <a :href="`tel:${config.public.phone}`" :class="row"><Phone class="size-4 text-muted" :stroke-width="1.6" /> <span class="tabular flex-1">+34 676 671 258</span><ArrowUpRight class="nudge size-4 text-faint" /></a>
      <a :href="wa" target="_blank" rel="noopener" :class="row"><BrandIcon name="whatsapp" class="size-4 text-muted" /> <span class="flex-1">{{ t('contact.whatsapp') }}</span><ArrowUpRight class="nudge size-4 text-faint" /></a>
      <a :href="`mailto:${config.public.email}`" :class="row"><Mail class="size-4 text-muted" :stroke-width="1.6" /> <span class="flex-1 truncate">{{ config.public.email }}</span><ArrowUpRight class="nudge size-4 text-faint" /></a>
    </div>
  </div>
</template>
