# CLAUDE.md — Moto On/Off

> Repository guide for Claude Code. Read this **before** writing or modifying anything in this project. Keep responses aligned with the constraints, conventions, and priorities below.

---

## 1. Project Overview

**Moto On/Off** is a marketing + lead-generation website for an adventure motorcycle tour brand. The product is the _experience_ — tours through Patagonia, the Andes, North of Argentina and many gravel routes in Argentina, and similar. The site exists to convert visitors into inquiries (primarily via WhatsApp and contact email) and to rank for tour-specific search terms.

### Brand positioning

**The competition sells tours. We sell triumph over the road.**

This is not a luxury or boutique tourism site. The brand is positioned around the rider's personal victory — pride in what they've achieved, the discovery of what they're made of. The challenge (mud, sand, distance, altitude) is the _product_, the thing the rider conquers. We facilitate that discovery; we don't deliver comfort.

**Critical voice rule:** the brand never positions itself in opposition to luxury competitors. It does not say "we're not a 5-star hotel" or "no pampering" — it says what it _is_. Defensive framing gives competitors free rent in our copy. The visual language (gonzo/pulp aesthetic) does the differentiation work; the copy stays confident and forward-facing.

### Core goals (in priority order)

1. Generate inquiries — make contact frictionless (WhatsApp first and email).
2. Showcase tours with a dedicated SEO-optimized page per tour.
3. Build trust through authenticity (real photos, founder voice, social proof).
4. Allow the client to update tour dates/availability without developer involvement.

### Target user reaction

> "I want to ride this — and I want to find out if I can."

Every design and copy decision is judged against that line. If a phrase could appear on a typical adventure-tourism site, it's probably wrong for this brand.

### Brand voice (summary — full version in design system §1.5)

- Sell what the rider becomes, not what we provide.
- Confident, never defensive. We say what we _are_, not what we aren't.
- Verb-first, active, founder-led ("We ride", not "The company offers").
- The challenge is the product. Name it as the thing conquered.
- Concrete > abstract. Distances, elevations, place names earn trust.
- Signature vocabulary: _triumph, conquer, earned, ridden, tested, crossed, remembered._
- Avoid: _discover, adventure awaits, embark, real X real Y real Z_, any defensive framing.

Spanish first (Rioplatense), then English, then Portuguese. Voice translates; idioms don't.

---

## 2. Tech Stack (locked)

| Layer            | Choice                                    | Notes                                                                        |
| ---------------- | ----------------------------------------- | ---------------------------------------------------------------------------- |
| Framework        | **Next.js 14+ (App Router)**              | RSC by default; Client Components only where state/interactivity is required |
| Styling          | **Tailwind CSS**                          | Theme tokens defined in `tailwind.config.ts` — see design system §8          |
| CMS              | **Google Sheets**                         | Tours, dates, availability, pricing pulled from Sheets — see §6              |
| Content (static) | **MDX**                                   | About, Custom Tours, legal pages — content that doesn't change often         |
| Forms            | **React Hook Form + Zod**                 | Inquiry forms, custom tour forms                                             |
| Animation        | **Framer Motion**                         | Used sparingly per design philosophy                                         |
| Images           | **next/image**                            | AVIF + WebP, `priority` only on hero                                         |
| Fonts            | **next/font**                             | Display + body fonts loaded with zero CLS                                    |
| Deployment       | **Vercel**                                | Default target                                                               |
| i18n             | **next-intl** or App Router built-in i18n | `/es/`, `/en/`, `/pt/`                                                       |

### Do not introduce

- A backend framework (no Express, NestJS, etc.) — Next.js API routes / Server Actions are sufficient.
- A database (Sheets is the source of truth for tours; everything else is static).
- A traditional headless CMS (Sanity, Payload, Contentful) — explicitly rejected to keep client management on Sheets.
- shadcn/ui or pre-built component libraries — components are custom; the aesthetic is incompatible with most defaults (rounded corners, soft shadows, neutral palettes).
- CSS-in-JS (styled-components, emotion). Tailwind only.

---

## 3. Repository Structure

```
/app
  /[locale]                    # es | en | pt
    /(marketing)               # Route group for public pages
      page.tsx                 # Home
      /about/page.tsx
      /tours/page.tsx          # Tour index
      /tours/[slug]/page.tsx   # Individual tour (SEO target)
      /custom/page.tsx         # Custom tours
      /calendar/page.tsx       # Departures
      /journal/page.tsx        # Blog/journal index
      /journal/[slug]/page.tsx # Journal post
      /contact/page.tsx
    layout.tsx
  /api
    /tours                     # Sheets read endpoint (cached)
    /inquiries                 # Form submission handler
    /revalidate                # On-demand ISR refresh
/components
  /primitives                  # Button, Eyebrow, DisplayHeading, Stamp, StickyNote, XIcon, etc.
  /surfaces                    # RedZone, PaperZone, TornEdge, HalftoneImage, CutoutFigure, PaperPanel
  /sections                    # Hero, FeatureStripGrid, TourGrid, QuoteSection, XListSection, etc.
  /ui                          # Nav, Footer, WhatsAppFAB, LangSwitcher, NewsletterForm
/content
  /tours                       # MDX descriptions per tour (long-form, SEO)
  /journal                     # MDX journal posts
  /pages                       # About, Custom Tours, etc.
/lib
  /sheets                      # Google Sheets client + parsers
  /i18n                        # Locale config + dictionaries
  /seo                         # Metadata helpers, JSON-LD generators
/public
  /images
    /halftone                  # Pre-processed halftone PNG cutouts
    /landscapes                # Halftone landscape banners
  /textures
    paper-grain.png
    red-grunge.png
    halftone-overlay.png
    torn-edge-1.svg
    torn-edge-2.svg
    torn-edge-3.svg
    torn-edge-4.svg
    sticker-edge-1.svg
    sticker-edge-2.svg
    sticker-edge-3.svg
  /sprites
    distress.svg               # Woodblock filters, hand-underlines, X-bullets, stamps, skull badge
/docs
  design-system-audit.md       # The visual baseline. Required reading.
  halftone-pipeline.md         # Photoshop action / batch processing instructions
  open-questions.md            # Unresolved decisions
/styles
  globals.css                  # Tailwind base + CSS vars + texture overlays
tailwind.config.ts
```

### Key patterns

- **Tour content is hybrid**: structured data (dates, price, availability, capacity) lives in Sheets. Long-form descriptive content (overview, itinerary, FAQ) lives in MDX under `/content/tours/[slug]/[locale].mdx`. The tour page reads both and merges them.
- **Slug is the join key** between Sheets row and MDX file.
- **Routing is locale-prefixed**. No automatic locale detection at the route level — user picks via switcher; preference stored in cookie.
- **Halftone images are pre-processed assets**, not runtime conversions. See `/docs/halftone-pipeline.md`.
- **Pages are stacks of zones.** Every page is composed of `<RedZone>` and `<PaperZone>` components separated by `<TornEdge>` transitions. Never hand-build section backgrounds.

---

## 4. Visual Design System

### Reference document — required reading

The full design system audit lives at **`/Users/sheinken/Desktop/tour_motos/design.md`**. It defines the visual baseline (two-zone pulp poster aesthetic), color tokens, typography, component patterns, motion philosophy, and photography pipeline.

**Always consult that document before building any UI component.** When this `CLAUDE.md` and the design system disagree, the design system wins on visual matters and this file wins on architectural matters.

### Quick reference — hard rules

The following are non-negotiable visual conventions enforced project-wide:

| Rule                                         | Detail                                                                                                      |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Two-zone color rhythm**                    | Pages alternate `<RedZone>` and `<PaperZone>`. Every page has at least 2 of each. Never a single-zone page. |
| Single brand color                           | Burgundy-rust `#A8342A` only. Never introduce a secondary brand color.                                      |
| Three-tone composition per zone              | Field (red OR paper) + ink halftone + opposite-zone-color highlights for headlines.                         |
| **Red-on-paper headlines**                   | In paper zones, display headlines are red — this is a signature pattern, not optional.                      |
| No pure black                                | Use `--color-ink` (`#1F140E`), never `#000000`.                                                             |
| No pure white                                | Use `--color-paper` (`#E8DCC4`), never `#FFFFFF`. Kraft, not cream.                                         |
| **All zones have texture overlays**          | Paper-grain on paper zones, red-grunge on red zones. No flat color anywhere.                                |
| **Zone transitions are torn paper**          | Use `<TornEdge>` SVG with one of 4 variants. Never a straight horizontal line.                              |
| No `border-radius` on primary UI             | Buttons, cards, inputs are rectangular. Sticker CTAs have distressed-edge borders via SVG.                  |
| No CSS box-shadows on UI                     | Only the documented hard-offset deep-toned sticker shadow is allowed.                                       |
| Display type: heavy condensed wood-block     | Anton or equivalent, distress filter applied. Always uppercase. Always left-aligned.                        |
| Body type: clean grotesque, never distressed | Inter (or equivalent). Distress filters destroy legibility.                                                 |
| Photography: halftone cutouts only           | No clean photo edges on subjects. Pre-processed PNGs with transparency.                                     |
| Outlined sticker CTAs are the default        | Filled stickers reserved for top-priority conversion CTAs only — max 1 per zone.                            |
| Stickers tilt 1–3deg                         | Never straight. Never centered.                                                                             |
| X-bullets for lists                          | Custom XIcon component, not `<ul>` default markers, not checkmarks, not dots.                               |
| No green/blue accents on marketing pages     | Functional colors live in booking flow only.                                                                |

If a request would violate one of these, push back before implementing.

---

## 5. Tailwind & Tokens

The complete `tailwind.config.ts` is specified in the design system §8. It extends the theme with:

- `colors.brand.{red, red-deep, red-bright}` — burgundy-rust palette
- `colors.ink.{DEFAULT, soft}` — warm-black, never pure black
- `colors.paper.{DEFAULT, light, aged, dark}` — kraft palette, never pure white
- `fontFamily.{display, sans, script}`
- `fontSize.{display-2xl, display-xl, display-lg, eyebrow}` with built-in line-height + letter-spacing
- `boxShadow.{sticker-red, sticker-ink}` for the print-style hard-offset shadow
- `backgroundImage.{paper-grain, red-grunge, halftone}` for texture overlay utilities
- `transitionTimingFunction.stamp` for sticker overshoot easing

### Conventions

- Use Tailwind utilities first. Custom CSS only for: SVG filter effects, woodblock distress treatment, halftone overlays, torn-edge masks, sticker-edge masks.
- **Never inline arbitrary hex values** in JSX (`text-[#A8342A]`). Add to the theme and reference by name.
- **Never use `rounded-*`** on primary UI. Opt in only for genuinely incidental elements (avatars, social icon containers).
- Spacing scale is 4px base — use `space-{xs,sm,md,lg,xl,2xl,3xl,4xl}` tokens.
- Background textures applied via `bg-paper-grain` / `bg-red-grunge` utilities — do not inline `background-image` URLs.
- **Always wrap sections in `<RedZone>` or `<PaperZone>`** — they handle texture, padding, and torn-edge logic. Never apply `bg-brand-red` or `bg-paper` directly to a section.

---

## 6. Google Sheets as CMS

### Why this choice

Client must be able to add tours, edit dates, and update availability without engineering involvement. Sheets is the lowest-friction option that meets this requirement and avoids the cost/complexity of a real CMS for a small content set.

### Architecture

- **Service account** with read-only access to a specific Sheet ID.
- Credentials in `GOOGLE_SHEETS_CREDENTIALS` env var (JSON, base64-encoded).
- Sheet ID in `GOOGLE_SHEETS_TOURS_ID`.
- Read layer in `/lib/sheets/` exposes typed functions: `getTours()`, `getTourBySlug(slug)`, `getUpcomingDepartures()`.

### Sheet structure (proposed)

**Sheet: `Tours`**

| slug | title_es | title_en | title_pt | region | difficulty | duration_days | distance_km | base_price_usd | currency | hero_image | published |

**Sheet: `Departures`**

| tour_slug | start_date | end_date | capacity | spots_remaining | status (`open` / `low` / `sold_out`) | notes |

### Caching

- **ISR with `revalidate: 600`** (10 minutes) on tour pages — client edits are visible within 10 min without manual deploys.
- **On-demand revalidation** via `/api/revalidate` endpoint with a secret token, so the client can hit a "Refresh site" link in their bookmarks for instant updates after big changes.
- `unstable_cache` wrapping the Sheets client with the same TTL.

### Validation

- Every Sheets read goes through a **Zod schema** (`/lib/sheets/schemas.ts`). If a row fails validation, log it and skip — never crash the page.
- A row with `published = FALSE` (or empty) is excluded from production.

### Failure modes

If Sheets is unreachable:

- Tour index falls back to the last cached snapshot.
- Individual tour page (the SEO-critical surface) keeps serving the cached version.
- Never show a broken page to a visitor because Sheets had a hiccup.

---

## 7. Component & Motion Conventions

### Server vs Client Components

Default to **Server Components**. Mark `"use client"` only when the component needs:

- State (`useState`, `useReducer`)
- Effects (`useEffect`)
- Browser APIs
- Event handlers tied to interactivity (form inputs, drawers, modals)
- Framer Motion animations

The following are explicitly Client Components:

- `Nav` (mobile drawer state, scroll-aware backdrop)
- `LangSwitcher`
- `WhatsAppFAB` (stamps in on scroll past hero)
- `InquiryForm`, `CustomTourForm`, `NewsletterForm`
- `Lightbox`, `VideoModal`
- Any component with hover-driven motion

Everything else — including most of the marketing surface — should be a Server Component.

### Motion rules

- Hero choreography: one-shot on load, ~1.8s total, staggered layer reveal (red field → landscape + cutout → headline → manifesto → sticky-note → torn edge static). Animates **once**, not on scroll-back.
- Section headlines: single fade-in on scroll via `IntersectionObserver`. No slide.
- Tour cards: lift 4px on hover, halftone density intensifies, paper-edge shadow grows.
- Outlined sticker CTAs: tilt + lift + **fill-on-hover** (color inverts).
- Filled sticker CTAs: tilt + lift + shadow grows.
- WhatsApp FAB: stamps in with rotation + bounce when user scrolls past hero.
- **No parallax on photography**, no scroll-jacking, no scaling text on scroll.
- Halftone landscape banners may use **very subtle** parallax (max 8% offset) — test before committing.
- **Torn edges never animate.** They're static visual elements.
- Honor `prefers-reduced-motion: reduce`. All choreography skipped, final state rendered immediately.

Timing tokens are defined in the design system §6. Use them; don't invent new durations.

---

## 8. Internationalization

Three locales required: **Spanish (default), English, Portuguese**.

### Conventions

- Routing: `/es/...`, `/en/...`, `/pt/...`. No locale-less root route except a redirect to `/es/`.
- Tour slugs are **localized** per language (e.g., `/es/tours/patagonia-aventura`, `/en/tours/patagonia-adventure`). The Sheets row holds a slug per language.
- Dictionaries in `/lib/i18n/dictionaries/{es,en,pt}.json` for static UI strings.
- MDX content has one file per locale per tour: `/content/tours/{slug}/{locale}.mdx`.
- **Do not use auto-translation services** — all copy is human-written. The brand voice does not survive machine translation.
- `hreflang` tags emitted on every page.
- `lang` attribute on `<html>` matches the active locale.

---

## 9. SEO Strategy

Per the discovery notes, **one page per tour is the main SEO engine**. Treat tour pages as the most important surface in the project.

### Required on every tour page

- `<title>`: `{Tour Title} | Moto On/Off` — locale-specific.
- `<meta description>`: 140–160 chars, locale-specific, hand-written (not auto).
- **JSON-LD `TouristTrip` schema** with name, description, itinerary, offers (price, currency, availability), and `geo` if applicable.
- **`BreadcrumbList` JSON-LD**.
- OpenGraph + Twitter card with hero image (1200×630) — **the OG image should reflect the brand aesthetic** (red zone + halftone cutout + display headline). Pre-render via a `/api/og` route.
- Canonical URL.
- `hreflang` to sibling-language versions.
- Long-form descriptive content (700+ words) in MDX. Itinerary, terrain, what's included, FAQ.

### Image SEO

- Every `<img>` / `next/image` has descriptive alt text (locale-specific).
- File names are descriptive: `patagonia-route-7-lakes-day-3-halftone.png`, not `IMG_4521.png`.

### Sitemap & robots

- Auto-generated `sitemap.xml` covering all locale variants of all published tours + journal posts + static pages.
- `robots.txt` allows all; disallows `/api/`.

---

## 10. Conversion & Contact

WhatsApp is the primary contact channel. Treat it as a first-class element of the UI.

### Patterns

- **Floating WhatsApp button (FAB)** that **stamps into view** when the user scrolls past the hero. Hidden during hero scroll position to not fight the cinematic intro. Sticker-style, tilted, with hard-offset deep-tone shadow.
- **Inline WhatsApp CTAs** on each tour page near the price/availability strip, also styled as sticker CTAs.
- **Inquiry forms** as a secondary path — submit via Server Action, store in a simple log (Sheets append or a Postmark/Resend email), and reply via WhatsApp.
- **Pre-filled WhatsApp messages** per tour: `https://wa.me/{NUMBER}?text=Hola%2C+me+interesa+la+ruta+{tour-name}`.

### Trust signals

- Google Reviews summary in the footer (rating + count, linked to the actual GMB profile). Style: stamped numerals on a paper panel, not a typical star widget.
- Embedded review snippets on the home page as **quote blocks** (using the `QuoteBlock` component from the design system).
- Real rider photos in the gallery — all run through the halftone pipeline.
- Founder bio with halftone-cutout portrait on About — humanize the brand.

---

## 11. Performance Budget

- **LCP** ≤ 2.0s on 4G mobile.
- **CLS** ≤ 0.05.
- **Total JS shipped on tour page** ≤ 150 KB gzipped.
- Hero halftone PNGs ≤ 200KB each, served via `next/image` with proper `sizes`.
- Texture overlays (paper-grain, red-grunge): ≤ 50KB each, tileable, applied via CSS background.
- Below-the-fold images lazy-loaded.
- Fonts: maximum 3 font files across the site (display + body + optional script). Subset to Latin-Extended for Spanish/Portuguese accents.
- Run Lighthouse + axe before every deploy. Target 95+ on Performance, 100 on SEO and Accessibility.

### Halftone-specific concerns

- The aesthetic involves more PNG-with-transparency assets than a typical site. Audit total image weight per page; budget 1.2MB max for hero compositions.
- Avoid runtime CSS halftone filters on hero-tier images — pre-process instead.
- Texture overlays are tileable PNGs, not full-screen assets. ~50KB total adds zero perceptual cost.

---

## 12. Accessibility Baseline

- WCAG AA contrast on all text. **Verify red-on-paper text specifically** at small sizes — passes for ≥18px regular or ≥14px bold. Use red headlines on paper liberally; use red body text on paper sparingly.
- **Verify paper-on-red small text** — passes AAA at display sizes, AA at body sizes.
- Visible focus rings on every interactive element. Use 2px paper outline with 2px offset on red surfaces; 2px ink outline with 2px offset on paper surfaces. Don't rely on hover alone.
- Skip-to-content link.
- Keyboard navigation works for the mobile nav drawer, lightbox, language switcher, and all forms.
- All images have meaningful `alt` (or `alt=""` if purely decorative). Halftone cutouts of people: describe the person and action, not "halftone illustration of a man."
- Form errors announced via `aria-live`.
- Video content has captions where speech is present.
- Sticker tilt and stamp rotation are decorative — keep underlying buttons semantic.
- Torn edges, paper textures, grunge overlays, and the skull/badge mark all receive `aria-hidden="true"` — they're decorative.

---

## 13. What Claude Code Should Do (and Not Do)

### Do

- Read `/docs/design-system-audit.md` before creating any new component **or writing any marketing copy**. Voice rules are in §1.5.
- Reuse primitives and surfaces from `/components/primitives/` and `/components/surfaces/` instead of restyling per-section.
- **Compose pages as stacks of `<RedZone>` and `<PaperZone>`** with `<TornEdge>` between them.
- Add new tokens to `tailwind.config.ts` rather than using arbitrary values.
- Validate Sheets data with Zod on every read.
- Keep components Server-rendered unless interactivity demands otherwise.
- Pre-process halftone images offline; reference them via `<HalftoneImage>`.
- Use `<Button variant="sticker-outline">` as the default CTA, `sticker-filled` only for top-priority conversion CTAs (max 1 per zone).
- Use `<XIcon>` for all bullet lists.
- Apply the `<HandUnderline>` component for emphasis under single key words.
- **When generating copy:** lead with verbs, name what the rider becomes, use specific places/distances/elevations.
- **CTA labels:** `Plan your trip`, `See the routes`, `Hold a spot`, `Talk to us`, `Read the journal` — specific next steps, not generic transactions.
- Write descriptive commit messages and small PRs.
- Ask before introducing a new dependency.
- Push back if a request would soften the aesthetic OR introduce defensive copy.

### Don't

- Don't add `border-radius` to buttons, cards, or inputs.
- Don't use centered display headlines.
- Don't introduce drop shadows for "depth" — only the documented sticker shadow is allowed.
- Don't add a secondary brand color, gradient, or color accent.
- Don't render distress filters on body or UI text.
- Don't use pure black (`#000000`) or pure white (`#FFFFFF`) anywhere.
- Don't apply `bg-brand-red` or `bg-paper` directly to sections — wrap in `<RedZone>` or `<PaperZone>`.
- Don't use straight-line zone transitions — always `<TornEdge>`.
- Don't build a single-zone page. Every page alternates red and paper at least twice.
- **Don't write defensive copy** — never frame the brand against luxury competitors. No "we're not a 5-star hotel," no "no pampering," no "comfort kills the edge." The visual language does the differentiation; the copy stays confident and forward-facing.
- **Don't use travel-brochure verbs** — no _discover, adventure awaits, embark, immerse yourself_. Use what actually happens: _ride, cross, climb, sleep, wake._
- **Don't write triple-real claims** — no "real connections, real stories, real hospitality." Pick one specific moment and describe it.
- **Don't use abstract scene-setters** like "Mountains. Desert. Epic." — replace with concrete specifics (distances, elevations, place names, day counts).
- Don't auto-translate copy — always ask for human translations.
- Don't bypass the Sheets validation layer.
- Don't add a new CMS, database, or backend framework without explicit approval.
- Don't ship hardcoded WhatsApp numbers — read from `NEXT_PUBLIC_WHATSAPP_NUMBER`.
- Don't ship hardcoded tour data — Sheets is the source of truth.
- Don't use stock photography. Don't use clean photo edges. Don't skip the halftone pipeline.
- Don't introduce shadcn/ui or any pre-built component library.
- Don't use `rotate-0` on stickers "to keep things tidy" — the tilt is the brand.
- Don't put more than 1 hand-script (sticky-note) callout per page.
- Don't put more than 1 filled sticker CTA per zone.

---

## 14. Environment Variables

```
# Google Sheets
GOOGLE_SHEETS_CREDENTIALS=        # base64-encoded service account JSON
GOOGLE_SHEETS_TOURS_ID=           # Spreadsheet ID

# Contact
NEXT_PUBLIC_WHATSAPP_NUMBER=      # E.164, no +, e.g. 5491141234567
NEXT_PUBLIC_SITE_URL=             # https://motoonoff.com

# Email (inquiry handler)
RESEND_API_KEY=                   # if Resend chosen
INQUIRY_NOTIFICATION_EMAIL=       # where leads land

# Revalidation
REVALIDATE_SECRET=                # for /api/revalidate

# Analytics
NEXT_PUBLIC_GA_ID=                # GA4
```

A `.env.example` mirrors this list. Real `.env.local` is gitignored.

---

## 15. Implementation Priority

When picking up the project from scratch, build in this order:

1. **Tokens + theme** (`tailwind.config.ts`, fonts via `next/font`, paper-grain + red-grunge textures, distress SVG sprite at `/public/sprites/distress.svg`).
2. **Texture pipeline assets** — paper-grain PNG, red-grunge PNG, torn-edge SVGs (4 variants), sticker-edge SVGs (3 variants), halftone Photoshop action documented in `/docs/halftone-pipeline.md`.
3. **Primitives**: `Button` (sticker-outline + sticker-filled variants), `Eyebrow`, `DisplayHeading` (with distress filter + zone-aware color), `Stamp`, `StickyNote`, `XIcon`, `HandUnderline`, `SkullBadge`, `Container`.
4. **Surfaces**: `RedZone`, `PaperZone`, `TornEdge`, `HalftoneImage`, `CutoutFigure`, `LandscapeBanner`, `PaperPanel`.
5. **Layout shell**: `Nav`, `Footer`, `WhatsAppFAB`, locale routing.
6. **Sheets integration** (`/lib/sheets/`) with Zod validation and caching.
7. **Hero zone** for the home page — full poster composition with all six layers + torn edge transition. **Validation gate.**
8. **Tour index page** (`/tours`) reading from Sheets.
9. **Tour detail page** (`/tours/[slug]`) — Sheets data + MDX content + JSON-LD + halftone hero.
10. **FeatureStripGrid** (4-cell bordered icon grid).
11. **TourGrid** + tour card design.
12. **XListSection** ("this is for you if..." pattern).
13. **JournalGrid** + journal post template.
14. **QuoteSection** (first-class quote blocks).
15. **About, Custom Tours, Calendar pages** (mostly MDX-driven, composed of zones).
16. **Inquiry forms** + newsletter form + Server Action submission.
17. **Photography processing pass** — run halftone pipeline on initial library.
18. **i18n pass** — wire dictionaries, localized slugs, `hreflang`.
19. **Motion pass** — hero choreography, hover states, FAB stamp-in.
20. **SEO pass** — sitemap, metadata audit, JSON-LD validation, OG image generation.
21. **Performance + accessibility audit**.

The hero (step 7) is the validation gate. If the red zone + torn edge transition don't feel like a printed poster, the rest of the system won't carry it. Iterate until it does before continuing to step 8.

---

## 16. Open Questions (for client)

Track these in `/docs/open-questions.md` and resolve before launch:

- Confirm burgundy-red shade — `#A8342A` is the recommended starting point; client may want to tune slightly.
- Confirm kraft-paper shade — `#E8DCC4` is the recommended starting point.
- Final tour list for launch, including localized slugs.
- Photography source — existing library? new shoot? license terms? **Halftone processing requires high-contrast source images** — flat midday phone shots will need re-shoots.
- WhatsApp number(s) — single or per-region?
- Google Sheet ownership — client's account or shared service workspace?
- Custom tour intake — what fields are required vs optional?
- Motorcycle transport service — launch with it or defer to v2?
- Privacy policy and terms — provided by client or drafted?
- Founder portrait for About page — needed for halftone cutout treatment.
- Brand mark — confirm skull/badge concept or design alternative.
- Quote sources — public-domain mix vs founder-original copy (legal review owned by client).

---

_This file is the source of truth for project conventions. When in doubt, prefer the rule here over external defaults. If a rule needs to change, update this file in the same PR as the change. For visual decisions, defer to `/docs/design-system-audit.md`._
