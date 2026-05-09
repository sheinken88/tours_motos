import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { type Locale } from "@/lib/i18n/config";

export type TourFrontmatter = {
  /** SEO description. 140–160 chars. */
  description: string;
  /** Short tagline shown on the tour hero. */
  tagline: string;
};

const CONTENT_ROOT = path.join(process.cwd(), "content", "tours");

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
