import type { Metadata } from "next";
import { type Locale, localeCodes, locales } from "@/lib/i18n/config";
import { type Tour } from "@/lib/sheets/schemas";
import { SITE_NAME, getSiteUrl } from "./site";

/**
 * Build a hreflang alternate set for a locale-specific path.
 *
 * Example: localeAlternates({ locale: "es", path: "/tours/patagonia-raw" })
 * yields { es-AR: "/es/tours/patagonia-raw", en: "/en/tours/...", ... }
 *
 * The `path` segment must NOT include the locale prefix.
 *
 * For tour pages, callers should pass the per-locale slug — Sheets stores
 * one slug per locale to support /es/tours/patagonia-raw and
 * /en/tours/patagonia-raw with different slugs when copy diverges.
 */
type LocaleAlternatesInput = {
  /** Map of locale → URL path (NO locale prefix). */
  pathByLocale: Record<Locale, string>;
};

export function localeAlternates({ pathByLocale }: LocaleAlternatesInput): Metadata["alternates"] {
  const site = getSiteUrl();
  const languages: Record<string, string> = {};

  for (const loc of locales) {
    const path = pathByLocale[loc];
    languages[localeCodes[loc]] = `${site}/${loc}${path}`;
  }
  // x-default points at the Spanish version per default-locale strategy.
  languages["x-default"] = `${site}/es${pathByLocale.es}`;

  return { languages };
}

/**
 * Metadata helper for individual tour pages. Consolidates title /
 * description / canonical / OG / Twitter / hreflang into one Metadata
 * object that the per-tour generateMetadata returns.
 */
type TourMetadataInput = {
  tour: Tour;
  locale: Locale;
  description: string;
};

export function tourMetadata({ tour, locale, description }: TourMetadataInput): Metadata {
  const site = getSiteUrl();
  const title = `${tour.title[locale]} | ${SITE_NAME}`;
  const slug = tour.slugs[locale];
  const url = `${site}/${locale}/tours/${slug}`;
  const ogImageUrl = `${site}/api/og/${tour.slug}?locale=${locale}`;

  const pathByLocale = Object.fromEntries(
    locales.map((loc) => [loc, `/tours/${tour.slugs[loc]}`]),
  ) as Record<Locale, string>;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      ...localeAlternates({ pathByLocale }),
    },
    openGraph: {
      type: "website",
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: localeCodes[locale],
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: tour.title[locale] }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}
