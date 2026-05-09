import { type Departure, type Tour } from "./schemas";

/**
 * Mock data used when GOOGLE_SHEETS_CREDENTIALS is missing or set to the
 * placeholder value. Lets us build pages and run the full ISR + revalidate
 * pipeline without a real GCP service account during Phase 5–7.
 *
 * Three Argentine routes per CLAUDE.md §1: Patagonia, the Andes (Cuyo→Salta),
 * and Norte (Salta→Jujuy→Bolivia border). Distances and durations are
 * realistic; final names, slugs, and pricing come from the client.
 *
 * Replaced by real Sheets data when the .env credentials are populated.
 * No code change required — see lib/sheets/client.ts for the gate.
 */

export const MOCK_TOURS: Tour[] = [
  {
    slug: "patagonia-raw",
    title: {
      es: "Patagonia Raw",
      en: "Patagonia Raw",
      pt: "Patagônia Raw",
    },
    slugs: {
      es: "patagonia-raw",
      en: "patagonia-raw",
      pt: "patagonia-raw",
    },
    region: "Patagonia",
    difficulty: "hard",
    duration_days: 12,
    distance_km: 2200,
    base_price_usd: 4800,
    currency: "USD",
    hero_image: "/images/halftone/patagonia-raw-hero.png",
    published: true,
  },
  {
    slug: "andes-cuyo-salta",
    title: {
      es: "De Cuyo a Salta · La Travesía Andina",
      en: "Cuyo to Salta · The Andean Crossing",
      pt: "De Cuyo a Salta · A Travessia Andina",
    },
    slugs: {
      es: "andes-cuyo-salta",
      en: "andes-cuyo-salta",
      pt: "andes-cuyo-salta",
    },
    region: "Cuyo & Norte",
    difficulty: "hard",
    duration_days: 10,
    distance_km: 1850,
    base_price_usd: 4200,
    currency: "USD",
    hero_image: "/images/halftone/andes-cuyo-salta-hero.png",
    published: true,
  },
  {
    slug: "norte-jujuy-bolivia",
    title: {
      es: "Norte · Salta, Jujuy y la Quebrada",
      en: "Norte · Salta, Jujuy and the Quebrada",
      pt: "Norte · Salta, Jujuy e a Quebrada",
    },
    slugs: {
      es: "norte-jujuy-bolivia",
      en: "norte-jujuy-bolivia",
      pt: "norte-jujuy-bolivia",
    },
    region: "Norte Argentino",
    difficulty: "moderate",
    duration_days: 8,
    distance_km: 1400,
    base_price_usd: 3200,
    currency: "USD",
    hero_image: "/images/halftone/norte-jujuy-bolivia-hero.png",
    published: true,
  },
];

export const MOCK_DEPARTURES: Departure[] = [
  // Patagonia Raw — late 2026 season
  {
    tour_slug: "patagonia-raw",
    start_date: "2026-11-08",
    end_date: "2026-11-19",
    capacity: 8,
    spots_remaining: 3,
    status: "low",
    notes: "Temporada baja — clima impredecible.",
  },
  {
    tour_slug: "patagonia-raw",
    start_date: "2026-12-06",
    end_date: "2026-12-17",
    capacity: 8,
    spots_remaining: 8,
    status: "open",
    notes: "",
  },
  // Andes — spring/summer
  {
    tour_slug: "andes-cuyo-salta",
    start_date: "2026-10-12",
    end_date: "2026-10-21",
    capacity: 8,
    spots_remaining: 0,
    status: "sold_out",
    notes: "",
  },
  {
    tour_slug: "andes-cuyo-salta",
    start_date: "2027-03-08",
    end_date: "2027-03-17",
    capacity: 8,
    spots_remaining: 6,
    status: "open",
    notes: "",
  },
  // Norte — autumn
  {
    tour_slug: "norte-jujuy-bolivia",
    start_date: "2026-05-18",
    end_date: "2026-05-25",
    capacity: 10,
    spots_remaining: 4,
    status: "low",
    notes: "Carnaval — alojamientos limitados.",
  },
];
