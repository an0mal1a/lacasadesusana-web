import tailwindcss from '@tailwindcss/vite'

const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'https://lacasadesusana.es'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  modules: [
    '@nuxtjs/i18n',
    '@nuxt/image',
    '@vueuse/nuxt',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',
    'nuxt-schema-org',
  ],

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: { include: ['lenis', 'lucide-vue-next', 'simple-icons', 'zod'] },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'theme-color', content: '#ffffff' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preload', href: '/fonts/gambetta-300.woff2', as: 'font', type: 'font/woff2', crossorigin: '' },
        { rel: 'preload', href: '/fonts/supreme-400.woff2', as: 'font', type: 'font/woff2', crossorigin: '' },
      ],
    },
  },

  runtimeConfig: {
    vestta: {
      apiKey: '', // NUXT_VESTTA_API_KEY
      baseUrl: 'https://api.vestta.io/v1', // NUXT_VESTTA_BASE_URL
    },
    smtp: {
      host: '', // NUXT_SMTP_HOST
      port: 587, // NUXT_SMTP_PORT
      secure: false, // NUXT_SMTP_SECURE
      user: '', // NUXT_SMTP_USER
      pass: '', // NUXT_SMTP_PASS
    },
    mail: {
      from: '', // NUXT_MAIL_FROM
      to: '', // NUXT_MAIL_TO
    },
    public: {
      siteUrl, // NUXT_PUBLIC_SITE_URL
      phone: '+34676671258',
      email: 'info@lacasadesusana.es',
    },
  },

  site: {
    url: siteUrl,
    name: 'La Casa de Susana',
    description: 'Luxury villas, fincas and homes for sale and rent in Ibiza, personally selected by Susana Rodrigo.',
    defaultLocale: 'en',
  },

  i18n: {
    baseUrl: siteUrl,
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    customRoutes: 'meta',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'lcds_lang',
      redirectOn: 'root',
    },
    // Add a locale here (and its JSON file) to grow the site: de, fr, it are planned.
    locales: [
      { code: 'en', language: 'en-GB', name: 'English', file: 'en.json' },
      { code: 'es', language: 'es-ES', name: 'Español', file: 'es.json' },
    ],
  },

  image: {
    quality: 78,
    format: ['avif', 'webp'],
    domains: ['cdn.vestta.io', 'cdn.vestta.app', 'vestta.app', 'api.vestta.io', 'storage.googleapis.com', 'lacasadesusana.es'],
    screens: { xs: 390, sm: 640, md: 768, lg: 1024, xl: 1280, xxl: 1600 },
    densities: [1, 2],
  },

  sitemap: {
    sources: ['/api/__sitemap__/urls'],
    exclude: ['/privacy', '/es/privacidad'],
  },

  routeRules: {
    '/api/properties/**': { cors: false },
    '/fonts/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
  },

  nitro: {
    compressPublicAssets: true,
  },

  experimental: {
    viewTransition: true,
  },

  typescript: {
    strict: true,
  },
})
