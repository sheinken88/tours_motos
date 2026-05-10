import { getTranslations } from "next-intl/server";
import {
  Button,
  Container,
  DisplayHeading,
  Eyebrow,
  HandUnderline,
} from "@/components/primitives";
import { PlaceholderMountains } from "@/components/surfaces/PlaceholderHalftones";
import { CutoutFigure, RedZone } from "@/components/surfaces";
import { type Locale } from "@/lib/i18n/config";

type HeroProps = {
  locale: Locale;
};

/**
 * Hero — the home-page red-zone composition.
 * Layers (back to front):
 *   1. Red field         — RedZone provides
 *   2. Mountain ridge    — PlaceholderMountains anchored bottom, bleeds into next zone via torn edge
 *   3. Rider cutout      — halftone PNG positioned in the right half
 *   4. DisplayHeading    — top-left, display-2xl, dictionary-driven copy
 *   5. Manifesto block   — paper-color body with HandUnderline emphasis word
 *
 * Static rendering. Motion choreography comes in a later phase.
 */
export async function Hero({ locale }: HeroProps) {
  const tHome = await getTranslations("home");
  const tCommon = await getTranslations("common");

  return (
    <RedZone density="heavy" tornBottom={2} className="relative overflow-hidden">
      {/* Layer 2 — mountain ridge, full width, anchored bottom, bleeds into the next zone */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%] opacity-90">
        <PlaceholderMountains className="absolute inset-0 h-full w-full" tint="ink" />
      </div>

      {/* Layer 3 — rider cutout, anchored right and bleeding into the poster edge. */}
      <CutoutFigure
        src="/images/halftone/hero-rider-cutout.png"
        alt={tHome("rider_alt")}
        width={1086}
        height={1448}
        priority
        anchor="bottom-right"
        bleed="bottom"
        widthFraction={0.46}
        className="z-1 hidden opacity-95 md:block md:-translate-x-10 lg:-translate-x-12 xl:-translate-x-16 xl:opacity-100"
      />

      {/* Foreground copy + CTAs */}
      <Container className="relative z-10 flex min-h-[78vh] flex-col justify-center md:min-h-[82vh]">
        <div className="max-w-[640px] space-y-6">
          {/* Layer 4 — eyebrow + display heading */}
          <Eyebrow>{tHome("eyebrow")}</Eyebrow>
          <DisplayHeading size="2xl" as="h1">
            {tHome("headline")}
          </DisplayHeading>
          {/* Layer 5 — manifesto with hand-underline emphasis */}
          <p className="text-on-red max-w-prose font-sans text-lg leading-relaxed sm:text-xl">
            {tHome("manifesto")} <HandUnderline>2.200 km</HandUnderline>.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Button href={`/${locale}/tours`} edge={1} tilt="left" variant="sticker-filled">
              {tCommon("plan_trip")}
            </Button>
            <Button href={`/${locale}/journal`} edge={2} tilt="right">
              {tCommon("read_journal")}
            </Button>
          </div>
        </div>
      </Container>

    </RedZone>
  );
}
