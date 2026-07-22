import { type Locale, localeCodes } from "@/lib/i18n/config";
import { type LocalizedPrice } from "@/lib/currency/types";
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
  /** Localized catalog price, retaining the source amount/currency for JSON-LD. */
  catalogPrice?: LocalizedPrice;
};

/**
 * TouristTrip schema for an individual tour page.
 * Combines Sheets structured data + departures + MDX description.
 */
export function tourTripSchema({ tour, departures, locale, description, catalogPrice }: TourTripInput) {
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
    .map((d) => {
      const hasDeparturePrice = d.price > 0;
      const price = hasDeparturePrice ? d.price : (catalogPrice?.sourceAmount ?? 0);
      const priceCurrency = hasDeparturePrice
        ? d.currency
        : (catalogPrice?.sourceCurrency ?? tour.currency);
      return {
        "@type": "Offer",
        url,
        priceCurrency,
        price,
        validFrom: d.start_date,
        availability:
          d.status === "open"
            ? "https://schema.org/InStock"
            : "https://schema.org/LimitedAvailability",
        eligibleQuantity: {
          "@type": "QuantitativeValue",
          value: d.spots_remaining,
        },
      };
    })
    .filter((offer) => offer.price > 0);

  const baseOffer =
    departures.length === 0 && catalogPrice
      ? [
          {
            "@type": "Offer",
            url,
            priceCurrency: catalogPrice.sourceCurrency,
            price: catalogPrice.sourceAmount,
            availability: "https://schema.org/PreOrder",
          },
        ]
      : [];

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
    offers: offers.length ? offers : baseOffer,
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
