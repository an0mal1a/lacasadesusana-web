# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Nuxt 4 (Vue 3), TailwindCSS, Lucide icons — pinned by the user. Any supporting package is allowed on top. Deployed on Vercel (SSR with route-level caching; Nitro server routes hold the CRM key and SMTP credentials). Data source: Vestta CRM public API (`https://api.vestta.io/v1`).

## Users

- **International high-net-worth buyers** (primarily foreign: UK, Nordic, German, French, Italian, Dutch) looking for a villa, finca or apartment in Ibiza, often researching remotely from their home country before a viewing trip.
- **Seasonal and long-term tenants** of a similar profile who want a quality rental and expect to be qualified (income, stay length, household).
- **Property owners** in Ibiza who want an agency to sell or rent their home.
- Spanish-speaking clients (residents, mainland buyers) as a secondary audience.

## Product Purpose

The website of La Casa de Susana, a boutique real-estate agency in Ibiza. It shows the agency's live catalogue straight from the Vestta CRM and turns visitors into qualified CRM leads: buyer/tenant search requests, rental tenant profiles, owner listing requests and general enquiries. Success = more qualified international leads arriving in Vestta with structured search preferences, and a brand perception on par with top-tier luxury agencies (the current site is outdated and frequently fails on SSL).

## Positioning

A personal, founder-led agency rather than a franchise: Susana Rodrigo, from San Sebastián, resident in Ibiza since 1999, founded the agency in 2010 after working at "The Key, Ibiza". About 90% of the listings are managed directly with the owner; when a client needs something not in stock, she works with partner agencies. She has a network of banks, law firms and associated firms for discreet negotiations.

## Operating Context

- Listings, images, videos, translations (en/fr/de/it/pt/ca) and features come from Vestta; the site never stores its own listing data.
- Forms post to the site's own server routes, never directly to Vestta from the browser:
  - Contact (`/contact`) → Vestta `POST /v1/leads/inquiries`.
  - Search request ("leave a request") → `POST /v1/leads/inquiries` with `search_preferences` (creates the client and their request in the CRM).
  - Rental tenant profile → `POST /v1/leads/ingest` with `tenant` profile (optionally with a `propertyId`).
  - List your property → email via SMTP to the agency for now (an owner lead in Vestta may follow later).
- API key scopes needed: `properties:read`, `leads:ingest`.

## Capabilities and Constraints

- Languages: **EN (default) + ES** for this demo. **Open decision:** the site must grow to more languages (DE, FR, IT at least). i18n must be built so adding a locale costs translations, not refactors.
- Geographic focus: **Ibiza first**. **Open decision, to raise with the client:** the brand may cover all of the Balearic Islands (current catalogue includes Mallorca: Ses Salines, Es Llombards/Santanyí). Location handling must not hard-code Ibiza-only.
- SEO aimed at luxury and international search: villas for sale in Ibiza, luxury real estate, plus multilingual hreflang, structured data (RealEstateAgent, listing schema) and fast Core Web Vitals.
- The address privacy set in Vestta must be respected (approximate locations shown as areas, never pins).
- Contact data: phone (+34) 676 671 258, email info@lacasadesusana.es, Facebook lacasadesusanaibiza, LinkedIn (URL to be confirmed).

## Brand Commitments

- Name: "La Casa de Susana".
- Logo: a white A-shaped peak over two waves, on turquoise (`#5EFFFF` in the logo file; `#7BE2F2` on the current site). Source: https://cdn.vestta.app/logo/bb352b93831e44b5fb00dd6d91540f5ecda31792/ea904bba3cfe4cdd8830d6f3c0b58403.png
- The user asked for a Mediterranean luxury look and no generic fonts.
- **Standing preference (2026-11-17):** the user rejected a crafted/material direction ("Espart i Savina") as looking cheap. The site must be **white, clean, premium and professional**, in the register of the current "premium real-estate web design" trend: generous whitespace, large rounded photography, refined type, restrained but polished motion (transitions and reveals are welcome; heavy motion is not). The legacy site's look is not a reference at all. The turquoise from the logo is a brand mark, not a page colour.

## Evidence on Hand

- Founder story and agency facts (above), taken from the current site.
- The live property catalogue from Vestta.
- A portrait of Susana (selfie-style, 768×801) on the current site: `https://lacasadesusana.es/wp-content/uploads/2019/11/Susana-rodrigo.jpeg`. Usable for the demo; a professional portrait should be commissioned.
- Listing photos of the current catalogue (villas in Jesús and Sa Carroca, Botafoc apartments, Mallorca projects) on the current site, used only as development fixtures until the Vestta key is set.
- **Absent and must not be invented:** testimonials, press, awards, sales figures, team members other than Susana, and certifications. The current site's "safe agent / my deposits" and "20 years" claims are template copy and must not be carried over without the client confirming them.

## Product Principles

1. The catalogue is the hero: every listing must look as good as the house.
2. Discreet and personal over loud and salesy: it's one person who knows the island.
3. Every form produces a structured, usable lead in Vestta, not a loose email.
4. International by default: English first, the price is always clear, and every route is translatable.
5. Fast on a phone in a villa with patchy 4G.
