import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Button, Container, DisplayHeading, Eyebrow, Stamp } from "@/components/primitives";
import { PaperZone, RedZone, RoutePrint } from "@/components/surfaces";
import { PlaceholderMountains } from "@/components/surfaces/PlaceholderHalftones";
import { parseCalendarDate } from "@/lib/date";
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
 * Input is already sorted ascending by start_date, preserving that order
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

function CalendarStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-ink/35 min-h-32 border-b-2 p-5 last:border-b-0 sm:border-r-2 sm:border-b-0 sm:last:border-r-0 md:p-6">
      <p className="text-accent-on-paper font-display text-5xl leading-none uppercase md:text-6xl">
        {value}
      </p>
      <p className="mt-3 font-sans text-xs leading-tight font-semibold tracking-[var(--tracking-uppercase)] uppercase opacity-75">
        {label}
      </p>
    </div>
  );
}

export default async function CalendarPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const currentLocale: Locale = locale;
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
  const openDepartures = departures.filter((d) => d.status !== "sold_out");
  const availableSpots = openDepartures.reduce((total, d) => total + d.spots_remaining, 0);
  const nextDeparture = departures[0];

  function statusLabel(status: Departure["status"]): string {
    return status === "open"
      ? tDetail("status_open")
      : status === "low"
        ? tDetail("status_low")
        : tDetail("status_sold_out");
  }

  function shortDate(date: string): string {
    return dayFormatter.format(parseCalendarDate(date)).replace(".", "").toUpperCase();
  }

  function monthLabel(monthKey: string): string {
    return monthFormatter.format(parseCalendarDate(`${monthKey}-01`)).toUpperCase();
  }

  function tourMeta(tour?: Tour): string | null {
    if (!tour) return null;
    return [
      tour.region[currentLocale],
      `${tour.duration_days} ${tDetail("days_unit")}`,
      `${tour.distance_km.toLocaleString(numberLocale)} km`,
      tour.ripio_percent ? `${tour.ripio_percent}% ${tDetail("ripio_label").toLowerCase()}` : null,
    ]
      .filter(Boolean)
      .join(" · ");
  }

  return (
    <>
      <RedZone density="heavy" tornBottom={2} className="overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[44%] opacity-75">
          <PlaceholderMountains className="absolute inset-0 h-full w-full" tint="ink" />
        </div>

        <Container className="relative z-10 grid min-h-[68vh] gap-12 lg:grid-cols-[minmax(0,0.86fr)_minmax(31rem,1fr)] lg:items-center xl:min-h-[72vh]">
          <div className="max-w-[55rem] space-y-7">
            <div className="flex flex-wrap items-center gap-4">
              <Eyebrow>{t("eyebrow")}</Eyebrow>
              <Stamp tilt={2}>{t("hero_stamp")}</Stamp>
            </div>
            <DisplayHeading size="2xl" as="h1">
              {t("headline")}
            </DisplayHeading>
            <p className="text-on-red max-w-3xl font-sans text-xl leading-relaxed md:text-2xl">
              {t("intro")}
            </p>
          </div>

          <div className="relative -mx-5 pt-6 sm:-mx-8 md:mx-0 lg:-mr-10 lg:pt-0 xl:-mr-16">
            <RoutePrint
              alt={t("hero_image_alt")}
              colorSrc="/images/Imagen%20Fondo%20Calendario.jpeg"
              priority
              sizes="(min-width: 1280px) 54vw, (min-width: 1024px) 50vw, 100vw"
              width={1600}
              height={737}
              className="h-80 rotate-1 sm:h-[28rem] lg:h-[38rem] xl:h-[42rem]"
              imageClassName="object-center"
            />
            <div className="bg-paper-grain text-on-paper shadow-sticker-ink border-ink absolute -bottom-7 left-5 z-20 w-64 -rotate-2 border-2 p-5 sm:left-10 md:w-72 lg:-bottom-8 lg:left-0">
              <p className="text-eyebrow tracking-eyebrow font-semibold uppercase opacity-75">
                {t("next_label")}
              </p>
              <p className="text-accent-on-paper font-display mt-3 text-5xl leading-none uppercase">
                {nextDeparture ? shortDate(nextDeparture.start_date) : "--"}
              </p>
              <p className="mt-3 font-sans text-sm leading-relaxed opacity-80">
                {nextDeparture
                  ? (tourBySlug.get(nextDeparture.tour_slug)?.title[currentLocale] ??
                    nextDeparture.tour_slug)
                  : t("no_departures")}
              </p>
            </div>
          </div>
        </Container>
      </RedZone>

      <PaperZone density="default" tornBottom={3}>
        <Container className="space-y-10">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1fr] lg:items-end">
            <div className="space-y-4">
              <Eyebrow rule>{t("season_eyebrow")}</Eyebrow>
              <DisplayHeading size="xl" as="h2">
                {t("season_heading")}
              </DisplayHeading>
            </div>
            <div className="border-ink/35 space-y-3 border-l-2 pl-5">
              <p className="text-accent-on-paper font-display text-4xl leading-none uppercase md:text-5xl">
                {t("season_callout")}
              </p>
              <p className="text-muted-on-paper font-sans text-xl leading-relaxed md:text-2xl">
                {t("season_body")}
              </p>
            </div>
          </div>

          <div className="border-ink/35 bg-paper-grain grid border-2 sm:grid-cols-2 lg:grid-cols-4">
            <CalendarStat value={String(departures.length)} label={t("confirmed_label")} />
            <CalendarStat value={String(openDepartures.length)} label={t("open_label")} />
            <CalendarStat value={String(availableSpots)} label={t("spots_label")} />
            <CalendarStat
              value={nextDeparture ? shortDate(nextDeparture.start_date) : "--"}
              label={t("next_label")}
            />
          </div>
        </Container>
      </PaperZone>

      <RedZone density="heavy" tornBottom={4} className="overflow-hidden">
        <Container className="space-y-12">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
            <div className="max-w-4xl space-y-4">
              <Eyebrow rule>{t("board_eyebrow")}</Eyebrow>
              <DisplayHeading size="xl" as="h2">
                {t("board_heading")}
              </DisplayHeading>
              <div className="text-muted-on-red max-w-2xl space-y-4 font-sans text-lg leading-relaxed">
                <p>{t("board_intro_detail")}</p>
                <p>{t("board_intro_prompt")}</p>
              </div>
            </div>
            <div className="border-paper/65 text-paper border-2 p-5 lg:rotate-1">
              <p className="text-eyebrow tracking-eyebrow font-semibold uppercase opacity-75">
                {t("legend_label")}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {(["open", "low", "sold_out"] as Departure["status"][]).map((status, index) => (
                  <Stamp key={status} tilt={index === 1 ? 2 : -2}>
                    {statusLabel(status)}
                  </Stamp>
                ))}
              </div>
            </div>
          </div>

          {groups.length === 0 ? (
            <div className="border-paper/70 border-2 p-8">
              <p className="max-w-2xl font-sans text-lg leading-relaxed">{t("no_departures")}</p>
            </div>
          ) : (
            groups.map(([monthKey, items]) => (
              <section key={monthKey} className="space-y-6">
                <div className="border-paper/40 flex flex-wrap items-end justify-between gap-4 border-b-2 pb-4">
                  <DisplayHeading size="lg" as="h3">
                    {monthLabel(monthKey)}
                  </DisplayHeading>
                  <p className="text-eyebrow tracking-eyebrow text-paper/80 font-semibold uppercase">
                    {items.length} {t("departures_unit")}
                  </p>
                </div>
                <ul className="grid gap-6">
                  {items.map((d, index) => {
                    const tour = tourBySlug.get(d.tour_slug);
                    const notes = d.notes[currentLocale];
                    const tourTitle = tour?.title[currentLocale] ?? d.tour_slug;
                    const tourSlug = tour?.slugs[currentLocale] ?? d.tour_slug;
                    const start = shortDate(d.start_date);
                    const end = shortDate(d.end_date);
                    const meta = tourMeta(tour);
                    return (
                      <li
                        key={`${d.tour_slug}-${d.start_date}`}
                        className="bg-paper-grain text-on-paper border-paper relative grid gap-6 overflow-hidden border-2 p-6 transition-transform duration-200 ease-out hover:-translate-y-1 md:grid-cols-[15rem_minmax(0,1fr)_15rem] md:items-stretch lg:odd:-rotate-1 lg:even:rotate-1"
                      >
                        <span
                          aria-hidden="true"
                          className="text-brand-red/10 font-display absolute right-4 bottom-2 text-[8rem] leading-none md:text-[10rem]"
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div
                          className="bg-halftone pointer-events-none absolute inset-y-0 left-0 w-full opacity-[0.12] md:w-80"
                          aria-hidden="true"
                        />
                        <div className="border-ink/25 relative border-b-2 pb-5 md:border-r-2 md:border-b-0 md:pr-6 md:pb-0">
                          <p className="text-eyebrow tracking-eyebrow text-brand-red font-semibold uppercase">
                            {t("departure_label")}
                          </p>
                          <p className="font-display text-brand-red text-6xl leading-none uppercase md:text-7xl">
                            {start}
                          </p>
                          <p className="text-eyebrow tracking-eyebrow mt-3 font-semibold uppercase opacity-70">
                            {t("until")} {end}
                          </p>
                        </div>
                        <div className="relative space-y-4 self-center">
                          <h3 className="font-display text-brand-red text-4xl leading-none uppercase">
                            {tourTitle}
                          </h3>
                          {meta ? (
                            <p className="font-sans text-sm font-semibold tracking-[var(--tracking-uppercase)] uppercase opacity-75">
                              {meta}
                            </p>
                          ) : null}
                          {notes ? (
                            <p className="font-sans text-sm leading-relaxed opacity-80">{notes}</p>
                          ) : null}
                        </div>
                        <div className="relative flex flex-col items-start gap-4 md:items-end md:justify-between md:text-right">
                          <Stamp tilt={index % 2 === 0 ? -2 : 2} className="text-brand-red">
                            {statusLabel(d.status)}
                          </Stamp>
                          <p className="font-sans text-sm font-semibold tracking-[var(--tracking-uppercase)] uppercase opacity-80">
                            {d.spots_remaining}/{d.capacity} {t("spots_remaining_label")}
                          </p>
                          <I18nLink
                            href={`/tours/${tourSlug}`}
                            className="text-eyebrow tracking-eyebrow text-accent-on-paper inline-flex min-h-11 items-center font-semibold uppercase underline-offset-4 hover:underline"
                          >
                            {tourTitle} →
                          </I18nLink>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))
          )}
        </Container>
      </RedZone>

      <PaperZone density="default">
        <Container className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="max-w-3xl space-y-4">
            <Eyebrow rule>{t("cta_eyebrow")}</Eyebrow>
            <DisplayHeading size="xl" as="h2">
              {t("cta_heading")}
            </DisplayHeading>
            <div className="text-muted-on-paper space-y-3 font-sans text-lg leading-relaxed">
              <p>{t("cta_body_lead")}</p>
              <p>{t("cta_body_follow")}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button href={`/${locale}/contact`} variant="sticker-filled" tilt="left" edge={1}>
              {t("cta_primary")}
            </Button>
            <Button href={`/${locale}/tours`} tilt="right" edge={3}>
              {t("cta_secondary")}
            </Button>
          </div>
        </Container>
      </PaperZone>
    </>
  );
}
