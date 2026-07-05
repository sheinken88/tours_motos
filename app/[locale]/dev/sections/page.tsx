import type { Metadata } from "next";
import type { ReactNode } from "react";
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
import { isLocale, type Locale } from "@/lib/i18n/config";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Sections — Moto On/Off (dev)",
  robots: { index: false, follow: false },
};

type Props = {
  params: Promise<{ locale: string }>;
};

const DEV_COPY: Record<
  Locale,
  {
    posts: Array<Pick<JournalPost, "slug" | "title" | "excerpt" | "date">>;
    intro: string;
    journalEyebrow: string;
    journalHeading: string;
    readMore: string;
    quoteA: string;
    quoteAAttribution: string;
    quoteAMeta: string;
    quoteB: string;
    quoteBAttribution: string;
    quoteEyebrow: string;
    quoteVariantNote: string;
    rawPhotoNote: string;
    multiplyPhotoNote: ReactNode;
    posterNote: string;
  }
> = {
  es: {
    posts: [
      {
        slug: "patagonia-dia-3",
        title: "Día 3 · Vuelta al Lago Buenos Aires",
        excerpt:
          "El ripio corta el ritmo durante 80 kilómetros. La curva final paga toda la jornada.",
        date: "2026-03-12",
      },
      {
        slug: "noa-puna",
        title: "Cruzar la Puna en convoy",
        excerpt:
          "4.300 metros, ripio profundo, dos horas sin señal. Aprendés a confiar en el de al lado.",
        date: "2026-02-18",
      },
      {
        slug: "ruta-40-norte",
        title: "Ruta 40 · Norte alto",
        excerpt: "De Cafayate a Iruya por caminos que no aparecen en Google Maps. Sin apuro.",
        date: "2026-01-30",
      },
    ],
    intro:
      "Cada sección se prueba en paper y en red. Si algo se cae al cambiar de zona, es bug: la sección debe leer ambas vías del cascade data-zone.",
    journalEyebrow: "Diario de ruta",
    journalHeading: "PRIMERO RODAMOS",
    readMore: "Leer la nota",
    quoteA: "Cruzá lo que te falta. La ruta no pide permiso.",
    quoteAAttribution: "Fundador, Moto On/Off",
    quoteAMeta: "Patagonia · Expedición 14",
    quoteB: "Volvés sabiendo algo que no sabías al salir. Eso es el viaje.",
    quoteBAttribution: "Rider · Edición 2025",
    quoteEyebrow: "Lo que se queda",
    quoteVariantNote: "Mismo texto, cinco tratamientos. Elegí cuál ancla la home y te lo cableo.",
    rawPhotoNote:
      "La foto sin procesar va en la columna derecha. El cielo blanco se ve contra el rojo: menos en marca, pero más editorial.",
    multiplyPhotoNote: (
      <>
        Misma foto pero con <code>mix-blend-mode: multiply</code>: el cielo blanco se cae, queda
        solo la figura sobre el rojo. Lee como halftone aunque la fuente no esté procesada.
      </>
    ),
    posterNote:
      "La referencia original entera, sin tipografía superpuesta. Pierde la voz tipográfica de la marca pero gana en autenticidad de póster.",
  },
  en: {
    posts: [
      {
        slug: "patagonia-dia-3",
        title: "Day 3 · Around Lago Buenos Aires",
        excerpt: "Gravel cuts the rhythm for 80 kilometers. The final curve pays the whole day.",
        date: "2026-03-12",
      },
      {
        slug: "noa-puna",
        title: "Crossing the Puna in convoy",
        excerpt:
          "4300 meters, deep gravel, two hours without signal. You learn to trust the rider beside you.",
        date: "2026-02-18",
      },
      {
        slug: "ruta-40-norte",
        title: "Ruta 40 · High north",
        excerpt: "From Cafayate to Iruya on roads that do not appear in Google Maps. No rush.",
        date: "2026-01-30",
      },
    ],
    intro:
      "Each section is tested on paper and red. If something breaks when the zone changes, it is a bug: the section must read both paths from the data-zone cascade.",
    journalEyebrow: "Route journal",
    journalHeading: "WE RIDE FIRST",
    readMore: "Read the note",
    quoteA: "Cross what you still owe yourself. The road does not ask permission.",
    quoteAAttribution: "Founder, Moto On/Off",
    quoteAMeta: "Patagonia · Expedition 14",
    quoteB: "You return knowing something you did not know when you left. That is the trip.",
    quoteBAttribution: "Rider · 2025 edition",
    quoteEyebrow: "What stays",
    quoteVariantNote:
      "Same text, five treatments. Choose which one anchors the home page and I will wire it.",
    rawPhotoNote:
      "The unprocessed photo sits in the right column. The white sky shows against red: less on-brand, but more editorial.",
    multiplyPhotoNote: (
      <>
        Same photo with <code>mix-blend-mode: multiply</code>: the white sky drops out and only the
        figure stays over red. It reads like halftone even though the source is not processed.
      </>
    ),
    posterNote:
      "The full original reference, with no typography overlaid. It loses the brand's type voice but gains poster authenticity.",
  },
  pt: {
    posts: [
      {
        slug: "patagonia-dia-3",
        title: "Dia 3 · Volta ao Lago Buenos Aires",
        excerpt: "O ripio corta o ritmo por 80 quilômetros. A curva final paga a jornada inteira.",
        date: "2026-03-12",
      },
      {
        slug: "noa-puna",
        title: "Cruzar a Puna em comboio",
        excerpt:
          "4300 metros, ripio profundo, duas horas sem sinal. Você aprende a confiar em quem está ao lado.",
        date: "2026-02-18",
      },
      {
        slug: "ruta-40-norte",
        title: "Ruta 40 · Norte alto",
        excerpt: "De Cafayate a Iruya por caminhos que não aparecem no Google Maps. Sem pressa.",
        date: "2026-01-30",
      },
    ],
    intro:
      "Cada seção é testada em paper e em red. Se algo quebra ao mudar de zona, é bug: a seção deve ler os dois caminhos do cascade data-zone.",
    journalEyebrow: "Diário de rota",
    journalHeading: "PRIMEIRO RODAMOS",
    readMore: "Ler a nota",
    quoteA: "Cruze o que ainda falta. A rota não pede permissão.",
    quoteAAttribution: "Fundador, Moto On/Off",
    quoteAMeta: "Patagônia · Expedição 14",
    quoteB: "Você volta sabendo algo que não sabia ao sair. Essa é a viagem.",
    quoteBAttribution: "Rider · Edição 2025",
    quoteEyebrow: "O que fica",
    quoteVariantNote: "Mesmo texto, cinco tratamentos. Escolha qual ancora a home e eu conecto.",
    rawPhotoNote:
      "A foto sem processar vai na coluna direita. O céu branco aparece contra o vermelho: menos marca, mais editorial.",
    multiplyPhotoNote: (
      <>
        Mesma foto com <code>mix-blend-mode: multiply</code>: o céu branco cai e fica só a figura
        sobre o vermelho. Lê como halftone mesmo que a fonte não esteja processada.
      </>
    ),
    posterNote:
      "A referência original inteira, sem tipografia sobreposta. Perde a voz tipográfica da marca, mas ganha autenticidade de pôster.",
  },
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
  const copy = DEV_COPY[locale];

  const mockPosts: JournalPost[] = copy.posts.map((post) => ({ ...post, locale: dateLocale }));
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
          <p className="font-sans text-base opacity-80">{copy.intro}</p>
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
          eyebrow={copy.journalEyebrow}
          heading={copy.journalHeading}
          readMoreLabel={copy.readMore}
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
          eyebrow={copy.journalEyebrow}
          heading={copy.journalHeading}
          readMoreLabel={copy.readMore}
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
          quote={copy.quoteA}
          attribution={copy.quoteAAttribution}
          attributionMeta={copy.quoteAMeta}
          eyebrow={copy.quoteEyebrow}
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
          quote={copy.quoteB}
          attribution={copy.quoteBAttribution}
          eyebrow={copy.quoteEyebrow}
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
          <p className="font-sans text-sm opacity-70">{copy.quoteVariantNote}</p>
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
          eyebrow={copy.quoteEyebrow}
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
          eyebrow={copy.quoteEyebrow}
        />
      </RedZone>

      <PaperZone density="light">
        <Container>
          <Eyebrow>C · QuoteWithFigure + photo in slot (raw)</Eyebrow>
          <p className="font-sans text-sm opacity-70">{copy.rawPhotoNote}</p>
        </Container>
      </PaperZone>
      <RedZone density="default" tornBottom={3}>
        <QuoteWithFigure
          quote="You won't find reasonable men on the tops of tall mountains."
          attribution="Hunter S. Thompson"
          eyebrow={copy.quoteEyebrow}
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
          <p className="font-sans text-sm opacity-70">{copy.multiplyPhotoNote}</p>
        </Container>
      </PaperZone>
      <RedZone density="default" tornBottom={4}>
        <QuoteWithFigure
          quote="You won't find reasonable men on the tops of tall mountains."
          attribution="Hunter S. Thompson"
          eyebrow={copy.quoteEyebrow}
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
          <p className="font-sans text-sm opacity-70">{copy.posterNote}</p>
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
