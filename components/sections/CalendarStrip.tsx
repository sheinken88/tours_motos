import { getTranslations } from "next-intl/server";
import { Button, Container, DisplayHeading, Eyebrow, Stamp } from "@/components/primitives";
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
  const datePartsFormatter = new Intl.DateTimeFormat(numberLocale, {
    day: "2-digit",
    month: "short",
  });
  const monthFormatter = new Intl.DateTimeFormat(numberLocale, { month: "long" });

  function formatDepartureDate(date: string) {
    const parts = datePartsFormatter.formatToParts(new Date(`${date}T12:00:00`));
    const day = parts.find((part) => part.type === "day")?.value ?? "";
    const month = parts.find((part) => part.type === "month")?.value.replace(".", "") ?? "";
    return {
      day,
      month: month.toUpperCase(),
      monthLong: monthFormatter.format(new Date(`${date}T12:00:00`)),
    };
  }

  function statusLabel(status: Departure["status"]): string {
    return status === "open"
      ? tDetail("status_open")
      : status === "low"
        ? tDetail("status_low")
        : tDetail("status_sold_out");
  }

  return (
    <Container className="space-y-10">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
        <div className="max-w-4xl space-y-4">
          <Eyebrow rule>{t("eyebrow")}</Eyebrow>
          <DisplayHeading size="xl" as="h2">
            {t("heading")}
          </DisplayHeading>
          <p className="text-muted-on-red max-w-2xl font-sans text-lg leading-relaxed">
            {t("intro")}
          </p>
        </div>
        <div className="border-paper/70 bg-brand-red-deep/25 text-paper border-2 p-5">
          <Stamp tilt={2} className="mb-4">
            {t("confirmed_label")}
          </Stamp>
          <p className="font-display text-display-md leading-none uppercase">{departures.length}</p>
          <p className="text-eyebrow tracking-eyebrow text-paper/75 mt-1 font-semibold uppercase">
            {t("available_label")}
          </p>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="border-paper/70 border-2 p-6">
          <p className="text-paper font-sans text-base leading-relaxed">{t("empty")}</p>
        </div>
      ) : (
        <ul className="relative grid gap-5 md:grid-cols-3 lg:gap-6">
          <span
            aria-hidden
            className="border-paper/45 absolute top-[3.125rem] right-0 left-0 hidden border-t-2 border-dashed md:block"
          />
          {visible.map((d, index) => {
            const tour = tourBySlug.get(d.tour_slug);
            const notes = d.notes[locale];
            const tourTitle = tour?.title[locale] ?? d.tour_slug;
            const tourSlug = tour?.slugs[locale] ?? d.tour_slug;
            const start = formatDepartureDate(d.start_date);
            const end = formatDepartureDate(d.end_date);
            const terrain = [
              tour ? `${tour.duration_days} ${tDetail("days_unit")}` : null,
              tour ? `${tour.distance_km.toLocaleString(numberLocale)} km` : null,
              tour?.ripio_percent
                ? `${tour.ripio_percent}% ${tDetail("ripio_label").toLowerCase()}`
                : null,
            ].filter(Boolean);
            return (
              <li
                key={`${d.tour_slug}-${d.start_date}`}
                className="border-paper bg-paper text-ink ease-out-soft relative flex min-h-[24rem] flex-col border-2 p-5 pr-16 transition-transform duration-200 hover:-translate-y-1 sm:pr-5"
              >
                <span
                  aria-hidden
                  className="border-paper bg-brand-red absolute top-[2.55rem] left-5 z-10 h-5 w-5 border-2"
                />
                <div
                  className="bg-halftone pointer-events-none absolute inset-x-0 top-0 h-24 opacity-[0.12]"
                  aria-hidden
                />
                <div className="relative flex items-start justify-between gap-4">
                  <p className="text-eyebrow tracking-eyebrow text-brand-red font-semibold uppercase">
                    {t("departure_label")} {String(index + 1).padStart(2, "0")}
                  </p>
                  <Stamp
                    tilt={index % 2 === 0 ? -2 : 2}
                    className="border-brand-red text-brand-red"
                  >
                    {statusLabel(d.status)}
                  </Stamp>
                </div>
                <div className="border-ink/25 relative mt-8 grid grid-cols-[5.6rem_1fr] gap-4 border-y-2 py-5">
                  <div>
                    <p className="font-display text-brand-red text-[5rem] leading-[0.82]">
                      {start.day}
                    </p>
                    <p className="text-eyebrow tracking-eyebrow mt-2 font-semibold uppercase">
                      {start.month}
                    </p>
                  </div>
                  <div className="self-end pb-1">
                    <p className="text-eyebrow tracking-eyebrow text-ink/65 font-semibold uppercase">
                      {t("until")} {end.day} {end.month}
                    </p>
                    <h3 className="font-display text-brand-red mt-2 text-4xl leading-none uppercase">
                      {tourTitle}
                    </h3>
                  </div>
                </div>
                <div className="mt-5 space-y-4">
                  {tour ? (
                    <p className="text-eyebrow tracking-eyebrow text-ink/70 font-semibold uppercase">
                      {tour.region[locale]}
                    </p>
                  ) : null}
                  {terrain.length > 0 ? (
                    <p className="text-ink font-sans text-sm font-semibold tracking-[var(--tracking-uppercase)] uppercase">
                      {terrain.join(" · ")}
                    </p>
                  ) : null}
                  {notes ? (
                    <p className="text-ink/75 font-sans text-sm leading-relaxed">{notes}</p>
                  ) : (
                    <p className="text-ink/75 font-sans text-sm leading-relaxed">
                      {t("card_fallback", { month: start.monthLong })}
                    </p>
                  )}
                </div>
                <I18nLink
                  href={`/tours/${tourSlug}`}
                  className="text-eyebrow tracking-eyebrow text-brand-red mt-auto inline-flex min-h-11 items-center pt-5 font-semibold uppercase underline-offset-4 hover:underline"
                >
                  {t("card_cta")} →
                </I18nLink>
              </li>
            );
          })}
        </ul>
      )}

      <div className="border-paper/35 flex flex-wrap items-center justify-between gap-5 border-t-2 pt-8">
        <p className="text-muted-on-red max-w-2xl font-sans text-sm leading-relaxed">
          {t("footer_note")}
        </p>
        <Button href={`/${locale}/calendar`} variant="sticker-outline" tilt="right" edge={2}>
          {t("see_all")}
        </Button>
      </div>
    </Container>
  );
}
