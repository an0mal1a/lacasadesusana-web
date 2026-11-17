<script setup lang="ts">
const { data: status } = await useFetch('/api/status', { key: 'status' })
const route = useRoute()
/** The home hero sits under the transparent header; every other page starts below it. */
const isHome = computed(() => String(route.name ?? '').startsWith('index'))
</script>

<template>
  <div class="flex min-h-dvh flex-col">
    <SiteHeader />
    <main id="main" class="flex-1" :class="!isHome && 'pt-[4.5rem] lg:pt-20'">
      <slot />
    </main>
    <SiteFooter :fixtures="status?.fixtures" />
  </div>
</template>
