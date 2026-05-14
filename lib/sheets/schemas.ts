import { z } from "zod";
import { type Locale, locales } from "@/lib/i18n/config";

/**
 * Zod schemas for the Google Sheets CMS layer.
 * Tours and Departures live in two tabs of the same spreadsheet
 * (CLAUDE.md §6). Sheet rows arrive as raw string arrays — these schemas
 * coerce, validate, and skip-with-log any malformed row so a typo in
 * Sheets never crashes a page.
 */

// ─── Helpers ────────────────────────────────────────────────────────────────

const trimmed = z
  .string()
  .transform((s) => s.trim())
  .pipe(z.string().min(1));

/** Sheets-style booleans: TRUE / FALSE / yes / no / 1 / 0. Empty = false. */
const sheetsBool = z
  .string()
  .transform((s) => s.trim().toLowerCase())
  .transform((s) => {
    if (s === "" || s === "false" || s === "no" || s === "0") return false;
    if (s === "true" || s === "yes" || s === "1") return true;
    return null;
  })
  .pipe(z.boolean());

const positiveInt = z
  .string()
  .transform((s) => Number(s))
  .pipe(z.number().int().positive());

/** Used for prices: 0 is valid ("price on request") so we can publish tours
 *  before the client has signed off on the final number. */
const nonNegativeNumber = z
  .string()
  .transform((s) => Number(s))
  .pipe(z.number().nonnegative());

const isoDate = z
  .string()
  .transform((s) => s.trim())
  .pipe(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "expected YYYY-MM-DD"));

const localizedSlug = z.object(
  Object.fromEntries(locales.map((loc) => [loc, trimmed])) as Record<Locale, typeof trimmed>,
);

const localizedTitle = localizedSlug;

// ─── Tour ───────────────────────────────────────────────────────────────────

export const TourSchema = z.object({
  /** Canonical slug (matches the ES URL by convention; en/pt slugs may differ). */
  slug: trimmed,
  title: localizedTitle,
  /** Per-locale URL slugs — e.g. /es/tours/patagonia-aventura. */
  slugs: localizedSlug,
  region: trimmed,
  difficulty: z.enum(["easy", "moderate", "hard", "expert"]),
  duration_days: positiveInt,
  distance_km: positiveInt,
  base_price_usd: nonNegativeNumber,
  currency: z.enum(["USD", "ARS", "EUR"]).default("USD"),
  /** Halftone PNG path under `/public`, e.g.
   *  `/images/tours/sobre_las_nubes/sobre_las_nubes_1_halftone.png`.
   *  May be empty: a tour can publish before its halftone asset is delivered —
   *  the card renders a paper-aged placeholder until the image lands. */
  hero_image: z
    .string()
    .transform((s) => s.trim())
    .pipe(z.string()),
  /** Optional sibling color JPG used for the hover-reveal crossfade on the
   *  tour card. Paired with `hero_image` — same crop, same scene. Empty when
   *  the color counterpart hasn't been delivered (the card stays halftone-only). */
  hero_image_color: z
    .string()
    .transform((s) => s.trim())
    .pipe(z.string()),
  published: sheetsBool,
});

export type Tour = z.infer<typeof TourSchema>;

// ─── Departure ──────────────────────────────────────────────────────────────

export const DepartureSchema = z.object({
  tour_slug: trimmed,
  start_date: isoDate,
  end_date: isoDate,
  capacity: positiveInt,
  spots_remaining: z
    .string()
    .transform((s) => Number(s))
    .pipe(z.number().int().nonnegative()),
  status: z.enum(["open", "low", "sold_out"]),
  notes: z.string().default(""),
});

export type Departure = z.infer<typeof DepartureSchema>;

// ─── Row parsers — skip-with-log on validation failure (CLAUDE.md §6) ───────

/**
 * Sheets returns rows as `string[]`, where index n maps to header n. We zip
 * each row with its header row to produce a `Record<string, string>`, then
 * fold the flat per-locale columns (`title_es`, `slug_en`, …) into the
 * nested objects the schemas expect.
 */
type RawCells = Record<string, string>;

function rowToCells(headers: string[], row: unknown): RawCells {
  const cells: RawCells = {};
  if (!Array.isArray(row)) return cells;
  for (let i = 0; i < headers.length; i++) {
    const key = headers[i]?.trim();
    if (!key) continue;
    cells[key] = typeof row[i] === "string" ? row[i] : "";
  }
  return cells;
}

function shapeTourRow(cells: RawCells): unknown {
  return {
    slug: cells.slug ?? "",
    title: {
      es: cells.title_es ?? "",
      en: cells.title_en ?? "",
      pt: cells.title_pt ?? "",
    },
    slugs: {
      es: cells.slug_es ?? cells.slug ?? "",
      en: cells.slug_en ?? cells.slug ?? "",
      pt: cells.slug_pt ?? cells.slug ?? "",
    },
    region: cells.region ?? "",
    difficulty: cells.difficulty ?? "",
    duration_days: cells.duration_days ?? "",
    distance_km: cells.distance_km ?? "",
    base_price_usd: cells.base_price_usd ?? "",
    currency: cells.currency ?? "USD",
    hero_image: cells.hero_image ?? "",
    hero_image_color: cells.hero_image_color ?? "",
    published: cells.published ?? "FALSE",
  };
}

function shapeDepartureRow(cells: RawCells): unknown {
  return {
    tour_slug: cells.tour_slug ?? "",
    start_date: cells.start_date ?? "",
    end_date: cells.end_date ?? "",
    capacity: cells.capacity ?? "",
    spots_remaining: cells.spots_remaining ?? "",
    status: cells.status ?? "",
    notes: cells.notes ?? "",
  };
}

function logSkippedRow(kind: "tour" | "departure", row: unknown, error: z.ZodError) {
  console.warn(
    `[sheets] skipped malformed ${kind} row: ${error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")}`,
    { row },
  );
}

export function parseTours(headers: string[], rows: unknown[]): Tour[] {
  const out: Tour[] = [];
  for (const row of rows) {
    const cells = rowToCells(headers, row);
    const shaped = shapeTourRow(cells);
    const parsed = TourSchema.safeParse(shaped);
    if (parsed.success) {
      if (parsed.data.published) out.push(parsed.data);
    } else {
      logSkippedRow("tour", row, parsed.error);
    }
  }
  return out;
}

export function parseDepartures(headers: string[], rows: unknown[]): Departure[] {
  const out: Departure[] = [];
  for (const row of rows) {
    const cells = rowToCells(headers, row);
    const shaped = shapeDepartureRow(cells);
    const parsed = DepartureSchema.safeParse(shaped);
    if (parsed.success) {
      out.push(parsed.data);
    } else {
      logSkippedRow("departure", row, parsed.error);
    }
  }
  return out;
}
