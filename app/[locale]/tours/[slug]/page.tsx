import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound, permanentRedirect } from "next/navigation";
import {
  Button,
  Container,
  DisplayHeading,
  ExchangeRateAttribution,
  Eyebrow,
  Stamp,
  TourPrice,
} from "@/components/primitives";
import { TourCmsContent, TourMdxContent } from "@/components/sections";
import { TourGrid } from "@/components/sections/TourGrid";
import { TourHero } from "@/components/sections/TourHero";
import { PaperZone, RedZone } from "@/components/surfaces";
import { buildTourWhatsAppLink } from "@/lib/contact/whatsappLink";
import {
  fillMissingTourSections,
  getTourFrontmatter,
  getTourPracticalSectionsFromMdx,
} from "@/lib/content/getTourMdx";
import { getTourMdxComponent } from "@/lib/content/tourMdxRegistry";
import { parseCalendarDate } from "@/lib/date";
import { localizePrices } from "@/lib/currency/exchange";
import { isLocale, type Locale, locales } from "@/lib/i18n/config";
import { breadcrumbSchema, tourTripSchema } from "@/lib/seo/jsonld";
import { tourMetadata } from "@/lib/seo/metadata";
import { getTourPageBySlug, getTours } from "@/lib/sheets/queries";

export const revalidate = 600;

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

function CalendarIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden focusable="false">
      <path
        d="M5 4.5h14v16H5v-16Zm0 5h14M8 2.5v4M16 2.5v4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
      />
      <path d="M8 12h3v3H8v-3Zm5 0h3v3h-3v-3Z" fill="currentColor" />
    </svg>
  );
}

/**
 * Pre-render every (locale, slug) combination at build time. Sheets data
 * is fetched once per build via the cached query layer; new tours added
 * to Sheets show up after the next ISR revalidation (10 min) or via the
 * /api/revalidate webhook bookmark.
 */
export async function generateStaticParams() {
  const params: Array<{ locale: Locale; slug: string }> = [];
  for (const locale of locales) {
    const tours = await getTours(locale);
    for (const tour of tours) {
      params.push({ locale, slug: tour.slugs[locale] });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};

  const tourPage = await getTourPageBySlug(locale, slug);
  if (!tourPage) return {};

  const { tour } = tourPage;
  const fm = await getTourFrontmatter(tour.slug, locale);
  const description =
    tour.seo_description[locale] || tour.summary[locale] || fm?.description || tour.title[locale];
  return tourMetadata({ tour, locale, description });
}

export default async function TourDetail({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const tourPage = await getTourPageBySlug(locale, slug);
  if (!tourPage) notFound();

  const { tour, departures } = tourPage;
  if (slug !== tour.slugs[locale]) {
    permanentRedirect(`/${locale}/tours/${tour.slugs[locale]}`);
  }

  const [allTours, fm, MdxBody, mdxPracticalSections, t, tCommon, tWhatsApp] = await Promise.all([
    getTours(locale),
    getTourFrontmatter(tour.slug, locale),
    getTourMdxComponent(tour.slug, locale),
    getTourPracticalSectionsFromMdx(tour.slug, locale),
    getTranslations({ locale, namespace: "tour_detail" }),
    getTranslations({ locale, namespace: "common" }),
    getTranslations({ locale, namespace: "whatsapp" }),
  ]);

  const description =
    tour.seo_description[locale] || tour.summary[locale] || fm?.description || tour.title[locale];
  const related = allTours.filter((t) => t.slug !== tour.slug);
  const hasStructuredBody = tourPage.itinerary.length > 0 || tourPage.sections.length > 0;
  const contentWithPracticalFallback = {
    ...tourPage,
    sections: fillMissingTourSections(tourPage.sections, mdxPracticalSections),
  };

  // JSON-LD schemas — embedded as <script> tags below
  const tripSchema = tourTripSchema({ tour, departures, locale, description });
  const breadcrumb = breadcrumbSchema([
    { name: "Home", href: `/${locale}` },
    { name: t("departures_heading"), href: `/${locale}/tours` },
    { name: tour.title[locale], href: `/${locale}/tours/${slug}` },
  ]);

  const numberLocale = locale === "en" ? "en-US" : locale === "pt" ? "pt-BR" : "es-AR";
  const dateFormatter = new Intl.DateTimeFormat(numberLocale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const tourWhatsAppHref = buildTourWhatsAppLink({
    template: tWhatsApp.raw("tour_message") as string,
    tourTitle: tour.title[locale],
  });
  const departurePrices = await localizePrices(
    departures.map(({ price, currency }) => ({ amount: price, currency })),
    locale,
  );
  const hasConvertedPrice = departurePrices.some((price) => price.converted);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tripSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <TourHero tour={tour} locale={locale} heroSummary={fm?.hero} />

      {hasStructuredBody ? (
        <TourCmsContent content={contentWithPracticalFallback} locale={locale} />
      ) : (
        <TourMdxContent tour={tour} locale={locale} gallery={tourPage.gallery} MdxBody={MdxBody} />
      )}

      {/* Departures + price strip */}
      <RedZone density="default" tornBottom={2}>
        <Container className="space-y-8">
          <div>
            <Eyebrow>{t("departures_eyebrow")}</Eyebrow>
            <DisplayHeading size="xl" as="h2" className="mt-3">
              {t("departures_heading")}
            </DisplayHeading>
          </div>
          {departures.length === 0 ? (
            <article className="border-paper/30 bg-brand-red-deep/20 grid gap-5 border-2 p-5 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center">
              <CalendarIcon className="text-paper h-10 w-10" />
              <p className="font-sans text-base leading-relaxed">{t("no_departures")}</p>
              <Button
                href={tourWhatsAppHref}
                external
                variant="sticker-filled"
                edge={2}
                tilt="right"
                className="justify-self-start sm:justify-self-end"
              >
                {t("no_departures_cta")}
              </Button>
            </article>
          ) : (
            <>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {departures.map((d, index) => {
                  const notes = d.notes[locale];
                  const startLabel = dateFormatter.format(parseCalendarDate(d.start_date));
                  const endLabel = dateFormatter.format(parseCalendarDate(d.end_date));
                  const statusLabel =
                    d.status === "open"
                      ? t("status_open")
                      : d.status === "low"
                        ? t("status_low")
                        : t("status_sold_out");
                  const displayPrice = departurePrices[index];
                  return (
                    <li
                      key={d.start_date}
                      className="border-paper/30 flex flex-col gap-3 border-2 p-5"
                    >
                      <Stamp tilt={-2} className="self-start">
                        {statusLabel}
                      </Stamp>
                      <p className="font-display text-paper text-lg leading-tight uppercase">
                        {startLabel}
                        <br />
                        <span className="opacity-70">→ {endLabel}</span>
                      </p>
                      {displayPrice && displayPrice.amount > 0 ? (
                        <TourPrice price={displayPrice} locale={locale} kind="exact" tone="red" />
                      ) : null}
                      {notes ? (
                        <p className="font-sans text-sm leading-relaxed opacity-80">{notes}</p>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
              {hasConvertedPrice ? <ExchangeRateAttribution locale={locale} /> : null}
              <div className="flex flex-wrap gap-4">
                <Button
                  href={tourWhatsAppHref}
                  external
                  variant="sticker-filled"
                  edge={1}
                  tilt="left"
                >
                  {tCommon("hold_a_spot")}
                </Button>
                <Button href={`/${locale}/contact?tour=${tour.slug}`} edge={3} tilt="right">
                  {tCommon("talk_to_us")}
                </Button>
              </div>
            </>
          )}
        </Container>
      </RedZone>

      {/* Related tours */}
      {related.length > 0 ? (
        <PaperZone density="default">
          <TourGrid
            tours={related}
            locale={locale}
            eyebrow={t("related_eyebrow")}
            heading={t("related_heading")}
          />
        </PaperZone>
      ) : null}
    </>
  );
}
