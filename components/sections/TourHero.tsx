import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Button, Container, DisplayHeading, Eyebrow } from "@/components/primitives";
import { PlaceholderMountains } from "@/components/surfaces/PlaceholderHalftones";
import { HalftoneImage, RedZone, RoutePlaceholderPanel } from "@/components/surfaces";
import { type Locale } from "@/lib/i18n/config";
import { type Tour } from "@/lib/sheets/schemas";

type TourHeroProps = {
  tour: Tour;
  locale: Locale;
};

type RoutePrintProps = {
  tour: Tour;
  locale: Locale;
  priority?: boolean;
  className?: string;
  sizes?: string;
};

function RoutePrint({
  tour,
  locale,
  priority = false,
  className = "",
  sizes = "(min-width: 1024px) 58vw, 100vw",
}: RoutePrintProps) {
  const imageAlt = tour.hero_image_alt[locale] || tour.title[locale];
  const routeImage = tour.hero_image_color || tour.hero_image;

  return (
    <figure
      className={`group/route-print border-paper/30 relative isolate overflow-hidden border-y-2 bg-transparent ${className}`}
      style={{
        clipPath: "polygon(0 10%, 100% 0, 100% 90%, 80% 100%, 0 88%)",
      }}
    >
      {routeImage ? (
        tour.hero_image_color ? (
          <Image
            src={routeImage}
            alt={imageAlt}
            width={1846}
            height={852}
            sizes={sizes}
            priority={priority}
            loading={priority ? "eager" : undefined}
            className="h-full w-full object-cover object-bottom opacity-95 contrast-125 saturate-75"
          />
        ) : (
          <HalftoneImage
            src={routeImage}
            alt={imageAlt}
            width={1846}
            height={852}
            sizes={sizes}
            priority={priority}
            loading={priority ? "eager" : undefined}
            className="h-full w-full object-cover object-bottom opacity-95 contrast-125"
          />
        )
      ) : (
        <RoutePlaceholderPanel
          id={tour.slug}
          className="absolute inset-0 opacity-80 mix-blend-multiply"
        />
      )}
      <div className="bg-brand-red pointer-events-none absolute inset-0 opacity-20 mix-blend-multiply" />
      {tour.hero_image_color && tour.hero_image ? (
        <HalftoneImage
          src={tour.hero_image}
          alt={imageAlt}
          width={1846}
          height={852}
          sizes={sizes}
          priority={priority}
          loading={priority ? "eager" : undefined}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-bottom opacity-35 mix-blend-multiply contrast-125"
        />
      ) : null}
      <div
        className="pointer-events-none absolute inset-0 opacity-20 mix-blend-multiply"
        style={{
          backgroundImage: "url(/textures/halftone-overlay.svg)",
          backgroundRepeat: "repeat",
        }}
        aria-hidden="true"
      />
    </figure>
  );
}

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

  return (
    <RedZone density="heavy" tornBottom={2} className="overflow-hidden">
      {/* Mountain ridge anchored bottom, bleeds into next zone */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[52%] opacity-90">
        <PlaceholderMountains className="absolute inset-0 h-full w-full" tint="ink" />
      </div>

      <Container className="relative z-10 grid min-h-[64vh] gap-10 lg:min-h-[68vh] lg:grid-cols-[minmax(0,0.9fr)_minmax(24rem,0.82fr)] lg:items-center xl:min-h-[72vh]">
        <div className="max-w-[760px] space-y-6 lg:max-w-[620px]">
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
            tour={tour}
            locale={locale}
            priority
            sizes="(min-width: 1024px) 44vw, 100vw"
            className="h-72 -rotate-1 sm:h-[22rem] lg:h-[30rem] lg:rotate-1 xl:h-[34rem]"
          />
        </div>
      </Container>
    </RedZone>
  );
}
