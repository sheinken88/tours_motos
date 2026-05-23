import "server-only";
import type { ComponentType } from "react";
import { type Locale } from "@/lib/i18n/config";

/**
 * Journal post MDX registry. Mirrors the tour registry — bundler-discoverable
 * static imports, one entry per (slug, locale).
 *
 * Phase 9 seeds three ES posts. EN/PT posts are added by the translator and
 * the registry expands accordingly. Empty locale entries return null and the
 * journal post page falls back to a missing-content stub (or 404 if the slug
 * doesn't exist at all).
 *
 * Adding a new post:
 *   1. Create /content/journal/{slug}/{es,en,pt}.mdx
 *   2. Add the slug to JOURNAL_REGISTRY below.
 *   3. The index page (uses listJournalSlugs) and sitemap pick it up
 *      automatically.
 */

type MdxModule = { default: ComponentType };

const JOURNAL_REGISTRY: Record<string, Partial<Record<Locale, () => Promise<MdxModule>>>> = {
  "armar-sobre-las-nubes": {
    es: () => import("@/content/journal/armar-sobre-las-nubes/es.mdx") as Promise<MdxModule>,
  },
  "armar-gigantes-del-oeste": {
    es: () => import("@/content/journal/armar-gigantes-del-oeste/es.mdx") as Promise<MdxModule>,
  },
  "armar-volcanes-del-norte": {
    es: () => import("@/content/journal/armar-volcanes-del-norte/es.mdx") as Promise<MdxModule>,
  },
  "armar-cruces-del-sur": {
    es: () => import("@/content/journal/armar-cruces-del-sur/es.mdx") as Promise<MdxModule>,
  },
};

/** Slugs in the registry — used by the index page and sitemap. */
export function listJournalSlugs(): string[] {
  return Object.keys(JOURNAL_REGISTRY);
}

/** Locales for which a given post has MDX content available. */
export function listLocalesForPost(slug: string): Locale[] {
  const entry = JOURNAL_REGISTRY[slug];
  if (!entry) return [];
  return (Object.keys(entry) as Locale[]).filter((loc) => entry[loc] !== undefined);
}

export async function getJournalMdxComponent(
  slug: string,
  locale: Locale,
): Promise<ComponentType | null> {
  const loader = JOURNAL_REGISTRY[slug]?.[locale];
  if (!loader) return null;
  try {
    const mod = await loader();
    return mod.default;
  } catch {
    return null;
  }
}
