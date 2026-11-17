<script setup lang="ts">
/** Shared layout for form pages: a quiet title, then the form card beside Susana's contact card. */
defineProps<{ title: string; lede: string }>()
</script>

<template>
  <div class="wrap pb-24 pt-14 md:pb-32 md:pt-20">
    <header class="max-w-[52rem]">
      <h1 class="hero-in font-display text-display font-light tracking-[-0.025em]">{{ title }}</h1>
      <p class="hero-in mt-6 max-w-[56ch] text-[1.125rem] leading-relaxed text-muted md:text-[1.25rem]" style="--d: 120ms">{{ lede }}</p>
    </header>
    <div class="mt-14 grid items-start gap-6 md:mt-20 lg:grid-cols-12 lg:gap-10">
      <div class="hero-in lg:col-span-8" style="--d: 200ms"><slot /></div>
      <aside class="hero-in lg:sticky lg:top-28 lg:col-span-4" style="--d: 280ms"><slot name="aside" /></aside>
    </div>
  </div>
</template>

<style scoped>
.hero-in { animation: rise 1.1s var(--ease-out) both; animation-delay: var(--d, 0ms); }
@keyframes rise { from { opacity: 0; transform: translateY(20px); } }
</style>
