# AGENTS.md — La Casa de Susana web

Guidance for any coding agent working in this repository.

## What this is

The public website of **La Casa de Susana**, a boutique real-estate agency in Ibiza run by Susana Rodrigo. The site reads its live catalogue from the **Vestta CRM** public API and sends every enquiry back into Vestta as a structured lead. Audience: international, high-end buyers and tenants; Ibiza owners. Product truth lives in `PRODUCT.md`. The visual system lives in `DESIGN.md` and the direction contract in `.impeccable/surfaces/`.

## Stack (pinned by the client)

- Nuxt 4 (Vue 3, `app/` directory), TypeScript strict
- Tailwind CSS v4 via `@tailwindcss/vite`; tokens live in `app/assets/css/main.css` (`@theme`)
- Lucide (`lucide-vue-next`) for icons, `simple-icons` for social brand marks
- `@nuxtjs/i18n` (EN default, ES under `/es`, `customRoutes: 'meta'`)
- `@nuxt/image` (ipx locally, Vercel image optimisation in production)
- `@nuxtjs/sitemap`, `@nuxtjs/robots`, `nuxt-schema-org` for SEO
- `lenis` for smooth wheel scrolling, `zod` for validation, `nodemailer` for SMTP
- Deploy target: **Vercel** (Nitro preset auto-detected)

## Commands

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (.output)
npm run preview
```

Without `NUXT_VESTTA_API_KEY` the site serves **development fixtures** (`server/utils/fixtures.ts` + `public/fixtures/`): the client's real listings from the legacy site. The footer then says so. Without SMTP, mails are logged to the server console instead of sent.

## Architecture

```
app/
  pages/                 index, properties/index, properties/[slug], contact,
                         private-search, rental-profile, sell, about, privacy
  components/            SiteHeader, HeroSearch, RevealImage, PropertyCard, ListingMap,
                         SiteFooter, FormPage, SusanaAside, LogoMark, BrandIcon
  plugins/reveal.ts      v-reveal scroll-in directive
  components/form/       FormShell, FormField, FormChoice, FormCheck, FormPhone
  composables/           useFormat (money/area/place), useLeadForm (validate + submit)
  utils/sizes.ts         vw() helper for @nuxt/image `sizes`
shared/                  code used by both client and server
  types/property.ts      normalised Property type
  utils/forms.ts         zod schemas for every form + AREAS + DIAL_CODES + toE164
  utils/property.ts      slugify, idFromSlug, primaryPrice
server/
  api/properties/        catalogue list + detail (cached 5 min, SWR)
  api/areas.get.ts       cities with counts
  api/forms/*.post.ts    contact, search-request, rental-profile, sell
  api/__sitemap__/urls   dynamic listing URLs for the sitemap
  utils/vestta.ts        API client (X-Api-Key, server-only)
  utils/normalize.ts     Vestta raw → Property (translations, privacy, sanitising)
  utils/catalogue.ts     list/get/areas, fixture fallback
  utils/leads.ts         deliverLead(): Vestta first, email fallback, 409 = "known"
  utils/mailer.ts        SMTP notifications
  utils/guard.ts         readForm(): zod + honeypot + timing + per-IP rate limit
i18n/locales/            en.json, es.json (keys must stay in parity)
```

## Vestta integration rules

- API docs: https://api-docs.vestta.io (OpenAPI at `/openapi.json`). Base `https://api.vestta.io/v1`, header `X-Api-Key`.
- The key needs only `properties:read` and `leads:ingest`. **Never** call Vestta from the browser or expose the key.
- Form → endpoint mapping:
  - `/contact` → `POST /leads/inquiries` (type from subject, message in `notes`)
  - Private search → `POST /leads/inquiries` with `search_preferences` (operations, property_types, per-type price/bedrooms, locations, `internal_notes`)
  - Rental profile → `POST /leads/ingest` with `search` + structured `tenant`; `propertyId` when applying for one listing
  - Sell your home → SMTP email only, for now
- `409` on inquiries means "phone already known in Vestta". Treat it as success (`known: true`), never retry.
- If Vestta fails, `deliverLead` falls back to email so no lead is lost.
- Business vocabulary is Spanish (`venta`, `alquiler`, `casa`, `apartamento`). Map UI labels through i18n.
- Listing URLs always end with the Vestta ID (`/properties/villa-nura-ses-torres-1977`); the CRM's bot rules rely on it. Build them with `listingSlug()` and parse with `idFromSlug()`. A bare ID redirects (301) to the canonical slug.
- Respect `specs.address_privacy`: approximate locations are shown as an area, never as a pin (`ListingMap`, Leaflet; the area centre is offset per listing so it never points at the house).
- Listing translations come from `specs.translations[locale]`; the base title and description are Spanish.

## Conventions

- Every user-facing string goes through i18n, in both `en.json` and `es.json`. Escape `@` as `{'@'}` in messages.
- To add a locale: add it to `i18n.locales` in `nuxt.config.ts`, add `i18n/locales/<code>.json`, add the paths in each page's `definePageMeta({ i18n: { paths } })`, and map it in `TRANSLATION_KEY` (normalize.ts) and `vesttaLanguage` (guard.ts).
- Never invent claims: no testimonials, awards, sales figures or press. `PRODUCT.md › Evidence on Hand` lists what is real.
- Images: use `NuxtImg`/`RevealImage` with `:sizes="vw(...)"`. A bare `"100vw"` breaks @nuxt/image v2 srcsets.
- Form schemas are shared: change `shared/utils/forms.ts`, then the server route and the page.
- Design: white, clean, premium (the client rejected a textured concept). White and stone grounds, pine-black `ink` for text and pill buttons, large rounded photography, Gambetta (light) for display and Supreme for UI, both self-hosted in `public/fonts`. Turquoise `mar` only in the logo badge. Motion: hero cross-fade, `RevealImage` unveil, `v-reveal`, and card→listing photo morph via `view-transition-name: listing-<id>`.

## Environment

See `.env.example`. All runtime config uses the `NUXT_` prefix (`runtimeConfig` in `nuxt.config.ts`).
