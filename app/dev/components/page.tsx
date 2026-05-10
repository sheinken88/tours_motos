import type { Metadata } from "next";
import {
  Button,
  Container,
  DisplayHeading,
  Eyebrow,
  HandUnderline,
  SkullBadge,
  Stamp,
  StickyNote,
  XIcon,
} from "@/components/primitives";

export const metadata: Metadata = {
  title: "Components — Moto On/Off (dev)",
  robots: { index: false, follow: false },
};

/**
 * /dev/components — Phase 2 sanity playground. Renders every primitive in
 * BOTH zone contexts so we can eyeball color inversion, tilts, hover states.
 *
 * Zone wrappers here are provisional (just data-zone + bg utilities).
 * Phase 3 RedZone / PaperZone components will replace these with proper
 * texture overlays, padding, and torn edges.
 *
 * Excluded from sitemap. Will be deleted once we have a real component
 * library doc surface.
 */
export default function ComponentsPage() {
  return (
    <main>
      <header className="bg-paper-grain text-on-paper border-b-ink/30 border-b-2" data-zone="paper">
        <Container className="py-12">
          <Eyebrow rule>Phase 2 · primitives sanity</Eyebrow>
          <DisplayHeading size="xl" as="h1" className="mt-4">
            Components
          </DisplayHeading>
        </Container>
      </header>

      <PaperShowcase />
      <RedShowcase />
    </main>
  );
}

function PaperShowcase() {
  return (
    <section className="bg-paper-grain text-on-paper" data-zone="paper">
      <Container className="space-y-12 py-16">
        <ShowcaseHeader title="Paper zone" />
        <PrimitiveBlocks zone="paper" />
      </Container>
    </section>
  );
}

function RedShowcase() {
  return (
    <section className="bg-red-grunge text-on-red border-t-paper/20 border-t-2" data-zone="red">
      <Container className="space-y-12 py-16">
        <ShowcaseHeader title="Red zone" />
        <PrimitiveBlocks zone="red" />
      </Container>
    </section>
  );
}

function ShowcaseHeader({ title }: { title: string }) {
  return (
    <div>
      <Eyebrow>showcase</Eyebrow>
      <DisplayHeading size="lg" className="mt-2">
        {title}
      </DisplayHeading>
    </div>
  );
}

function PrimitiveBlocks({ zone }: { zone: "red" | "paper" }) {
  // Tint variants chosen so each demo reads against its zone background.
  const skullTintA = zone === "paper" ? "text-brand-red" : "text-paper-aged";
  const skullTintB = zone === "paper" ? "text-paper-dark" : "text-paper-light";
  return (
    <>
      {/* DisplayHeading sizes */}
      <Block label="DisplayHeading">
        <DisplayHeading size="2xl" as="h3">
          Cross the Andes the hard way
        </DisplayHeading>
        <DisplayHeading size="xl" as="h3" className="mt-6">
          Trips that leave marks
        </DisplayHeading>
        <DisplayHeading size="lg" as="h3" className="mt-6">
          Sobre las Nubes
        </DisplayHeading>
        <DisplayHeading size="md" as="h3" className="mt-4">
          7 days · 1712 km
        </DisplayHeading>
      </Block>

      {/* Eyebrow */}
      <Block label="Eyebrow">
        <Eyebrow>field notes & dusty thoughts</Eyebrow>
        <Eyebrow rule className="mt-6">
          with hairline rule
        </Eyebrow>
      </Block>

      {/* Buttons */}
      <Block label="Button — sticker-outline (default), 3 edge variants × tilt directions">
        <div className="flex flex-wrap items-center gap-6">
          <Button href="#" edge={1} tilt="left">
            Plan your trip
          </Button>
          <Button href="#" edge={2} tilt="right">
            See the routes
          </Button>
          <Button href="#" edge={3} tilt="none">
            Read the journal
          </Button>
        </div>
      </Block>

      <Block label="Button — sticker-filled (max 1 per zone)">
        <Button href="#" variant="sticker-filled" tilt="left">
          Hold a spot
        </Button>
      </Block>

      <Block label="Button — ghost (tertiary)">
        <Button href="#" variant="ghost" arrow={false}>
          back to all trips
        </Button>
      </Block>

      {/* X-list */}
      <Block label="X-list">
        <ul className="space-y-3">
          {[
            "You'd take a dirt road over a resort any day.",
            "You ride to feel something.",
            "You want stories worth telling.",
          ].map((text) => (
            <li key={text} className="flex items-start gap-3">
              <XIcon className="mt-1.5 h-4 w-4 shrink-0" />
              <span className="text-base">{text}</span>
            </li>
          ))}
        </ul>
      </Block>

      {/* HandUnderline */}
      <Block label="HandUnderline">
        <p className="text-lg">
          You ride to find out <HandUnderline>what you&rsquo;re made of</HandUnderline>.
        </p>
      </Block>

      {/* Stamps — Stamp uses currentColor; tint via parent or className */}
      <Block label="Stamp">
        <div className="flex flex-wrap items-center gap-4">
          <Stamp>EXPEDITION 14</Stamp>
          <Stamp tilt={2}>JUNE 2 · 2026</Stamp>
          <Stamp tilt={-1} className="opacity-70">
            SOLD OUT
          </Stamp>
        </div>
      </Block>

      {/* StickyNote */}
      <Block label="StickyNote (max 1 per page in production)">
        <div className="relative h-32">
          <StickyNote className="absolute top-0 left-8">
            Ridden.
            <br />
            Earned.
            <br />
            Remembered.
          </StickyNote>
        </div>
      </Block>

      {/* SkullBadge — multiple sizes, multiple tints via currentColor.
          Holes are transparent SVG mask cutouts so the page background shows through. */}
      <Block label="SkullBadge — currentColor + transparent cutouts">
        <div className="flex flex-wrap items-end gap-8">
          <div className="flex items-end gap-3">
            <SkullBadge size="sm" />
            <SkullBadge size="md" />
            <SkullBadge size="lg" />
          </div>
          <SkullBadge size="lg" className={skullTintA} />
          <SkullBadge size="lg" className={skullTintB} />
        </div>
      </Block>
    </>
  );
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-t-2 border-dashed border-current/25 pt-6">
      <p className="text-eyebrow tracking-eyebrow mb-4 font-mono text-xs uppercase opacity-70">
        {label}
      </p>
      {children}
    </div>
  );
}
