import type { MetadataRoute } from "next";
import { listJournalEntries } from "@/lib/content/getJournalMdx";
import { listLocalesForPost } from "@/lib/content/journalMdxRegistry";
import { type Locale, locales } from "@/lib/i18n/config";
import { getSiteUrl } from "@/lib/seo/site";
import { getTours } from "@/lib/sheets/queries";

/**
 * Sitemap — all locales × (home, tours index, individual tours, static pages,
 * journal posts).
 *
 * hreflang alternates emitted per URL via the `alternates.languages` field.
 * Journal posts only emit alternates for locales where the MDX exists, so
 * we don't point search engines at empty translations.
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

  // Journal posts — slug shared across locales, only emit alternates for
  // locales where MDX content exists.
  const journalEntries = await listJournalEntries(baseLocale);
  for (const entry of journalEntries) {
    const availableLocales = listLocalesForPost(entry.slug);
    entries.push({
      url: `${site}/${baseLocale}/journal/${entry.slug}`,
      lastModified: new Date(entry.date),
      changeFrequency: "monthly",
      priority: 0.5,
      alternates: {
        languages: Object.fromEntries(
          availableLocales.map((loc) => [loc, `${site}/${loc}/journal/${entry.slug}`]),
        ),
      },
    });
  }

  return entries;
}
