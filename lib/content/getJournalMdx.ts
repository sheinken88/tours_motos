import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { type Locale } from "@/lib/i18n/config";
import { listJournalSlugs, listLocalesForPost } from "./journalMdxRegistry";

export type JournalFrontmatter = {
  title: string;
  date: string;
  excerpt: string;
  tags?: string[];
  /** Optional hero image path under /public/images/journal/. */
  image?: string;
  /** Alt text for the hero image. */
  imageAlt?: string;
};

export type JournalEntry = JournalFrontmatter & {
  slug: string;
  locale: Locale;
};

const CONTENT_ROOT = path.join(process.cwd(), "content", "journal");

export async function getJournalFrontmatter(
  slug: string,
  locale: Locale,
): Promise<JournalFrontmatter | null> {
  const filePath = path.join(CONTENT_ROOT, slug, `${locale}.mdx`);
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = matter(raw);
    const title = typeof parsed.data.title === "string" ? parsed.data.title : "";
    const date = typeof parsed.data.date === "string" ? parsed.data.date : String(parsed.data.date);
    const excerpt = typeof parsed.data.excerpt === "string" ? parsed.data.excerpt : "";
    const tags = Array.isArray(parsed.data.tags)
      ? (parsed.data.tags.filter((t) => typeof t === "string") as string[])
      : undefined;
    const image = typeof parsed.data.image === "string" ? parsed.data.image : undefined;
    const imageAlt = typeof parsed.data.imageAlt === "string" ? parsed.data.imageAlt : undefined;
    if (!title || !date) return null;
    return { title, date, excerpt, tags, image, imageAlt };
  } catch {
    return null;
  }
}

/**
 * Load all journal entries available for a locale, sorted descending by date.
 * Skip posts that have no MDX for the requested locale (the EN/PT versions
 * may not exist yet during translation phases).
 */
export async function listJournalEntries(locale: Locale): Promise<JournalEntry[]> {
  const slugs = listJournalSlugs();
  const entries: JournalEntry[] = [];
  for (const slug of slugs) {
    const localesAvailable = listLocalesForPost(slug);
    if (!localesAvailable.includes(locale)) continue;
    const fm = await getJournalFrontmatter(slug, locale);
    if (!fm) continue;
    entries.push({ ...fm, slug, locale });
  }
  entries.sort((a, b) => b.date.localeCompare(a.date));
  return entries;
}
