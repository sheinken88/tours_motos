import { type Locale, localeCodes } from "@/lib/i18n/config";
import { type Departure, type Tour } from "@/lib/sheets/schemas";
import { SITE_NAME, getSiteUrl } from "./site";

/**
 * JSON-LD schema generators. Required on every tour page per CLAUDE.md §9.
 * Validate via Google's Rich Results Test before launch.
 */

type TourTripInput = {
  tour: Tour;
  departures: Departure[];
  locale: Locale;
  /** Long-form description from MDX frontmatter, used as schema description. */
  description: string;
};

/**
 * TouristTrip schema for an individual tour page.
 * Combines Sheets structured data + departures + MDX description.
 */
export function tourTripSchema({ tour, departures, locale, description }: TourTripInput) {
  const site = getSiteUrl();
  const slug = tour.slugs[locale];
  const url = `${site}/${locale}/tours/${slug}`;
  const image = tour.hero_image
    ? tour.hero_image.startsWith("http")
      ? tour.hero_image
      : `${site}${tour.hero_image}`
    : undefined;

  const offers = departures
    .filter((d) => d.tour_slug === tour.slug && d.status !== "sold_out")
    .map((d) => ({
      "@type": "Offer",
      url,
      priceCurrency: tour.currency,
      price: tour.base_price_usd,
      validFrom: d.start_date,
      availability:
        d.status === "open"
          ? "https://schema.org/InStock"
          : "https://schema.org/LimitedAvailability",
      eligibleQuantity: {
        "@type": "QuantitativeValue",
        value: d.spots_remaining,
      },
    }));

  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "@id": url,
    name: tour.title[locale],
    description,
    inLanguage: localeCodes[locale],
    url,
    ...(image ? { image } : null),
    provider: {
      "@type": "TravelAgency",
      name: SITE_NAME,
      url: site,
    },
    itinerary: {
      "@type": "ItemList",
      name: tour.region[locale],
      numberOfItems: tour.duration_days,
    },
    touristType: tour.difficulty,
    duration: `P${tour.duration_days}D`,
    offers,
  };
}

type BreadcrumbCrumb = {
  name: string;
  href: string;
};

/**
 * BreadcrumbList for any deep page (tour detail, journal post).
 * Pass crumbs in order from root → current.
 */
export function breadcrumbSchema(crumbs: BreadcrumbCrumb[]) {
  const site = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: c.href.startsWith("http") ? c.href : `${site}${c.href}`,
    })),
  };
}
