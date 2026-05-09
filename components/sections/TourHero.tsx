import { getTranslations } from "next-intl/server";
import { Button, Container, DisplayHeading, Eyebrow, Stamp } from "@/components/primitives";
import { PlaceholderMountains } from "@/components/surfaces/PlaceholderHalftones";
import { RedZone } from "@/components/surfaces";
import { type Locale } from "@/lib/i18n/config";
import { type Tour } from "@/lib/sheets/schemas";

type TourHeroProps = {
  tour: Tour;
  locale: Locale;
  /** Tagline from MDX frontmatter — shown below the headline. */
  tagline?: string;
};

/**
 * TourHero — per-tour variant of the home Hero. Same red-zone composition
 * (mountain ridge, torn bottom edge) with tour-specific copy:
 *   - Eyebrow: region · days · km
 *   - Headline: tour title from Sheets
 *   - Tagline: from MDX frontmatter
 *   - Stamp: difficulty
 *   - CTAs: Hold a spot (sticker-filled) + Talk to us (sticker-outline)
 *
 * The rider/cutout slot is reserved for tour.hero_image (Phase 10 PNG).
 */
export async function TourHero({ tour, locale, tagline }: TourHeroProps) {
  const tCommon = await getTranslations("common");
  const numberLocale = locale === "en" ? "en-US" : locale === "pt" ? "pt-BR" : "es-AR";
  const km = tour.distance_km.toLocaleString(numberLocale);
  const days = tour.duration_days;
  const daysWord = locale === "en" ? "days" : locale === "pt" ? "dias" : "días";

  return (
    <RedZone density="heavy" tornBottom={2}>
      {/* Mountain ridge anchored bottom, bleeds into next zone */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] opacity-90">
        <PlaceholderMountains className="absolute inset-0 h-full w-full" tint="ink" />
      </div>

      {/*
        Tour cutout slot — reserved for tour.hero_image (Phase 10 PNG).
        Drop the asset and render via:
          <CutoutFigure
            src={tour.hero_image}
            alt={tour.title[locale]}
            anchor="bottom-right"
            bleed="right"
            widthFraction={0.55}
            paperOutline
            priority
          />
      */}

      <Container className="relative z-10 flex min-h-[68vh] flex-col justify-center md:min-h-[72vh]">
        <div className="max-w-[760px] space-y-6">
          <div className="flex flex-wrap items-center gap-4">
            <Eyebrow>{tour.region}</Eyebrow>
            <Stamp tilt={-2}>
              {days} {daysWord}
            </Stamp>
            <Stamp tilt={1}>{km} km</Stamp>
          </div>
          <DisplayHeading size="2xl" as="h1">
            {tour.title[locale]}
          </DisplayHeading>
          {tagline ? (
            <p className="text-on-red max-w-prose font-sans text-lg leading-relaxed sm:text-xl">
              {tagline}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-4 pt-2">
            <Button
              href={`/contact?tour=${tour.slug}`}
              edge={1}
              tilt="left"
              variant="sticker-filled"
            >
              {tCommon("hold_a_spot")}
            </Button>
            <Button href="/contact" edge={2} tilt="right">
              {tCommon("talk_to_us")}
            </Button>
          </div>
        </div>
      </Container>
    </RedZone>
  );
}
