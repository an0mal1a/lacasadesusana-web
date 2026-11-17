/**
 * v-reveal: content rises in once when it enters the viewport.
 * `v-reveal="120"` adds a stagger delay in ms. SSR renders the attribute so the
 * initial state is set before hydration (only when the `js` class is on <html>).
 */
export default defineNuxtPlugin((nuxtApp) => {
  let io: IntersectionObserver | null = null
  const observer = () =>
    (io ??= new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          e.target.classList.add('in')
          io!.unobserve(e.target)
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    ))

  nuxtApp.vueApp.directive<HTMLElement, number | undefined>('reveal', {
    getSSRProps: binding => ({ 'data-reveal': '', style: binding.value ? `--d:${binding.value}ms` : undefined }),
    mounted(el, binding) {
      el.setAttribute('data-reveal', '')
      if (binding.value) el.style.setProperty('--d', `${binding.value}ms`)
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return el.classList.add('in')
      observer().observe(el)
    },
    unmounted(el) {
      io?.unobserve(el)
    },
  })
})
