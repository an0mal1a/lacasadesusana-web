const SCREENS = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const

/**
 * Build a @nuxt/image `sizes` string, carrying each width forward to larger screens
 * (the module only emits a candidate per explicitly named screen).
 * vw('100', { lg: 58 }) → "xs:100vw sm:100vw md:100vw lg:58vw xl:58vw xxl:58vw"
 */
export function vw(base: number, steps: Partial<Record<(typeof SCREENS)[number], number>> = {}): string {
  let cur = base
  return SCREENS.map((s) => {
    cur = steps[s] ?? cur
    return `${s}:${cur}vw`
  }).join(' ')
}
