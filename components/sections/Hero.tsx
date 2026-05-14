import { getTranslations } from "next-intl/server";
import {
  Button,
  Container,
  DisplayHeading,
  Eyebrow,
} from "@/components/primitives";
import { PlaceholderMountains } from "@/components/surfaces/PlaceholderHalftones";
import { RedZone } from "@/components/surfaces";
import { type Locale } from "@/lib/i18n/config";
import { HeroVideo } from "./HeroVideo";

type HeroProps = {
  locale: Locale;
};

/**
 * Hero — the home-page red-zone composition.
 * Layers (back to front):
 *   1. Red field         — RedZone provides
 *   2. Mountain ridge    — PlaceholderMountains anchored bottom, bleeds into next zone via torn edge
 *   3. DisplayHeading    — top-left, display-2xl, dictionary-driven copy
 *
 * Static rendering. Motion choreography comes in a later phase.
 */
export async function Hero({ locale }: HeroProps) {
  const [tHome, tCommon] = await Promise.all([
    getTranslations("home"),
    getTranslations("common"),
  ]);

  return (
    <RedZone density="heavy" tornBottom={2} className="relative overflow-hidden">
      {/* Layer 1 — looping background video, duotoned + red-washed to read as texture */}
      <HeroVideo />

      {/* Layer 2 — mountain ridge, full width, anchored bottom, bleeds into the next zone */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[60%] opacity-90">
        <PlaceholderMountains className="absolute inset-0 h-full w-full" tint="ink" />
      </div>

      {/* Foreground copy + CTAs */}
      <Container className="relative z-10 flex min-h-[78vh] flex-col justify-center md:min-h-[82vh]">
        <div className="max-w-[640px] -translate-y-6 space-y-6 md:-translate-y-10">
          {/* Layer 4 — eyebrow + display heading */}
          <Eyebrow>{tHome("eyebrow")}</Eyebrow>
          <DisplayHeading size="2xl" as="h1">
            {tHome("headline")}
          </DisplayHeading>
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
