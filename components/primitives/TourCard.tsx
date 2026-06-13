import Image from "next/image";
import { type Locale } from "@/lib/i18n/config";
import { Link } from "@/lib/i18n/navigation";
import { type Tour } from "@/lib/sheets/schemas";
import { HalftoneImage } from "../surfaces/HalftoneImage";
import { DisplayHeading } from "./DisplayHeading";
import { Stamp } from "./Stamp";

type TourCardProps = {
  tour: Tour;
  locale: Locale;
  /** Localized formatter for the kilometers number — defaults to es-AR. */
  numberLocale?: string;
  /** Poster cards add richer stats and a slightly pasted-on composition. */
  variant?: "standard" | "poster";
  /** Zero-based visual index, used for route numbering and poster tilt. */
  index?: number;
  className?: string;
};

const difficultyLabel: Record<Tour["difficulty"], { es: string; en: string; pt: string }> = {
  easy: { es: "fácil", en: "easy", pt: "fácil" },
  moderate: { es: "intermedio", en: "moderate", pt: "moderado" },
  hard: { es: "duro", en: "hard", pt: "difícil" },
  expert: { es: "experto", en: "expert", pt: "expert" },
};

const routeLabel: Record<Locale, string> = {
  es: "Ruta",
  en: "Route",
  pt: "Rota",
};

const statLabels: Record<Locale, { days: string; gravel: string; altitude: string }> = {
  es: { days: "días", gravel: "ripio", altitude: "msnm" },
  en: { days: "days", gravel: "gravel", altitude: "masl" },
  pt: { days: "dias", gravel: "terra", altitude: "msnm" },
};

const posterTiltClass = ["lg:-rotate-1", "lg:rotate-1", "lg:-rotate-2", "lg:rotate-2"];

/**
 * TourCard — design.md §5 tour card pattern.
 *
 * Layout:
 *   - Halftone hero region at top (Phase 10 swap-in for real PNG via
 *     hero_image; for now a paper-light block with the region stamp).
 *   - Paper title bar with ink DisplayHeading.
 *   - Ink metadata strip: duration · distance · difficulty.
 *
 * The whole card is the link. Hover lifts 4px, shadow grows.
 *
 * Sits on either zone — the data-zone cascade picks up colors. The card
 * itself uses paper-light so it stays legible against red zones AND
 * against paper zones (it's a paper-colored chip on paper, slightly
 * lifted by the sticker shadow).
 */
export function TourCard({
  tour,
  locale,
  numberLocale = "es-AR",
  variant = "standard",
  index = 0,
  className = "",
}: TourCardProps) {
  const title = tour.title[locale];
  const region = tour.region[locale];
  const slug = tour.slugs[locale];
  const km = tour.distance_km.toLocaleString(numberLocale);
  const routeNumber = String(index + 1).padStart(2, "0");
  const days =
    locale === "en"
      ? `${tour.duration_days} days`
      : locale === "pt"
        ? `${tour.duration_days} dias`
        : `${tour.duration_days} días`;
  const diff = difficultyLabel[tour.difficulty][locale];
  const labels = statLabels[locale];
  const poster = variant === "poster";
  const gravelValue = tour.ripio_percent === null ? "-" : `${tour.ripio_percent}%`;

  const cardClass = poster
    ? [
        "bg-paper-grain text-on-paper shadow-sticker-ink hover:shadow-sticker-red",
        "ease-out-soft group relative isolate flex h-full flex-col border-2 border-ink/70",
        "transition-[box-shadow,transform] duration-200 hover:-translate-y-2 hover:rotate-0",
        "focus-visible:rotate-0",
        posterTiltClass[index % posterTiltClass.length],
        className,
      ].join(" ")
    : [
        "bg-paper-light text-on-paper hover:shadow-sticker-ink",
        "ease-out-soft group flex h-full flex-col border-2 border-current/20",
        "transition-[box-shadow,transform] duration-200 hover:-translate-y-1",
        className,
      ].join(" ");

  return (
    <Link href={`/tours/${slug}`} className={cardClass} aria-label={title}>
      {poster ? (
        <span
          className="bg-paper-aged border-ink/35 pointer-events-none absolute -top-3 right-8 z-20 h-6 w-20 -rotate-2 border-2 opacity-90 mix-blend-multiply"
          aria-hidden="true"
        />
      ) : null}

      {/* Hero slot. Z-stack (bottom → top):
          1. paper-aged field + halftone overlay (always — graceful fallback
             for tours whose halftone PNG has not shipped yet).
          2. HalftoneImage cropped to 4:3 (if hero_image resolves) — the
             default visible state.
          3. Color JPG (if hero_image_color resolves) layered on top at
             opacity-0, crossfading to opacity-100 on card hover.
          4. Region stamp, tilted top-left, on top of everything. */}
      <div
        className={`bg-paper-aged relative overflow-hidden ${
          poster ? "border-ink/60 aspect-[16/10] border-b-2" : "aspect-[4/3]"
        }`}
      >
        <div
          className={`absolute inset-0 z-[1] mix-blend-multiply transition-opacity duration-200 ${
            poster ? "opacity-35 group-hover:opacity-55" : "opacity-30"
          }`}
          style={{
            backgroundImage: "url(/textures/halftone-overlay.svg)",
            backgroundRepeat: "repeat",
          }}
        />
        {tour.hero_image ? (
          <HalftoneImage
            src={tour.hero_image}
            alt={tour.hero_image_alt[locale] || `${title} — ${region}`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className={`object-cover ${poster ? "mix-blend-multiply" : ""}`}
          />
        ) : null}
        {tour.hero_image_color ? (
          <Image
            src={tour.hero_image_color}
            alt=""
            aria-hidden="true"
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            draggable={false}
            className="ease-out-soft absolute inset-0 object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
        ) : null}
        <div className="absolute top-4 left-4 z-[3]">
          <Stamp tilt={-2} className="text-accent-on-paper bg-paper-light/80 backdrop-blur-[1px]">
            {region}
          </Stamp>
        </div>
        {poster ? (
          <div className="absolute right-4 bottom-4 z-[3]">
            <Stamp tilt={2} className="bg-brand-red text-paper border-paper/80">
              {routeLabel[locale]} {routeNumber}
            </Stamp>
          </div>
        ) : null}
      </div>

      {poster ? (
        <div className="relative flex flex-1 flex-col gap-5 p-5 md:p-6">
          <div className="flex items-start justify-between gap-5">
            <DisplayHeading
              size="md"
              as="h3"
              distress={false}
              className="!text-brand-red max-w-[12ch]"
            >
              {title}
            </DisplayHeading>
            <span
              className="font-display text-accent-on-paper text-5xl leading-none opacity-75"
              aria-hidden="true"
            >
              {routeNumber}
            </span>
          </div>

          {tour.tagline[locale] ? (
            <p className="font-sans text-sm leading-relaxed opacity-80">{tour.tagline[locale]}</p>
          ) : null}

          <dl className="border-ink/25 mt-auto grid grid-cols-3 border-y-2 py-3">
            <div>
              <dt className="font-display text-[0.64rem] tracking-[var(--tracking-cta)] uppercase opacity-60">
                {labels.days}
              </dt>
              <dd className="font-display text-accent-on-paper text-2xl leading-none">
                {tour.duration_days}
              </dd>
            </div>
            <div className="border-ink/20 border-l-2 pl-3">
              <dt className="font-display text-[0.64rem] tracking-[var(--tracking-cta)] uppercase opacity-60">
                km
              </dt>
              <dd className="font-display text-accent-on-paper text-2xl leading-none">{km}</dd>
            </div>
            <div className="border-ink/20 border-l-2 pl-3">
              <dt className="font-display text-[0.64rem] tracking-[var(--tracking-cta)] uppercase opacity-60">
                {labels.gravel}
              </dt>
              <dd className="font-display text-accent-on-paper text-2xl leading-none">
                {gravelValue}
              </dd>
            </div>
          </dl>

          <p className="font-display flex flex-wrap gap-x-3 gap-y-1 text-xs tracking-[var(--tracking-cta)] uppercase opacity-75">
            <span>{diff}</span>
            {tour.max_altitude_m ? (
              <span>
                {tour.max_altitude_m.toLocaleString(numberLocale)} {labels.altitude}
              </span>
            ) : null}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 p-6">
          <DisplayHeading size="md" as="h3" distress={false} className="!text-brand-red">
            {title}
          </DisplayHeading>
          <p className="font-sans text-sm leading-relaxed opacity-80">
            {days} · {km} km · {diff}
          </p>
        </div>
      )}
    </Link>
  );
}
