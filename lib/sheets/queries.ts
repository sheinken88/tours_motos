import "server-only";
import { unstable_cache } from "next/cache";
import { type Locale } from "@/lib/i18n/config";
import { hasRealCredentials, readSheet } from "./client";
import {
  MOCK_DEPARTURES,
  MOCK_GALLERY,
  MOCK_ITINERARY,
  MOCK_TOUR_SECTIONS,
  MOCK_TOURS,
  translateKnownSpanish,
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

type LocalizedText = Record<Locale, string>;
type LocalizedList = Record<Locale, string[]>;

// ─── Images ────────────────────────────────────────────────────────────────

function isRemoteImage(publicPath: string): boolean {
  return /^https?:\/\//i.test(publicPath);
}

function isLocalPublicImage(publicPath: string): boolean {
  return publicPath.startsWith("/") && !publicPath.startsWith("//");
}

/**
 * Keep local public image paths out of filesystem probing. Runtime `existsSync`
 * on variable public paths makes Vercel's file tracer bundle the whole
 * `public/` tree into server functions. Remote/Drive URLs are still validated
 * by Next image remotePatterns at render time.
 */
function resolveHeroImages(tours: Tour[]): Tour[] {
  const resolves = (src: string) => src && (isRemoteImage(src) || isLocalPublicImage(src));
  return tours.map((tour) => ({
    ...tour,
    hero_image: resolves(tour.hero_image) ? tour.hero_image : "",
    hero_image_color: resolves(tour.hero_image_color) ? tour.hero_image_color : "",
  }));
}

function sortTours(tours: Tour[]): Tour[] {
  return [...tours].sort((a, b) => a.sort_order - b.sort_order);
}

function normalizeLocalizedText(value: LocalizedText): LocalizedText {
  return {
    es: value.es,
    en: translateKnownSpanish(value.en || value.es, "en"),
    pt: translateKnownSpanish(value.pt || value.es, "pt"),
  };
}

function normalizeLocalizedList(value: LocalizedList): LocalizedList {
  return {
    es: value.es,
    en: (value.en.length ? value.en : value.es).map((item) => translateKnownSpanish(item, "en")),
    pt: (value.pt.length ? value.pt : value.es).map((item) => translateKnownSpanish(item, "pt")),
  };
}

function normalizeTours(tours: Tour[]): Tour[] {
  return tours.map((tour) => ({
    ...tour,
    title: normalizeLocalizedText(tour.title),
    region: normalizeLocalizedText(tour.region),
    hero_image_alt: normalizeLocalizedText(tour.hero_image_alt),
    summary: normalizeLocalizedText(tour.summary),
    tagline: normalizeLocalizedText(tour.tagline),
    seo_title: normalizeLocalizedText(tour.seo_title),
    seo_description: normalizeLocalizedText(tour.seo_description),
  }));
}

function normalizeItinerary(days: ItineraryDay[]): ItineraryDay[] {
  return days.map((day) => ({
    ...day,
    title: normalizeLocalizedText(day.title),
    surface: normalizeLocalizedText(day.surface),
    body: normalizeLocalizedText(day.body),
    highlights: normalizeLocalizedList(day.highlights),
  }));
}

function normalizeTourSections(sections: TourSection[]): TourSection[] {
  return sections.map((section) => ({
    ...section,
    text: normalizeLocalizedText(section.text),
  }));
}

function normalizeGallery(gallery: GalleryImage[]): GalleryImage[] {
  return gallery.map((image) => ({
    ...image,
    alt: normalizeLocalizedText(image.alt),
    caption: normalizeLocalizedText(image.caption),
  }));
}

function normalizeDepartures(departures: Departure[]): Departure[] {
  return departures.map((departure) => ({
    ...departure,
    notes: normalizeLocalizedText(departure.notes),
  }));
}

function supplementMissingTourRows<T extends { tour_slug: string }>(rows: T[], fallback: T[]): T[] {
  const populatedTours = new Set(rows.map((row) => row.tour_slug));
  return [...rows, ...fallback.filter((row) => !populatedTours.has(row.tour_slug))];
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
    return sortTours(
      resolveHeroImages(normalizeTours(MOCK_TOURS.filter((tour) => tour.published))),
    );
  }

  try {
    const { headers, rows } = await fetchSheetRows(TOURS_RANGE);
    return sortTours(resolveHeroImages(normalizeTours(parseTours(headers, rows))));
  } catch (error) {
    console.error("[sheets] fetchTours failed", error);
    return [];
  }
}

async function fetchItinerary(): Promise<ItineraryDay[]> {
  if (!hasRealCredentials()) return normalizeItinerary(MOCK_ITINERARY);

  try {
    const { headers, rows } = await fetchSheetRows(ITINERARY_RANGE);
    return normalizeItinerary(
      supplementMissingTourRows(parseItinerary(headers, rows), MOCK_ITINERARY),
    );
  } catch (error) {
    console.error("[sheets] fetchItinerary failed", error);
    return [];
  }
}

async function fetchTourSections(): Promise<TourSection[]> {
  if (!hasRealCredentials()) return normalizeTourSections(MOCK_TOUR_SECTIONS);

  try {
    const { headers, rows } = await fetchSheetRows(SECTIONS_RANGE);
    return normalizeTourSections(
      supplementMissingTourRows(parseTourSections(headers, rows), MOCK_TOUR_SECTIONS),
    );
  } catch (error) {
    console.error("[sheets] fetchTourSections failed", error);
    return [];
  }
}

async function fetchGallery(): Promise<GalleryImage[]> {
  if (!hasRealCredentials()) return normalizeGallery(MOCK_GALLERY);

  try {
    const { headers, rows } = await fetchSheetRows(GALLERY_RANGE);
    return normalizeGallery(
      supplementMissingTourRows(parseGalleryImages(headers, rows), MOCK_GALLERY),
    );
  } catch (error) {
    console.error("[sheets] fetchGallery failed", error);
    return [];
  }
}

async function fetchDepartures(): Promise<Departure[]> {
  if (!hasRealCredentials()) return normalizeDepartures(MOCK_DEPARTURES);

  try {
    const { headers, rows } = await fetchSheetRows(DEPARTURES_RANGE);
    return normalizeDepartures(parseDepartures(headers, rows));
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
