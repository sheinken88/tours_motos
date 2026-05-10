import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Container, DisplayHeading, Eyebrow } from "@/components/primitives";
import {
  FeatureStripGrid,
  JournalGrid,
  type JournalPost,
  Manifesto,
  QuoteSection,
  QuoteWithFigure,
  XListSection,
} from "@/components/sections";
import { PaperZone, RedZone } from "@/components/surfaces";
import { isLocale } from "@/lib/i18n/config";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Sections — Moto On/Off (dev)",
  robots: { index: false, follow: false },
};

type Props = {
  params: Promise<{ locale: string }>;
};

/**
 * /[locale]/dev/sections — Phase 8 exit criterion. Renders every reusable
 * section in BOTH zone contexts (red and paper) so we can eyeball that the
 * data-zone color inversion holds and that nothing relies on a specific
 * surface.
 *
 * Lives under [locale] so the next-intl request config picks up dictionary
 * messages. Excluded from the sitemap and robots.txt via metadata.
 *
 * Sections under test:
 *   - <FeatureStripGrid>
 *   - <XListSection>
 *   - <JournalGrid> (mock posts; Phase 9 wires real MDX)
 *   - <QuoteSection>
 *   - <Manifesto>
 *
 * Hero / TourHero / TourGrid live in their own dev surfaces (the home page
 * and /tours act as their canonical previews).
 */
export default async function SectionsPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const numberLocale = locale === "en" ? "en-US" : locale === "pt" ? "pt-BR" : "es-AR";
  const dateLocale = locale as "es" | "en" | "pt";

  const mockPosts: JournalPost[] = [
    {
      slug: "patagonia-dia-3",
      title: "Día 3 · Vuelta al Lago Buenos Aires",
      excerpt:
        "El viento corta de costado durante 80 kilómetros. La curva final paga toda la jornada.",
      date: "2026-03-12",
      locale: dateLocale,
    },
    {
      slug: "noa-puna",
      title: "Cruzar la Puna en convoy",
      excerpt:
        "4.300 metros, ripio profundo, dos horas sin señal. Aprendés a confiar en el de al lado.",
      date: "2026-02-18",
      locale: dateLocale,
    },
    {
      slug: "ruta-40-norte",
      title: "Ruta 40 · Norte alto",
      excerpt: "De Cafayate a Iruya por caminos que no aparecen en Google Maps. Sin apuro.",
      date: "2026-01-30",
      locale: dateLocale,
    },
  ];
  // numberLocale silences unused-var lint while we keep the helper inline
  // for future formatting needs in this dev surface.
  void numberLocale;

  return (
    <>
      <PaperZone density="light" tornBottom={1}>
        <Container className="space-y-3">
          <Eyebrow rule>Phase 8 · sections sanity</Eyebrow>
          <DisplayHeading size="xl" as="h1">
            Sections
          </DisplayHeading>
          <p className="font-sans text-base opacity-80">
            Cada sección se prueba en paper y en red. Si algo se cae al cambiar de zona, es bug — la
            sección debe leer ambas vías el data-zone cascade.
          </p>
        </Container>
      </PaperZone>

      {/* ── FeatureStripGrid in paper, then red ─────────────────────────── */}
      <RedZone density="light">
        <Container>
          <Eyebrow>FeatureStripGrid · paper</Eyebrow>
        </Container>
      </RedZone>
      <PaperZone density="default" tornBottom={2}>
        <FeatureStripGrid />
      </PaperZone>

      <RedZone density="light">
        <Container>
          <Eyebrow>FeatureStripGrid · red</Eyebrow>
        </Container>
      </RedZone>
      <RedZone density="default" tornBottom={3}>
        <FeatureStripGrid />
      </RedZone>

      {/* ── XListSection in paper, then red ─────────────────────────────── */}
      <PaperZone density="light">
        <Container>
          <Eyebrow>XListSection · paper</Eyebrow>
        </Container>
      </PaperZone>
      <PaperZone density="default" tornBottom={4}>
        <XListSection />
      </PaperZone>

      <RedZone density="light">
        <Container>
          <Eyebrow>XListSection · red</Eyebrow>
        </Container>
      </RedZone>
      <RedZone density="default" tornBottom={1}>
        <XListSection />
      </RedZone>

      {/* ── JournalGrid in paper, then red ──────────────────────────────── */}
      <PaperZone density="light">
        <Container>
          <Eyebrow>JournalGrid · paper</Eyebrow>
        </Container>
      </PaperZone>
      <PaperZone density="default" tornBottom={2}>
        <JournalGrid
          posts={mockPosts}
          eyebrow="Diario de ruta"
          heading="NOTAS DE CAMPO"
          readMoreLabel="Leer la nota"
        />
      </PaperZone>

      <RedZone density="light">
        <Container>
          <Eyebrow>JournalGrid · red</Eyebrow>
        </Container>
      </RedZone>
      <RedZone density="default" tornBottom={3}>
        <JournalGrid
          posts={mockPosts}
          eyebrow="Diario de ruta"
          heading="NOTAS DE CAMPO"
          readMoreLabel="Leer la nota"
        />
      </RedZone>

      {/* ── QuoteSection in paper, then red (matches /quote1.png treatment) */}
      <PaperZone density="light">
        <Container>
          <Eyebrow>QuoteSection · paper</Eyebrow>
        </Container>
      </PaperZone>
      <PaperZone density="default" tornBottom={4}>
        <QuoteSection
          quote="Cruzá lo que te falta. La ruta no pide permiso."
          attribution="Fundador, Moto On/Off"
          attributionMeta="Patagonia · Expedición 14"
          eyebrow="Lo que se queda"
          stamp="EXPEDITION 14"
        />
      </PaperZone>

      <RedZone density="light">
        <Container>
          <Eyebrow>QuoteSection · red</Eyebrow>
        </Container>
      </RedZone>
      <RedZone density="default" tornBottom={1}>
        <QuoteSection
          quote="Volvés sabiendo algo que no sabías al salir. Eso es el viaje."
          attribution="Rider · Edición 2025"
          eyebrow="Lo que se queda"
          stamp="2.200 KM"
        />
      </RedZone>

      {/*
        Quote treatments side-by-side — pick which one anchors the home
        page. Same quote, five treatments:
          A. QuoteSection (typographic-only, current home implementation)
          B. QuoteWithFigure, empty figure slot (asymmetric layout, no image)
          C. QuoteWithFigure + raw photo in the slot
             (sky shows through — editorial but off-brand)
          D. QuoteWithFigure + photo with mix-blend-multiply
             (sky drops out, figure reads against the red field)
          E. Original /quote1.png used full-bleed as the entire block
             (text baked into the image; no separate typography)
      */}
      <PaperZone density="light">
        <Container>
          <Eyebrow>Quote variants · A through E</Eyebrow>
          <p className="font-sans text-sm opacity-70">
            Mismo texto, cinco tratamientos. Elegí cuál ancla la home y te lo cableo.
          </p>
        </Container>
      </PaperZone>

      <RedZone density="light">
        <Container>
          <Eyebrow>A · QuoteSection (typographic only) — current</Eyebrow>
        </Container>
      </RedZone>
      <RedZone density="default" tornBottom={1}>
        <QuoteSection
          quote="You won't find reasonable men on the tops of tall mountains."
          attribution="Hunter S. Thompson"
          eyebrow="Lo que se queda"
        />
      </RedZone>

      <PaperZone density="light">
        <Container>
          <Eyebrow>B · QuoteWithFigure (empty slot)</Eyebrow>
        </Container>
      </PaperZone>
      <RedZone density="default" tornBottom={2}>
        <QuoteWithFigure
          quote="You won't find reasonable men on the tops of tall mountains."
          attribution="Hunter S. Thompson"
          eyebrow="Lo que se queda"
        />
      </RedZone>

      <PaperZone density="light">
        <Container>
          <Eyebrow>C · QuoteWithFigure + photo in slot (raw)</Eyebrow>
          <p className="font-sans text-sm opacity-70">
            La foto sin procesar va en la columna derecha. El cielo blanco se ve contra el rojo —
            menos en marca, pero más editorial.
          </p>
        </Container>
      </PaperZone>
      <RedZone density="default" tornBottom={3}>
        <QuoteWithFigure
          quote="You won't find reasonable men on the tops of tall mountains."
          attribution="Hunter S. Thompson"
          eyebrow="Lo que se queda"
          figure={
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src="/images/halftone/hunter-thompson-bike.webp"
              alt="Hunter S. Thompson aiming a revolver while seated on a motorcycle"
              className="absolute inset-0 h-full w-full object-contain object-right-bottom"
              draggable={false}
            />
          }
        />
      </RedZone>

      <PaperZone density="light">
        <Container>
          <Eyebrow>D · QuoteWithFigure + photo in slot (multiply blend)</Eyebrow>
          <p className="font-sans text-sm opacity-70">
            Misma foto pero con <code>mix-blend-mode: multiply</code> — el cielo blanco se cae,
            queda solo la figura sobre el rojo. Lee como halftone aunque la fuente no esté
            procesada.
          </p>
        </Container>
      </PaperZone>
      <RedZone density="default" tornBottom={4}>
        <QuoteWithFigure
          quote="You won't find reasonable men on the tops of tall mountains."
          attribution="Hunter S. Thompson"
          eyebrow="Lo que se queda"
          figure={
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src="/images/halftone/hunter-thompson-bike.webp"
              alt="Hunter S. Thompson aiming a revolver while seated on a motorcycle"
              className="absolute inset-0 h-full w-full object-contain object-right-bottom mix-blend-multiply"
              draggable={false}
            />
          }
        />
      </RedZone>

      <PaperZone density="light">
        <Container>
          <Eyebrow>E · Poster-as-image (the original /quote1.png, baked-in text)</Eyebrow>
          <p className="font-sans text-sm opacity-70">
            La referencia original entera, sin tipografía superpuesta. Pierde la voz tipográfica de
            la marca pero gana en autenticidad de póster.
          </p>
        </Container>
      </PaperZone>
      <RedZone density="default" tornBottom={1}>
        <Container className="flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/halftone/hunter-thompson-quote.png"
            alt="Hunter S. Thompson quote: You won't find reasonable men on the tops of tall mountains."
            className="block h-auto w-full max-w-[640px]"
            draggable={false}
          />
        </Container>
      </RedZone>

      {/* ── Manifesto canonical use is in red; paper variant for sanity ──── */}
      <PaperZone density="light">
        <Container>
          <Eyebrow>Manifesto · red (canonical)</Eyebrow>
        </Container>
      </PaperZone>
      <RedZone density="default" tornBottom={2}>
        <Manifesto />
      </RedZone>

      <RedZone density="light">
        <Container>
          <Eyebrow>Manifesto · paper</Eyebrow>
        </Container>
      </RedZone>
      <PaperZone density="default">
        <Manifesto />
      </PaperZone>
    </>
  );
}
