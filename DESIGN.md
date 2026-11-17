---
name: La Casa de Susana
description: A white, quiet, premium agency site where the houses do the talking.
colors:
  paper: "#ffffff"
  stone: "#f6f4f0"
  stone-2: "#ece8e1"
  line: "#e4e0d9"
  line-strong: "#cfcac1"
  ink: "#17221f"
  ink-2: "#2a3833"
  muted: "#6b6862"
  faint: "#9b978f"
  mar: "#13c6c9"
  alert: "#b3361f"
typography:
  display:
    fontFamily: "Gambetta, 'Iowan Old Style', 'Palatino Linotype', serif"
    fontSize: "clamp(2.75rem, 1.6rem + 4.6vw, 6rem)"
    fontWeight: 300
    lineHeight: 1
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Gambetta, 'Iowan Old Style', 'Palatino Linotype', serif"
    fontSize: "clamp(2.1rem, 1.5rem + 2.4vw, 3.75rem)"
    fontWeight: 300
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Gambetta, 'Iowan Old Style', 'Palatino Linotype', serif"
    fontSize: "1.9rem"
    fontWeight: 300
    lineHeight: 1.25
  card-title:
    fontFamily: "Gambetta, 'Iowan Old Style', 'Palatino Linotype', serif"
    fontSize: "1.45rem"
    fontWeight: 400
    lineHeight: 1.15
  body:
    fontFamily: "Supreme, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.625
  body-listing:
    fontFamily: "Supreme, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.75
  button:
    fontFamily: "Supreme, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 500
    lineHeight: 1
  price:
    fontFamily: "Supreme, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 500
    lineHeight: 1.4
    fontFeature: "'tnum', 'lnum'"
  label:
    fontFamily: "Supreme, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    letterSpacing: "0.01em"
rounded:
  check: "6px"
  input: "0.875rem"
  card: "1.25rem"
  search-stack: "1.5rem"
  hero: "1.75rem"
  pill: "999px"
spacing:
  gutter-phone: "16px"
  gutter-tablet: "32px"
  gutter-desktop: "48px"
  rail-gap: "16px"
  grid-gap: "24px"
  grid-row-gap: "56px"
  section-phone: "80px"
  section-desktop: "128px"
  hero-inset-phone: "8px"
  hero-inset-desktop: "12px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "0.85rem 1.6rem"
    height: "3.25rem"
  button-primary-hover:
    backgroundColor: "{colors.ink-2}"
    textColor: "{colors.paper}"
  button-primary-disabled:
    backgroundColor: "{colors.faint}"
    textColor: "{colors.paper}"
  button-light:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0.85rem 1.6rem"
    height: "3.25rem"
  button-light-hover:
    backgroundColor: "{colors.stone}"
  button-ghost:
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0.85rem 1.6rem"
    height: "3.25rem"
  button-ghost-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.input}"
    padding: "0.8rem 1rem"
    height: "3.25rem"
  chip:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0.55rem 1.1rem"
    height: "2.75rem"
  chip-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  tag:
    backgroundColor: "{colors.stone}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0.5rem 1rem"
  property-card-photo:
    backgroundColor: "{colors.stone-2}"
    rounded: "{rounded.card}"
  form-shell:
    backgroundColor: "{colors.stone}"
    rounded: "{rounded.hero}"
    padding: "28px 20px"
  hero-search:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "8px"
  footer:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.hero}"
  logo-badge:
    backgroundColor: "{colors.mar}"
    textColor: "{colors.paper}"
    size: "36px"
---

# Design System: La Casa de Susana

## Overview

**Creative North Star: "The Quiet Gallery"**

A white gallery whose exhibits are Ibiza houses. Pure white paper alternates with a warm stone ground; everything else steps back so the listing photography, large and softly rounded, carries all the colour on the page. Type is a light, refined serif for anything that speaks (Gambetta) and a clean grotesk for anything that works (Supreme). Actions are pine-black pills. The palette is deliberately colourless so a turquoise sea in a listing photo reads as the most saturated thing on screen.

Density is low and generous: sections breathe on 80px (phone) and 128px (desktop) vertical padding, cards sit in a three-up grid with 56px between rows, and copy is held to readable measures (36–58ch for ledes and body, 68ch for listing prose). The page is built for a phone first, at 390 wide: photo rails swipe, the listing gallery becomes a full-bleed strip, long forms break into short steps with a sticky Continue.

Motion is slow, soft and one-way: photos cross-fade and settle from a gentle zoom, frames unveil from the bottom as they enter, content rises in once, and a listing photo morphs from its card into the listing page. Nothing bounces, nothing loops for attention, and with reduced motion every element is simply present. The system refuses texture, material costume and decorative gimmicks; the user rejected a crafted, material direction as looking cheap.

**Key Characteristics:**
- White and warm-stone grounds in alternation; colour comes only from photography.
- Gambetta Light display over Supreme UI; tabular numerals for every price, area and count.
- Large rounded photography (20px cards, 28px hero panels) with generous margins.
- Ink pill buttons; a single ink focus ring; hairlines instead of boxes.
- Slow cross-fades, bottom-up mask reveals, a 1.025 hover zoom, and a card-to-listing shared-element transition.
- Mobile-first: rails, a swipeable photo strip, stepped forms, 44px+ targets.

## Colors

A near-monochrome warm-neutral palette, anchored by a green-tinted pine-black, with the logo's turquoise held strictly inside the logo.

### Primary
- **Pine Ink** (#17221f): body text, headings, the primary pill button, selected chips, the active Buy/Rent segment, the checked checkbox, step progress fill, the focus ring, text selection, the footer and the dark hero/close panels.
- **Pine Ink Lifted** (#2a3833): the primary button's hover ground and listing prose text; one step lighter than ink, never a separate accent.

### Secondary
- **Brick Alert** (#b3361f): validation errors only (invalid input border, error text, error panel). Never decorative.

### Tertiary
- **Mar Turquoise** (#13c6c9): the logo badge behind the white peak-and-waves mark, in the header (36px, 0.6rem corners) and the footer (44px). Nowhere else.

### Neutral
- **Paper** (#ffffff): the default page ground, cards' text column, inputs, the floating search, light pills.
- **Warm Stone** (#f6f4f0): the alternate section ground, form shells, segmented-control tracks, feature tags, hover fills on rows and search fields.
- **Pressed Stone** (#ece8e1): image placeholders behind photos still loading.
- **Hairline** (#e4e0d9): every divider, card outline ring, input border, progress track and list rule.
- **Hairline Strong** (#cfcac1): hover border on inputs and chips, resting border on checkboxes. Currently a literal in source, not a theme variable.
- **Warm Muted** (#6b6862): secondary text, ledes, meta lines, icons beside data (5.3:1 on white).
- **Warm Faint** (#9b978f): tertiary marks only: placeholders, select chevrons, arrow glyphs in rows, separators, disabled button ground.

### Named Rules
**The Houses Carry the Colour Rule.** The interface is white, stone and ink. Any saturated colour on screen must come from a photograph.

**The Logo-Only Turquoise Rule.** Mar appears only as the logo badge. It is never a link colour, a button, an active state, a tint or a section ground.

**The Ink Means Act Rule.** A filled ink shape is either an action (pill button) or a chosen state (selected chip, active segment, checked box, progress). Ink is not used for decoration.

## Typography

**Display Font:** Gambetta (with Iowan Old Style, Palatino Linotype, serif), self-hosted in weights 300, 300 italic, 400, 400 italic, 500.
**Body Font:** Supreme (with ui-sans-serif, system-ui, sans-serif), self-hosted in weights 300, 400, 500, 700.

**Character:** A light, high-contrast serif that reads like a well-set brochure headline, paired with a calm, slightly geometric grotesk that handles forms, numbers and navigation without competing.

### Hierarchy
- **Display** (Gambetta 300, clamp 2.75rem to 6rem, line-height 1, tracking -0.025em): one per page; the hero headline in white over photography, and the page title on catalogue and form pages.
- **Title** (Gambetta 300, clamp 2.1rem to 3.75rem, line-height 1.05, tracking -0.02em): every section heading (Selected properties, Susana, ways of working, areas, close, similar listings). Short measures (16–20ch) are common.
- **Headline** (Gambetta 300, about 1.75–2rem, line-height ~1.25): sub-section headings inside a page: listing Description, Features, Location, Enquire; each form step title; form success title (2.2rem).
- **Card Title** (Gambetta 400, 1.45rem, line-height 1.15): listing card titles; the Susana card name (1.4rem); area names in the area list run Gambetta 300 at 1.6rem to 2.6rem.
- **Listing Price** (Gambetta 400, clamp 2rem to 3rem, line-height 1, tabular): the listing page price only. Card prices use the Supreme price role.
- **Body** (Supreme 400, 1.0625rem to 1.125rem, relaxed leading ~1.625): ledes and paragraphs in muted, 36–58ch.
- **Listing Prose** (Supreme 400, 1.0625rem, line-height 1.75, max 68ch, ink-2): CRM descriptions; CRM h2/h3 and bold-only paragraphs are promoted to Gambetta 400 at 1.45–1.6rem.
- **Price** (Supreme 500, 1.125rem, tabular lining numerals): card prices; "/month" follows in Supreme 400 muted at 0.9375rem.
- **Button** (Supreme 500, 0.9375rem; 0.875rem in compact header and footer pills).
- **Label** (Supreme 500, 0.8125rem, tracking 0.01em, sentence case): the operation tag on cards, search field captions, footer column headings, form field labels (0.875rem).

### Named Rules
**The Light Serif Rule.** Display and section headings are Gambetta Light (300). Weight 400 is for small serif sizes (card titles, CRM subheads, prices); 500 is reserved.

**The Tabular Numbers Rule.** Every price, area, bedroom count, reference number, phone number and step counter uses tabular lining numerals.

**The Sentence Case Rule.** Labels are sentence case at 0.01em tracking. The only uppercase text is the two-letter locale switch (EN/ES).

## Layout

**Container.** One wrap for everything: max 1440px, centred, with gutters of 16px on phones, 32px from 768px and 48px from 1280px. Breakpoints are Tailwind's defaults (640, 768, 1024, 1280).

**Section rhythm.** Sections run 80px top and bottom on phones and 128px from 768px, and alternate white and warm stone so the page reads in calm bands without rules or boxes (home: hero, stone intro on desktop, white selection, stone Susana, white ways, stone areas, dark close). Headings sit 40px (phone) to 56px (desktop) above their content.

**Inset panels.** The home hero, the close panel and the footer are dark rounded panels inset from the viewport edge by 8px on phones and 12px from 768px, rounded at 28px. The desktop hero is full viewport height minus that inset (min 44rem); on phones it is 64svh (min 30rem) and the search card overlaps its bottom edge by 32px.

**Grids.** Content uses a 12-column grid from 1024px (intro 5/4/3 with a vertical hairline before the three facts; Susana 5/7; listing body 7/5 with a sticky enquiry aside; form pages 8/4 with a sticky Susana card). Listing grids are 1, 2 (640px) and 3 (1024px or 1280px on the catalogue) columns with 24px column gaps and 56px row gaps.

**Rails on phones.** Below 640px, listing collections become a horizontal swipe rail: items at 84% width with the next card peeking, mandatory snap to start, 16px gaps, bleeding to the screen edge, scrollbar hidden. From 640px the same markup becomes the grid.

**Mobile-first rules.**
- Judge every page at 390 wide first.
- The listing page opens with a full-bleed 4:3 photo strip (snap per photo, counter bottom-left, "all photos" pill bottom-right) before the title; the desktop bento appears from 768px.
- The hero search becomes a stacked white card under the hero; area spans full width, type and budget sit two-up, search is full-width.
- Catalogue filters collapse behind one "Filters" row inside a sticky white bar.
- Navigation collapses into a full-screen white drawer below 1280px.
- Hit targets are at least 44px (icon buttons 44px, chips 44px, inputs and buttons 52px).
- Phone-only copy can be shorter (the hero lede has a short variant).

## Elevation & Depth

Flat by default, with depth from tonal grounds (white over stone, photography over ink) and hairlines. Shadows exist only where something genuinely floats over a photograph or responds to a press: they are long, soft and ink-tinted, with negative spread so they sit under the object rather than around it.

### Shadow Vocabulary
- **Floating search** (`box-shadow: 0 30px 60px -30px rgb(23 34 31 / 0.45)`): the hero search bar over the hero photo.
- **Photo pill** (`box-shadow: 0 10px 30px -12px rgb(23 34 31 / 0.5)`): the white "all photos" button floating over the gallery (0 8px 24px -10px on phones).
- **Button lift** (`box-shadow: 0 10px 24px -12px rgb(23 34 31 / 0.45)`): the primary pill on hover only.
- **Header hairline** (`box-shadow: 0 1px 0 #e4e0d9`): the solid header's bottom edge, with a 90% white ground and backdrop blur.
- **Focus halo** (`box-shadow: 0 0 0 4px rgb(23 34 31 / 0.08)`): inputs on focus, with an ink border.

### Named Rules
**The Float-Only Shadow Rule.** A surface earns a shadow only when it floats over a photograph or answers a hover. Cards, form shells and sections never carry a resting shadow.

**The Glass Over Photos Rule.** Translucency and backdrop blur are used only where UI sits on imagery or scrolling content: the header, the hero villa chip, the card operation tag, the sticky filter bar and the phone form action bar.

## Shapes

The form language is soft rectangles and full pills. Photographs are rounded at 20px (cards, bento tiles, map, video) or 28px (hero, close panel, footer, Susana portrait, form shell, Susana card, empty state). Every button, tag, segmented control, chip, slide indicator and icon button is a full pill or circle. Inputs and counters use a 14px radius; checkboxes 6px. On phones the hero search is a 24px-radius card; from 1024px it becomes a full pill.

One organic exception: the home intro photo is clipped by an SVG path with a softly bowed bottom edge and a rounded top-right corner, bleeding off the left gutter. It is a single signature shape for the intro, not a pattern for other photos.

Borders are 1px hairlines; the ghost button draws its border as an inset 1px ring in currentColor.

## Components

### Buttons
Quiet, confident pills.
- **Shape:** full pill (999px), minimum height 52px (44px in the header and compact uses), icon gap ~10px.
- **Primary:** ink ground, white text, Supreme 500 at 0.9375rem, padding 0.85rem 1.6rem.
- **Hover / Focus:** ground lifts to ink-2 with the soft button-lift shadow (0.3s, ease-soft); press scales to 0.98; focus is the global 2px ink outline at 3px offset. A trailing arrow nudges 4px right on hover of its group (0.45s).
- **Light:** white ground with ink text, hover to stone; used on the dark hero header, the footer and the close panel.
- **Ghost:** transparent with an inset 1px currentColor ring; hover fills ink with white text. A light variant on dark panels fills white with ink text.
- **Disabled:** faint ground, no shadow, not-allowed cursor.

### Chips
- **Style:** pill, 44px tall, white ground, 1px hairline border, ink text at 0.9375rem; hover darkens the border to hairline-strong.
- **State:** selected chips fill ink with white text (0.3s ease-soft). Used for every single and multiple choice in forms (operation, types, areas, must-haves, timeline). Non-interactive feature tags on the listing page are stone pills without a border.

### Cards / Containers
- **Property card:** a 20px-rounded photo (4:5 on the home rail, 4:3 elsewhere) on a pressed-stone placeholder, a white glass operation tag top-left, and a white arrow disc that fades in bottom-right on hover. Below, with no box: Gambetta title, muted place and reference line, then price (left) and bed/bath/area with Lucide icons (right). The whole card is one link.
- **Corner Style:** 20px for photos; 28px for panels.
- **Background:** photos sit directly on the page ground; form shells and empty states are stone; the Susana card is white with a hairline ring.
- **Shadow Strategy:** none at rest (see Elevation).
- **Spec grid:** listing specs are a 2- or 4-column grid of white cells divided by 1px hairline gaps inside a 20px-rounded ring; values in Gambetta at 1.75rem.

### Inputs / Fields
- **Style:** white ground, 1px hairline border, 14px radius, 52px tall, 1rem text, padding 0.8rem 1rem; placeholders in faint; selects carry an ink chevron.
- **Focus:** ink border plus a 4px ink halo at 8% opacity.
- **Error / Disabled:** brick border; brick error text at 0.8125rem under the field with role alert; a summary line above the actions and a pale brick panel for send failures.
- **Labels:** Supreme 500 at 0.875rem above the control, with an "Optional" marker right-aligned.

### Form Comfort
Forms are built to be filled on a phone without effort.
- **Steps:** long forms (private search, rental profile, sell) split into short screens, each validated on its own before advancing; contact details are always the last step. A row of thin pill progress segments (4px, hairline track, ink fill that grows from the left over 0.7s) sits under a "Step n of N" counter and a "Next: …" preview.
- **Step transition:** the outgoing step slides 28px out and fades while the next slides 28px in from the travel direction (opacity 0.35s ease-soft, transform 0.5s ease-out); the shell scrolls back to its top if needed.
- **Sticky actions:** on phones the Back/Continue bar pins to the bottom of the screen inside the form (stone glass, hairline top, safe-area padding), with Continue filling the width and Back collapsing to an icon.
- **Money:** euro amounts format with thousands separators as you type, use the numeric keypad and show a muted € (and "/month") suffix.
- **Counters:** numbers like minimum bedrooms are a − value + counter (52px tall, 40px round buttons) where empty means "Any", never a typed number.
- **Phone:** a country dial-code select beside the national number.
- **Inputs:** correct autocomplete, inputmode, enterkeyhint and autocapitalize on every field.
- **Outcome:** success replaces the form with an ink check disc, a Gambetta headline and a ghost "send another" button, and moves focus to it.

### Navigation
- **Header:** fixed; 72px tall (80px from 1024px). On the home hero it is transparent with white type and a light Contact pill; after 40px of scroll, and on every other page, it becomes 90% white with blur and a hairline. Logo badge plus Gambetta wordmark at 1.3rem on the left; links in Supreme 0.9375rem with an underline that draws in from the left on hover and stays for the current page; EN/ES switch; Contact pill with nudging arrow.
- **Mobile:** below 1280px a menu button opens a full-screen white drawer: Gambetta links at 2rem on hairline rows, staggered in (45ms apart, rising 16px over 0.7s), with a full-width Call pill and the language choice at the bottom.
- **Footer:** an inset 28px-rounded ink panel with the logo, a Gambetta Light tagline, phone and email, a light Private search pill, round social buttons (white ring, fill white on hover), and three link columns with quiet white/50 headings.

### Hero Search (signature)
The working search, floating over the hero. A white pill (24px card on phones) with the floating-search shadow holds a Buy/Rent segmented control (an ink thumb that slides 0.5s ease-out across a stone track), three select fields with a Lucide icon, a muted label caption and a stone hover fill, and an ink Search pill. It routes to the catalogue with filters applied.

### Reveal Image (signature)
Every editorial photograph unveils once when 12% of it is in view: the frame opens upwards from the bottom (clip-path, 1.2s ease-out) while the photo settles from 1.12 scale to 1 (1.8s ease-out), with an optional stagger delay. The image is always in the DOM. Without JS or with reduced motion it is shown as-is.

### Motion Grammar
- **Hero cross-fade:** up to four featured listings cross-fade every 7s (opacity 1.8s ease-soft) while the active photo eases from 1.08 to 1 scale over 9s linear. Pill indicators fill over the 7s; choosing one stops autoplay. The villa chip swaps its content with an 8px rise.
- **Hero entrance:** headline, lede and chip rise 24px and fade in over 1.2s with 120ms staggers.
- **v-reveal:** headings, text and list items rise 28px and fade in once (opacity 1s, transform 1.1s, ease-out) when they cross 8% from the bottom of the viewport, with per-item stagger delays (60–200ms).
- **Card to listing:** each card photo carries a view-transition name matched by the listing hero (desktop bento lead or phone strip first photo), so the photo morphs into place (0.7s ease-out) while the rest of the page cross-fades (out 0.35s, in 0.6s with a 12px rise).
- **Hover:** photos zoom to 1.025 over 2.2s ease-soft; arrows nudge 4px; underlines draw in over 0.45s; area rows slide 8px.
- **Smooth scroll:** Lenis on wheel input; galleries and the lightbox opt out.
- **Reduced motion:** all animations and transitions collapse to near-zero, view transitions are disabled, v-reveal and Reveal Image content is shown immediately, the hero does not autoplay or zoom, and indicators render full.

## Do's and Don'ts

### Do:
- **Do** alternate white (#ffffff) and warm stone (#f6f4f0) sections and let the photographs supply all colour.
- **Do** use the ink pill for the primary action on every surface, and the light or ghost pill beside it.
- **Do** set display and section headings in Gambetta Light with negative tracking, and everything functional in Supreme.
- **Do** round photographs at 20px (cards) or 28px (panels) and keep generous margins around them.
- **Do** use tabular numerals for every price, area, count and phone number.
- **Do** design at 390 wide first: rails for collections, a swipe strip for listing photos, sticky actions in forms, 44px minimum targets.
- **Do** split long forms into validated steps with a progress bar, format money as it is typed, and use counters instead of typed numbers.
- **Do** keep hover gentle: a 1.025 photo zoom over 2.2s, a 4px arrow nudge, a drawn underline.
- **Do** carry a view-transition name from each card photo to its listing hero.
- **Do** make every reveal one-way and give it a static fallback for no-JS and reduced motion.

### Don't:
- **Don't** add textures, grain, paper, woven or material patterns, or any costume that dresses the site as a craft object.
- **Don't** use turquoise (#13c6c9) anywhere outside the logo badge: not for links, buttons, active states, tints or grounds.
- **Don't** use aggressive hover: no zoom beyond 1.025 on photos, no card lifts, bounces, tilts or fast scale jumps.
- **Don't** put eyebrows or kickers (small uppercase labels) above headings.
- **Don't** use ghost wordmarks: no oversized, faded brand name or headline text as background decoration.
- **Don't** invent claims: no testimonials, awards, press, sales figures or certifications beyond what the product facts support.
- **Don't** add resting shadows to cards, sections or form shells.
- **Don't** use faint (#9b978f) for body text.
