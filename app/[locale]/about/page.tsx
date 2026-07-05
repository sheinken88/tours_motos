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
  galleryOne: "/images/nosotros/Galeria 1.jpg",
  galleryTwo: "/images/nosotros/Galeria 2.jpg",
  riders: "/images/nosotros/20260331_120545.jpg",
  road: "/images/nosotros/20220905_150725.jpg",
  workshop: "/images/nosotros/20260402_180621.jpg",
  camp: "/images/nosotros/WhatsApp Image 2026-04-15 at 17.06.08.jpeg",
} as const;

const aboutHeroBackground = {
  src: "/images/nosotros/Fondo de pantalla Nosotros.jpg",
  alt: "Equipo de Moto On/Off rodando una ruta de ripio en Argentina",
  objectPosition: "54% center",
} as const;

const nosotrosCarouselImages = [
  {
    src: "/images/nosotros/nosotros-caco/Imagen 1.jpg",
    alt: "Riders de Moto On/Off reunidos durante una salida en moto",
  },
  {
    src: "/images/nosotros/nosotros-caco/Imagen 2.jpg",
    alt: "Rider de Moto On/Off cruzando terreno de montaña",
  },
  {
    src: "/images/nosotros/nosotros-caco/Imagen 3.jpg",
    alt: "Grupo de motos de aventura en una ruta de ripio",
  },
  {
    src: "/images/nosotros/nosotros-caco/Imagen 4.jpg",
    alt: "Riders avanzando por una ruta abierta entre montañas",
  },
  {
    src: "/images/nosotros/nosotros-caco/Imagen 5.jpg",
    alt: "Moto de aventura detenida sobre un camino de ripio",
  },
] as const;

const routePrinciples = [
  "Cada kilómetro de nuestras rutas en moto fueron diseñadas previamente, testeadas y ajustadas para que vivas el viaje con libertad.",
  "Planificamos cada viaje en moto al detalle, desde los hoteles, las paradas y las horas de manejo.",
  "Brindamos apoyo y organización para que la experiencia sea intensa y auténtica.",
  "Hacemos especial foco en el grupo humano.",
];

const terrainList = [
  "Zonas volcánicas.",
  "Desiertos.",
  "Bosques con lagos.",
  "Montañas nevadas.",
  "Yungas cerradas.",
];

const commitmentTestimonials = [
  {
    quote:
      "La Mina La Mejicana fue el desafío más grande que hice en moto. El grupo siempre con buena onda. Muy bueno todo.",
    rider: "Diego Bianco",
    meta: "Mina La Mejicana",
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
      "El grupo que se formó en esos 7 días es increíble. Seguimos en contacto y ya estamos planeando el próximo tour.",
    rider: "Martin Pujol",
    meta: "7 días de ruta",
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

function AboutHero({ eyebrow, heading, body }: { eyebrow: string; heading: string; body: string }) {
  return (
    <RedZone density="heavy" tornBottom={1} className="min-h-[100svh] overflow-hidden !py-0">
      <Image
        src={aboutHeroBackground.src}
        alt={aboutHeroBackground.alt}
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 z-0 h-full w-full object-cover"
        style={{ objectPosition: aboutHeroBackground.objectPosition }}
      />
      <div className="from-brand-red/[0.70] via-brand-red/[0.24] pointer-events-none absolute inset-0 z-[3] bg-gradient-to-r to-transparent mix-blend-multiply" />
      <div className="from-ink/[0.30] via-ink/[0.08] pointer-events-none absolute inset-0 z-[3] bg-gradient-to-r to-transparent mix-blend-multiply" />
      <div className="from-ink/[0.24] via-ink/[0.07] pointer-events-none absolute inset-x-0 bottom-0 z-[4] h-2/5 bg-gradient-to-t to-transparent [mask-image:linear-gradient(to_right,black_0%,black_46%,transparent_78%)]" />
      <div className="from-ink/[0.16] pointer-events-none absolute inset-x-0 top-0 z-[4] h-48 bg-gradient-to-b to-transparent [mask-image:linear-gradient(to_right,black_0%,black_46%,transparent_78%)]" />
      <div
        className="from-ink via-ink/[0.28] pointer-events-none absolute inset-0 z-[5] bg-gradient-to-r to-transparent [mask-image:linear-gradient(to_right,black_0%,black_45%,transparent_78%)] opacity-10 mix-blend-multiply"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 z-[5] [background-image:linear-gradient(to_right,rgb(168_52_42/.82)_0%,rgb(168_52_42/.24)_45%,transparent_78%),url('/textures/red-grunge.svg')] [background-size:100%_100%,320px_320px] opacity-[0.08] mix-blend-multiply"
        aria-hidden="true"
      />

      <Container className="relative z-10 flex min-h-[100svh] items-center pt-32 pb-24 md:pt-40 md:pb-28">
        <div className="max-w-[52rem] space-y-6">
          <Eyebrow>{eyebrow}</Eyebrow>
          <DisplayHeading size="2xl" as="h1" className="max-w-[10ch] leading-[0.88]">
            {heading}
          </DisplayHeading>
          <p className="text-on-red max-w-2xl font-sans text-xl leading-relaxed whitespace-pre-line md:text-2xl">
            {body}
          </p>
        </div>
      </Container>
    </RedZone>
  );
}

function PosterPhoto({
  src,
  alt,
  className = "",
  sizes,
  treatment = "color",
}: {
  src: string;
  alt: string;
  className?: string;
  sizes: string;
  treatment?: "poster" | "color";
}) {
  const isColor = treatment === "color";

  return (
    <div
      className={`bg-paper-aged border-ink/25 group/photo relative isolate overflow-hidden border-2 ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className={
          isColor
            ? "object-cover opacity-95 contrast-110 saturate-110"
            : "object-cover opacity-90 mix-blend-multiply contrast-125 grayscale saturate-0"
        }
      />
      {!isColor ? (
        <Image
          src={src}
          alt=""
          aria-hidden="true"
          fill
          sizes={sizes}
          className="object-cover opacity-0 transition-opacity duration-300 ease-out group-hover/photo:opacity-100"
        />
      ) : null}
      <div
        className={`bg-brand-red pointer-events-none absolute inset-0 mix-blend-multiply ${
          isColor ? "opacity-5" : "opacity-15"
        }`}
      />
    </div>
  );
}

function NosotrosCarousel() {
  return (
    <section className="space-y-6" aria-label="Fotos de Moto On/Off">
      <Eyebrow rule>Fotos de ruta</Eyebrow>
      <div className="border-ink/25 -mx-5 overflow-x-auto border-y-2 py-5 sm:-mx-8 lg:mx-0">
        <div className="flex snap-x snap-mandatory gap-4 px-5 sm:px-8 lg:px-0">
          {nosotrosCarouselImages.map((image) => (
            <figure
              key={image.src}
              className="text-on-paper group/gallery-frame border-ink/60 bg-paper-aged shadow-sticker-ink hover:shadow-sticker-red relative aspect-[16/10] w-[86vw] shrink-0 snap-start overflow-hidden border-2 transition-[box-shadow,transform] duration-200 ease-out hover:-translate-y-1 sm:w-[42rem] lg:w-[48rem]"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 1024px) 760px, (min-width: 640px) 78vw, 92vw"
                draggable={false}
                className="object-cover object-center saturate-110 transition-transform duration-300 ease-out group-hover/gallery-frame:scale-[1.03]"
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
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
                  <CheckMark className="text-accent-on-paper mt-0.5 shrink-0" />
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

function CheckMark({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`font-display text-2xl leading-none text-current ${className}`}
    >
      ✓
    </span>
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
        <AboutHero eyebrow={t("eyebrow")} heading={t("headline")} body={t("subheadline")} />

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
      <AboutHero
        eyebrow={t("eyebrow")}
        heading="EL EQUIPO QUE ABRE LA HUELLA"
        body={`Somos el equipo que diseña, prueba y guía cada ruta.
No abrimos una salida hasta haberla recorrido, medido y ajustado el terreno.`}
      />

      <PaperZone density="default" tornBottom={2}>
        <Container className="space-y-12">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1fr] lg:gap-16">
            <div className="space-y-8">
              <div className="space-y-4">
                <Eyebrow rule>Nosotros</Eyebrow>
                <DisplayHeading size="xl" as="h2">
                  TOURS EN MOTO CON ENFOQUE OFFROAD
                </DisplayHeading>
              </div>
              <div className="space-y-5 font-sans text-lg leading-relaxed">
                <p>
                  Ofrecemos tours en moto para todo público con un enfoque Offroad, desde
                  expediciones por Catamarca hasta viajes en moto por la Carretera Austral.
                </p>
                <p>
                  Todos nuestros tours en moto son distintos entre sí. Diseñamos experiencias de
                  moto ON/OFF que combinan ruta, ripio y aventura.
                </p>
                <p>
                  Viajando en moto por zonas volcánicas, desiertos, bosques con lagos, montañas
                  nevadas o yungas cerradas.
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
                src={nosotrosImages.galleryOne}
                alt="Riders de Moto On/Off avanzando en una ruta de ripio"
                sizes="(min-width: 1024px) 38vw, 100vw"
                className="col-span-5 row-span-3 -rotate-1"
              />
              <PosterPhoto
                src={nosotrosImages.galleryTwo}
                alt="Grupo de riders de Moto On/Off durante una travesía"
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
                DISEÑADAS, TESTEADAS Y AJUSTADAS
              </DisplayHeading>
            </div>
            <ul className="grid gap-4 font-sans text-lg leading-relaxed md:grid-cols-2">
              {routePrinciples.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckMark className="mt-0.5 shrink-0" />
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
                  NO HACEMOS TOURS MASIVOS
                </DisplayHeading>
              </div>
              <div className="space-y-6">
                <p className="max-w-3xl font-sans text-lg leading-relaxed">
                  No hacemos tours masivos. En un viaje en moto la ruta importa, pero también
                  quiénes la comparten. Armamos grupos chicos para ayudarnos, acompañarnos y
                  disfrutar el camino como equipo. Porque una gran experiencia no la hace solamente
                  el paisaje.
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
              treatment="color"
            />
            <NosotrosCarousel />
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
              Invitamos a vivir una experiencia que va más allá del camino. Ganar confianza, sumar
              herramientas y volver del viaje siendo un mejor piloto.
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
