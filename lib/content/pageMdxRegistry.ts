import "server-only";
import type { ComponentType } from "react";
import { type Locale } from "@/lib/i18n/config";

/**
 * Registry of compiled MDX modules for static "page" content (about,
 * journal posts, etc.). Mirrors the tour registry — bundler-discoverable
 * static imports keep the routes statically generable.
 *
 * Add a new page:
 *   1. Create /content/pages/{slug}/{es,en,pt}.mdx
 *   2. Add the slug to the registry below.
 *   3. Wire the page component to call getPageMdxComponent(slug, locale).
 */

type MdxModule = { default: ComponentType };

const PAGE_REGISTRY: Record<string, Partial<Record<Locale, () => Promise<MdxModule>>>> = {
  about: {
    es: () => import("@/content/pages/about/es.mdx") as Promise<MdxModule>,
    en: () => import("@/content/pages/about/en.mdx") as Promise<MdxModule>,
    pt: () => import("@/content/pages/about/pt.mdx") as Promise<MdxModule>,
  },
};

export async function getPageMdxComponent(
  slug: string,
  locale: Locale,
): Promise<ComponentType | null> {
  const loader = PAGE_REGISTRY[slug]?.[locale];
  if (!loader) return null;
  try {
    const mod = await loader();
    return mod.default;
  } catch {
    return null;
  }
}
