import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { type Locale, locales } from "@/lib/i18n/config";
import { type TourSection } from "@/lib/sheets/schemas";

export type TourFrontmatter = {
  /** SEO description. 140–160 chars. */
  description: string;
  /** Short tagline shown on the tour hero. */
  tagline: string;
  /** Optional editorial override for the tour hero subtitle. */
  hero: string;
};

const CONTENT_ROOT = path.join(process.cwd(), "content", "tours");

const practicalHeadingMap: Record<string, TourSection["type"]> = {
  "que incluye": "included",
  incluye: "included",
  "what is included": "included",
  "what s included": "included",
  "whats included": "included",
  "o que inclui": "included",
  "o que esta incluido": "included",
  "que esta incluido": "included",
  "que no incluye": "not_included",
  "no incluye": "not_included",
  "what is not included": "not_included",
  "what s not included": "not_included",
  "whats not included": "not_included",
  "o que nao inclui": "not_included",
  "o que nao esta incluido": "not_included",
  "que no esta incluido": "not_included",
  "lo que conviene saber": "need_to_know",
  "buenas a saber": "need_to_know",
  "good to know": "need_to_know",
  "o que convem saber": "need_to_know",
};

function normalizeHeading(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanMarkdownInline(value: string): string {
  return value
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function linesToPracticalItems(lines: string[]): string[] {
  const items: string[] = [];
  let paragraph: string[] = [];

  const flushParagraph = () => {
    const text = cleanMarkdownInline(paragraph.join(" "));
    if (text) items.push(text);
    paragraph = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      flushParagraph();
      continue;
    }

    const bullet = trimmed.match(/^[-*]\s+(.+)$/);
    if (bullet) {
      flushParagraph();
      items.push(cleanMarkdownInline(bullet[1] ?? ""));
      continue;
    }

    paragraph.push(trimmed);
  }

  flushParagraph();
  return items.filter(Boolean);
}

function extractPracticalSectionsFromBody(
  body: string,
  slug: string,
  locale: Locale,
  sourceLocale: Locale,
): TourSection[] {
  const buckets: Record<TourSection["type"], string[]> = {
    included: [],
    not_included: [],
    need_to_know: [],
  };
  let activeType: TourSection["type"] | null = null;

  for (const line of body.split(/\r?\n/)) {
    const heading = line.match(/^##\s+(.+?)\s*$/);
    if (heading) {
      activeType = practicalHeadingMap[normalizeHeading(heading[1] ?? "")] ?? null;
      continue;
    }

    if (activeType) {
      buckets[activeType].push(line);
    }
  }

  return (Object.keys(buckets) as TourSection["type"][]).flatMap((type) =>
    linesToPracticalItems(buckets[type]).map((text, index) => {
      const localized = Object.fromEntries(locales.map((loc) => [loc, ""])) as Record<
        Locale,
        string
      >;
      localized[sourceLocale] = text;
      localized[locale] = sourceLocale === locale ? text : `${text}`;

      return {
        tour_slug: slug,
        type,
        sort_order: index + 1,
        text: localized,
      };
    }),
  );
}

async function readTourMdxBody(slug: string, locale: Locale) {
  const filePath = path.join(CONTENT_ROOT, slug, `${locale}.mdx`);
  const raw = await fs.readFile(filePath, "utf8");
  return matter(raw).content;
}

/**
 * Read just the frontmatter for a tour MDX file. Body rendering happens via
 * the dynamic MDX page convention in /app/[locale]/tours/[slug]/page.tsx
 * which imports the file directly at build time.
 *
 * Returns null if the file doesn't exist — callers can render Sheets-only.
 */
export async function getTourFrontmatter(
  slug: string,
  locale: Locale,
): Promise<TourFrontmatter | null> {
  const filePath = path.join(CONTENT_ROOT, slug, `${locale}.mdx`);
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = matter(raw);
    return {
      description: typeof parsed.data.description === "string" ? parsed.data.description : "",
      tagline: typeof parsed.data.tagline === "string" ? parsed.data.tagline : "",
      hero: typeof parsed.data.hero === "string" ? parsed.data.hero : "",
    };
  } catch {
    return null;
  }
}

/**
 * Returns whether a tour has an MDX body for the given locale.
 * Tour pages use this to decide whether to render the MDX component
 * via dynamic import or fall back to a "coming soon" stub.
 */
export async function hasTourMdx(slug: string, locale: Locale): Promise<boolean> {
  const filePath = path.join(CONTENT_ROOT, slug, `${locale}.mdx`);
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Temporary bridge while the client-editable Includes tab is still pending.
 * Structured CMS rows should remain authoritative; callers use these MDX
 * bullets only for missing practical-detail groups.
 */
export async function getTourPracticalSectionsFromMdx(
  slug: string,
  locale: Locale,
): Promise<TourSection[]> {
  const candidateLocales = [locale, "es"].filter(
    (candidate, index, all): candidate is Locale =>
      locales.includes(candidate as Locale) && all.indexOf(candidate) === index,
  );

  for (const sourceLocale of candidateLocales) {
    try {
      const body = await readTourMdxBody(slug, sourceLocale);
      const sections = extractPracticalSectionsFromBody(body, slug, locale, sourceLocale);
      if (sections.length > 0) return sections;
    } catch {
      // Missing MDX should not block the structured Sheets page.
    }
  }

  return [];
}

export function fillMissingTourSections(
  cmsSections: TourSection[],
  fallbackSections: TourSection[],
): TourSection[] {
  const cmsTypes = new Set(cmsSections.map((section) => section.type));
  return [
    ...cmsSections,
    ...fallbackSections.filter((section) => !cmsTypes.has(section.type)),
  ].sort((a, b) => a.sort_order - b.sort_order);
}
