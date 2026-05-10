# Moto On/Off — Phased Implementation Plan

> Source documents: `/CLAUDE.md` (architectural rules), `/design.md` (visual baseline), `/inspiration.png` (visual reference — NOT a copy reference), `/quote1.png` (halftone-on-red treatment reference).
>
> **Important framing:** the inspiration image contains exact copy that `CLAUDE.md §13` and `design.md §1.5` explicitly forbid (`I DON'T WANT A 5-STAR HOTEL`, `No pampering. No parade.`, `Comfort kills the edge.`, `Real connections. Real stories. Real hospitality.`, `Mountains. Desert. Epic.`). The inspiration is the **visual** reference, not the **copy** reference. The plan reflects that throughout.

---

## Project context (locked decisions)

| Item | Value |
| --- | --- |
| GitHub repo | `https://github.com/sheinken88/tours_motos.git` (public) |
| Vercel | User's existing account; client production credentials pending |
| Brand name | **Moto On/Off** (per CLAUDE.md) — inspiration's "RUST & ROAD" is visual reference only |
| Domain | TBD — pending client |
| Stack | Next.js 14+ App Router, Tailwind, MDX, Google Sheets CMS, Framer Motion, RHF + Zod, next-intl, Resend, Vercel |
| Locales | Spanish (default, Rioplatense), English, Portuguese |

---

## Phase 0 — Repository & Environment Setup

**Goal:** working Next.js project on GitHub, deploying to Vercel, with a green CI build. Nothing visual yet.

### 0.1 — Initialize repo locally
- `git init` in `/Users/sheinken/Desktop/tour_motos/` — preserve existing `CLAUDE.md`, `design.md`, `inspiration.png`, `quote1.png` as the first commit.
- Add remote: `git remote add origin https://github.com/sheinken88/tours_motos.git`.
- Create `.gitignore` (Next defaults: `.next/`, `node_modules/`, `.env*.local`, `.vercel/`, `.DS_Store`).
- First commit: existing docs as the baseline. Push to `main`.

### 0.2 — Scaffold Next.js 14+ App Router project in place
- `npx create-next-app@latest . --ts --app --tailwind --eslint --src-dir=false --import-alias "@/*"` — preserve existing markdown files.
- Verify: `npm run dev` serves the default page. Confirm Node 20+.

### 0.3 — Install locked dependencies (CLAUDE.md §2)
- Runtime: `framer-motion`, `react-hook-form`, `zod`, `@hookform/resolvers`, `next-intl`, `googleapis`, `@next/mdx`, `@mdx-js/loader`, `@mdx-js/react`, `gray-matter`, `resend`.
- Dev: `@types/node`, `prettier`, `prettier-plugin-tailwindcss`, `eslint-config-prettier`, `@axe-core/react`, `lighthouse`.
- **Explicitly do not install:** `shadcn`, `sanity`, `payload`, `contentful`, `styled-components`, `emotion` (CLAUDE.md §2 forbids).

### 0.4 — Tooling baseline
- `prettier.config.js` with the Tailwind plugin so class order is auto-sorted.
- `.editorconfig` (LF, UTF-8, 2-space indent).
- `.nvmrc` pinning Node 20.
- `eslint.config.*` extends `next/core-web-vitals` + Prettier.
- `tsconfig.json` strict mode, `noUncheckedIndexedAccess: true`.

### 0.5 — Environment scaffold (CLAUDE.md §14)
- Create `.env.example` mirroring all required vars: `GOOGLE_SHEETS_CREDENTIALS`, `GOOGLE_SHEETS_TOURS_ID`, `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_SITE_URL`, `RESEND_API_KEY`, `INQUIRY_NOTIFICATION_EMAIL`, `REVALIDATE_SECRET`, `NEXT_PUBLIC_GA_ID`.
- Create `.env.local` locally (gitignored) with placeholder values so dev runs.

### 0.6 — GitHub & Vercel
- Push initial commit to `https://github.com/sheinken88/tours_motos.git`.
- Connect Vercel → GitHub repo → preview deploys on every PR, production on `main`.
- Configure Vercel env vars to match `.env.example` (with placeholders until client credentials arrive).
- CI: GitHub Actions workflow running `lint`, `typecheck`, `build` on every PR.

### 0.7 — Repository skeleton (CLAUDE.md §3)
- Pre-create empty directories with `.gitkeep`: `/components/{primitives,surfaces,sections,ui}`, `/lib/{sheets,i18n,seo}`, `/content/{tours,journal,pages}`, `/public/{images/{halftone,landscapes},textures,sprites}`, `/docs`, `/styles`.
- Drop in stub `docs/open-questions.md` with the CLAUDE.md §16 list copied verbatim.

**Exit criterion:** PR previews deploy a default-styled page on Vercel.

---

## Phase 1 — Design Tokens & Texture Pipeline

**Goal:** every visual primitive a designer would need exists as a token or asset. No components yet.

### 1.1 — Tailwind theme (design.md §8)
- Replace `tailwind.config.ts` with the full config from design.md §8: brand/ink/paper colors, fontFamily, fontSize with embedded line-height + tracking, `borderRadius: { none: "0" }`, backgroundImage tokens, boxShadow tokens, transitionTimingFunction.
- Add a custom ESLint or stylelint rule rejecting `#000`/`#fff`/`#000000`/`#ffffff` to enforce CLAUDE.md hard rule.

### 1.2 — `globals.css`
- Tailwind base + components + utilities directives.
- CSS custom properties from design.md §2 (color tokens) + §3 (line-height, tracking) + §6 (timing tokens).
- `@layer base`: `html { scroll-behavior: smooth; }` honoring `prefers-reduced-motion`; `body` background defaults to paper (so flash-of-unstyled isn't pure white).
- `@layer components`: utility classes for `.bg-paper-grain`, `.bg-red-grunge`, `.shadow-sticker-red`, `.shadow-sticker-ink`.

### 1.3 — Fonts via `next/font` (design.md §3)
- `app/fonts.ts` exports `display` (Anton, weight 400, swap), `body` (Inter, 400/500/600/700, swap), `script` (Permanent Marker, 400, swap, lazy-loaded only on routes that need it).
- Subset to `latin-ext` for Spanish/Portuguese accents (CLAUDE.md §11).
- Wire via CSS variables `--font-display`, `--font-inter`, `--font-script` in `app/layout.tsx`.

### 1.4 — Texture assets
Three sourcing options, in order of preference:
1. Source from a textures library (Subtle Patterns, Lost & Taken) with appropriate license.
2. Generate procedurally via SVG `feTurbulence` filters.
3. Commission/produce in Photoshop.

For Phase 1, place placeholder PNGs at the documented paths so build passes; quality pass happens in Phase 2:
- `/public/textures/paper-grain.png` — 512×512, tileable, ≤ 50KB, applied at 8–12% opacity per design.md §10.
- `/public/textures/red-grunge.png` — same dims, 10–15% opacity.
- `/public/textures/halftone-overlay.png`.
- `/public/textures/torn-edge-{1,2,3,4}.svg` — four hand-drawn jagged paper edges, ~20–40px tall.
- `/public/textures/sticker-edge-{1,2,3}.svg` — three irregular rectangle masks for sticker CTAs.

### 1.5 — Distress sprite
`/public/sprites/distress.svg` — single sprite containing:
- `<filter id="woodblock-distress">` with `feTurbulence` (high baseFrequency) + `feDisplacementMap` (scale 1–2) + `feComposite`.
- `<symbol id="hand-underline">` brush-stroke path.
- `<symbol id="x-bullet">` for X-list markers.
- `<symbol id="stamp-frame">` for stamp borders.
- `<symbol id="skull-badge">` brand mark.

### 1.6 — Halftone pipeline doc
- Write `/docs/halftone-pipeline.md` (CLAUDE.md §3 references it). Source from design.md §7 + §11. Step-by-step with screenshots once we have a real photo to work with — for Phase 1, commit the text instructions only.

**Exit criterion:** a throwaway `/_dev/tokens` page renders all colors, font sizes, textures, and shadows without any component code. Visual sanity check.

---

## Phase 2 — Primitives

**Goal:** build the atomic UI vocabulary. CLAUDE.md §15 step 3, design.md §9 step 3.

All primitives are Server Components unless noted. Each ships with TypeScript-typed props, a Storybook-style demo on `/_dev/components`, and zero `border-radius` (CLAUDE.md hard rule).

| Component | Notes |
| --- | --- |
| `<Container>` | Max-width wrapper with the responsive padding from design.md §4. |
| `<Eyebrow>` | Uppercase, tracked, small, hairline rule below. Color-aware via zone context. |
| `<DisplayHeading>` | Uppercase, left-aligned (always), Anton with `filter: url(#woodblock-distress)` from sprite, zone-aware color. Sizes: `2xl \| xl \| lg \| md`. Renders `<h1>` through `<h3>` per `as` prop. |
| `<Button>` | Variants: `sticker-outline` (default), `sticker-filled`, `ghost`. 2px stroke in `currentColor` with one of 3 sticker-edge SVG masks. Tilt prop: `left \| right \| none`, defaulting to randomized 1–2deg. Hover: tilt straightens, lifts 2px, fills with `currentColor` (text inverts). 200ms ease-out. |
| `<XIcon>` | SVG X for bullet lists. |
| `<HandUnderline>` | Inline SVG brush stroke positioned under wrapped text. |
| `<Stamp>` | 2px rotated bordered text chip, display font, `rotate(-3deg)`. |
| `<StickyNote>` | Paper rectangle, hand-script font, slight rotation (3–5deg). Hard cap of 1 instance per page enforced via React context warning in dev. |
| `<SkullBadge>` | `<svg>` referencing the sprite symbol. |

**Exit criterion:** `/_dev/components` shows every primitive in both red and paper zone contexts, hover and focus states pass keyboard nav and AA contrast.

---

## Phase 3 — Surfaces

**Goal:** the zone composition system. CLAUDE.md §15 step 4, design.md §9 step 4.

| Component | Notes |
| --- | --- |
| `<RedZone>` | `<section>` with `bg-brand-red`, paper-grain + red-grunge overlays via pseudo-elements at design.md §10-prescribed opacity, vertical padding `--space-3xl`/`--space-4xl`. Optional `<TornEdge>` via `tornTop` / `tornBottom` props. Sets a React context advertising `zone="red"` so descendants color themselves correctly. |
| `<PaperZone>` | Symmetric to RedZone but with paper background and paper-grain only. |
| `<TornEdge>` | Absolute-positioned SVG. Props: `variant={1\|2\|3\|4}` (random default), `direction="up"\|"down"`, `from`, `to`. Renders SVG path filled with destination color, `aria-hidden`. Never animates. |
| `<HalftoneImage>` | Wraps `next/image`, expects pre-processed PNG with transparency, applies `priority` only when prop set (hero), `sizes` per breakpoint. Refuses to render JPEG (dev assertion) — halftone needs alpha. |
| `<CutoutFigure>` | Wraps HalftoneImage with positioning/bleed helpers. Optional 1px paper-color outline for figures on red zones. No shadow ever. |
| `<LandscapeBanner>` | Full-width halftone landscape, anchored to bottom of zone, optional 8% parallax wrapper (gated on `prefers-reduced-motion`). |
| `<PaperPanel>` | Paper-colored card placed inside a red zone. Distressed edge via SVG mask. |

**Exit criterion:** `/_dev/zones` renders all six zone permutations (red→paper→red, paper→red→paper, with all torn-edge variants) and verifies no flat-color surfaces.

---

## Phase 4 — Layout Shell, Locale Routing, i18n

**Goal:** the chrome that wraps every page, plus the three-locale routing structure.

### 4.1 — App Router structure (CLAUDE.md §3)
- `/app/[locale]/layout.tsx` with `generateStaticParams` returning `['es', 'en', 'pt']`, `lang` attribute matching the locale, `hreflang` link tags emitted from a helper.
- `/app/[locale]/(marketing)/` route group.
- Root `/app/page.tsx` redirects to `/es/`.
- `middleware.ts` reads `NEXT_LOCALE` cookie; fallback to `es`.

### 4.2 — `next-intl` setup
- `/lib/i18n/config.ts` exports locales, default locale, type-safe routing helpers.
- `/lib/i18n/dictionaries/{es,en,pt}.json` — start with shell strings only (nav, footer, language switcher, common CTAs from design.md §1.5). Empty page-specific keys filled per page.
- `/lib/i18n/getDictionary.ts` — async loader.
- **No machine translation** — placeholder strings flagged `[NEEDS_TRANSLATION]` per CLAUDE.md §8.

### 4.3 — `<Nav>` (Client Component)
- Floating, no backdrop, paper-color text on transparent.
- Logo (SkullBadge + wordmark — final brand mark TBD per open question §16).
- Links from dictionary.
- "LET'S RIDE" sticker-outline-paper CTA.
- Mobile: hamburger → full-screen red overlay (in-aesthetic), keyboard-navigable per CLAUDE.md §12.
- Scroll-aware: `position: sticky` with backdrop fade only after hero passed.

### 4.4 — `<LangSwitcher>` (Client Component)
- Three letter-button group: ES / EN / PT, current locale highlighted with hand-underline.
- Persists choice in `NEXT_LOCALE` cookie.

### 4.5 — `<Footer>`
- Paper zone with torn top edge.
- Skull mark center (large).
- Three columns: Trips list, Journal list, Contact (WhatsApp + email + Instagram).
- Google Reviews summary (stamped numerals on paper panel) — placeholder until GMB account confirmed.
- Newsletter inline form.
- Tire-track ornament corners.

### 4.6 — `<WhatsAppFAB>` (Client Component)
- Stamps in (Framer Motion + `--ease-stamp`) on scroll past hero.
- Reads `NEXT_PUBLIC_WHATSAPP_NUMBER`.
- Pre-filled message template per locale.
- Honors `prefers-reduced-motion`.

**Exit criterion:** every locale resolves, hamburger menu works on touch, FAB stamps in correctly, language switcher persists across reloads.

---

## Phase 5 — Sheets Integration & Caching

**Goal:** typed, validated, cached read layer for tours and departures.

### 5.1 — Service account + sheet provisioning
- Create GCP project, enable Sheets API, create service account, generate JSON key.
- Document the provisioning steps in `/docs/sheets-setup.md`.
- Base64-encode key into `GOOGLE_SHEETS_CREDENTIALS` (Vercel + `.env.local`).
- Resolve open question: client's account vs. shared workspace ownership of the sheet.

### 5.2 — Sheet template
- Build the two-tab template per CLAUDE.md §6 (`Tours`, `Departures`).
- Include header row matching the documented columns + a frozen header.
- Drop in 2–3 sample rows so dev has something to render against.
- Share a write-access copy with the client.

### 5.3 — `/lib/sheets/client.ts`
- `googleapis` Sheets v4 client, lazy-instantiated with the decoded service account.
- Single read function `readSheet(range: string)` returning raw rows.

### 5.4 — `/lib/sheets/schemas.ts`
- Zod schemas for `Tour` and `Departure` matching CLAUDE.md columns plus localized slug/title fields per locale.
- `parseTours(rows): Tour[]` filters `published === FALSE`, logs invalid rows, never throws (CLAUDE.md §6 failure-mode rule).

### 5.5 — `/lib/sheets/queries.ts`
- `getTours(locale)`, `getTourBySlug(locale, slug)`, `getUpcomingDepartures()`, `getDeparturesByTour(slug)`.
- Each wrapped in `unstable_cache` with `revalidate: 600` (CLAUDE.md §6).
- Cache tags: `'tours'`, `'tour:${slug}'`, `'departures'` for surgical revalidation.

### 5.6 — `/app/api/revalidate/route.ts`
- POST endpoint, requires `REVALIDATE_SECRET` header.
- Calls `revalidateTag('tours')` etc.
- Doc: client gets a bookmark URL with the secret embedded that triggers a "Refresh site" action.

### 5.7 — Failure-mode tests
- Unit test: malformed row gets skipped, log emitted.
- Manual test: revoke service account access — tour pages must still serve stale cache, not crash (CLAUDE.md §6).

**Exit criterion:** `/api/tours` returns validated JSON; cache TTL works; manual revalidation works; bad rows logged but skipped.

---

## Phase 6 — Hero Zone (THE Validation Gate)

**Goal:** the home-page hero composition that proves the system. CLAUDE.md §15 step 7, design.md §9 step 6.

> **This is the gate.** If the hero doesn't read as "printed poster" with all six layers, halt and iterate before continuing.

### 6.1 — Source one halftone-ready photo
- Either take an existing photo or run the halftone pipeline once on a placeholder rider+bike shot.
- Background-removed PNG with transparency at the `/public/images/halftone/` path.
- Document any gotchas back into `/docs/halftone-pipeline.md`.

### 6.2 — Source one halftone landscape
- Mountain ridge / horizon for the bottom-of-zone bleed.

### 6.3 — `<Hero>` section
- `<RedZone tornBottom>` wrapper.
- Layer stack per design.md §5 (back to front):
  1. Red field (zone provides).
  2. LandscapeBanner anchored bottom, bleeding into next zone.
  3. CutoutFigure anchored bottom-right, bleeding past right margin.
  4. DisplayHeading top-left, `display-2xl`. **Copy from dictionary, not hardcoded — and explicitly NOT the inspiration's `I DON'T WANT A 5-STAR HOTEL`** (CLAUDE.md §13 forbids defensive copy). Suggested ES headline draft: `"VIAJES QUE DEJAN MARCA."` ("Trips that leave marks") or `"CRUZÁ LO QUE TE FALTA."` — written human, reviewed by client per CLAUDE.md §8.
  5. Manifesto block below headline, paper-color, with one HandUnderline emphasis.
  6. StickyNote callout overlapping the cutout.
- Torn edge static (CLAUDE.md §7 motion rules).

### 6.4 — Hero choreography (Client Component subcomponent)
- Framer Motion variants per design.md §6: red field instant, landscape+cutout fade up 600ms, headline letter-mask reveal 800ms, manifesto fade 400ms, sticky-note bounce 500ms.
- One-shot. No re-trigger on scroll-back (CLAUDE.md §7).
- `prefers-reduced-motion` skips choreography entirely.

### 6.5 — Validation review
Before exiting this phase, eye-check against design.md §1 + the inspiration image:
- Does it read as a printed poster, not a website?
- Does the torn edge feel hand-cut?
- Does the cutout feel scissor-cut, not feathered?
- Are there exactly three tones in play (red field, ink halftone, paper highlights)?
- Does any element have `border-radius`? Reject.
- Is the headline left-aligned and uppercase? Required.

**Exit criterion:** the hero satisfies all six questions above. If not, iterate before Phase 7.

---

## Phase 7 — Tour Surfaces (the SEO core)

**Goal:** tour index + individual tour page, both reading from Sheets, both fully SEO-ready.

### 7.1 — `<TourCard>` primitive (CLAUDE.md §15 step 11)
- Halftone photo top with paper-color frame.
- Paper title bar, ink display-weight text.
- Ink metadata strip: region, duration, kilometers, tagline.
- Whole card is the link. No internal CTA.
- Hover: 4px lift, halftone density bump (CSS filter), shadow grows.

### 7.2 — `<TourGrid>` section
- 3-up → 2-up → 1-up responsive.
- Sits on a red zone for impact.

### 7.3 — `/[locale]/tours/page.tsx`
- `<RedZone>` hero with eyebrow + DisplayHeading: dictionary-driven copy.
- `<PaperZone>` short intro.
- `<RedZone>` with `<TourGrid>` reading `getTours(locale)`.
- `<PaperZone>` with quote section (Phase 8).
- Footer.
- ISR `revalidate: 600`.
- Metadata + sitemap entry.

### 7.4 — `/[locale]/tours/[slug]/page.tsx`
- `generateStaticParams` from Sheets.
- Compose: hero red zone (tour-specific halftone hero) → paper zone (overview MDX) → red zone (itinerary day-by-day) → paper zone (what's included / FAQ MDX) → red zone (price + availability strip + WhatsApp CTA) → paper zone (related tours).
- Reads structured data from Sheets via `getTourBySlug`, narrative content from `/content/tours/{slug}/{locale}.mdx`. Slug is the join key (CLAUDE.md §3).
- 404 if Sheets row missing or unpublished.
- ISR + on-demand revalidation hooks.

### 7.5 — MDX pipeline
- Configure `@next/mdx` in `next.config.mjs`.
- `mdx-components.tsx` maps native elements to design-system primitives (`h2 → DisplayHeading as="h2"`, `ul → XList`, etc.).
- Frontmatter via `gray-matter` for tour overview / SEO description.
- Seed 1–2 tours' MDX files (placeholders flagged for client).

### 7.6 — JSON-LD + metadata helpers (`/lib/seo/`)
- `tourTripSchema(tour, departures, locale)` → `TouristTrip` JSON-LD.
- `breadcrumbSchema(crumbs)`.
- `localeAlternates(slug)` → `hreflang` link set.
- `generateMetadata` per tour: title, description (140–160 char, hand-written), OG image URL pointing at `/api/og`.

### 7.7 — `/api/og/route.tsx` (edge runtime)
- Renders the 1200×630 OG image: red zone + halftone cutout + display headline matching the page (CLAUDE.md §9). Uses `next/og`.

### 7.8 — Sitemap & robots
- `/app/sitemap.ts` enumerates all locales × all published tours + journal + static pages.
- `/app/robots.ts` allows all, disallows `/api/`.

**Exit criterion:** Lighthouse SEO 100 on `/es/tours/{seed-slug}/`. JSON-LD validates in Google's Rich Results Test. All three locales render with proper hreflang.

---

## Phase 8 — Remaining Sections

**Goal:** the other sections used across home + tour pages. CLAUDE.md §15 steps 10, 12, 13, 14.

Each section is a pre-built composition — pages just stack them.

| Section | Notes |
| --- | --- |
| `<FeatureStripGrid>` | 4-cell paper-zone bordered grid. **Rewritten** to drop the inspiration's "SLEEP SIMPLE / Comfort kills the edge" (CLAUDE.md §13 forbids as defensive). Copy from dictionary, e.g. `RUTAS REMOTAS / GENTE LOCAL / ANDAR DURO / DORMIR DONDE CAIGA` — pending client review. |
| `<XListSection>` | "ESTO ES PARA VOS SI…" / "THIS IS FOR YOU IF…" pattern with X-bullets and a halftone group illustration. Copy rewritten to avoid the inspiration's defensive bullets per voice rules. |
| `<JournalGrid>` | 3-up cards, halftone photo + title + stamped date. |
| `<QuoteSection>` | First-class quote block. Each quote gets its own zone with breathing room (design.md §5). Resolves CLAUDE.md §16 open question on quote sourcing — start with founder-original until client confirms public-domain mix. |
| `<Manifesto>` | Long-form red-zone block. |

**Exit criterion:** all sections show on `/_dev/sections` in both zone contexts. Reuse-ready.

---

## Phase 9 — Static Pages & Forms

### 9.1 — Static MDX pages (CLAUDE.md §15 step 15)
- `/[locale]/about/` — founder bio + halftone portrait. Pending open question §16 on portrait source.
- `/[locale]/custom/` — custom-tour intake.
- `/[locale]/calendar/` — departures table reading from Sheets.
- `/[locale]/journal/` (index) and `/[locale]/journal/[slug]` (post).
- `/[locale]/contact/` — WhatsApp + email + map (no scroll-jacking) + InquiryForm.
- All composed of zones; no single-zone pages (CLAUDE.md hard rule).

### 9.2 — Forms (CLAUDE.md §15 step 16)
- `<NewsletterForm>` — paper input + ink arrow button, server action posting to Resend audience.
- `<InquiryForm>` — multi-field, RHF + Zod, server action emails via Resend, optional Sheets append.
- `<CustomTourForm>` — extended fields per CLAUDE.md §16 open question (resolve before building).
- All form errors `aria-live` (CLAUDE.md §12).
- Honeypot field for spam (no captcha — kills aesthetic).

### 9.3 — Pre-filled WhatsApp helper
- `/lib/contact/whatsappLink.ts` builds `https://wa.me/{NUMBER}?text=...` per locale + tour name.

**Exit criterion:** every documented page exists in all three locales; forms submit and emit to inbox; thank-you state shown without redirect.

---

## Phase 10 — Photography Pipeline Pass

**Goal:** convert the initial photo library to halftone-ready assets. CLAUDE.md §15 step 17.

### 10.1 — Resolve §16 open questions
- Photography source — existing library? new shoot?
- License terms.

### 10.2 — Batch processing
- Run the documented Photoshop action across the full library.
- Document any per-image manual adjustments back into `/docs/halftone-pipeline.md`.
- Compress all PNGs through ImageOptim/TinyPNG (≤ 200KB each per CLAUDE.md §11).

### 10.3 — Naming + placement
- `{subject}-{location}-halftone.png` per design.md §7.
- Place under `/public/images/halftone/` (subjects) or `/public/images/landscapes/` (banners).

### 10.4 — Replace placeholders
- Walk every page, swap placeholder halftones for real assets.
- Audit alt text per locale (CLAUDE.md §9 image SEO).

**Exit criterion:** zero placeholder images on production routes; total image weight per page ≤ 1.2MB (CLAUDE.md §11).

---

## Phase 11 — i18n Translation Pass

**Goal:** all copy human-translated and reviewed.

- **11.1** — Compile every dictionary key plus every MDX page into a single translation packet for each locale.
- **11.2** — Hand off to client / native translator. Spanish (Rioplatense first per CLAUDE.md §1), then English, then Portuguese. **No machine translation.**
- **11.3** — Voice review against design.md §1.5 anti-patterns: every string passes the "could a luxury competitor say this?" test. Reject defensive framing, triple-real claims, travel-brochure verbs.
- **11.4** — Localized slugs: each tour gets per-locale slugs in Sheets (e.g. `/es/tours/sobre-las-nubes`, `/en/tours/over-the-clouds`). Phase-9 launch ships with identical slugs across locales for the four locked tours; EN/PT divergence is allowed once the translator passes.
- **11.5** — `hreflang` audit: every URL has alternates pointing at sibling locales.

**Exit criterion:** zero `[NEEDS_TRANSLATION]` markers; all three locales render with native voice; client signs off.

---

## Phase 12 — Motion, Polish, Audits

### 12.1 — Motion pass (CLAUDE.md §15 step 19, design.md §6)
- Hero choreography (refined since Phase 6).
- IntersectionObserver fade-ins on section headlines.
- Hover states on tour cards, sticker CTAs, nav links.
- WhatsApp FAB stamp-in.
- Subtle landscape parallax (8% max) — A/B test, kill if it feels gimmicky.
- Verify all motion respects `prefers-reduced-motion`.

### 12.2 — Performance audit (CLAUDE.md §11)
- Lighthouse mobile + desktop on Home, Tours index, top tour page.
- Targets: LCP ≤ 2.0s, CLS ≤ 0.05, JS ≤ 150KB gzipped on tour page, Performance ≥ 95.
- Bundle analyzer pass — verify Framer Motion isn't shipping to Server Components.
- Image weight per page ≤ 1.2MB.
- Font count audit: 3 max.

### 12.3 — Accessibility audit (CLAUDE.md §12)
- axe + Lighthouse A11y = 100.
- Manual keyboard navigation through nav drawer, language switcher, lightbox, all forms.
- Verify red-on-paper contrast at every text size used (≥18px regular or ≥14px bold passes AA).
- Decorative elements (textures, torn edges, skull, grunge) all `aria-hidden`.
- Focus rings visible per the documented styles.

### 12.4 — SEO audit (CLAUDE.md §15 step 20, §9)
- Sitemap renders all locales × all published tours + journal + static.
- JSON-LD validates on every tour page.
- All meta descriptions are 140–160 chars, hand-written, locale-specific.
- OG images render and are 1200×630 with brand aesthetic.

### 12.5 — Cross-browser / device pass
- Safari, Chrome, Firefox; iOS, Android.
- Verify zone alternation holds on mobile (CLAUDE.md §10 risk: mobile flattening).

**Exit criterion:** Lighthouse ≥ 95 Performance, 100 SEO, 100 Accessibility on all three primary routes in three locales.

---

## Phase 13 — Pre-launch & Launch

- **13.1** — Resolve all `/docs/open-questions.md` (CLAUDE.md §16 list). Anything still open at launch becomes a v1.1 ticket.
- **13.2** — Analytics: GA4 wired per `NEXT_PUBLIC_GA_ID`. Custom events on WhatsApp clicks (per-tour), form submissions, language switches.
- **13.3** — Legal: privacy policy + terms (client-provided or drafted per §16). Cookie banner only if GA enabled in EU traffic.
- **13.4** — DNS + production env: point client's domain at Vercel (pending client's domain decision), configure `NEXT_PUBLIC_SITE_URL`, verify all env vars on production.
- **13.5** — Client training: 30-min walkthrough of the Sheet edit flow + revalidate bookmark + how to brief new halftone photos.
- **13.6** — Smoke tests: submit a real inquiry, real newsletter signup, real WhatsApp click from production.
- **13.7** — Launch.

---

## Cross-cutting working agreements

- **Branching:** every phase ships via PR with the phase number in the title; `main` always green.
- **Commits:** small, descriptive; conventional commits aren't required but encouraged.
- **Voice gate:** every string of copy proposed is checked against design.md §1.5 anti-patterns before commit. The inspiration image's exact copy (`5-STAR HOTEL`, `No pampering`, `Comfort kills the edge`, `Real connections...`, `Mountains. Desert. Epic.`) is **explicitly rejected source material** per CLAUDE.md §13 — the inspiration is visual, not lexical.
- **Open questions:** `/docs/open-questions.md` is the durable backlog. Don't let unresolved questions block phases that don't depend on them — flag, defer, continue.

---

## Pending dependencies (blocks specific phases)

| Item | Blocks | Owner |
| --- | --- | --- |
| Client's Vercel team / production credentials | Phase 13.4 (production deploy) | Client |
| Domain decision | Phase 13.4 | Client |
| Google Sheet ownership decision | Phase 5.1 | Client |
| WhatsApp number(s) | Phase 4.6 (WhatsAppFAB testing) | Client |
| Photography library / shoot decision | Phase 6.1 (hero gate), Phase 10 | Client |
| Founder portrait | Phase 9.1 (About page) | Client |
| Brand mark (skull/badge) confirmation | Phase 2.9, Phase 4.3 (Nav logo) | Client |
| ~~Tour list~~ + localized slugs | ~~Phase 5.2, Phase 7~~ | ~~Client~~ — **list locked 2026-05-10**, see `/docs/tours-source.md`. EN/PT slug variants + `base_price_usd` still pending client. |
| Custom tour intake fields | Phase 9.2 | Client |
| Privacy policy + terms | Phase 13.3 | Client |
| Translation packet review | Phase 11 | Client / native translator |

---

_Last updated: 2026-05-09. Update this file in the same PR as any phase scope change._
