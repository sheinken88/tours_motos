import { getTranslations } from "next-intl/server";
import { Container, DisplayHeading, Eyebrow, Stamp } from "@/components/primitives";
import { type Locale } from "@/lib/i18n/config";
import { Link as I18nLink } from "@/lib/i18n/navigation";
import { type Departure, type Tour } from "@/lib/sheets/schemas";
import { getTours, getUpcomingDepartures } from "@/lib/sheets/queries";

type CalendarStripProps = {
  locale: Locale;
  /** Cap. Default 3 — keeps the home page strip compact. */
  limit?: number;
};

/**
 * CalendarStrip — small "próximas fechas" preview for the home page. Reads
 * up to N upcoming departures via the cached Sheets layer and renders them
 * as bordered cells with status stamps and per-tour links.
 *
 * Empty state is intentional: when no real departures exist (Phase 9 ships
 * with empty mock departures), the component renders the dictionary's
 * `home_calendar.empty` line and a CTA to the full /calendar page. Avoids
 * shipping fake dates.
 *
 * Caller wraps in a zone for breathing space + texture.
 */
export async function CalendarStrip({ locale, limit = 3 }: CalendarStripProps) {
  const [t, tDetail, tours, departures] = await Promise.all([
    getTranslations({ locale, namespace: "home_calendar" }),
    getTranslations({ locale, namespace: "tour_detail" }),
    getTours(locale),
    getUpcomingDepartures(),
  ]);

  const tourBySlug = new Map<string, Tour>(tours.map((tour) => [tour.slug, tour]));
  const visible = departures.slice(0, limit);

  const numberLocale = locale === "en" ? "en-US" : locale === "pt" ? "pt-BR" : "es-AR";
  const dayFormatter = new Intl.DateTimeFormat(numberLocale, {
    day: "2-digit",
    month: "short",
  });

  function statusLabel(status: Departure["status"]): string {
    return status === "open"
      ? tDetail("status_open")
      : status === "low"
        ? tDetail("status_low")
        : tDetail("status_sold_out");
  }

  return (
    <Container className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="space-y-3">
          <Eyebrow rule>{t("eyebrow")}</Eyebrow>
          <DisplayHeading size="xl" as="h2">
            {t("heading")}
          </DisplayHeading>
        </div>
        <I18nLink
          href="/calendar"
          className="text-eyebrow tracking-eyebrow font-semibold uppercase underline-offset-4 hover:underline"
        >
          {t("see_all")} →
        </I18nLink>
      </div>

      {visible.length === 0 ? (
        <p className="font-sans text-base leading-relaxed">{t("empty")}</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((d) => {
            const tour = tourBySlug.get(d.tour_slug);
            const tourTitle = tour?.title[locale] ?? d.tour_slug;
            const tourSlug = tour?.slugs[locale] ?? d.tour_slug;
            const start = dayFormatter.format(new Date(d.start_date));
            const end = dayFormatter.format(new Date(d.end_date));
            return (
              <li
                key={`${d.tour_slug}-${d.start_date}`}
                className="flex flex-col gap-3 border-2 border-current p-5"
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
                  className="text-eyebrow tracking-eyebrow font-semibold uppercase underline-offset-4 hover:underline"
                >
                  {tourTitle} →
                </I18nLink>
              </li>
            );
          })}
        </ul>
      )}
    </Container>
  );
}
