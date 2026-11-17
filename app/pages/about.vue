<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'
definePageMeta({ i18n: { paths: { en: '/susana-rodrigo', es: '/susana-rodrigo' } } })
const { t } = useI18n()
const localePath = useLocalePath()
useSeoMeta({ title: () => t('about.metaTitle'), description: () => t('about.metaDescription'), ogType: 'profile' })
useSchemaOrg([definePerson({ name: 'Susana Rodrigo', jobTitle: 'Real estate agent', image: '/media/susana-rodrigo.webp', worksFor: { '@id': '#identity' } })])
</script>

<template>
  <div class="wrap pb-24 pt-14 md:pb-36 md:pt-20">
    <div class="grid items-end gap-12 md:grid-cols-12">
      <div class="md:col-span-7">
        <h1 v-reveal class="font-display text-display font-light tracking-[-0.025em]">{{ t('about.title') }}</h1>
        <p v-reveal="100" class="mt-5 font-display text-[1.6rem] font-light italic leading-snug text-muted md:text-[2rem]">{{ t('about.lede') }}</p>
      </div>
      <div class="md:col-span-5 lg:col-span-4 lg:col-start-9">
        <RevealImage src="/media/susana-rodrigo.webp" alt="Susana Rodrigo" eager :width="768" :height="801" :sizes="vw(100, { md: 40 })" class="aspect-[4/5] rounded-[var(--radius-hero)]" img-class="object-top" />
      </div>
    </div>
    <div class="mt-20 grid gap-12 border-t border-line pt-16 md:mt-28 md:grid-cols-12">
      <p v-reveal class="font-display text-[1.75rem] font-light leading-snug md:col-span-6 md:text-[2.2rem]">{{ t('about.p1') }}</p>
      <div class="space-y-6 text-[1.125rem] leading-relaxed text-muted md:col-span-5 md:col-start-8">
        <p v-reveal="80">{{ t('about.p2') }}</p>
        <p v-reveal="140">{{ t('about.p3') }}</p>
        <div v-reveal="200" class="flex flex-wrap gap-3 pt-4">
          <NuxtLink :to="localePath('contact')" class="btn group">{{ t('about.cta') }} <ArrowRight class="nudge size-4" :stroke-width="1.8" /></NuxtLink>
          <NuxtLink :to="localePath('properties')" class="btn btn-ghost">{{ t('home.allProperties') }}</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
