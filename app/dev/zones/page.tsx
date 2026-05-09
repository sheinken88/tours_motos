import type { Metadata } from "next";
import {
  Button,
  Container,
  DisplayHeading,
  Eyebrow,
  HandUnderline,
  StickyNote,
  XIcon,
} from "@/components/primitives";
import { PaperPanel, PaperZone, RedZone } from "@/components/surfaces";

export const metadata: Metadata = {
  title: "Zones — Moto On/Off (dev)",
  robots: { index: false, follow: false },
};

/**
 * /dev/zones — Phase 3 sanity playground. Validates the zone composition
 * system by stacking RedZone and PaperZone with all four torn-edge variants
 * and a PaperPanel inset on red.
 *
 * Real halftone-cutout figures and landscape PNGs come in Phase 6 / Phase 10.
 * CutoutFigure, HalftoneImage, and LandscapeBanner are exercised by static
 * analysis (typecheck + build); their visual smoke test waits for a real .png.
 *
 * Known issue (tracked in backlog): a faint pale band sits along each torn
 * edge at the y-range covered by the path's tip-to-dip variation. The rugged
 * irregular path is the desired look; the band reads as a transition seam.
 * Defer to Phase 6 hero gate or Phase 12 polish.
 */
export default function ZonesPage() {
  return (
    <main>
      {/* ── Hero-style red zone with manifesto + bottom torn edge ─────────── */}
      <RedZone density="heavy" tornBottom={2}>
        <Container className="space-y-6">
          <Eyebrow>Phase 3 · zones sanity</Eyebrow>
          <DisplayHeading size="2xl" as="h1">
            Cross what you thought you couldn&rsquo;t
          </DisplayHeading>
          <p className="max-w-prose text-lg leading-relaxed">
            We ride the routes that test what you&rsquo;re made of —{" "}
            <HandUnderline>twelve days, 2,200 kilometers</HandUnderline>, all of it earned.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button href="#" edge={1} tilt="left" variant="sticker-filled">
              Plan your trip
            </Button>
            <Button href="#" edge={2} tilt="right">
              See the routes
            </Button>
          </div>
        </Container>
      </RedZone>

      {/* ── Paper zone, X-list, eyebrow + display heading ─────────────────── */}
      <PaperZone density="default" tornBottom={3}>
        <Container className="grid gap-12 md:grid-cols-2">
          <div className="space-y-6">
            <Eyebrow rule>this is for you if</Eyebrow>
            <DisplayHeading size="lg" as="h2">
              You came to ride.
            </DisplayHeading>
            <ul className="space-y-3">
              {[
                "You'd take a dirt road over a resort any day.",
                "You ride to feel something.",
                "You measure trips by what you accomplished.",
              ].map((text) => (
                <li key={text} className="flex items-start gap-3 text-base">
                  <XIcon className="mt-1.5 h-4 w-4 shrink-0" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative h-64">
            <StickyNote className="absolute top-12 right-4">
              Ridden.
              <br />
              Earned.
              <br />
              Remembered.
            </StickyNote>
          </div>
        </Container>
      </PaperZone>

      {/* ── Red zone with PaperPanel inset (founder quote pattern) ────────── */}
      <RedZone density="default" tornBottom={4}>
        <Container className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <Eyebrow>field notes</Eyebrow>
            <DisplayHeading size="xl" as="h2" className="mt-4">
              Trips that leave marks
            </DisplayHeading>
            <p className="mt-4 max-w-prose text-base leading-relaxed">
              The competition sells tours. We sell triumph over the road. Every route is one
              we&rsquo;ve ridden — usually more than once — and remembered.
            </p>
          </div>
          <PaperPanel className="md:col-span-5" edge={2} tilt={-2}>
            <Eyebrow rule>founder</Eyebrow>
            <p className="font-display text-display-md mt-3 uppercase">
              &ldquo;You won&rsquo;t find reasonable men on the tops of tall mountains.&rdquo;
            </p>
            <p className="text-on-paper mt-3 font-sans text-sm">— Hunter S. Thompson</p>
          </PaperPanel>
        </Container>
      </RedZone>

      {/* ── Final paper zone, no bottom edge (page ends here) ─────────────── */}
      <PaperZone density="light">
        <Container className="space-y-3 text-center">
          <Eyebrow>end of demo</Eyebrow>
          <p className="font-sans text-base">
            All four torn-edge variants exercised: 2, 3, 4 above. Variant 1 is the default.
          </p>
        </Container>
      </PaperZone>
    </main>
  );
}
