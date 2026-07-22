import "server-only";
import { unstable_cache } from "next/cache";
import { localizePrices } from "@/lib/currency/exchange";
import { type LocalizedPrice } from "@/lib/currency/types";
import { type Locale } from "@/lib/i18n/config";
import {
  MOCK_DEPARTURES,
  MOCK_GALLERY,
  MOCK_ITINERARY,
  MOCK_TOUR_PRICES,
  MOCK_TOUR_SECTIONS,
  MOCK_TOURS,
  translateKnownSpanish,
} from "./mock";
import {
  type Departure,
  type GalleryImage,
  type ItineraryDay,
  type Tour,
  type TourPrice,
  type TourPageContent,
  type TourSection,
  parseDepartures,
  parseTourPrices,
} from "./schemas";

/**
 * Query layer for route content and calendar departures.
 *
 * Tours, itinerary, route sections, gallery, and route images are static site
 * content. Google Sheets owns client-editable route prices and the
 * departures/calendar surface.
 * Every reader is cached for 10 minutes and tagged so /api/revalidate can
 * flush departures after client edits.
 */

const REVALIDATE_SECONDS = 600;

const DEPARTURES_RANGE = "Departures!A1:AZ1000";
const TOUR_PRICES_RANGE = "'Tour Prices'!A1:C1000";

type LocalizedText = Record<Locale, string>;
type LocalizedList = Record<Locale, string[]>;

// ─── Images ────────────────────────────────────────────────────────────────

function isLocalPublicImage(publicPath: string): boolean {
  return publicPath.startsWith("/") && !publicPath.startsWith("//");
}

/**
 * Keep local public image paths out of filesystem probing. Runtime `existsSync`
 * on variable public paths makes Vercel's file tracer bundle the whole
 * `public/` tree into server functions. Route images should resolve to local
 * public assets now that Sheets no longer owns route imagery.
 */
function resolveHeroImages(tours: Tour[]): Tour[] {
  const resolves = (src: string) => src && isLocalPublicImage(src);
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

// ─── Sheet fetch helpers ───────────────────────────────────────────────────

async function fetchSheetRows(range: string) {
  const { readSheet } = await import("./client");
  const { headers, rows } = await readSheet(range);
  return { headers, rows };
}

async function hasSheetsCredentials(): Promise<boolean> {
  const { hasRealCredentials } = await import("./client");
  return hasRealCredentials();
}

async function fetchTours(): Promise<Tour[]> {
  return sortTours(resolveHeroImages(normalizeTours(MOCK_TOURS.filter((tour) => tour.published))));
}

async function fetchItinerary(): Promise<ItineraryDay[]> {
  return normalizeItinerary(MOCK_ITINERARY);
}

async function fetchTourSections(): Promise<TourSection[]> {
  return normalizeTourSections(MOCK_TOUR_SECTIONS);
}

async function fetchGallery(): Promise<GalleryImage[]> {
  return normalizeGallery(MOCK_GALLERY);
}

async function fetchDepartures(): Promise<Departure[]> {
  if (!(await hasSheetsCredentials())) return normalizeDepartures(MOCK_DEPARTURES);

  try {
    const { headers, rows } = await fetchSheetRows(DEPARTURES_RANGE);
    return normalizeDepartures(parseDepartures(headers, rows));
  } catch (error) {
    console.error("[sheets] fetchDepartures failed", error);
    return [];
  }
}

async function fetchTourPrices(): Promise<TourPrice[]> {
  if (!(await hasSheetsCredentials())) return MOCK_TOUR_PRICES;

  try {
    const { headers, rows } = await fetchSheetRows(TOUR_PRICES_RANGE);
    return parseTourPrices(headers, rows);
  } catch (error) {
    console.error("[sheets] fetchTourPrices failed", error);
    return MOCK_TOUR_PRICES;
  }
}

// ─── Cached gates ───────────────────────────────────────────────────────────

const cachedTours = unstable_cache(fetchTours, ["content:tours:v3"], {
  revalidate: REVALIDATE_SECONDS,
  tags: ["tours"],
});

const cachedItinerary = unstable_cache(fetchItinerary, ["content:itinerary"], {
  revalidate: REVALIDATE_SECONDS,
  tags: ["tours"],
});

const cachedTourSections = unstable_cache(fetchTourSections, ["content:tour-sections"], {
  revalidate: REVALIDATE_SECONDS,
  tags: ["tours"],
});

const cachedGallery = unstable_cache(fetchGallery, ["content:gallery"], {
  revalidate: REVALIDATE_SECONDS,
  tags: ["tours"],
});

const cachedDepartures = unstable_cache(fetchDepartures, ["sheets:departures"], {
  revalidate: REVALIDATE_SECONDS,
  tags: ["departures"],
});

const cachedTourPrices = unstable_cache(fetchTourPrices, ["sheets:tour-prices"], {
  revalidate: REVALIDATE_SECONDS,
  tags: ["tour-prices"],
});

// ─── Public queries ─────────────────────────────────────────────────────────

export async function getTours(_locale: Locale): Promise<Tour[]> {
  return cachedTours();
}

export async function getTourBySlug(locale: Locale, slug: string): Promise<Tour | null> {
  const tours = await cachedTours();
  return (
    tours.find(
      (tour) =>
        tour.slug === slug ||
        tour.slugs[locale] === slug ||
        Object.values(tour.slugs).includes(slug),
    ) ?? null
  );
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
    (candidate) =>
      candidate.slug === slug ||
      candidate.slugs[locale] === slug ||
      Object.values(candidate.slugs).includes(slug),
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

export type TourPriceMap = Record<string, LocalizedPrice>;

/**
 * Public catalog price per tour. The `Tour Prices` tab is the stable base
 * price source; a non-zero price on an upcoming departure overrides that base
 * price for the catalog. A zero price means "consult us" and is omitted.
 */
export async function getTourPriceMap(locale: Locale): Promise<TourPriceMap> {
  const [tours, tourPrices, allDepartures] = await Promise.all([
    cachedTours(),
    cachedTourPrices(),
    cachedDepartures(),
  ]);
  const today = new Date().toISOString().slice(0, 10);
  const departures = allDepartures.filter(
    (departure) => departure.start_date >= today && departure.price > 0,
  );
  const baseByTour = new Map<string, TourPrice>();
  const overridesByTour = new Map<string, Departure[]>();

  for (const tourPrice of tourPrices) {
    if (tourPrice.price > 0) baseByTour.set(tourPrice.tour_slug, tourPrice);
  }

  for (const departure of departures) {
    const current = overridesByTour.get(departure.tour_slug) ?? [];
    current.push(departure);
    overridesByTour.set(departure.tour_slug, current);
  }

  const entries = await Promise.all(
    tours.map(async (tour) => {
      const overrides = overridesByTour.get(tour.slug) ?? [];
      const base = baseByTour.get(tour.slug);
      const candidates = overrides.length
        ? overrides.map(({ price, currency }) => ({ price, currency }))
        : base
          ? [{ price: base.price, currency: base.currency }]
          : [];

      if (!candidates.length) return null;

      const localized = await localizePrices(
        candidates.map(({ price, currency }) => ({ amount: price, currency })),
        locale,
      );
      const comparable = localized.every((price) => price.currency === localized[0]?.currency);
      const first = localized[0]!;
      const selected = comparable
        ? localized
            .slice(1)
            .reduce((lowest, price) => (price.amount < lowest.amount ? price : lowest), first)
        : first;
      return [tour.slug, selected] as const;
    }),
  );

  return Object.fromEntries(
    entries.filter((entry): entry is [string, LocalizedPrice] => entry !== null),
  );
}
