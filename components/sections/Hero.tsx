import { getTranslations } from "next-intl/server";
import {
  Button,
  Container,
  DisplayHeading,
  Eyebrow,
  HandUnderline,
  StickyNote,
} from "@/components/primitives";
import { PlaceholderMountains } from "@/components/surfaces/PlaceholderHalftones";
import { RedZone } from "@/components/surfaces";
import { type Locale } from "@/lib/i18n/config";

type HeroProps = {
  locale: Locale;
};

/**
 * Hero — the home-page red-zone composition. The Phase 6 validation gate.
 * Six layers per design.md §5 (back to front):
 *   1. Red field           — RedZone provides
 *   2. Mountain ridge      — PlaceholderMountains anchored bottom, bleeds into next zone via torn edge
 *   3. Rider cutout        — PlaceholderRider anchored bottom-right, bleeds past right margin
 *   4. DisplayHeading      — top-left, display-2xl, dictionary-driven copy
 *   5. Manifesto block     — paper-color body with HandUnderline emphasis word
 *   6. Sticky-note callout — overlapping the cutout, declarative 3–5 word claim
 *
 * Static rendering for Phase 6. Motion choreography (one-shot 1.8s reveal)
 * comes in Phase 12.
 *
 * Placeholders (PlaceholderRider / PlaceholderMountains) are swapped for
 * pre-processed halftone PNGs in Phase 10 — Hero stays the same shape.
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

      {/*
        Layer 3 — RIDER CUTOUT SLOT. Reserved for a real halftone-processed PNG
        produced via /docs/halftone-pipeline.md. Drop the asset at
        /public/images/halftone/rider-hero.png and render via:

          <CutoutFigure
            src="/images/halftone/rider-hero.png"
            alt="..."
            anchor="bottom-right"
            bleed="right"
            widthFraction={0.55}
            paperOutline
            priority
          />

        Procedural placeholders looked too cartoonish; runtime-filtered photos
        looked muddy. Real halftone PNGs ship in Phase 10.
      */}

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

      {/* Layer 6 — sticky-note callout overlapping the cutout
          (max 1 per page rule per CLAUDE.md §13 — used here as the
          declarative signature line) */}
      <StickyNote tilt={4} className="absolute right-[18%] bottom-[28%] hidden md:block" withX>
        Ridden.
        <br />
        Earned.
        <br />
        Remembered.
      </StickyNote>
    </RedZone>
  );
}
