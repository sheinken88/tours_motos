import {
  Button,
  Container,
  ExchangeRateAttribution,
  Eyebrow,
  TourCard,
} from "@/components/primitives";
import { DisplayHeading } from "@/components/primitives/DisplayHeading";
import { type Locale } from "@/lib/i18n/config";
import { type TourPriceMap } from "@/lib/sheets/queries";
import { type Tour } from "@/lib/sheets/schemas";

type TourGridProps = {
  tours: Tour[];
  locale: Locale;
  /** Optional eyebrow label above the heading (e.g. "Rutas"). */
  eyebrow?: string;
  /** Optional heading above the grid. */
  heading?: string;
  /** Cap the number of cards rendered. Default: all. */
  limit?: number;
  /** Empty-state copy when tours is []. */
  emptyMessage?: string;
  /** Route index page gets a more editorial poster-wall treatment. */
  variant?: "standard" | "posterWall" | "homeShowcase";
  /** Optional CTA rendered by editorial variants. */
  ctaHref?: string;
  ctaLabel?: string;
  /** Hide the decorative halftone accent when a page needs clean color cards. */
  showHalftoneAccent?: boolean;
  /** Catalog prices are opt-in so the home showcase never renders them. */
  prices?: TourPriceMap;
};

const posterWallCellClass = [
  "lg:col-span-3",
  "lg:col-span-3 lg:mt-10",
  "lg:col-span-3 lg:-mt-6",
  "lg:col-span-3 lg:mt-4",
];

const wallLabels: Record<
  Locale,
  {
    routes: string;
    ridden: string;
    totalKm: string;
    highPoint: string;
    altitudeUnit: string;
  }
> = {
  es: {
    routes: "rutas",
    ridden: "rodadas",
    totalKm: "km trazados",
    highPoint: "punto alto",
    altitudeUnit: "msnm",
  },
  en: {
    routes: "routes",
    ridden: "ridden",
    totalKm: "km mapped",
    highPoint: "high point",
    altitudeUnit: "masl",
  },
  pt: {
    routes: "rotas",
    ridden: "rodadas",
    totalKm: "km traçados",
    highPoint: "ponto alto",
    altitudeUnit: "msnm",
  },
};

/**
 * TourGrid — responsive 3-up → 2-up → 1-up grid of TourCard primitives.
 *
 * Caller fetches tours via getTours(locale) and passes them in. Sits in
 * either zone — data-zone cascade handles the headline color.
 *
 * Limit prop is useful for the home page (3 hero tours) without a separate
 * SlicedTourGrid component.
 */
export function TourGrid({
  tours,
  locale,
  eyebrow,
  heading,
  limit,
  emptyMessage,
  variant = "standard",
  ctaHref,
  ctaLabel,
  showHalftoneAccent = true,
  prices,
}: TourGridProps) {
  const visible = typeof limit === "number" ? tours.slice(0, limit) : tours;
  const posterWall = variant === "posterWall";
  const homeShowcase = variant === "homeShowcase";
  const totalKm = visible.reduce((total, tour) => total + tour.distance_km, 0);
  const numberLocale = locale === "en" ? "en-US" : locale === "pt" ? "pt-BR" : "es-AR";
  const altitudes = visible
    .map((tour) => tour.max_altitude_m ?? 0)
    .filter((altitude) => altitude > 0);
  const highestAltitude = altitudes.length > 0 ? Math.max(...altitudes) : null;
  const labels = wallLabels[locale];
  const hasConvertedPrice = visible.some((tour) => prices?.[tour.slug]?.converted);

  if (homeShowcase) {
    return (
      <Container className="relative isolate">
        <div
          className="border-brand-red/20 pointer-events-none absolute top-24 right-6 left-6 hidden h-[72%] -rotate-1 border-2 border-dashed lg:block"
          aria-hidden="true"
        />
        {showHalftoneAccent ? (
          <div
            className="bg-brand-red/10 border-brand-red/20 bg-halftone pointer-events-none absolute -top-10 right-0 hidden h-40 w-40 rotate-3 border-2 mix-blend-multiply lg:block"
            aria-hidden="true"
          />
        ) : null}

        <div className="relative z-10 grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-end">
          <div className="space-y-5">
            {eyebrow ? <Eyebrow rule>{eyebrow}</Eyebrow> : null}
            {heading ? (
              <DisplayHeading size="xl" as="h2" className="max-w-[11ch]">
                {heading}
              </DisplayHeading>
            ) : null}
          </div>

          {visible.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="bg-brand-red text-paper shadow-sticker-ink border-ink -rotate-1 border-2 p-4">
                <p className="font-display text-5xl leading-none">
                  {String(visible.length).padStart(2, "0")}
                </p>
                <p className="font-display mt-1 text-xs tracking-[var(--tracking-cta)] uppercase">
                  {labels.routes} {labels.ridden}
                </p>
              </div>
              <div className="bg-paper-light border-ink/60 shadow-sticker-ink rotate-1 border-2 p-4">
                <p className="font-display text-accent-on-paper text-5xl leading-none">
                  {totalKm.toLocaleString(numberLocale)}
                </p>
                <p className="font-display mt-1 text-xs tracking-[var(--tracking-cta)] uppercase">
                  {labels.totalKm}
                </p>
              </div>
              {highestAltitude ? (
                <div className="bg-paper-aged border-ink/60 shadow-sticker-ink -rotate-1 border-2 p-4">
                  <p className="font-display text-accent-on-paper text-5xl leading-none">
                    {highestAltitude.toLocaleString(numberLocale)}
                  </p>
                  <p className="font-display mt-1 text-xs tracking-[var(--tracking-cta)] uppercase">
                    {labels.highPoint}
                  </p>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        {visible.length === 0 ? (
          emptyMessage ? (
            <p className="relative z-10 mt-8 font-sans text-sm opacity-70">{emptyMessage}</p>
          ) : null
        ) : (
          <div className="relative z-10 mt-12 space-y-10">
            <ul className="grid gap-7 md:grid-cols-2 lg:gap-x-8 lg:gap-y-14">
              {visible.map((tour, index) => (
                <li key={tour.slug}>
                  <TourCard
                    tour={tour}
                    locale={locale}
                    numberLocale={numberLocale}
                    variant="photo"
                    index={index}
                    className="h-full"
                    price={prices?.[tour.slug]}
                  />
                </li>
              ))}
            </ul>

            {ctaHref && ctaLabel ? (
              <div>
                <Button
                  href={ctaHref}
                  edge={2}
                  tilt="right"
                  variant="sticker-outline"
                  className="px-9 py-4 text-base"
                >
                  {ctaLabel}
                </Button>
              </div>
            ) : null}
            {hasConvertedPrice ? <ExchangeRateAttribution locale={locale} /> : null}
          </div>
        )}
      </Container>
    );
  }

  if (posterWall) {
    return (
      <Container className="relative isolate space-y-12">
        <div className="font-display text-brand-red/10 pointer-events-none absolute -top-12 right-2 hidden text-[13rem] leading-none select-none lg:block xl:right-10">
          {String(visible.length).padStart(2, "0")}
        </div>

        {(eyebrow || heading) && (
          <div className="relative z-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(14rem,18rem)] lg:items-end">
            <div className="space-y-3">
              {eyebrow ? <Eyebrow rule>{eyebrow}</Eyebrow> : null}
              {heading ? (
                <DisplayHeading size="xl" as="h2" className="max-w-[12ch] 2xl:max-w-[14ch]">
                  {heading}
                </DisplayHeading>
              ) : null}
            </div>

            {visible.length > 0 ? (
              <aside className="bg-paper-light shadow-sticker-ink border-ink/30 rotate-1 border-2 p-5">
                <p className="font-display text-accent-on-paper text-6xl leading-none">
                  {String(visible.length).padStart(2, "0")}
                </p>
                <p className="font-display mt-1 text-xs tracking-[var(--tracking-cta)] uppercase">
                  {labels.routes} {labels.ridden}
                </p>
                <dl className="border-ink/20 mt-5 grid gap-3 border-t-2 pt-4 font-sans text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="opacity-65">{labels.totalKm}</dt>
                    <dd className="font-semibold">{totalKm.toLocaleString(numberLocale)} km</dd>
                  </div>
                  {highestAltitude ? (
                    <div className="flex justify-between gap-4">
                      <dt className="opacity-65">{labels.highPoint}</dt>
                      <dd className="font-semibold">
                        {highestAltitude.toLocaleString(numberLocale)} {labels.altitudeUnit}
                      </dd>
                    </div>
                  ) : null}
                </dl>
              </aside>
            ) : null}
          </div>
        )}

        <div
          className="border-brand-red/25 pointer-events-none absolute top-52 right-5 left-5 hidden h-16 -rotate-1 border-y-2 border-dashed lg:block"
          aria-hidden="true"
        />

        {visible.length === 0 ? (
          emptyMessage ? (
            <p className="relative z-10 font-sans text-sm opacity-70">{emptyMessage}</p>
          ) : null
        ) : (
          <>
            <ul className="relative z-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-6">
              {visible.map((tour, index) => (
                <li
                  key={tour.slug}
                  className={posterWallCellClass[index % posterWallCellClass.length]}
                >
                  <TourCard
                    tour={tour}
                    locale={locale}
                    numberLocale={numberLocale}
                    variant="poster"
                    index={index}
                    price={prices?.[tour.slug]}
                  />
                </li>
              ))}
            </ul>
            {hasConvertedPrice ? <ExchangeRateAttribution locale={locale} /> : null}
          </>
        )}
      </Container>
    );
  }

  return (
    <Container className="space-y-8">
      {(eyebrow || heading) && (
        <div className="space-y-3">
          {eyebrow ? <Eyebrow rule>{eyebrow}</Eyebrow> : null}
          {heading ? (
            <DisplayHeading size="xl" as="h2">
              {heading}
            </DisplayHeading>
          ) : null}
        </div>
      )}
      {visible.length === 0 ? (
        emptyMessage ? (
          <p className="font-sans text-sm opacity-70">{emptyMessage}</p>
        ) : null
      ) : (
        <>
          <ul className="grid gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
            {visible.map((tour, index) => (
              <li key={tour.slug}>
                <TourCard
                  tour={tour}
                  locale={locale}
                  numberLocale={numberLocale}
                  index={index}
                  price={prices?.[tour.slug]}
                />
              </li>
            ))}
          </ul>
          {hasConvertedPrice ? <ExchangeRateAttribution locale={locale} /> : null}
        </>
      )}
    </Container>
  );
}
