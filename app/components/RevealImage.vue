<script setup lang="ts">
/**
 * A photograph that unveils once in view: the frame opens from the bottom while the image settles from a slight zoom.
 * The image is always in the DOM (crawlable); without JS or with reduced motion it is shown as-is.
 */
const props = withDefaults(
  defineProps<{
    src: string
    alt: string
    eager?: boolean
    sizes?: string
    width?: number
    height?: number
    imgClass?: string
    delay?: number
    vtName?: string
  }>(),
  { eager: false, sizes: vw(100), width: 1600, height: 1000, imgClass: '', delay: 0, vtName: undefined },
)

const root = ref<HTMLElement | null>(null)
const open = ref(false)

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return (open.value = true)
  const io = new IntersectionObserver(
    ([entry]) => {
      if (entry?.isIntersecting) {
        open.value = true
        io.disconnect()
      }
    },
    { threshold: 0.12 },
  )
  if (root.value) io.observe(root.value)
})
</script>

<template>
  <div ref="root" class="reveal-image overflow-hidden" :class="{ 'is-open': open }" :style="{ '--d': `${props.delay}ms`, viewTransitionName: vtName }">
    <NuxtImg
      :src="src"
      :alt="alt"
      :width="width"
      :height="height"
      :sizes="sizes"
      :loading="eager ? 'eager' : 'lazy'"
      :fetchpriority="eager ? 'high' : 'auto'"
      :preload="eager"
      class="ri-img block size-full object-cover"
      :class="imgClass"
    />
  </div>
</template>

<style scoped>
.js .reveal-image:not(.is-open) { clip-path: inset(100% 0 0 0 round inherit); }
.js .reveal-image:not(.is-open) .ri-img { transform: scale(1.12); }
.reveal-image { clip-path: inset(0 0 0 0 round inherit); transition: clip-path 1.2s var(--ease-out) var(--d); }
.ri-img { transition: transform 1.8s var(--ease-out) var(--d); }
</style>

<style>
@layer components { :where(.reveal-image) { position: relative; } }
</style>
