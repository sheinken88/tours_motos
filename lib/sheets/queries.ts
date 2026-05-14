import "server-only";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { unstable_cache } from "next/cache";
import { type Locale } from "@/lib/i18n/config";
import { hasRealCredentials, readSheet } from "./client";
import { MOCK_DEPARTURES, MOCK_TOURS } from "./mock";
import { type Departure, type Tour, parseDepartures, parseTours } from "./schemas";

/**
 * Clear `hero_image` and `hero_image_color` on tours whose assets haven't
 * shipped yet so the card renders the paper-aged placeholder (and skips the
 * hover crossfade) instead of broken next/image markers. Schema accepts
 * empty strings; the TourCard treats empty as "no image / no color pair".
 *
 * Server-only — uses fs, runs once per cache miss (10 min TTL).
 */
function resolveHeroImages(tours: Tour[]): Tour[] {
  const onDisk = (publicPath: string) =>
    publicPath.startsWith("/") && existsSync(join(process.cwd(), "public", publicPath));
  return tours.map((tour) => ({
    ...tour,
    hero_image: tour.hero_image && onDisk(tour.hero_image) ? tour.hero_image : "",
    hero_image_color:
      tour.hero_image_color && onDisk(tour.hero_image_color) ? tour.hero_image_color : "",
  }));
}

/**
 * Query layer over the Sheets CMS. Every reader is cached for 10 minutes
 * (CLAUDE.md §6) and tagged so /api/revalidate can flush surgically.
 *
 * Failure modes (CLAUDE.md §6):
 *   - Sheets unreachable → unstable_cache keeps serving the last good payload.
 *   - Specific row malformed → skipped + logged; remaining rows ship.
 *   - No credentials → mock data (lib/sheets/mock.ts) so dev / preview
 *     environments and CI keep working without a service account.
 *
 * Surface types are stable regardless of source: callers don't know whether
 * data came from Sheets or the mock. Phase 7 pages consume `Tour[]` and
 * `Departure[]` directly.
 */

const REVALIDATE_SECONDS = 600;

const TOURS_RANGE = "Tours!A1:Z1000";
const DEPARTURES_RANGE = "Departures!A1:Z1000";

// ─── Sources ────────────────────────────────────────────────────────────────

async function fetchTours(): Promise<Tour[]> {
  if (!hasRealCredentials()) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[sheets] credentials missing — serving mock tours");
    }
    return resolveHeroImages(MOCK_TOURS.filter((t) => t.published));
  }

  try {
    const { headers, rows } = await readSheet(TOURS_RANGE);
    return resolveHeroImages(parseTours(headers, rows));
  } catch (error) {
    console.error("[sheets] fetchTours failed", error);
    // Empty array is the safest fallback — Phase 7 pages render their
    // empty-state UI and the cache layer keeps the last good payload.
    return [];
  }
}

async function fetchDepartures(): Promise<Departure[]> {
  if (!hasRealCredentials()) {
    return MOCK_DEPARTURES;
  }

  try {
    const { headers, rows } = await readSheet(DEPARTURES_RANGE);
    return parseDepartures(headers, rows);
  } catch (error) {
    console.error("[sheets] fetchDepartures failed", error);
    return [];
  }
}

// ─── Cached gates ───────────────────────────────────────────────────────────

const cachedTours = unstable_cache(fetchTours, ["sheets:tours"], {
  revalidate: REVALIDATE_SECONDS,
  tags: ["tours"],
});

const cachedDepartures = unstable_cache(fetchDepartures, ["sheets:departures"], {
  revalidate: REVALIDATE_SECONDS,
  tags: ["departures"],
});

// ─── Public queries ─────────────────────────────────────────────────────────

export async function getTours(_locale: Locale): Promise<Tour[]> {
  // Locale awareness is in the Tour shape itself (per-locale slugs and
  // titles). We accept the locale arg today so consumers don't have to
  // refactor when we eventually filter by locale-specific publish state.
  return cachedTours();
}

export async function getTourBySlug(locale: Locale, slug: string): Promise<Tour | null> {
  const tours = await cachedTours();
  return tours.find((t) => t.slug === slug || t.slugs[locale] === slug) ?? null;
}

export async function getUpcomingDepartures(): Promise<Departure[]> {
  const today = new Date().toISOString().slice(0, 10);
  const departures = await cachedDepartures();
  return departures
    .filter((d) => d.start_date >= today)
    .sort((a, b) => a.start_date.localeCompare(b.start_date));
}

export async function getDeparturesByTour(slug: string): Promise<Departure[]> {
  const departures = await cachedDepartures();
  return departures
    .filter((d) => d.tour_slug === slug)
    .sort((a, b) => a.start_date.localeCompare(b.start_date));
}
