import Image from "next/image";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Button, Container, DisplayHeading, Eyebrow, Stamp } from "@/components/primitives";
import { PaperZone, RedZone } from "@/components/surfaces";
import { buildWhatsAppLink } from "@/lib/contact/whatsappLink";
import { listJournalEntries, type JournalEntry } from "@/lib/content/getJournalMdx";
import {
  localizeWorkshopImage,
  listWorkshopCases,
  type WorkshopCase,
  type WorkshopCaseImage,
} from "@/lib/content/workshopCases";
import { isLocale, type Locale, locales } from "@/lib/i18n/config";
import { Link as I18nLink } from "@/lib/i18n/navigation";
import { localeAlternates } from "@/lib/seo/metadata";
import { SITE_NAME, getSiteUrl } from "@/lib/seo/site";

export const revalidate = 600;

type Props = {
  params: Promise<{ locale: string }>;
};

type WorkshopStat = {
  value: string;
  label: string;
};

type ProcessItem = {
  title: string;
  body: string;
};

const TALLER_HERO_PHOTO: WorkshopCaseImage = {
  src: "/images/optimized/heroes/taller-de-rutas.jpg",
  alt: "Dos pilotos detenidos junto a un cartel de desvío durante una exploración de ruta.",
  label: "Horas de exploración",
  caption: "Cada desvío se prueba antes de entrar a un itinerario.",
};

const TALLER_ROUTE_PHOTOS: WorkshopCaseImage[] = [
  {
    src: "/images/taller_de_rutas/drive-download-20260704T224229Z-3-001/DSC04248.jpg",
    alt: "Pilotos y motos detenidos junto a una construcción rural durante una prueba de ruta.",
    label: "Salida de prueba",
    caption: "Cada recorrido empieza con kilómetros reales, no con una línea dibujada.",
  },
  {
    src: "/images/taller_de_rutas/drive-download-20260704T224229Z-3-001/DSC04356.jpg",
    alt: "Motos y carpas junto a un lago durante una exploración de ruta.",
    label: "Noche medida",
    caption: "Probamos dónde conviene cortar el día y cómo responde el grupo.",
  },
  {
    src: "/images/taller_de_rutas/drive-download-20260704T224229Z-3-001/DSC04474.jpg",
    alt: "Formaciones rocosas altas en una quebrada recorrida durante el armado de ruta.",
    label: "Terreno elegido",
    caption: "El paisaje entra al tour cuando la logística también cierra.",
  },
  {
    src: "/images/taller_de_rutas/drive-download-20260704T224229Z-3-001/DSC04536.jpg",
    alt: "Pilotos junto a motos cargadas en un camino de ripio de montaña.",
    label: "Ritmo real",
    caption: "Medimos paradas, tiempos y dificultad con motos cargadas.",
  },
  {
    src: "/images/taller_de_rutas/drive-download-20260704T224229Z-3-001/DSC04649.jpg",
    alt: "Piloto en moto pasando un cartel naranja en un camino de montaña.",
    label: "Camino revisado",
    caption: "Volvemos al terreno hasta saber qué tramo aguanta.",
  },
  {
    src: "/images/taller_de_rutas/drive-download-20260704T224229Z-3-001/WhatsApp Image 2026-05-21 at 09.47.11 (2).jpeg",
    alt: "Piloto cruzando agua sobre una moto durante un testeo de ruta.",
    label: "Cruce probado",
    caption: "Hay horas de testeo antes de abrir cupos.",
  },
  {
    src: "/images/taller_de_rutas/drive-download-20260704T224229Z-3-001/WhatsApp Image 2026-05-21 at 09.47.17 (1).jpeg",
    alt: "Moto avanzando por barro y nieve durante una exploración de montaña.",
    label: "Barro y nieve",
    caption: "El mapa no cuenta cómo cambia el terreno bajo la rueda.",
  },
  {
    src: "/images/taller_de_rutas/drive-download-20260704T224229Z-3-001/WhatsApp Image 2026-05-27 at 11.09.17.jpeg",
    alt: "Piloto en moto atravesando una ladera nevada en alta montaña.",
    label: "Altura testeada",
    caption: "Probamos dificultad real, no dificultad imaginada.",
  },
  {
    src: "/images/taller_de_rutas/drive-download-20260704T224229Z-3-001/WhatsApp Image 2026-05-27 at 11.09.18 (2).jpeg",
    alt: "Valle de alta montaña con nieve durante una exploración de ruta.",
    label: "Ventana de clima",
    caption: "Las estaciones cambian el viaje; por eso volvemos.",
    objectPosition: "center 72%",
  },
  {
    src: "/images/taller_de_rutas/drive-download-20260704T224229Z-3-001/caida 1.png",
    alt: "Moto caída en un camino nevado durante una prueba de condiciones reales.",
    label: "Condición real",
    caption: "También medimos dónde el viaje deja de sumar y empieza a romper el ritmo.",
  },
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: "journal_index" });
  const site = getSiteUrl();
  const url = `${site}/${locale}/taller-de-rutas`;
  const title = `${t("title")} | ${SITE_NAME}`;
  const description = t("metadata_description");

  const pathByLocale = Object.fromEntries(
    locales.map((loc) => [loc, "/taller-de-rutas"]),
  ) as Record<Locale, string>;

  return {
    title,
    description,
    alternates: { canonical: url, ...localeAlternates({ pathByLocale }) },
    openGraph: { type: "website", title, description, url, siteName: SITE_NAME },
  };
}

export default async function TallerDeRutasIndex({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const [t, tWhatsApp, tCommon, entries] = await Promise.all([
    getTranslations({ locale, namespace: "journal_index" }),
    getTranslations({ locale, namespace: "whatsapp" }),
    getTranslations({ locale, namespace: "common" }),
    listJournalEntries(locale),
  ]);
  const tGrid = await getTranslations({ locale, namespace: "journal_grid" });

  const proofItems = t.raw("proof_items") as string[];
  const stats = t.raw("stats") as WorkshopStat[];
  const processItems = t.raw("process_items") as ProcessItem[];
  const storyCases = listWorkshopCases(
    entries.map((entry) => entry.slug),
    locale,
  );
  const routePhotos = TALLER_ROUTE_PHOTOS.map((image) => localizeWorkshopImage(image, locale));
  const processPhotos = routePhotos.slice(0, 4);
  const proofPhotos = routePhotos.slice(4);
  const proofImage = proofPhotos[1] ?? proofPhotos[0];
  const proofGalleryPhotos = proofPhotos.filter((image) => image.src !== proofImage?.src);
  const whatsAppHref = buildWhatsAppLink({ message: tWhatsApp("default_message") });
  const heroPhoto = localizeWorkshopImage(TALLER_HERO_PHOTO, locale);

  return (
    <>
      <RouteWorkshopHero
        locale={locale}
        eyebrow={t("eyebrow")}
        headline={t("headline")}
        intro={t("intro")}
        image={heroPhoto}
        whatsAppHref={whatsAppHref}
        whatsAppLabel={tWhatsApp("label")}
        reserveLabel={tCommon("reserve_spot")}
      />

      <PaperZone density="light" tornBottom={1}>
        <WorkshopProcessSheet
          eyebrow={t("process_eyebrow")}
          heading={t("process_heading")}
          intro={t("how_we_test_copy")}
          stats={stats}
          processItems={processItems}
          photos={processPhotos}
        />
      </PaperZone>

      <RedZone density="default" tornBottom={3}>
        <WorkshopStoryWall
          entries={entries}
          cases={storyCases}
          eyebrow={t("stories_eyebrow")}
          heading={t("stories_heading")}
          storyBody={t("story_wall_body")}
          readMoreLabel={tGrid("read_more")}
          emptyMessage={t("empty")}
          genericWorkshopLabel={t("generic_workshop_label")}
        />
      </RedZone>

      <PaperZone density="default">
        <WorkshopProofBand
          eyebrow={t("proof_eyebrow")}
          heading={t("proof_heading")}
          body={t("proof_body")}
          proofBandTitle={t("proof_band_title")}
          proofBandBody={t("proof_band_body")}
          proofItems={proofItems}
          proofImage={proofImage}
          gallery={proofGalleryPhotos}
        />
      </PaperZone>
    </>
  );
}

function RouteWorkshopHero({
  locale,
  eyebrow,
  headline,
  intro,
  image,
  whatsAppHref,
  whatsAppLabel,
  reserveLabel,
}: {
  locale: Locale;
  eyebrow: string;
  headline: string;
  intro: string;
  image: WorkshopCaseImage;
  whatsAppHref: string;
  whatsAppLabel: string;
  reserveLabel: string;
}) {
  return (
    <RedZone density="heavy" tornBottom={2} className="min-h-[100svh] overflow-hidden !py-0">
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 z-0 h-full w-full object-cover object-[58%_center]"
      />
      <div className="from-brand-red/[0.76] via-brand-red/[0.28] pointer-events-none absolute inset-0 z-[3] bg-gradient-to-r to-transparent mix-blend-multiply" />
      <div className="from-ink/[0.34] via-ink/[0.10] pointer-events-none absolute inset-0 z-[3] bg-gradient-to-r to-transparent mix-blend-multiply" />
      <div className="from-ink/[0.24] via-ink/[0.07] pointer-events-none absolute inset-x-0 bottom-0 z-[4] h-2/5 bg-gradient-to-t to-transparent [mask-image:linear-gradient(to_right,rgb(31_20_14)_0%,rgb(31_20_14)_46%,transparent_78%)]" />
      <div
        className="pointer-events-none absolute inset-0 z-[5] [background-image:linear-gradient(to_right,rgb(168_52_42/.82)_0%,rgb(168_52_42/.24)_45%,transparent_78%),url('/textures/red-grunge.svg')] [background-size:100%_100%,320px_320px] opacity-[0.10] mix-blend-multiply"
        aria-hidden="true"
      />

      <Container className="relative z-10 flex min-h-[100svh] items-center pt-32 pb-24 md:pt-40 md:pb-28">
        <div className="max-w-[52rem] space-y-6">
          <Eyebrow>{eyebrow}</Eyebrow>
          <DisplayHeading size="xl" as="h1" className="max-w-[18ch] leading-[0.9]">
            {headline}
          </DisplayHeading>
          <p className="text-on-red max-w-2xl font-sans text-xl leading-relaxed whitespace-pre-line md:text-2xl">
            {intro}
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Button href={whatsAppHref} external variant="sticker-filled" edge={1} tilt="left">
              {whatsAppLabel}
            </Button>
            <Button href={`/${locale}/reservas`} edge={2} tilt="right">
              {reserveLabel}
            </Button>
          </div>
          <Stamp tilt={2} className="text-paper">
            {image.label}
          </Stamp>
        </div>
      </Container>
    </RedZone>
  );
}

function WorkshopProcessSheet({
  eyebrow,
  heading,
  intro,
  stats,
  processItems,
  photos,
}: {
  eyebrow: string;
  heading: string;
  intro: string;
  stats: WorkshopStat[];
  processItems: ProcessItem[];
  photos: WorkshopCaseImage[];
}) {
  return (
    <Container className="space-y-10">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.82fr)_minmax(320px,0.58fr)] lg:items-end">
        <div className="space-y-3">
          <Eyebrow rule>{eyebrow}</Eyebrow>
          <DisplayHeading size="xl" as="h2" className="max-w-[16ch]">
            {heading}
          </DisplayHeading>
        </div>
        <p className="max-w-prose font-sans text-lg leading-relaxed whitespace-pre-line opacity-85">
          {intro}
        </p>
      </div>

      <dl className="border-ink/25 grid border-2 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={`${stat.value}-${stat.label}`}
            className="border-ink/25 flex min-h-28 items-center gap-4 border-b px-5 py-5 last:border-b-0 sm:border-r lg:border-b-0 lg:px-6 lg:last:border-r-0 sm:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r"
          >
            <WorkshopStatIcon index={index} className="text-accent-on-paper h-9 w-9 shrink-0" />
            <div>
              <dt className="font-display text-accent-on-paper text-4xl leading-none uppercase">
                {stat.value}
              </dt>
              <dd className="tracking-eyebrow mt-2 font-sans text-[0.65rem] leading-tight font-black uppercase opacity-75">
                {stat.label}
              </dd>
            </div>
          </div>
        ))}
      </dl>

      <ol
        className="border-ink/25 grid border-2 md:grid-cols-2 xl:grid-cols-4"
        data-whatsapp-fab="hide"
      >
        {processItems.map((item, index) => {
          const image = photos[index % photos.length];

          return (
            <li
              key={item.title}
              className="border-ink/25 min-h-full border-b p-5 last:border-b-0 md:border-r xl:border-b-0 xl:last:border-r-0 md:[&:nth-child(2n)]:border-r-0 xl:[&:nth-child(2n)]:border-r"
            >
              <div className="flex h-full flex-col">
                <p className="font-display text-accent-on-paper text-3xl leading-none uppercase">
                  {String(index + 1)}. {item.title}
                </p>
                {image ? (
                  <WorkshopPhoto
                    image={image}
                    label={image.label}
                    sizes="(min-width: 1280px) 23vw, (min-width: 768px) 46vw, 92vw"
                    aspectClassName="aspect-[16/9]"
                    className="mt-5"
                    compact
                    showLabel={false}
                    showCaption={false}
                  />
                ) : null}
                <p className="mt-5 font-sans text-sm leading-relaxed opacity-85">{item.body}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </Container>
  );
}

function WorkshopProofBand({
  eyebrow,
  heading,
  body,
  proofBandTitle,
  proofBandBody,
  proofItems,
  proofImage,
  gallery,
}: {
  eyebrow: string;
  heading: string;
  body: string;
  proofBandTitle: string;
  proofBandBody: string;
  proofItems: string[];
  proofImage?: WorkshopCaseImage;
  gallery: WorkshopCaseImage[];
}) {
  return (
    <Container>
      <div className="space-y-10">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.76fr)_minmax(360px,1fr)] lg:items-end">
          <div className="space-y-3">
            <Eyebrow rule>{eyebrow}</Eyebrow>
            <DisplayHeading size="xl" as="h2" className="max-w-[10ch]">
              {heading}
            </DisplayHeading>
          </div>
          <p className="max-w-prose font-sans text-base leading-relaxed opacity-85 md:text-lg lg:justify-self-end">
            {body}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(240px,0.46fr)_minmax(0,1.34fr)] lg:items-start xl:grid-cols-[minmax(260px,0.42fr)_minmax(0,1.58fr)]">
          <div className="space-y-5">
            <ul className="border-ink/25 bg-paper-light/35 space-y-4 border-2 p-5 md:p-6">
              {proofItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckTickIcon className="text-accent-on-paper mt-1.5 h-5 w-5 shrink-0" />
                  <span className="font-sans text-sm leading-relaxed md:text-base">{item}</span>
                </li>
              ))}
            </ul>
            <div className="border-ink/25 bg-paper-light/35 border-2 p-5 md:p-6">
              <div className="flex items-start gap-4">
                <WorkshopStatIcon index={4} className="text-accent-on-paper h-10 w-10 shrink-0" />
                <p className="font-display text-accent-on-paper text-xl leading-none uppercase">
                  {proofBandTitle}
                </p>
              </div>
              <p className="mt-4 font-sans text-sm leading-relaxed opacity-80">{proofBandBody}</p>
            </div>
          </div>

          <div className="space-y-5">
            {proofImage ? (
              <WorkshopPhoto
                image={proofImage}
                label={proofImage.label}
                sizes="(min-width: 1024px) 54vw, 92vw"
                aspectClassName="aspect-[16/9]"
                className="lg:rotate-1"
                showCaption={false}
              />
            ) : null}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {gallery.slice(0, 4).map((image, index) => (
                <WorkshopPhoto
                  key={image.src}
                  image={image}
                  label={image.label}
                  sizes="(min-width: 1024px) 26vw, 46vw"
                  aspectClassName="aspect-[4/3]"
                  className={index % 2 === 0 ? "lg:-rotate-1" : "lg:rotate-1"}
                  compact
                  showCaption={false}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

function CheckTickIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={className} fill="none">
      <path
        d="M4 12.8 9.2 18 20 5.5"
        stroke="currentColor"
        strokeLinecap="square"
        strokeLinejoin="miter"
        strokeWidth="3.5"
      />
    </svg>
  );
}

function WorkshopStatIcon({ index, className = "" }: { index: number; className?: string }) {
  const kind = index % 5;

  if (kind === 1) {
    return (
      <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <path
          d="M8 34C16 18 28 38 40 14"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="square"
        />
        <circle cx="8" cy="34" r="4" stroke="currentColor" strokeWidth="3" />
        <circle cx="24" cy="28" r="4" stroke="currentColor" strokeWidth="3" />
        <circle cx="40" cy="14" r="4" stroke="currentColor" strokeWidth="3" />
      </svg>
    );
  }

  if (kind === 2) {
    return (
      <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <path d="M12 10v28" stroke="currentColor" strokeWidth="4" />
        <path
          d="M12 12h22l-5 7 5 7H12V12Z"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (kind === 3) {
    return (
      <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <path
          d="m34 8 6 6-20 20-8 2 2-8L34 8Z"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path d="m29 13 6 6" stroke="currentColor" strokeWidth="4" />
      </svg>
    );
  }

  if (kind === 4) {
    return (
      <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="4" />
        <path d="m16 16 16 16M32 16 16 32" stroke="currentColor" strokeWidth="4" />
      </svg>
    );
  }

  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="4" />
      <path d="M24 8v6M24 34v6M8 24h6M34 24h6" stroke="currentColor" strokeWidth="4" />
      <path d="m18 31 7-15 5 7-12 8Z" fill="currentColor" />
    </svg>
  );
}

function WorkshopStoryWall({
  entries,
  cases,
  eyebrow,
  heading,
  storyBody,
  readMoreLabel,
  emptyMessage,
  genericWorkshopLabel,
}: {
  entries: JournalEntry[];
  cases: WorkshopCase[];
  eyebrow: string;
  heading: string;
  storyBody: string;
  readMoreLabel: string;
  emptyMessage: string;
  genericWorkshopLabel: string;
}) {
  const caseBySlug = new Map(cases.map((item) => [item.slug, item]));

  return (
    <Container className="space-y-10">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(280px,0.45fr)] lg:items-end">
        <div className="space-y-3">
          <Eyebrow rule>{eyebrow}</Eyebrow>
          <DisplayHeading size="xl" as="h2" className="max-w-[10ch]">
            {heading}
          </DisplayHeading>
        </div>
        <p className="max-w-prose font-sans text-sm leading-relaxed opacity-75 lg:text-base">
          {storyBody}
        </p>
      </div>

      {entries.length === 0 ? (
        <p className="font-sans text-sm opacity-70">{emptyMessage}</p>
      ) : (
        <ul
          className="grid items-start gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8"
          data-whatsapp-fab="hide"
        >
          {entries.map((entry, index) => {
            const item = caseBySlug.get(entry.slug);
            const image = item?.hero ?? {
              src: entry.image ?? "/images/halftone/hero-rider-cutout.png",
              alt: entry.imageAlt ?? entry.title,
              label: entry.title,
              caption: entry.excerpt,
            };
            return (
              <li key={entry.slug}>
                <I18nLink
                  href={`/taller-de-rutas/${entry.slug}`}
                  className="bg-paper-light text-on-paper shadow-sticker-ink group hover:shadow-sticker-red block border-2 border-current transition-[box-shadow,transform] duration-200 hover:-translate-y-1"
                >
                  <div className="relative aspect-[4/3] overflow-hidden border-b-2 border-current">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(min-width: 1024px) 22vw, (min-width: 768px) 46vw, 92vw"
                      draggable={false}
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                    {item ? (
                      <div className="absolute top-4 left-4 z-[2]">
                        <Stamp tilt={index % 2 === 0 ? -2 : 2}>{item.region}</Stamp>
                      </div>
                    ) : null}
                  </div>
                  <div className="space-y-4 p-5 md:p-6 xl:p-7">
                    <p className="text-eyebrow tracking-eyebrow text-accent-on-paper font-bold uppercase">
                      {item ? item.routeName : genericWorkshopLabel}
                    </p>
                    <DisplayHeading
                      size="md"
                      as="h3"
                      distress={false}
                      className="text-accent-on-paper line-clamp-3"
                    >
                      {entry.title}
                    </DisplayHeading>
                    {entry.excerpt ? (
                      <p className="line-clamp-4 font-sans text-base leading-7 opacity-80">
                        {entry.excerpt}
                      </p>
                    ) : null}
                    {item ? (
                      <dl className="border-ink/20 grid grid-cols-2 gap-5 border-t pt-5">
                        {item.stats.slice(0, 2).map((stat) => (
                          <div key={`${entry.slug}-${stat.value}-${stat.label}`}>
                            <dt className="tracking-eyebrow font-sans text-[0.58rem] leading-tight font-black uppercase opacity-65">
                              {stat.label}
                            </dt>
                            <dd className="font-display text-accent-on-paper mt-1 text-2xl leading-none">
                              {stat.value}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    ) : null}
                    <p className="text-eyebrow tracking-eyebrow pt-2 font-semibold uppercase underline-offset-4 group-hover:underline">
                      {readMoreLabel} →
                    </p>
                  </div>
                </I18nLink>
              </li>
            );
          })}
        </ul>
      )}
    </Container>
  );
}

function WorkshopPhoto({
  image,
  label,
  priority = false,
  sizes,
  aspectClassName,
  className = "",
  compact = false,
  showLabel = true,
  showCaption = true,
}: {
  image: WorkshopCaseImage;
  label: string;
  priority?: boolean;
  sizes: string;
  aspectClassName: string;
  className?: string;
  compact?: boolean;
  showLabel?: boolean;
  showCaption?: boolean;
}) {
  return (
    <figure className={`group/photo ${className}`}>
      <div
        className={`bg-paper-grain shadow-sticker-ink border-ink/70 relative overflow-hidden border-2 ${aspectClassName}`}
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          priority={priority}
          draggable={false}
          style={image.objectPosition ? { objectPosition: image.objectPosition } : undefined}
          className="object-cover transition-[filter,transform] duration-300 group-hover/photo:scale-[1.02] group-hover/photo:brightness-105"
        />
        {showLabel ? (
          <div className="absolute top-4 left-4 z-[2]">
            <span className="bg-paper-light font-display text-accent-on-paper inline-block border-2 border-current px-3 py-1.5 text-xs tracking-[var(--tracking-cta)] uppercase">
              {label}
            </span>
          </div>
        ) : null}
      </div>
      {showCaption ? (
        <figcaption
          className={`mt-3 max-w-prose font-sans leading-relaxed opacity-75 ${
            compact ? "text-xs" : "text-sm"
          }`}
        >
          {image.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
