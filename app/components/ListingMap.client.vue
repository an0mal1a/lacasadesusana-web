<script setup lang="ts">
import 'leaflet/dist/leaflet.css'

/**
 * The listing's location as a real map, so the drawn area moves with it.
 * - `approximate`: a soft area, never a pin. Its centre is shifted by a fixed, per-listing offset
 *   (up to ~300 m) so the circle never points at the house itself.
 * - `public`: a small ink dot on the exact spot.
 * Scroll-wheel zoom and one-finger dragging stay off, so the map never hijacks the page scroll.
 */
const props = defineProps<{ id: number; lat: number; lon: number; privacy: 'public' | 'approximate' | 'hidden' | string; label: string }>()

const el = ref<HTMLElement | null>(null)
let map: import('leaflet').Map | null = null

/** Deterministic pseudo-random offset from the listing id, in degrees. */
function offset(id: number): [number, number] {
  const a = Math.sin(id * 12.9898) * 43758.5453
  const b = Math.sin(id * 78.233) * 12345.6789
  const fx = a - Math.floor(a) - 0.5
  const fy = b - Math.floor(b) - 0.5
  return [fy * 0.0054, fx * 0.007] // ≈ ±300 m
}

onMounted(async () => {
  const L = await import('leaflet')
  if (!el.value) return
  const exact = props.privacy === 'public'
  const [dLat, dLon] = exact ? [0, 0] : offset(props.id)
  const center: [number, number] = [props.lat + dLat, props.lon + dLon]

  map = L.map(el.value, {
    center,
    zoom: exact ? 15 : 14,
    scrollWheelZoom: false,
    dragging: !L.Browser.mobile,
    zoomControl: true,
    attributionControl: true,
  })
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>',
  }).addTo(map)
  map.attributionControl.setPrefix(false)

  const ink = getComputedStyle(document.documentElement).getPropertyValue('--color-ink').trim() || '#17221f'
  if (exact) {
    L.circleMarker(center, { radius: 8, color: '#fff', weight: 3, fillColor: ink, fillOpacity: 1 }).addTo(map)
  } else {
    L.circle(center, { radius: 650, color: ink, weight: 1.5, opacity: 0.7, fillColor: ink, fillOpacity: 0.1 }).addTo(map)
  }
})

onBeforeUnmount(() => {
  map?.remove()
  map = null
})
</script>

<template>
  <div ref="el" class="listing-map size-full" role="region" :aria-label="label" />
</template>

<style scoped>
.listing-map { background: var(--color-stone-2); font-family: var(--font-sans); }
.listing-map :deep(.leaflet-tile-pane) { filter: grayscale(0.85) contrast(0.95) brightness(1.04); }
.listing-map :deep(.leaflet-control-zoom) { border: 0; box-shadow: 0 8px 24px -12px rgb(23 34 31 / 0.4); border-radius: 999px; overflow: hidden; }
.listing-map :deep(.leaflet-control-zoom a) { width: 2.5rem; height: 2.5rem; line-height: 2.5rem; color: var(--color-ink); border-color: var(--color-line); }
.listing-map :deep(.leaflet-control-attribution) { font-size: 0.6875rem; background: rgb(255 255 255 / 0.85); }
</style>
