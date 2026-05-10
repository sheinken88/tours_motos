import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Container, DisplayHeading, Eyebrow, Stamp } from "@/components/primitives";
import { PaperZone, RedZone } from "@/components/surfaces";
import { isLocale, type Locale, locales } from "@/lib/i18n/config";
import { Link as I18nLink } from "@/lib/i18n/navigation";
import { localeAlternates } from "@/lib/seo/metadata";
import { SITE_NAME, getSiteUrl } from "@/lib/seo/site";
import { type Departure, type Tour } from "@/lib/sheets/schemas";
import { getTours, getUpcomingDepartures } from "@/lib/sheets/queries";

export const revalidate = 600;

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: "calendar" });
  const site = getSiteUrl();
  const url = `${site}/${locale}/calendar`;
  const title = `${t("title")} | ${SITE_NAME}`;
  const description = t("metadata_description");

  const pathByLocale = Object.fromEntries(locales.map((loc) => [loc, "/calendar"])) as Record<
    Locale,
    string
  >;

  return {
    title,
    description,
    alternates: { canonical: url, ...localeAlternates({ pathByLocale }) },
    openGraph: { type: "website", title, description, url, siteName: SITE_NAME },
  };
}

/**
 * Group an ordered Departure[] into month buckets keyed by `YYYY-MM`.
 * Input is already sorted ascending by start_date — preserves that order
 * within each bucket.
 */
function groupByMonth(departures: Departure[]): Map<string, Departure[]> {
  const groups = new Map<string, Departure[]>();
  for (const d of departures) {
    const key = d.start_date.slice(0, 7);
    const bucket = groups.get(key);
    if (bucket) {
      bucket.push(d);
    } else {
      groups.set(key, [d]);
    }
  }
  return groups;
}

export default async function CalendarPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const [t, tDetail, tours, departures] = await Promise.all([
    getTranslations({ locale, namespace: "calendar" }),
    getTranslations({ locale, namespace: "tour_detail" }),
    getTours(locale),
    getUpcomingDepartures(),
  ]);

  const tourBySlug = new Map<string, Tour>(tours.map((tour) => [tour.slug, tour]));
  const numberLocale = locale === "en" ? "en-US" : locale === "pt" ? "pt-BR" : "es-AR";
  const monthFormatter = new Intl.DateTimeFormat(numberLocale, {
    year: "numeric",
    month: "long",
  });
  const dayFormatter = new Intl.DateTimeFormat(numberLocale, {
    day: "2-digit",
    month: "short",
  });

  const groups = Array.from(groupByMonth(departures).entries());

  function statusLabel(status: Departure["status"]): string {
    return status === "open"
      ? tDetail("status_open")
      : status === "low"
        ? tDetail("status_low")
        : tDetail("status_sold_out");
  }

  return (
    <>
      <RedZone density="heavy" tornBottom={2}>
        <Container className="space-y-6">
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <DisplayHeading size="2xl" as="h1">
            {t("headline")}
          </DisplayHeading>
          <p className="max-w-prose font-sans text-lg leading-relaxed">{t("intro")}</p>
        </Container>
      </RedZone>

      <PaperZone density="default">
        <Container className="space-y-12">
          {groups.length === 0 ? (
            <p className="font-sans text-base">{t("no_departures")}</p>
          ) : (
            groups.map(([monthKey, items]) => {
              const sample = new Date(`${monthKey}-01T00:00:00`);
              const monthLabel = monthFormatter.format(sample).toUpperCase();
              return (
                <section key={monthKey} className="space-y-5">
                  <DisplayHeading size="md" as="h2">
                    {monthLabel}
                  </DisplayHeading>
                  <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((d) => {
                      const tour = tourBySlug.get(d.tour_slug);
                      const tourTitle = tour?.title[locale] ?? d.tour_slug;
                      const tourSlug = tour?.slugs[locale] ?? d.tour_slug;
                      const start = dayFormatter.format(new Date(d.start_date));
                      const end = dayFormatter.format(new Date(d.end_date));
                      return (
                        <li
                          key={`${d.tour_slug}-${d.start_date}`}
                          className="border-ink/30 flex flex-col gap-3 border-2 p-5"
                        >
                          <Stamp tilt={-2} className="self-start">
                            {statusLabel(d.status)}
                          </Stamp>
                          <p className="font-display text-display-md uppercase">
                            {start}
                            <br />
                            <span className="opacity-70">
                              {t("until")} {end}
                            </span>
                          </p>
                          <I18nLink
                            href={`/tours/${tourSlug}`}
                            className="text-eyebrow tracking-eyebrow text-accent-on-paper font-semibold uppercase underline-offset-4 hover:underline"
                          >
                            {tourTitle} →
                          </I18nLink>
                          {d.notes ? (
                            <p className="font-sans text-sm leading-relaxed opacity-80">
                              {d.notes}
                            </p>
                          ) : null}
                        </li>
                      );
                    })}
                  </ul>
                </section>
              );
            })
          )}
        </Container>
      </PaperZone>
    </>
  );
}
