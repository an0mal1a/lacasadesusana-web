<script setup lang="ts">
definePageMeta({ i18n: { paths: { en: '/privacy', es: '/privacidad' } } })
const { t } = useI18n()
useSeoMeta({ title: () => t('privacy.metaTitle'), robots: 'noindex, follow' })
</script>

<template>
  <section class="wrap py-20 md:py-28">
    <h1 class="font-display text-title font-light tracking-[-0.02em]">{{ t('privacy.title') }}</h1>
    <div class="mt-10 max-w-3xl rounded-[var(--radius-card)] bg-stone px-6 py-8 text-[1.0625rem] leading-relaxed sm:px-10">{{ t('privacy.pending') }}</div>
  </section>
</template>
