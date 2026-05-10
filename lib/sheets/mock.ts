import { type Departure, type Tour } from "./schemas";

/**
 * Mock data used when GOOGLE_SHEETS_CREDENTIALS is missing or set to the
 * placeholder value. Lets us build pages and run the full ISR + revalidate
 * pipeline without a real GCP service account.
 *
 * The four launch tours per /docs/tours-source.md (client-provided 2026-05-10).
 * Pricing is `0` until the client confirms — `published=true` so the tours
 * appear on /tours but the JSON-LD price reads "0" (interpreted as
 * "contact for pricing"). Schema allows nonnegative prices for this case.
 *
 * Mock departures intentionally empty: client owns the calendar in Sheets.
 * Calendar / tour-detail pages render their empty-state copy until real
 * dates land.
 *
 * Replaced by real Sheets data when the .env credentials are populated.
 * No code change required — see lib/sheets/client.ts for the gate.
 */

export const MOCK_TOURS: Tour[] = [
  {
    slug: "sobre-las-nubes",
    title: {
      es: "Sobre las Nubes",
      en: "Sobre las Nubes",
      pt: "Sobre las Nubes",
    },
    slugs: {
      es: "sobre-las-nubes",
      en: "sobre-las-nubes",
      pt: "sobre-las-nubes",
    },
    region: "Salta y Jujuy",
    difficulty: "moderate",
    duration_days: 7,
    distance_km: 1712,
    base_price_usd: 0,
    currency: "USD",
    hero_image: "/images/halftone/sobre-las-nubes-hero.png",
    published: true,
  },
  {
    slug: "gigantes-del-oeste",
    title: {
      es: "Gigantes del Oeste",
      en: "Gigantes del Oeste",
      pt: "Gigantes del Oeste",
    },
    slugs: {
      es: "gigantes-del-oeste",
      en: "gigantes-del-oeste",
      pt: "gigantes-del-oeste",
    },
    region: "Mendoza a La Rioja",
    difficulty: "moderate",
    duration_days: 8,
    distance_km: 2400,
    base_price_usd: 0,
    currency: "USD",
    hero_image: "/images/halftone/gigantes-del-oeste-hero.png",
    published: true,
  },
  {
    slug: "volcanes-del-norte",
    title: {
      es: "Volcanes del Norte",
      en: "Volcanes del Norte",
      pt: "Volcanes del Norte",
    },
    slugs: {
      es: "volcanes-del-norte",
      en: "volcanes-del-norte",
      pt: "volcanes-del-norte",
    },
    region: "Catamarca",
    // "Intermedio +" in the brief — closest schema match is "hard". The level
    // sits between moderate and hard; we err harder so riders self-select up.
    difficulty: "hard",
    duration_days: 7,
    // Brief did not provide a total; sum across day tramos = 1917 km.
    // Verify with client before launch.
    distance_km: 1917,
    base_price_usd: 0,
    currency: "USD",
    hero_image: "/images/halftone/volcanes-del-norte-hero.png",
    published: true,
  },
  {
    slug: "cruces-del-sur",
    title: {
      es: "Cruces del Sur",
      en: "Cruces del Sur",
      pt: "Cruces del Sur",
    },
    slugs: {
      es: "cruces-del-sur",
      en: "cruces-del-sur",
      pt: "cruces-del-sur",
    },
    region: "Carretera Austral y Patagonia",
    difficulty: "moderate",
    duration_days: 7,
    distance_km: 2321,
    base_price_usd: 0,
    currency: "USD",
    hero_image: "/images/halftone/cruces-del-sur-hero.png",
    published: true,
  },
];

/**
 * Departures intentionally empty — the client owns dates via the Sheets
 * `Departures` tab. Calendar and tour-detail pages render their empty-state
 * copy ("Sin fechas confirmadas...") until real rows are added.
 */
export const MOCK_DEPARTURES: Departure[] = [];
