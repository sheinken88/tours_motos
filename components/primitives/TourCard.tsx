import { type Locale } from "@/lib/i18n/config";
import { Link } from "@/lib/i18n/navigation";
import { type Tour } from "@/lib/sheets/schemas";
import { DisplayHeading } from "./DisplayHeading";
import { Stamp } from "./Stamp";

type TourCardProps = {
  tour: Tour;
  locale: Locale;
  /** Localized formatter for the kilometers number — defaults to es-AR. */
  numberLocale?: string;
};

const difficultyLabel: Record<Tour["difficulty"], { es: string; en: string; pt: string }> = {
  easy: { es: "fácil", en: "easy", pt: "fácil" },
  moderate: { es: "intermedio", en: "moderate", pt: "moderado" },
  hard: { es: "duro", en: "hard", pt: "difícil" },
  expert: { es: "experto", en: "expert", pt: "expert" },
};

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
export function TourCard({ tour, locale, numberLocale = "es-AR" }: TourCardProps) {
  const title = tour.title[locale];
  const slug = tour.slugs[locale];
  const km = tour.distance_km.toLocaleString(numberLocale);
  const days =
    locale === "en"
      ? `${tour.duration_days} days`
      : locale === "pt"
        ? `${tour.duration_days} dias`
        : `${tour.duration_days} días`;
  const diff = difficultyLabel[tour.difficulty][locale];

  return (
    <Link
      href={`/tours/${slug}`}
      className="bg-paper-light text-on-paper hover:shadow-sticker-ink ease-out-soft group flex h-full flex-col border-2 border-current/20 transition-[box-shadow,transform] duration-200 hover:-translate-y-1"
      aria-label={title}
    >
      {/* Hero slot — Phase 10 swaps to a halftone PNG via tour.hero_image.
          For now: paper-aged field with the region stamp, so the card has
          presence without a real image. */}
      <div className="bg-paper-aged relative aspect-[4/3] overflow-hidden">
        <div className="absolute top-4 left-4">
          <Stamp tilt={-2} className="text-accent-on-paper bg-paper-light/80 backdrop-blur-[1px]">
            {tour.region}
          </Stamp>
        </div>
        {/* Subtle halftone overlay for visual texture until the photo lands */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "url(/textures/halftone-overlay.svg)",
            backgroundRepeat: "repeat",
          }}
        />
      </div>

      <div className="flex flex-col gap-3 p-6">
        <DisplayHeading size="md" as="h3" distress={false}>
          {title}
        </DisplayHeading>
        <p className="font-sans text-sm leading-relaxed opacity-80">
          {days} · {km} km · {diff}
        </p>
      </div>
    </Link>
  );
}
