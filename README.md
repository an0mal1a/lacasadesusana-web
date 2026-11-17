# La Casa de Susana — web

Luxury real-estate website for La Casa de Susana (Ibiza), connected to the Vestta CRM.

- **Stack:** Nuxt 4 · Vue 3 · Tailwind CSS v4 · Lucide · @nuxtjs/i18n · @nuxt/image
- **Data:** Vestta public API (catalogue + leads), server-side only
- **Deploy:** Vercel

## Getting started

```bash
cp .env.example .env   # fill in the Vestta key and SMTP
npm install
npm run dev
```

Without a Vestta key the site runs on development fixtures (the agency's real listings from the legacy site), so the design can be reviewed before the CRM is connected.

## Forms

| Page | Route (EN / ES) | Goes to |
| --- | --- | --- |
| Contact | `/contact` · `/es/contacto` | Vestta `POST /leads/inquiries` |
| Private search | `/private-search` · `/es/busqueda-privada` | Vestta `POST /leads/inquiries` + `search_preferences` |
| Rental profile | `/rental-profile` · `/es/perfil-de-alquiler` | Vestta `POST /leads/ingest` + `tenant` |
| Sell your home | `/sell-your-home` · `/es/vender-tu-casa` | SMTP email |

If Vestta is unreachable, every lead falls back to an SMTP email to the agency.

See `AGENTS.md` for the architecture and conventions, `PRODUCT.md` for product context and `DESIGN.md` for the design system.
