import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Container, DisplayHeading, Eyebrow, Stamp } from "@/components/primitives";
import { TourCmsContent, TourMdxContent } from "@/components/sections";
import { TourGrid } from "@/components/sections/TourGrid";
import { TourHero } from "@/components/sections/TourHero";
import { PaperZone, RedZone } from "@/components/surfaces";
import { getTourFrontmatter } from "@/lib/content/getTourMdx";
import { getTourMdxComponent } from "@/lib/content/tourMdxRegistry";
import { isLocale, type Locale, locales } from "@/lib/i18n/config";
import { Link as I18nLink } from "@/lib/i18n/navigation";
import { breadcrumbSchema, tourTripSchema } from "@/lib/seo/jsonld";
import { tourMetadata } from "@/lib/seo/metadata";
import { getTourPageBySlug, getTours } from "@/lib/sheets/queries";

export const revalidate = 600;

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

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

  const [allTours, fm, MdxBody, t, tCommon] = await Promise.all([
    getTours(locale),
    getTourFrontmatter(tour.slug, locale),
    getTourMdxComponent(tour.slug, locale),
    getTranslations({ locale, namespace: "tour_detail" }),
    getTranslations({ locale, namespace: "common" }),
  ]);

  const description =
    tour.seo_description[locale] || tour.summary[locale] || fm?.description || tour.title[locale];
  const related = allTours.filter((t) => t.slug !== tour.slug);
  const hasCmsBody =
    tourPage.itinerary.length > 0 || tourPage.sections.length > 0 || tourPage.gallery.length > 0;

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

      <TourHero tour={tour} locale={locale} />

      {hasCmsBody ? (
        <TourCmsContent content={tourPage} locale={locale} />
      ) : (
        <TourMdxContent tour={tour} locale={locale} MdxBody={MdxBody} />
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
            <p className="font-sans text-base">{t("no_departures")}</p>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {departures.map((d) => {
                const notes = d.notes[locale];
                const startLabel = dateFormatter.format(new Date(d.start_date));
                const endLabel = dateFormatter.format(new Date(d.end_date));
                const statusLabel =
                  d.status === "open"
                    ? t("status_open")
                    : d.status === "low"
                      ? t("status_low")
                      : t("status_sold_out");
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
                    {notes ? (
                      <p className="font-sans text-sm leading-relaxed opacity-80">{notes}</p>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )}
          <p className="text-on-red font-sans text-sm leading-relaxed opacity-80">
            {tCommon("hold_a_spot")}:{" "}
            <I18nLink href="/contact" className="underline-offset-4 hover:underline">
              /contact
            </I18nLink>
          </p>
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
