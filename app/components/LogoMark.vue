<script setup lang="ts">
/** The brand mark — a peak over two waves — redrawn as a vector from the official logo so it can take any colour. */
defineProps<{ title?: string }>()
</script>

<template>
  <svg viewBox="240 80 490 790" fill="none" stroke="currentColor" stroke-width="62" stroke-linecap="round" stroke-linejoin="round" :aria-hidden="title ? undefined : 'true'" :role="title ? 'img' : undefined">
    <title v-if="title">{{ title }}</title>
    <path d="M355 476 487 138l132 338" />
    <path d="M287 594c33 68 74 90 120 90 22 0 42-5 62-14l78-35c20-9 40-14 60-14 46 0 82 22 106 74" stroke-width="58" />
    <path d="M287 744c33 68 74 90 120 90 22 0 42-5 62-14l78-35c20-9 40-14 60-14 46 0 82 22 106 74" stroke-width="58" />
  </svg>
</template>
