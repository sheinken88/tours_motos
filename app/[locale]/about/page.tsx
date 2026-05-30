import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Button,
  Container,
  DisplayHeading,
  Eyebrow,
  Stamp,
  TourCard,
  XIcon,
} from "@/components/primitives";
import { PaperZone, RedZone } from "@/components/surfaces";
import { buildWhatsAppLink } from "@/lib/contact/whatsappLink";
import { getPageFrontmatter } from "@/lib/content/getPageMdx";
import { getPageMdxComponent } from "@/lib/content/pageMdxRegistry";
import { isLocale, type Locale, locales } from "@/lib/i18n/config";
import { localeAlternates } from "@/lib/seo/metadata";
import { SITE_NAME, getSiteUrl } from "@/lib/seo/site";
import { getTours } from "@/lib/sheets/queries";
import { type Tour } from "@/lib/sheets/schemas";

export const revalidate = 600;

type Props = {
  params: Promise<{ locale: string }>;
};

const nosotrosImages = {
  group: "/images/nosotros/43-DSC01360.jpg",
  dunes: "/images/nosotros/428-DSC09893.jpg",
  riders: "/images/nosotros/20260331_120545.jpg",
  road: "/images/nosotros/20220905_150725.jpg",
  workshop: "/images/nosotros/20260402_180621.jpg",
} as const;

const routePrinciples = [
  "Diseñamos rutas ON/OFF que combinan asfalto, ripio y manejo real.",
  "Rodamos cada itinerario antes de venderlo: lo testeamos, lo ajustamos y volvemos a medirlo.",
  "Planificamos hoteles, paradas, horarios de manejo y tramos de descanso para que el viaje fluya.",
  "Armamos grupos chicos, con foco en la confianza, el ritmo y el equipo humano.",
];

const terrainList = [
  "Zonas volcánicas y desiertos de altura.",
  "Bosques con lagos, montañas nevadas y yungas cerradas.",
  "Catamarca, Carretera Austral, Patagonia y el norte argentino.",
];

const commitmentTestimonials = [
  {
    quote:
      "La ruta en moto hasta El Balcón del Pissis fue lo más impactante que he visto en mi vida. La vista del volcán a 4.500 metros fue mágica.",
    rider: "Martín Gonzalez",
    meta: "Volcanes del Norte · Balcón del Pissis",
    tilt: -1.5,
  },
  {
    quote:
      "El grupo que se formó en esos 7 días fue espectacular, ya hicimos 2 asados desde que volvimos.",
    rider: "Juan Carrera",
    meta: "Volcanes del Norte · 7 días de ruta",
    tilt: 1.25,
  },
  {
    quote:
      "El Campo de Piedra Pómez fue como estar en otro planeta. Cada día fue una sorpresa. Nunca pensé que existían lugares así.",
    rider: "Lucas Taccone",
    meta: "Volcanes del Norte · Campo de Piedra Pómez",
    tilt: -1,
  },
] satisfies Array<{
  quote: string;
  rider: string;
  meta: string;
  tilt: number;
}>;

type AboutContactCtaProps = {
  eyebrow: string;
  heading: string;
  body: string;
  prompts: string[];
  primaryLabel: string;
  secondaryLabel: string;
  promptHeading: string;
  promptMeta: string;
  whatsAppHref: string;
  contactHref: string;
};

function PosterPhoto({
  src,
  alt,
  className = "",
  sizes,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes: string;
}) {
  return (
    <div
      className={`bg-paper-aged border-ink/25 group/photo relative isolate overflow-hidden border-2 ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover opacity-90 mix-blend-multiply contrast-125 grayscale saturate-0"
      />
      <Image
        src={src}
        alt=""
        aria-hidden="true"
        fill
        sizes={sizes}
        className="object-cover opacity-0 transition-opacity duration-300 ease-out group-hover/photo:opacity-100"
      />
      <div className="bg-brand-red pointer-events-none absolute inset-0 opacity-15 mix-blend-multiply" />
      <div
        className="pointer-events-none absolute inset-0 opacity-25 mix-blend-multiply"
        style={{
          backgroundImage: "url(/textures/halftone-overlay.svg)",
          backgroundRepeat: "repeat",
        }}
        aria-hidden="true"
      />
    </div>
  );
}

function AboutContactCta({
  eyebrow,
  heading,
  body,
  prompts,
  primaryLabel,
  secondaryLabel,
  promptHeading,
  promptMeta,
  whatsAppHref,
  contactHref,
}: AboutContactCtaProps) {
  return (
    <PaperZone density="light">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1fr_0.82fr] lg:items-start">
          <div className="flex flex-col items-start justify-between gap-8">
            <div className="space-y-4">
              <Eyebrow rule>{eyebrow}</Eyebrow>
              <DisplayHeading size="lg" as="h2">
                {heading}
              </DisplayHeading>
              <p className="max-w-2xl font-sans text-lg leading-relaxed">{body}</p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Button href={whatsAppHref} edge={1} tilt="left" variant="sticker-filled" external>
                {primaryLabel}
              </Button>
              <Button href={contactHref} edge={3} tilt="right" variant="sticker-outline">
                {secondaryLabel}
              </Button>
            </div>
          </div>

          <div className="border-ink border-2">
            <div className="border-ink bg-brand-red text-on-red flex flex-wrap items-end justify-between gap-3 border-b-2 px-5 py-4">
              <p className="font-display text-3xl leading-none uppercase md:text-4xl">
                {promptHeading}
              </p>
              <span className="font-sans text-xs leading-none font-semibold tracking-[var(--tracking-uppercase)] uppercase opacity-80">
                {promptMeta}
              </span>
            </div>
            <ul className="grid gap-0 font-sans text-base leading-relaxed">
              {prompts.map((item) => (
                <li
                  key={item}
                  className="border-ink/35 flex items-start gap-3 border-b-2 p-4 last:border-b-0 md:p-5"
                >
                  <XIcon className="text-accent-on-paper mt-1 h-4 w-4 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </PaperZone>
  );
}

function ProofStamp({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-r-2 border-current px-4 py-3 text-current last:border-r-0">
      <p className="font-display text-4xl leading-none uppercase md:text-5xl">{value}</p>
      <p className="mt-1 font-sans text-xs leading-tight font-semibold tracking-[var(--tracking-uppercase)] uppercase opacity-80">
        {label}
      </p>
    </div>
  );
}

function CommitmentTestimonialCard({
  quote,
  rider,
  meta,
  tilt,
}: (typeof commitmentTestimonials)[number]) {
  return (
    <article
      data-zone="paper"
      className="bg-paper-grain text-on-paper shadow-sticker-red relative isolate flex h-full overflow-hidden p-8 md:p-10"
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      <div className="bg-brand-red absolute inset-x-0 top-0 h-2" aria-hidden="true" />
      <div
        className="border-brand-red/35 pointer-events-none absolute inset-4 border-2"
        aria-hidden="true"
      />
      <figure className="flex h-full flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <span
            aria-hidden="true"
            className="font-display text-accent-on-paper -mt-5 text-7xl leading-none opacity-30 select-none"
          >
            “
          </span>
          <Stamp tilt={tilt > 0 ? -2 : 2} className="text-accent-on-paper shrink-0">
            Volcanes
          </Stamp>
        </div>
        <blockquote className="font-sans text-lg leading-relaxed md:text-xl">{quote}</blockquote>
        <figcaption className="border-brand-red/35 mt-auto border-t-2 pt-4 font-sans">
          <p className="text-eyebrow tracking-eyebrow font-semibold uppercase">{rider}</p>
          <p className="mt-1 text-sm leading-relaxed opacity-70">{meta}</p>
        </figcaption>
      </figure>
    </article>
  );
}

function AboutRouteCards({ tours, locale }: { tours: Tour[]; locale: Locale }) {
  const visible = tours.slice(0, 4);
  if (visible.length === 0) return null;

  return (
    <div className="border-paper/25 space-y-8 border-t-2 border-dashed pt-12">
      <div className="grid gap-5 lg:grid-cols-[0.7fr_1fr] lg:items-end">
        <div className="space-y-3">
          <Eyebrow rule>Rutas probadas</Eyebrow>
          <DisplayHeading size="xl" as="h2">
            ELEGÍ LO QUE VAS A CRUZAR
          </DisplayHeading>
        </div>
        <p className="text-muted-on-red max-w-3xl font-sans text-lg leading-relaxed">
          Salta y Jujuy, Mendoza a La Rioja, Catamarca o Patagonia. Cuatro rutas rodadas antes de
          ponerles nombre.
        </p>
      </div>
      <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {visible.map((tour, index) => (
          <li key={tour.slug}>
            <TourCard tour={tour} locale={locale} index={index} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: "about" });
  const fm = await getPageFrontmatter("about", locale);
  const site = getSiteUrl();
  const url = `${site}/${locale}/about`;
  const title = `${t("title")} | ${SITE_NAME}`;
  const description = fm?.description ?? t("metadata_description");

  const pathByLocale = Object.fromEntries(locales.map((loc) => [loc, "/about"])) as Record<
    Locale,
    string
  >;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      ...localeAlternates({ pathByLocale }),
    },
    openGraph: {
      type: "website",
      title,
      description,
      url,
      siteName: SITE_NAME,
    },
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const [t, tWhatsApp, tCommon, MdxBody, tours] = await Promise.all([
    getTranslations({ locale, namespace: "about" }),
    getTranslations({ locale, namespace: "whatsapp" }),
    getTranslations({ locale, namespace: "common" }),
    getPageMdxComponent("about", locale),
    getTours(locale),
  ]);

  const whatsAppHref = buildWhatsAppLink({ message: tWhatsApp("default_message") });
  const contactHref = `/${locale}/contact`;
  const ctaPrompts = t.raw("cta_prompts") as string[];

  if (locale !== "es") {
    return (
      <>
        <RedZone density="heavy" tornBottom={1}>
          <Container className="space-y-6">
            <Eyebrow>{t("eyebrow")}</Eyebrow>
            <DisplayHeading size="2xl" as="h1">
              {t("headline")}
            </DisplayHeading>
            <p className="max-w-prose font-sans text-lg leading-relaxed">{t("subheadline")}</p>
          </Container>
        </RedZone>

        <PaperZone density="default" tornBottom={2}>
          <Container width="narrow">
            <div className="mb-12 space-y-3">
              <Eyebrow rule>{t("founder_eyebrow")}</Eyebrow>
              <DisplayHeading size="lg" as="h2">
                {t("founder_name")}
              </DisplayHeading>
              <p className="font-sans text-sm opacity-80">{t("founder_caption")}</p>
            </div>
            {MdxBody ? (
              <article className="prose-tour">
                <MdxBody />
              </article>
            ) : null}
          </Container>
        </PaperZone>

        <RedZone density="default" tornBottom={3}>
          <Container className="space-y-5">
            <Eyebrow rule>{t("eyebrow")}</Eyebrow>
            <DisplayHeading size="xl" as="h2">
              ON THE ADVENTURE. OFF THE MAP.
            </DisplayHeading>
          </Container>
        </RedZone>

        <AboutContactCta
          eyebrow={tCommon("talk_to_us")}
          heading={t("cta_heading")}
          body={t("cta_body")}
          prompts={ctaPrompts}
          primaryLabel={t("cta")}
          secondaryLabel={t("cta_secondary")}
          promptHeading={t("cta_prompt_heading")}
          promptMeta={t("cta_prompt_meta")}
          whatsAppHref={whatsAppHref}
          contactHref={contactHref}
        />
      </>
    );
  }

  return (
    <>
      <RedZone density="heavy" tornBottom={1} className="overflow-hidden">
        <Container>
          <div className="grid items-end gap-12 lg:grid-cols-[1fr_0.78fr]">
            <div className="space-y-6">
              <Eyebrow>{t("eyebrow")}</Eyebrow>
              <DisplayHeading size="2xl" as="h1">
                RUTAS QUE VAN MÁS ALLÁ DEL ASFALTO
              </DisplayHeading>
              <p className="max-w-3xl font-sans text-xl leading-relaxed md:text-2xl">
                Diseñamos experiencias de moto ON/OFF que te prueban en ruta, ripio y grupo. Cada
                kilómetro fue rodado antes, ajustado después y pensado para que vuelvas manejando
                distinto.
              </p>
            </div>
            <div className="relative min-h-80 lg:min-h-[34rem]">
              <PosterPhoto
                src={nosotrosImages.group}
                alt="Grupo de riders de Moto On/Off reunido durante una travesía"
                sizes="(min-width: 1024px) 38vw, 100vw"
                className="absolute inset-x-0 top-0 h-72 rotate-1 md:h-96 lg:h-[27rem]"
              />
              <div className="bg-paper text-accent-on-paper shadow-sticker-ink font-display absolute right-4 bottom-2 z-10 max-w-56 -rotate-2 border-2 border-current px-5 py-4 text-2xl leading-none uppercase md:right-10">
                ON the Adventure. OFF the Map.
              </div>
            </div>
          </div>
        </Container>
      </RedZone>

      <PaperZone density="default" tornBottom={2}>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1fr] lg:gap-16">
            <div className="space-y-8">
              <div className="space-y-4">
                <Eyebrow rule>Nosotros</Eyebrow>
                <DisplayHeading size="xl" as="h2">
                  ARMAMOS VIAJES QUE SE GANAN MANEJANDO
                </DisplayHeading>
              </div>
              <div className="space-y-5 font-sans text-lg leading-relaxed">
                <p>
                  Creamos tours en moto para riders de distintos niveles, siempre con enfoque
                  offroad. Desde expediciones por Catamarca hasta viajes por la Carretera Austral,
                  cada ruta tiene una razón para existir.
                </p>
                <p>
                  No repetimos moldes. Todas nuestras rutas son distintas entre sí: volcán,
                  desierto, bosque, lago, nieve, yunga. El terreno cambia. La exigencia también.
                </p>
              </div>
              <div className="border-ink text-ink grid max-w-2xl grid-cols-3 border-2">
                <ProofStamp value="+6" label="años rodando" />
                <ProofStamp value="ON/OFF" label="ruta y ripio" />
                <ProofStamp value="100%" label="rutas probadas" />
              </div>
            </div>
            <div className="grid min-h-[34rem] grid-cols-5 grid-rows-5 gap-4">
              <PosterPhoto
                src={nosotrosImages.dunes}
                alt="Riders cruzando una zona de dunas y cordillera"
                sizes="(min-width: 1024px) 38vw, 100vw"
                className="col-span-5 row-span-3 -rotate-1"
              />
              <PosterPhoto
                src={nosotrosImages.riders}
                alt="Motos de aventura avanzando por una ruta de ripio"
                sizes="(min-width: 1024px) 22vw, 55vw"
                className="col-span-3 row-span-2 rotate-1"
              />
              <PosterPhoto
                src={nosotrosImages.road}
                alt="Moto de aventura cargada en un camino de montaña"
                sizes="(min-width: 1024px) 16vw, 45vw"
                className="col-span-2 row-span-2 -rotate-1"
              />
            </div>
          </div>
        </Container>
      </PaperZone>

      <RedZone density="default" tornBottom={3}>
        <Container>
          <div className="grid gap-10 md:grid-cols-[0.72fr_1fr] md:items-center">
            <div className="space-y-3">
              <Eyebrow rule>Cómo lo hacemos</Eyebrow>
              <DisplayHeading size="xl" as="h2">
                DISEÑAMOS. RODAMOS. AJUSTAMOS.
              </DisplayHeading>
            </div>
            <ul className="grid gap-4 font-sans text-lg leading-relaxed md:grid-cols-2">
              {routePrinciples.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <XIcon className="mt-1 h-5 w-5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </RedZone>

      <PaperZone density="default" tornBottom={4}>
        <Container>
          <div className="space-y-8">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1fr] lg:items-end">
              <div className="space-y-5">
                <Eyebrow rule>Terreno humano</Eyebrow>
                <DisplayHeading size="xl" as="h2">
                  EL GRUPO TAMBIÉN ES PARTE DE LA RUTA
                </DisplayHeading>
              </div>
              <div className="space-y-6">
                <p className="max-w-3xl font-sans text-lg leading-relaxed">
                  Brindamos apoyo y organización para que la experiencia sea intensa, auténtica y
                  posible. Hacemos foco en el grupo humano porque el viaje no se sostiene solo con
                  kilómetros: se sostiene con confianza, ritmo compartido y gente que se anima a
                  cruzar.
                </p>
                <ul className="grid max-w-3xl gap-3 font-sans text-base leading-relaxed md:grid-cols-3">
                  {terrainList.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <XIcon className="text-accent-on-paper mt-1 h-4 w-4 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <PosterPhoto
              src={nosotrosImages.workshop}
              alt="Riders de Moto On/Off en una parada de ruta"
              sizes="(min-width: 1024px) 82vw, 100vw"
              className="mx-auto aspect-[3264/1504] max-w-6xl -rotate-1"
            />
          </div>
        </Container>
      </PaperZone>

      <RedZone density="default" tornBottom={1}>
        <Container className="space-y-12">
          <div className="grid gap-8 lg:grid-cols-[0.88fr_0.72fr] lg:items-end">
            <div className="space-y-5">
              <Eyebrow rule>Compromiso</Eyebrow>
              <DisplayHeading size="2xl" as="h2">
                MÁS ALLÁ DEL CAMINO
              </DisplayHeading>
            </div>
            <p className="max-w-3xl font-sans text-xl leading-relaxed md:text-2xl">
              Animamos a la gente a una experiencia que va más allá del camino. Más de 6 años de
              ruta respaldan nuestro compromiso.
            </p>
          </div>

          <div className="grid gap-7 md:grid-cols-3 md:items-stretch" aria-label="Testimonios">
            {commitmentTestimonials.map((testimonial) => (
              <CommitmentTestimonialCard key={testimonial.quote} {...testimonial} />
            ))}
          </div>
          <AboutRouteCards tours={tours} locale={locale} />
        </Container>
      </RedZone>

      <AboutContactCta
        eyebrow={tCommon("talk_to_us")}
        heading={t("cta_heading")}
        body={t("cta_body")}
        prompts={ctaPrompts}
        primaryLabel={t("cta")}
        secondaryLabel={t("cta_secondary")}
        promptHeading={t("cta_prompt_heading")}
        promptMeta={t("cta_prompt_meta")}
        whatsAppHref={whatsAppHref}
        contactHref={contactHref}
      />
    </>
  );
}
