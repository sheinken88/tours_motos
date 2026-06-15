import { getTranslations } from "next-intl/server";
import { Button, Container, DisplayHeading, Eyebrow } from "@/components/primitives";
import { PlaceholderMountains } from "@/components/surfaces/PlaceholderHalftones";
import { RedZone, RoutePrint } from "@/components/surfaces";
import { type Locale } from "@/lib/i18n/config";
import { type Tour } from "@/lib/sheets/schemas";

type TourHeroProps = {
  tour: Tour;
  locale: Locale;
};

/**
 * TourHero — per-tour variant of the home Hero. Same red-zone composition
 * (mountain ridge, torn bottom edge) with tour-specific copy:
 *   - Eyebrow: route region
 *   - Headline: tour title from Sheets
 *   - CTAs: Hold a spot (sticker-filled) + Talk to us (sticker-outline)
 *   - Image: route proof printed into the red field and tucked behind the
 *     mountain layer, rather than a freestanding photo card.
 *
 * The detailed stats stay in the paper overview immediately below, so the hero
 * does not repeat the same duration, distance, ripio, and altitude data.
 */
export async function TourHero({ tour, locale }: TourHeroProps) {
  const tCommon = await getTranslations("common");
  const region = tour.region[locale];
  const imageAlt = tour.hero_image_alt[locale] || tour.title[locale];

  return (
    <RedZone density="heavy" tornBottom={2} className="overflow-hidden">
      {/* Mountain ridge anchored bottom, bleeds into next zone */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[52%] opacity-90">
        <PlaceholderMountains className="absolute inset-0 h-full w-full" tint="ink" />
      </div>

      <Container className="relative z-10 grid min-h-[64vh] gap-10 lg:min-h-[68vh] lg:grid-cols-[minmax(0,1fr)_minmax(24rem,0.8fr)] lg:items-center xl:min-h-[72vh]">
        <div className="max-w-[50rem] space-y-6">
          <Eyebrow>{region}</Eyebrow>
          <DisplayHeading size="2xl" as="h1">
            {tour.title[locale]}
          </DisplayHeading>
          <p className="text-on-red max-w-2xl font-sans text-xl leading-relaxed md:text-2xl">
            {tour.summary[locale]}
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Button
              href={`/${locale}/contact?tour=${tour.slugs[locale]}`}
              edge={1}
              tilt="left"
              variant="sticker-filled"
            >
              {tCommon("hold_a_spot")}
            </Button>
            <Button href={`/${locale}/contact`} edge={2} tilt="right">
              {tCommon("talk_to_us")}
            </Button>
          </div>
        </div>

        <div className="relative -mx-5 sm:-mx-8 md:mx-0">
          <RoutePrint
            alt={imageAlt}
            colorSrc={tour.hero_image_color}
            halftoneSrc={tour.hero_image}
            fallbackId={tour.slug}
            priority
            sizes="(min-width: 1024px) 44vw, 100vw"
            className="h-72 sm:h-[22rem] md:-rotate-1 lg:h-[30rem] lg:rotate-1 xl:h-[34rem]"
          />
        </div>
      </Container>
    </RedZone>
  );
}
