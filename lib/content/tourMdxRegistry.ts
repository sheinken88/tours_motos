import "server-only";
import type { ComponentType } from "react";
import { type Locale } from "@/lib/i18n/config";

/**
 * Registry of compiled MDX modules. Bundler-discoverable static imports —
 * one entry per (slug, locale) tour file in /content/tours.
 *
 * Adding a new tour:
 *   1. Create /content/tours/{slug}/{es,en,pt}.mdx
 *   2. Add three lines below pointing at the new files
 *   3. Add the matching tour row in Sheets (or lib/sheets/mock.ts)
 *
 * Lookup is async — call getTourMdxComponent(slug, locale) and render
 * the returned component (or fall back to the missing-content stub).
 *
 * Returns null when no module exists for (slug, locale) — the tour page
 * renders a "content coming soon" stub flagged via the dictionary key
 * tour_detail.missing_content.
 */

type MdxModule = { default: ComponentType };

const REGISTRY: Record<string, Partial<Record<Locale, () => Promise<MdxModule>>>> = {
  "patagonia-raw": {
    es: () => import("@/content/tours/patagonia-raw/es.mdx") as Promise<MdxModule>,
    en: () => import("@/content/tours/patagonia-raw/en.mdx") as Promise<MdxModule>,
    pt: () => import("@/content/tours/patagonia-raw/pt.mdx") as Promise<MdxModule>,
  },
  "andes-cuyo-salta": {
    es: () => import("@/content/tours/andes-cuyo-salta/es.mdx") as Promise<MdxModule>,
    en: () => import("@/content/tours/andes-cuyo-salta/en.mdx") as Promise<MdxModule>,
    pt: () => import("@/content/tours/andes-cuyo-salta/pt.mdx") as Promise<MdxModule>,
  },
  "norte-jujuy-bolivia": {
    es: () => import("@/content/tours/norte-jujuy-bolivia/es.mdx") as Promise<MdxModule>,
    en: () => import("@/content/tours/norte-jujuy-bolivia/en.mdx") as Promise<MdxModule>,
    pt: () => import("@/content/tours/norte-jujuy-bolivia/pt.mdx") as Promise<MdxModule>,
  },
};

export async function getTourMdxComponent(
  slug: string,
  locale: Locale,
): Promise<ComponentType | null> {
  const loader = REGISTRY[slug]?.[locale];
  if (!loader) return null;
  try {
    const mod = await loader();
    return mod.default;
  } catch {
    return null;
  }
}
