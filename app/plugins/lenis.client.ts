import Lenis from 'lenis'

/** Weighted, smooth wheel scrolling — disabled for reduced motion and touch (native feels better there). */
export default defineNuxtPlugin((nuxtApp) => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 0.95, smoothWheel: true, syncTouch: false })
  const raf = (time: number) => {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }
  requestAnimationFrame(raf)
  nuxtApp.hook('page:finish', () => lenis.scrollTo(0, { immediate: true }))
  return { provide: { lenis } }
})
