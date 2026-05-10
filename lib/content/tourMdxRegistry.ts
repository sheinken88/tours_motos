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
 *
 * The four launch tours per /docs/tours-source.md (client-provided
 * 2026-05-10). EN/PT bodies are placeholders flagged [NEEDS_TRANSLATION]
 * until the translator passes (CLAUDE.md §8 forbids machine translation).
 */

type MdxModule = { default: ComponentType };

const REGISTRY: Record<string, Partial<Record<Locale, () => Promise<MdxModule>>>> = {
  "sobre-las-nubes": {
    es: () => import("@/content/tours/sobre-las-nubes/es.mdx") as Promise<MdxModule>,
    en: () => import("@/content/tours/sobre-las-nubes/en.mdx") as Promise<MdxModule>,
    pt: () => import("@/content/tours/sobre-las-nubes/pt.mdx") as Promise<MdxModule>,
  },
  "gigantes-del-oeste": {
    es: () => import("@/content/tours/gigantes-del-oeste/es.mdx") as Promise<MdxModule>,
    en: () => import("@/content/tours/gigantes-del-oeste/en.mdx") as Promise<MdxModule>,
    pt: () => import("@/content/tours/gigantes-del-oeste/pt.mdx") as Promise<MdxModule>,
  },
  "volcanes-del-norte": {
    es: () => import("@/content/tours/volcanes-del-norte/es.mdx") as Promise<MdxModule>,
    en: () => import("@/content/tours/volcanes-del-norte/en.mdx") as Promise<MdxModule>,
    pt: () => import("@/content/tours/volcanes-del-norte/pt.mdx") as Promise<MdxModule>,
  },
  "cruces-del-sur": {
    es: () => import("@/content/tours/cruces-del-sur/es.mdx") as Promise<MdxModule>,
    en: () => import("@/content/tours/cruces-del-sur/en.mdx") as Promise<MdxModule>,
    pt: () => import("@/content/tours/cruces-del-sur/pt.mdx") as Promise<MdxModule>,
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
