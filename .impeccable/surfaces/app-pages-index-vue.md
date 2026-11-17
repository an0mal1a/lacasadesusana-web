---
version: 1
slug: "app-pages-index-vue"
primary_target: "app/pages/index.vue"
related_targets: ["app/pages"]
---

# Surface brief — Public site (home + catalogue + forms)

Scope: the whole public website, led by the home page. Visitor mode: **Persuade** (home, sell, private search), with the catalogue and forms as working tools inside the same world.
Audience: international HNW buyers and tenants researching Ibiza remotely, and Ibiza owners. Action: start a real property search (buy/rent, area, type, budget) from the first viewport. Secondary: leave a private search request, or list your home.
Proof: the live Vestta catalogue (real photos and prices) and Susana's story (on the island since 1999, agency since 2010). Never invented testimonials or numbers.

## Direction contract

THESIS: A white, quiet, premium agency site where the houses do the talking. This is the category standard (the user's pinned choice), executed at the craft level of the best luxury-hospitality and premium real-estate sites. It refuses texture, costume and gimmicks.

OWN-WORLD:
- Grounds: pure white #FFFFFF alternating with warm stone #F5F3EF. Ink is pine-black #17221F (user reference), muted text #6B6862, hairlines #E6E3DD.
- Primary actions are ink pills. Turquoise lives only in the logo and a small active-state dot.
- Photography is large and rounded (radius 20–28px) with generous margins.
- Type: Gambetta (light, refined serif) for display; Supreme (grotesk) for UI, labels and numbers.

STORY: The visitor sees beautiful Ibiza houses immediately, searches or browses clean listing cards, opens a listing through a seamless photo transition, meets Susana as a real person, and leaves a private search that lands in Vestta.

FIRST VIEWPORT:
- A full-height hero photo inset 12–16px from the edges, radius 28px, slowly crossfading between featured villas.
- Transparent header over it, with white logo and nav.
- Bottom-left: a large white Gambetta headline (about 5.5rem) with one line of lede.
- Bottom, spanning: a floating white search bar with Buy/Rent tabs, Area, Type, Budget and an ink Search button (Bedrooms lives in the catalogue filters).
- Bottom-right: a current-villa chip (name, price, arrow) with slide indicators.

FORM: Category standard (canon), user-pinned on 2026-11-17 after rejecting the rolled direction "Espart i Savina" (seed cc92471f). Signature interaction: the shared-element view transition from card photo to listing hero. Motion grammar: slow crossfades, mask reveals on scroll, gentle hover zoom; nothing bouncy.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved
- More locales (DE/FR/IT) are to be added. Brand scope (Ibiza vs all of the Balearics) is to be confirmed with the client.
- Legal texts are to be supplied by the client. The user may send concrete reference URLs to fine-tune.

## User additions (2026-11-17, after first white build)
- Mobile is the priority surface: judge every page at 390 wide first.
- Forms must be comfortable to fill: long forms are split into steps (progress bar, per-step validation, sticky Continue on phones), money inputs format as you type, counters instead of typed numbers.
- Intro section follows the user's reference `.impeccable/review/reference-intro.png`: organic-cornered photo, heading + text + button, vertical divider, three icon facts (On Ibiza since 1999 / Own agency since 2010 / 9 in 10 homes direct).
- Card hover must be gentle (the earlier zoom read as aggressive).
- Overall reference: `.impeccable/review/reference-pinterest.jpg` (warm white, serif display, dark pill buttons, floating search pill, rounded listing cards with spec icons).
- Live Vestta data is connected; listing photos carry a Vestta watermark that the site cannot remove (CRM-side setting).
