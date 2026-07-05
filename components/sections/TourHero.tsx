import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Button, Container, DisplayHeading, Eyebrow } from "@/components/primitives";
import { RedZone } from "@/components/surfaces";
import { type Locale } from "@/lib/i18n/config";
import { type Tour } from "@/lib/sheets/schemas";

type TourHeroProps = {
  tour: Tour;
  locale: Locale;
  heroSummary?: string;
};

type TourHeroBackground = {
  src: string;
  objectPosition: string;
};

const tourHeroBackgrounds: Record<string, TourHeroBackground> = {
  "sobre-las-nubes": {
    src: "/images/optimized/heroes/tour-sobre-las-nubes.jpg",
    objectPosition: "50% center",
  },
  "gigantes-del-oeste": {
    src: "/images/optimized/heroes/tour-gigantes-del-oeste.jpg",
    objectPosition: "58% center",
  },
  "volcanes-del-norte": {
    src: "/images/optimized/heroes/tour-volcanes-del-norte.jpg",
    objectPosition: "58% center",
  },
  "cruces-del-sur": {
    src: "/images/optimized/heroes/tour-cruces-del-sur.jpg",
    objectPosition: "58% bottom",
  },
};

/**
 * TourHero — per-tour full-bleed poster hero. Same soft red-wash treatment as
 * the tour index hero, with tour-specific copy:
 *   - Eyebrow: route region
 *   - Headline: tour title from Sheets
 *   - CTAs: Hold a spot (sticker-filled) + Talk to us (sticker-outline)
 *   - Image: route proof printed into the red field as a full-bleed background.
 *
 * The detailed stats stay in the paper overview immediately below, so the hero
 * does not repeat the same duration, distance, ripio, and altitude data.
 */
export async function TourHero({ tour, locale, heroSummary }: TourHeroProps) {
  const tCommon = await getTranslations("common");
  const region = tour.region[locale];
  const summary = heroSummary || tour.summary[locale];
  const imageAlt = tour.hero_image_alt[locale] || tour.title[locale];
  const background = tourHeroBackgrounds[tour.slug] ?? {
    src: tour.hero_image_color || tour.hero_image,
    objectPosition: "54% center",
  };

  return (
    <RedZone density="heavy" tornBottom={2} className="min-h-[100svh] overflow-hidden !py-0">
      {background.src ? (
        <Image
          src={background.src}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 z-0 h-full w-full object-cover"
          style={{ objectPosition: background.objectPosition }}
        />
      ) : null}
      <div className="from-brand-red/[0.70] via-brand-red/[0.24] pointer-events-none absolute inset-0 z-[3] bg-gradient-to-r to-transparent mix-blend-multiply" />
      <div className="from-ink/[0.30] via-ink/[0.08] pointer-events-none absolute inset-0 z-[3] bg-gradient-to-r to-transparent mix-blend-multiply" />
      <div className="from-ink/[0.24] via-ink/[0.07] pointer-events-none absolute inset-x-0 bottom-0 z-[4] h-2/5 bg-gradient-to-t to-transparent [mask-image:linear-gradient(to_right,black_0%,black_46%,transparent_78%)]" />
      <div className="from-ink/[0.16] pointer-events-none absolute inset-x-0 top-0 z-[4] h-48 bg-gradient-to-b to-transparent [mask-image:linear-gradient(to_right,black_0%,black_46%,transparent_78%)]" />
      <div
        className="pointer-events-none absolute inset-0 z-[5] [background-image:linear-gradient(to_right,rgb(31_20_14)_0%,rgb(31_20_14/.28)_45%,transparent_78%),url('/textures/halftone-overlay.svg')] [background-size:100%_100%,18px_18px] opacity-10 mix-blend-multiply"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 z-[5] [background-image:linear-gradient(to_right,rgb(168_52_42/.82)_0%,rgb(168_52_42/.24)_45%,transparent_78%),url('/textures/red-grunge.svg')] [background-size:100%_100%,320px_320px] opacity-[0.08] mix-blend-multiply"
        aria-hidden="true"
      />

      <Container className="relative z-10 flex min-h-[100svh] items-center pt-32 pb-24 md:pt-40 md:pb-28">
        <div className="max-w-[52rem] space-y-6">
          <Eyebrow>{region}</Eyebrow>
          <DisplayHeading size="2xl" as="h1" className="max-w-[10ch] leading-[0.88]">
            {tour.title[locale]}
          </DisplayHeading>
          <p className="text-on-red max-w-2xl font-sans text-xl leading-relaxed whitespace-pre-line md:text-2xl">
            {summary}
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
      </Container>
    </RedZone>
  );
}
