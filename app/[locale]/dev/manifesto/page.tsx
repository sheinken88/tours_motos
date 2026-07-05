import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Container, DisplayHeading, Eyebrow } from "@/components/primitives";
import { RedZone } from "@/components/surfaces";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { type ManifestoVariant } from "@/components/sections/manifesto-prototypes/shared";
import { Variant1InkBanner } from "@/components/sections/manifesto-prototypes/Variant1InkBanner";
import { Variant2StampedFrame } from "@/components/sections/manifesto-prototypes/Variant2StampedFrame";
import { Variant3PaperCard } from "@/components/sections/manifesto-prototypes/Variant3PaperCard";
import { Variant4EyebrowTag } from "@/components/sections/manifesto-prototypes/Variant4EyebrowTag";
import { Variant5RuleAndDots } from "@/components/sections/manifesto-prototypes/Variant5RuleAndDots";
import { Variant6TornStrip } from "@/components/sections/manifesto-prototypes/Variant6TornStrip";
import { Variant7RuggedInkStamp } from "@/components/sections/manifesto-prototypes/Variant7RuggedInkStamp";

export const metadata: Metadata = {
  title: "Manifesto prototypes — Moto On/Off (dev)",
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ locale: string }> };

const VARIANTS: Record<Locale, ManifestoVariant[]> = {
  es: [
    {
      slug: "sobre-las-nubes",
      label: "Sobre las Nubes · 7 días",
      teaser:
        "Salta y Jujuy en 7 días. Cruzás el Abra del Acay a 4.895 m, el paso más alto de la Ruta 40.",
    },
    {
      slug: "gigantes-del-oeste",
      label: "Gigantes del Oeste · 8 días",
      teaser:
        "Mendoza a La Rioja en 8 días. Subís a Laguna Brava, 4.300 m, donde descansa un avión y caminan los flamencos.",
    },
    {
      slug: "volcanes-del-norte",
      label: "Volcanes del Norte · 7 días",
      teaser:
        "Catamarca en 7 días. Antofagasta de la Sierra, el Campo de Piedra Pómez y las dunas de Tatón.",
    },
    {
      slug: "cruces-del-sur",
      label: "Cruces del Sur · 7 días",
      teaser:
        "Carretera Austral en 7 días. Paso Roballos, el Lago General Carrera y ripio de punta a punta.",
    },
  ],
  en: [
    {
      slug: "sobre-las-nubes",
      label: "Over the Clouds · 7 days",
      teaser:
        "Salta and Jujuy in 7 days. You cross Abra del Acay at 4895 m, the highest pass on Ruta 40.",
    },
    {
      slug: "gigantes-del-oeste",
      label: "Giants of the West · 8 days",
      teaser:
        "Mendoza to La Rioja in 8 days. You climb to Laguna Brava, 4300 m, where an aircraft rests and flamingos walk.",
    },
    {
      slug: "volcanes-del-norte",
      label: "Volcanoes of the North · 7 days",
      teaser:
        "Catamarca in 7 days. Antofagasta de la Sierra, Campo de Piedra Pómez, and the dunes of Tatón.",
    },
    {
      slug: "cruces-del-sur",
      label: "Southern Crossings · 7 days",
      teaser:
        "Carretera Austral in 7 days. Paso Roballos, Lago General Carrera, and gravel from end to end.",
    },
  ],
  pt: [
    {
      slug: "sobre-las-nubes",
      label: "Sobre as Nuvens · 7 dias",
      teaser:
        "Salta e Jujuy em 7 dias. Você cruza o Abra del Acay a 4895 m, o passo mais alto da Ruta 40.",
    },
    {
      slug: "gigantes-del-oeste",
      label: "Gigantes do Oeste · 8 dias",
      teaser:
        "Mendoza a La Rioja em 8 dias. Você sobe à Laguna Brava, 4300 m, onde descansa um avião e caminham flamingos.",
    },
    {
      slug: "volcanes-del-norte",
      label: "Vulcões do Norte · 7 dias",
      teaser:
        "Catamarca em 7 dias. Antofagasta de la Sierra, Campo de Piedra Pómez e as dunas de Tatón.",
    },
    {
      slug: "cruces-del-sur",
      label: "Cruces do Sul · 7 dias",
      teaser:
        "Carretera Austral em 7 dias. Paso Roballos, Lago General Carrera e ripio de ponta a ponta.",
    },
  ],
};

const SHOWCASE: Array<{
  number: number;
  title: string;
  description: string;
  Component: (props: { variants: ManifestoVariant[] }) => React.ReactNode;
}> = [
  {
    number: 1,
    title: "Ink banner",
    description:
      "Solid warm-near-black bar with paper text. The high-contrast 'rotating slot' option.",
    Component: Variant1InkBanner,
  },
  {
    number: 2,
    title: "Stamped frame",
    description: "Paper border, no fill, slight tilt. Reads as a passport stamp on a rally card.",
    Component: Variant2StampedFrame,
  },
  {
    number: 3,
    title: "Paper card on red",
    description: "Kraft panel with hard-offset shadow, tilted -1°. Strongest contrast of the six.",
    Component: Variant3PaperCard,
  },
  {
    number: 4,
    title: "Eyebrow tag + plain line",
    description:
      "Rotating eyebrow above (route name + days) signals the change; line below stays in current treatment. Subtlest.",
    Component: Variant4EyebrowTag,
  },
  {
    number: 5,
    title: "Left rule + dots",
    description:
      "Vertical paper rule on the left + small pagination dots below. Quietest 'this rotates' affordance.",
    Component: Variant5RuleAndDots,
  },
  {
    number: 6,
    title: "Torn-paper strip",
    description:
      "Kraft strip torn out of the red zone, ink text. Reuses the TornEdge vocabulary at strip scale.",
    Component: Variant6TornStrip,
  },
  {
    number: 7,
    title: "Rugged ink stamp · edge 1",
    description:
      "Ink-filled silhouette with chipped edges (sticker-edge variant 1), tilt -1.5°, paper text. The black-bg idea with a stamped, irregular outline rather than a clean rectangle.",
    Component: (props) => <Variant7RuggedInkStamp {...props} edge={1} />,
  },
  {
    number: 8,
    title: "Rugged ink stamp · edge 2",
    description: "Same hybrid, sticker-edge variant 2 — slightly different chip pattern.",
    Component: (props) => <Variant7RuggedInkStamp {...props} edge={2} />,
  },
  {
    number: 9,
    title: "Rugged ink stamp · edge 3",
    description: "Same hybrid, sticker-edge variant 3 — third silhouette for comparison.",
    Component: (props) => <Variant7RuggedInkStamp {...props} edge={3} />,
  },
];

/**
 * /[locale]/dev/manifesto — visual showcase of the six rotating-manifesto
 * container prototypes. Each renders inside a real RedZone so contrast,
 * texture overlays, and motion match the home hero context.
 *
 * Excluded from sitemap and robots.txt via metadata.
 */
export default async function ManifestoDevPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  const variants = VARIANTS[locale];

  return (
    <main>
      {SHOWCASE.map(({ number, title, description, Component }) => (
        <RedZone key={number} density="default" className="py-16 md:py-20">
          <Container>
            <div className="text-paper mb-6 max-w-prose space-y-2">
              <Eyebrow>Variant {number}</Eyebrow>
              <DisplayHeading size="lg" as="h2">
                {title}
              </DisplayHeading>
              <p className="text-paper/80 text-sm leading-relaxed">{description}</p>
            </div>
            {/* Mimic Hero column width and rhythm so the prototype reads
                in the same visual context as the live home page. */}
            <div className="max-w-[640px] space-y-6">
              <Component variants={variants} />
            </div>
          </Container>
        </RedZone>
      ))}
    </main>
  );
}
