# Open Questions

> Mirror of CLAUDE.md §16. Track decisions here; resolve before launch. Anything unresolved at launch becomes a v1.1 ticket.

## For client / project owner

- [ ] **Burgundy-red shade** — `#A8342A` is the recommended starting point; client may want to tune slightly.
- [ ] **Kraft-paper shade** — `#E8DCC4` is the recommended starting point.
- [x] **Final tour list for launch** — locked 2026-05-10 (full itineraries in `/docs/tours-source.md`):
  - `sobre-las-nubes` — Sobre las Nubes (Salta y Jujuy · 7d · 1712 km)
  - `gigantes-del-oeste` — Gigantes del Oeste (Mendoza a La Rioja · 8d · 2400 km)
  - `volcanes-del-norte` — Volcanes del Norte (Catamarca · 7d · ~1917 km — verify total)
  - `cruces-del-sur` — Cruces del Sur (Carretera Austral y Patagonia · 7d · 2321 km)
  - **Still pending:** `base_price_usd` per tour (currently 0 — interpreted as "consultar"); EN/PT localized slug variants (currently identical to ES); two distance gaps in source flagged inline in `/docs/tours-source.md`.
- [ ] **Photography source** — existing library? new shoot? license terms? Halftone processing requires high-contrast source images — flat midday phone shots will need re-shoots.
- [ ] **WhatsApp number(s)** — single or per-region?
- [ ] **Google Sheet ownership** — client's account or shared service workspace?
- [x] **Custom tour intake** — Phase 9 ships sensible defaults pending client review (resolved 2026-05-10):
  - Required: name, email.
  - Optional: group size, riding experience (years/bike/terrain), region or route of interest, preferred date window, free-form pitch (the trip in their head).
  - Honeypot field (`company`) for spam.
  - No captcha (kills the aesthetic per CLAUDE.md §10).
  - Client sign-off needed before launch — minor wording tweaks expected.
- [ ] **Motorcycle transport service** — launch with it or defer to v2?
- [ ] **Privacy policy and terms** — provided by client or drafted?
- [ ] **Founder portrait** for About page — needed for halftone cutout treatment. Phase 9 ships an empty portrait slot in the about page; Phase 10 fills the PNG.
- [ ] **Brand mark** — confirm skull/badge concept or design alternative.
- [ ] **Quote sources** — public-domain mix vs founder-original copy (legal review owned by client).
- [ ] **Journal author bio** — name + voice attribution for journal posts. Phase 9 seeds three ES placeholder posts that the client must replace or sign off on.
- [ ] **Inquiry destination email** — `INQUIRY_NOTIFICATION_EMAIL` value (where leads land).

## For project setup

- [ ] **Vercel project linking** — connect `https://github.com/sheinken88/tours_motos` to a Vercel project (user task; client production credentials pending).
- [ ] **Production domain** — confirm with client.
- [ ] **GMB profile** — Google Reviews summary needs the GMB URL.
- [ ] **Resend API key** — `RESEND_API_KEY` value (forms degrade to console.log without it).
- [ ] **Resend audience id** — `RESEND_AUDIENCE_ID` for the newsletter form (degrades to console.log without it).
- [ ] **Inquiry → Sheets mirror** — should inquiry submissions also append to a `Inquiries` tab in the existing tour Sheet? Phase 9 ships email-only; mirror is a one-line addition to `lib/contact/sendInquiry.ts` once the destination is chosen.
- [ ] **GA4 measurement ID** — `NEXT_PUBLIC_GA_ID` value.

---

_Add new questions as they surface. Mark resolved items with the resolution and date rather than deleting them — preserves the decision trail._
