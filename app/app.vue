<script setup lang="ts">
const head = useLocaleHead({ seo: true })
const { t } = useI18n()
const config = useRuntimeConfig()

useHead(() => ({
  htmlAttrs: { lang: head.value.htmlAttrs?.lang },
  link: [...(head.value.link || [])],
  meta: [...(head.value.meta || [])],
  // Marks the document as scripted before first paint, so scroll reveals only hide content when they can show it again.
  script: [{ key: 'js-flag', innerHTML: "document.documentElement.classList.add('js')", tagPosition: 'head' }],
}))

useSeoMeta({
  titleTemplate: (title?: string) => (title ? `${title} · La Casa de Susana` : 'La Casa de Susana · Ibiza'),
  ogSiteName: 'La Casa de Susana',
  ogType: 'website',
  ogImage: `${config.public.siteUrl}/og-default.jpg`,
  twitterCard: 'summary_large_image',
})

useSchemaOrg([
  defineOrganization({
    '@type': ['Organization', 'RealEstateAgent'],
    name: 'La Casa de Susana',
    logo: '/logo-512.png',
    email: config.public.email,
    telephone: config.public.phone,
    foundingDate: '2010',
    founder: { '@type': 'Person', name: 'Susana Rodrigo' },
    areaServed: [{ '@type': 'Place', name: 'Ibiza' }, { '@type': 'Place', name: 'Balearic Islands' }],
    knowsLanguage: ['en', 'es'],
    address: { '@type': 'PostalAddress', addressRegion: 'Illes Balears', addressLocality: 'Ibiza', addressCountry: 'ES' },
    sameAs: ['https://www.facebook.com/lacasadesusanaibiza/'],
  }),
  defineWebSite({ name: 'La Casa de Susana', description: () => t('home.metaDescription') }),
])
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
