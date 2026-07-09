import { z } from "zod";
import { type Locale, locales } from "@/lib/i18n/config";

/**
 * Zod schemas for the Google Sheets CMS layer.
 *
 * Sheets remains the client-editable source for structured tour content:
 * tour cards, localized SEO fields, day-by-day itineraries, departures,
 * include/exclude lists, and gallery image references. Rows are validated
 * independently so one bad row is skipped without breaking the site.
 */

// ─── Helpers ────────────────────────────────────────────────────────────────

type RawCells = Record<string, string>;

const emptyLocalizedText = Object.fromEntries(locales.map((loc) => [loc, ""])) as Record<
  Locale,
  string
>;

function cellToString(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function splitList(value: unknown): string[] {
  return cellToString(value)
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
}

const text = z.preprocess(cellToString, z.string());
const requiredText = text.pipe(z.string().min(1));

const positiveInt = z.preprocess(
  (value) => Number(cellToString(value)),
  z.number().int().positive(),
);

const nonNegativeInt = z.preprocess(
  (value) => Number(cellToString(value)),
  z.number().int().nonnegative(),
);

const nonNegativeNumber = z.preprocess(
  (value) => Number(cellToString(value)),
  z.number().nonnegative(),
);

const optionalNonNegativeInt = z.preprocess((value) => {
  const raw = cellToString(value);
  return raw === "" ? null : Number(raw);
}, z.number().int().nonnegative().nullable());

const difficulty = z.preprocess(
  (value) => {
    const raw = cellToString(value).toLowerCase().replace(/\s+/g, "_").replace(/\+/g, "_plus");

    if (raw === "intermedio_plus_plus" || raw === "intermediate_plus_plus") {
      return "intermediate_plus_plus";
    }

    return raw;
  },
  z.enum(["easy", "moderate", "intermediate_plus_plus", "hard", "expert"]),
);

/** Sheets-style booleans: TRUE / FALSE / yes / no / 1 / 0. Empty = false. */
const sheetsBool = z.preprocess((value) => {
  const raw = cellToString(value).toLowerCase();
  if (raw === "" || raw === "false" || raw === "no" || raw === "0") return false;
  if (raw === "true" || raw === "yes" || raw === "1") return true;
  return null;
}, z.boolean());

const isoDate = text.pipe(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "expected YYYY-MM-DD"));

const localizedText = z.object(
  Object.fromEntries(locales.map((loc) => [loc, requiredText])) as Record<
    Locale,
    typeof requiredText
  >,
);

const optionalLocalizedText = z.object(
  Object.fromEntries(locales.map((loc) => [loc, text])) as Record<Locale, typeof text>,
);

const localizedList = z.object(
  Object.fromEntries(
    locales.map((loc) => [loc, z.preprocess(splitList, z.array(z.string()))]),
  ) as unknown as Record<Locale, z.ZodType<string[]>>,
);

function localizedFromCells(cells: RawCells, key: string): Record<Locale, string> {
  return Object.fromEntries(locales.map((loc) => [loc, cells[`${key}_${loc}`] ?? ""])) as Record<
    Locale,
    string
  >;
}

function localizedWithFallback(cells: RawCells, key: string): Record<Locale, string> {
  const explicit = localizedFromCells(cells, key);
  const fallback = cells[key] ?? "";
  return Object.fromEntries(locales.map((loc) => [loc, explicit[loc] || fallback])) as Record<
    Locale,
    string
  >;
}

function rowToCells(headers: string[], row: unknown): RawCells {
  const cells: RawCells = {};
  if (!Array.isArray(row)) return cells;
  for (let i = 0; i < headers.length; i++) {
    const key = headers[i]?.trim();
    if (!key) continue;
    cells[key] = cellToString(row[i]);
  }
  return cells;
}

function driveImageUrl(fileId: string): string {
  return `https://drive.google.com/uc?export=view&id=${encodeURIComponent(fileId)}`;
}

function resolveImageReference(url: string, driveId: string): string {
  if (url) return url;
  if (driveId) return driveImageUrl(driveId);
  return "";
}

// ─── Tour ───────────────────────────────────────────────────────────────────

export const TourSchema = z.object({
  /** Stable join key across every CMS tab. Keep separate from public URL slugs. */
  slug: requiredText,
  sort_order: nonNegativeInt.default(0),
  title: localizedText,
  /** Per-locale URL slugs — e.g. /es/tours/tour-moto-salta-jujuy. */
  slugs: localizedText,
  region: localizedText,
  difficulty,
  duration_days: positiveInt,
  distance_km: positiveInt,
  ripio_percent: optionalNonNegativeInt,
  max_altitude_m: optionalNonNegativeInt,
  base_price_usd: nonNegativeNumber,
  currency: z.enum(["USD", "ARS", "EUR"]).default("USD"),
  hero_image: text,
  hero_image_color: text,
  hero_image_drive_id: text,
  hero_image_color_drive_id: text,
  hero_image_alt: optionalLocalizedText,
  summary: localizedText,
  tagline: optionalLocalizedText,
  seo_title: optionalLocalizedText,
  seo_description: optionalLocalizedText,
  published: sheetsBool,
});

export type Tour = z.infer<typeof TourSchema>;

// ─── Itinerary ──────────────────────────────────────────────────────────────

export const ItineraryDaySchema = z.object({
  tour_slug: requiredText,
  day_number: positiveInt,
  title: localizedText,
  route_from: text,
  route_to: text,
  distance_km: optionalNonNegativeInt,
  surface: optionalLocalizedText,
  max_altitude_m: optionalNonNegativeInt,
  body: localizedText,
  highlights: localizedList,
});

export type ItineraryDay = z.infer<typeof ItineraryDaySchema>;

// ─── Tour Sections ─────────────────────────────────────────────────────────

export const TourSectionSchema = z.object({
  tour_slug: requiredText,
  type: z.enum(["included", "not_included", "need_to_know"]),
  sort_order: nonNegativeInt.default(0),
  text: localizedText,
});

export type TourSection = z.infer<typeof TourSectionSchema>;

// ─── Gallery ────────────────────────────────────────────────────────────────

export const GalleryImageSchema = z.object({
  tour_slug: requiredText,
  sort_order: nonNegativeInt.default(0),
  image_url: requiredText,
  image_drive_id: text,
  alt: localizedText,
  caption: optionalLocalizedText,
  featured: sheetsBool,
});

export type GalleryImage = z.infer<typeof GalleryImageSchema>;

// ─── Departure ──────────────────────────────────────────────────────────────

export const DepartureSchema = z.object({
  tour_slug: requiredText,
  start_date: isoDate,
  end_date: isoDate,
  capacity: positiveInt,
  spots_remaining: nonNegativeInt,
  status: z.enum(["open", "low", "sold_out"]),
  price: nonNegativeNumber,
  currency: z.enum(["USD", "ARS", "EUR"]).default("USD"),
  notes: optionalLocalizedText,
});

export type Departure = z.infer<typeof DepartureSchema>;

export type TourPageContent = {
  tour: Tour;
  itinerary: ItineraryDay[];
  sections: TourSection[];
  gallery: GalleryImage[];
  departures: Departure[];
};

// ─── Row shapers ────────────────────────────────────────────────────────────

function shapeTourRow(cells: RawCells): unknown {
  const heroDriveId = cells.hero_image_drive_id ?? cells.hero_drive_id ?? "";
  const heroColorDriveId = cells.hero_image_color_drive_id ?? cells.hero_color_drive_id ?? "";
  const canonicalSlug = cells.slug ?? cells.tour_slug ?? cells.id ?? cells.slug_es ?? "";

  return {
    slug: canonicalSlug,
    sort_order: cells.sort_order ?? "",
    title: localizedFromCells(cells, "title"),
    slugs: {
      es: cells.slug_es ?? canonicalSlug,
      en: cells.slug_en ?? canonicalSlug,
      pt: cells.slug_pt ?? canonicalSlug,
    },
    region: localizedWithFallback(cells, "region"),
    difficulty: cells.difficulty ?? "",
    duration_days: cells.duration_days ?? "",
    distance_km: cells.distance_km ?? "",
    ripio_percent: cells.ripio_percent ?? "",
    max_altitude_m: cells.max_altitude_m ?? "",
    base_price_usd: cells.base_price_usd ?? cells.base_price ?? "",
    currency: cells.currency || "USD",
    hero_image: resolveImageReference(cells.hero_image ?? cells.hero_image_url ?? "", heroDriveId),
    hero_image_color: resolveImageReference(
      cells.hero_image_color ?? cells.hero_image_color_url ?? "",
      heroColorDriveId,
    ),
    hero_image_drive_id: heroDriveId,
    hero_image_color_drive_id: heroColorDriveId,
    hero_image_alt: localizedWithFallback(cells, "hero_image_alt"),
    summary: localizedFromCells(cells, "summary"),
    tagline: localizedWithFallback(cells, "tagline"),
    seo_title: localizedWithFallback(cells, "seo_title"),
    seo_description: localizedWithFallback(cells, "seo_description"),
    published: cells.published ?? "FALSE",
  };
}

function shapeItineraryRow(cells: RawCells): unknown {
  return {
    tour_slug: cells.tour_slug ?? cells.tour_id ?? cells.slug ?? "",
    day_number: cells.day_number ?? cells.day ?? "",
    title: localizedFromCells(cells, "title"),
    route_from: cells.route_from ?? "",
    route_to: cells.route_to ?? "",
    distance_km: cells.distance_km ?? "",
    surface: localizedWithFallback(cells, "surface"),
    max_altitude_m: cells.max_altitude_m ?? "",
    body: localizedFromCells(cells, "body"),
    highlights: localizedFromCells(cells, "highlights"),
  };
}

function shapeTourSectionRow(cells: RawCells): unknown {
  return {
    tour_slug: cells.tour_slug ?? cells.tour_id ?? cells.slug ?? "",
    type: cells.type ?? "",
    sort_order: cells.sort_order ?? "",
    text: localizedFromCells(cells, "text"),
  };
}

function shapeGalleryRow(cells: RawCells): unknown {
  const driveId = cells.image_drive_id ?? cells.drive_id ?? "";
  return {
    tour_slug: cells.tour_slug ?? cells.tour_id ?? cells.slug ?? "",
    sort_order: cells.sort_order ?? "",
    image_url: resolveImageReference(cells.image_url ?? "", driveId),
    image_drive_id: driveId,
    alt: localizedFromCells(cells, "alt"),
    caption: localizedWithFallback(cells, "caption"),
    featured: cells.featured ?? "FALSE",
  };
}

function shapeDepartureRow(cells: RawCells): unknown {
  return {
    tour_slug: cells.tour_slug ?? cells.tour_id ?? cells.slug ?? "",
    start_date: cells.start_date ?? "",
    end_date: cells.end_date ?? "",
    capacity: cells.capacity ?? "",
    spots_remaining: cells.spots_remaining ?? "",
    status: cells.status ?? "",
    price: cells.price ?? cells.base_price_usd ?? "0",
    currency: cells.currency || "USD",
    notes: localizedWithFallback(cells, "notes"),
  };
}

function logSkippedRow(
  kind: "tour" | "itinerary" | "section" | "gallery" | "departure",
  row: unknown,
  error: z.ZodError,
) {
  console.warn(
    `[sheets] skipped malformed ${kind} row: ${error.issues
      .map((i) => `${i.path.join(".")}: ${i.message}`)
      .join("; ")}`,
    { row },
  );
}

function parseRows<T>(
  kind: "tour" | "itinerary" | "section" | "gallery" | "departure",
  headers: string[],
  rows: unknown[],
  shape: (cells: RawCells) => unknown,
  schema: z.ZodType<T>,
): T[] {
  const out: T[] = [];
  for (const row of rows) {
    const cells = rowToCells(headers, row);
    const parsed = schema.safeParse(shape(cells));
    if (parsed.success) {
      out.push(parsed.data);
    } else {
      logSkippedRow(kind, row, parsed.error);
    }
  }
  return out;
}

// ─── Public parsers ─────────────────────────────────────────────────────────

export function parseTours(headers: string[], rows: unknown[]): Tour[] {
  return parseRows("tour", headers, rows, shapeTourRow, TourSchema)
    .filter((tour) => tour.published)
    .sort((a, b) => a.sort_order - b.sort_order || a.title.es.localeCompare(b.title.es));
}

export function parseItinerary(headers: string[], rows: unknown[]): ItineraryDay[] {
  return parseRows("itinerary", headers, rows, shapeItineraryRow, ItineraryDaySchema).sort(
    (a, b) => a.day_number - b.day_number,
  );
}

export function parseTourSections(headers: string[], rows: unknown[]): TourSection[] {
  return parseRows("section", headers, rows, shapeTourSectionRow, TourSectionSchema).sort(
    (a, b) => a.sort_order - b.sort_order,
  );
}

export function parseGalleryImages(headers: string[], rows: unknown[]): GalleryImage[] {
  return parseRows("gallery", headers, rows, shapeGalleryRow, GalleryImageSchema).sort(
    (a, b) => a.sort_order - b.sort_order,
  );
}

export function parseDepartures(headers: string[], rows: unknown[]): Departure[] {
  return parseRows("departure", headers, rows, shapeDepartureRow, DepartureSchema);
}

export function emptyLocalized(): Record<Locale, string> {
  return { ...emptyLocalizedText };
}
