import { defineSitemapEventHandler } from '#imports'

/** Every published listing, in both locales, for @nuxtjs/sitemap. */
export default defineSitemapEventHandler(async (event) => {
  const urls: { loc: string; lastmod?: string; _i18nTransform?: boolean }[] = []
  for (let offset = 0; offset < 2000; offset += 100) {
    const page = await listProperties(event, { limit: 100, offset }, 'en')
    for (const p of page.items) urls.push({ loc: `/properties/${p.slug}`, lastmod: p.updatedAt, _i18nTransform: true })
    if (offset + page.limit >= page.count) break
  }
  return urls
})
