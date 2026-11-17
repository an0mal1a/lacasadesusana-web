<script setup lang="ts">
import type { NuxtError } from '#app'
const props = defineProps<{ error: NuxtError }>()
const { t } = useI18n()
const localePath = useLocalePath()
useSeoMeta({ title: () => t('notFound.title'), robots: 'noindex' })
</script>

<template>
  <NuxtLayout>
    <section class="wrap flex min-h-[70dvh] flex-col justify-center py-24">
      <h1 class="max-w-3xl font-display text-display font-light tracking-[-0.025em]">{{ t('notFound.title') }}</h1>
      <p class="mt-6 max-w-xl text-[1.125rem] text-muted">{{ t('notFound.body') }} <span class="tabular">({{ props.error.statusCode }})</span></p>
      <NuxtLink :to="localePath('properties')" class="btn mt-10 self-start" @click="clearError()">{{ t('notFound.cta') }}</NuxtLink>
    </section>
  </NuxtLayout>
</template>
