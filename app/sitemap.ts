import type { MetadataRoute } from "next";
import { type Locale, locales } from "@/lib/i18n/config";
import { getSiteUrl } from "@/lib/seo/site";
import { getTours } from "@/lib/sheets/queries";

/**
 * Sitemap — all locales × (home, tours index, individual tours,
 * static pages). Journal posts will be added in Phase 8.
 *
 * hreflang alternates emitted per URL via the `alternates.languages` field
 * (Next 15+ MetadataRoute.Sitemap supports this).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = getSiteUrl();
  const now = new Date();

  // Static pages that exist for every locale.
  const staticPaths = ["", "/tours", "/about", "/journal", "/calendar", "/custom", "/contact"];

  const entries: MetadataRoute.Sitemap = [];

  for (const path of staticPaths) {
    entries.push({
      url: `${site}/${locales[0]}${path}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: path === "" ? 1.0 : path === "/tours" ? 0.9 : 0.6,
      alternates: {
        languages: Object.fromEntries(locales.map((loc) => [loc, `${site}/${loc}${path}`])),
      },
    });
  }

  // Per-tour pages — locale-specific slugs.
  const baseLocale: Locale = locales[0];
  const tours = await getTours(baseLocale);
  for (const tour of tours) {
    entries.push({
      url: `${site}/${baseLocale}/tours/${tour.slugs[baseLocale]}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: {
        languages: Object.fromEntries(
          locales.map((loc) => [loc, `${site}/${loc}/tours/${tour.slugs[loc]}`]),
        ),
      },
    });
  }

  return entries;
}
