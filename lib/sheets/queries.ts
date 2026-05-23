import "server-only";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { unstable_cache } from "next/cache";
import { type Locale } from "@/lib/i18n/config";
import { hasRealCredentials, readSheet } from "./client";
import {
  MOCK_DEPARTURES,
  MOCK_GALLERY,
  MOCK_ITINERARY,
  MOCK_TOUR_SECTIONS,
  MOCK_TOURS,
} from "./mock";
import {
  type Departure,
  type GalleryImage,
  type ItineraryDay,
  type Tour,
  type TourPageContent,
  type TourSection,
  parseDepartures,
  parseGalleryImages,
  parseItinerary,
  parseTourSections,
  parseTours,
} from "./schemas";

/**
 * Query layer over the Sheets CMS. Every reader is cached for 10 minutes and
 * tagged so /api/revalidate can flush surgically. Callers consume stable typed
 * data whether the source is Google Sheets or the local mock.
 */

const REVALIDATE_SECONDS = 600;

const TOURS_RANGE = "Tours!A1:AZ1000";
const ITINERARY_RANGE = "Itinerary!A1:AZ3000";
const SECTIONS_RANGE = "Includes!A1:AZ3000";
const GALLERY_RANGE = "Gallery!A1:AZ3000";
const DEPARTURES_RANGE = "Departures!A1:AZ1000";

// ─── Images ────────────────────────────────────────────────────────────────

function isRemoteImage(publicPath: string): boolean {
  return /^https?:\/\//i.test(publicPath);
}

function isLocalPublicImage(publicPath: string): boolean {
  return publicPath.startsWith("/") && existsSync(join(process.cwd(), "public", publicPath));
}

/**
 * Clear local image paths whose assets have not shipped yet. Remote/Drive URLs
 * are left intact and validated by Next image remotePatterns at render time.
 */
function resolveHeroImages(tours: Tour[]): Tour[] {
  const resolves = (src: string) => src && (isRemoteImage(src) || isLocalPublicImage(src));
  return tours.map((tour) => ({
    ...tour,
    hero_image: resolves(tour.hero_image) ? tour.hero_image : "",
    hero_image_color: resolves(tour.hero_image_color) ? tour.hero_image_color : "",
  }));
}

// ─── Sheet fetch helpers ───────────────────────────────────────────────────

async function fetchSheetRows(range: string) {
  const { headers, rows } = await readSheet(range);
  return { headers, rows };
}

async function fetchTours(): Promise<Tour[]> {
  if (!hasRealCredentials()) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[sheets] credentials missing — serving mock tours");
    }
    return resolveHeroImages(MOCK_TOURS.filter((tour) => tour.published));
  }

  try {
    const { headers, rows } = await fetchSheetRows(TOURS_RANGE);
    return resolveHeroImages(parseTours(headers, rows));
  } catch (error) {
    console.error("[sheets] fetchTours failed", error);
    return [];
  }
}

async function fetchItinerary(): Promise<ItineraryDay[]> {
  if (!hasRealCredentials()) return MOCK_ITINERARY;

  try {
    const { headers, rows } = await fetchSheetRows(ITINERARY_RANGE);
    return parseItinerary(headers, rows);
  } catch (error) {
    console.error("[sheets] fetchItinerary failed", error);
    return [];
  }
}

async function fetchTourSections(): Promise<TourSection[]> {
  if (!hasRealCredentials()) return MOCK_TOUR_SECTIONS;

  try {
    const { headers, rows } = await fetchSheetRows(SECTIONS_RANGE);
    return parseTourSections(headers, rows);
  } catch (error) {
    console.error("[sheets] fetchTourSections failed", error);
    return [];
  }
}

async function fetchGallery(): Promise<GalleryImage[]> {
  if (!hasRealCredentials()) return MOCK_GALLERY;

  try {
    const { headers, rows } = await fetchSheetRows(GALLERY_RANGE);
    return parseGalleryImages(headers, rows);
  } catch (error) {
    console.error("[sheets] fetchGallery failed", error);
    return [];
  }
}

async function fetchDepartures(): Promise<Departure[]> {
  if (!hasRealCredentials()) return MOCK_DEPARTURES;

  try {
    const { headers, rows } = await fetchSheetRows(DEPARTURES_RANGE);
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

const cachedItinerary = unstable_cache(fetchItinerary, ["sheets:itinerary"], {
  revalidate: REVALIDATE_SECONDS,
  tags: ["tours"],
});

const cachedTourSections = unstable_cache(fetchTourSections, ["sheets:tour-sections"], {
  revalidate: REVALIDATE_SECONDS,
  tags: ["tours"],
});

const cachedGallery = unstable_cache(fetchGallery, ["sheets:gallery"], {
  revalidate: REVALIDATE_SECONDS,
  tags: ["tours"],
});

const cachedDepartures = unstable_cache(fetchDepartures, ["sheets:departures"], {
  revalidate: REVALIDATE_SECONDS,
  tags: ["departures"],
});

// ─── Public queries ─────────────────────────────────────────────────────────

export async function getTours(_locale: Locale): Promise<Tour[]> {
  return cachedTours();
}

export async function getTourBySlug(locale: Locale, slug: string): Promise<Tour | null> {
  const tours = await cachedTours();
  return tours.find((tour) => tour.slug === slug || tour.slugs[locale] === slug) ?? null;
}

export async function getTourPageBySlug(
  locale: Locale,
  slug: string,
): Promise<TourPageContent | null> {
  const [tours, itinerary, sections, gallery, departures] = await Promise.all([
    cachedTours(),
    cachedItinerary(),
    cachedTourSections(),
    cachedGallery(),
    cachedDepartures(),
  ]);

  const tour = tours.find(
    (candidate) => candidate.slug === slug || candidate.slugs[locale] === slug,
  );
  if (!tour) return null;

  return {
    tour,
    itinerary: itinerary
      .filter((day) => day.tour_slug === tour.slug)
      .sort((a, b) => a.day_number - b.day_number),
    sections: sections
      .filter((section) => section.tour_slug === tour.slug)
      .sort((a, b) => a.sort_order - b.sort_order),
    gallery: gallery
      .filter((image) => image.tour_slug === tour.slug)
      .sort((a, b) => a.sort_order - b.sort_order),
    departures: departures
      .filter((departure) => departure.tour_slug === tour.slug)
      .sort((a, b) => a.start_date.localeCompare(b.start_date)),
  };
}

export async function getUpcomingDepartures(): Promise<Departure[]> {
  const today = new Date().toISOString().slice(0, 10);
  const departures = await cachedDepartures();
  return departures
    .filter((departure) => departure.start_date >= today)
    .sort((a, b) => a.start_date.localeCompare(b.start_date));
}

export async function getDeparturesByTour(slug: string): Promise<Departure[]> {
  const departures = await cachedDepartures();
  return departures
    .filter((departure) => departure.tour_slug === slug)
    .sort((a, b) => a.start_date.localeCompare(b.start_date));
}
