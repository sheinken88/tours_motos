import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { type Locale } from "@/lib/i18n/config";

export type PageFrontmatter = {
  /** SEO title — used by generateMetadata if set, otherwise dictionary fallback. */
  title?: string;
  /** SEO description — 140–160 chars. */
  description?: string;
};

const CONTENT_ROOT = path.join(process.cwd(), "content", "pages");

/**
 * Read frontmatter for a static page MDX (about, future legal pages, etc.).
 * Returns null when the file doesn't exist so callers can fall back to
 * dictionary copy without a hard error.
 */
export async function getPageFrontmatter(
  slug: string,
  locale: Locale,
): Promise<PageFrontmatter | null> {
  const filePath = path.join(CONTENT_ROOT, slug, `${locale}.mdx`);
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = matter(raw);
    return {
      title: typeof parsed.data.title === "string" ? parsed.data.title : undefined,
      description:
        typeof parsed.data.description === "string" ? parsed.data.description : undefined,
    };
  } catch {
    return null;
  }
}
