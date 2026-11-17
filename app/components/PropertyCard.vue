<script setup lang="ts">
import { ArrowUpRight, Bath, BedDouble, Maximize } from 'lucide-vue-next'
import type { Property } from '#shared/types/property'

/**
 * A listing card: rounded photograph with a slow hover zoom, then title, place and the numbers that matter.
 * The photo carries a view-transition-name so it morphs into the listing page's hero.
 */
const props = withDefaults(defineProps<{ property: Property; eager?: boolean; tall?: boolean; delay?: number }>(), { eager: false, tall: false, delay: 0 })
const { t } = useI18n()
const localePath = useLocalePath()
const { price, place, area, op } = useFormat()
const p = computed(() => props.property)
const pr = computed(() => price(p.value))
const to = computed(() => localePath({ name: 'properties-slug', params: { slug: p.value.slug } }))
const cover = computed(() => p.value.images[0])
</script>

<template>
  <article class="group relative flex h-full flex-col">
    <div class="relative overflow-hidden rounded-[var(--radius-card)] bg-stone-2" :class="tall ? 'aspect-[4/5]' : 'aspect-[4/3]'">
      <RevealImage
        v-if="cover"
        :src="cover.url"
        :alt="cover.alt"
        :eager="eager"
        :delay="delay"
        :width="tall ? 960 : 1000"
        :height="tall ? 1200 : 750"
        :sizes="vw(100, { sm: 50, lg: 34 })"
        :vt-name="`listing-${p.id}`"
        class="size-full rounded-[var(--radius-card)]"
        img-class="transition-transform duration-[2.2s] ease-[var(--ease-soft)] group-hover:scale-[1.025]"
      />
      <p class="label absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-ink backdrop-blur">{{ op(p) }}</p>
      <span class="absolute bottom-4 right-4 grid size-10 place-items-center rounded-full bg-white/95 text-ink opacity-0 transition-opacity duration-700 group-hover:opacity-100" aria-hidden="true">
        <ArrowUpRight class="size-5" :stroke-width="1.6" />
      </span>
    </div>
    <div class="flex flex-1 flex-col pt-5">
      <div class="flex items-start justify-between gap-4">
        <h3 class="font-display text-[1.45rem] leading-[1.15]">
          <NuxtLink :to="to" class="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">{{ p.title }}</NuxtLink>
        </h3>
      </div>
      <p class="mt-1.5 text-[0.875rem] text-muted">{{ place(p) }} <span class="text-faint">·</span> <span class="tabular">{{ t('listing.ref', { id: p.id }) }}</span></p>
      <div class="mt-auto flex flex-wrap items-center justify-between gap-x-6 gap-y-2 pt-4">
        <p class="tabular text-[1.125rem] font-medium">
          {{ pr.text }}<span v-if="pr.perMonth" class="text-[0.9375rem] font-normal text-muted"> {{ t('listing.perMonth') }}</span>
        </p>
        <p class="tabular flex items-center gap-4 text-[0.875rem] text-muted">
          <span v-if="p.bedrooms" class="inline-flex items-center gap-1.5" :title="t('listing.beds')"><BedDouble class="size-4" :stroke-width="1.5" aria-hidden="true" />{{ p.bedrooms }}<span class="sr-only"> {{ t('listing.beds') }}</span></span>
          <span v-if="p.bathrooms" class="inline-flex items-center gap-1.5" :title="t('listing.baths')"><Bath class="size-4" :stroke-width="1.5" aria-hidden="true" />{{ p.bathrooms }}<span class="sr-only"> {{ t('listing.baths') }}</span></span>
          <span v-if="p.size" class="inline-flex items-center gap-1.5" :title="t('listing.built')"><Maximize class="size-4" :stroke-width="1.5" aria-hidden="true" />{{ area(p.size) }}</span>
        </p>
      </div>
    </div>
  </article>
</template>
