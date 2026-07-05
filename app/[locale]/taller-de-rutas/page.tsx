import Image from "next/image";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Button, Container, DisplayHeading, Eyebrow, Stamp } from "@/components/primitives";
import { PaperZone, RedZone } from "@/components/surfaces";
import { buildWhatsAppLink } from "@/lib/contact/whatsappLink";
import { listJournalEntries, type JournalEntry } from "@/lib/content/getJournalMdx";
import {
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

const HOW_WE_TEST_COPY =
  "No improvisamos rutas: las vivimos primero.\nNuestro equipo se embarra, prueba terrenos, ajusta tiempos y testea con pilotos de todos los niveles para que vos viajes con total libertad.";

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
  const storyCases = listWorkshopCases(entries.map((entry) => entry.slug));
  const processPhotos = TALLER_ROUTE_PHOTOS.slice(0, 4);
  const proofPhotos = TALLER_ROUTE_PHOTOS.slice(4);
  const proofImage = proofPhotos[1] ?? proofPhotos[0];
  const proofGalleryPhotos = proofPhotos.filter((image) => image.src !== proofImage?.src);
  const whatsAppHref = buildWhatsAppLink({ message: tWhatsApp("default_message") });

  return (
    <>
      <RouteWorkshopHero
        locale={locale}
        eyebrow={t("eyebrow")}
        headline={t("headline")}
        intro={t("intro")}
        whatsAppHref={whatsAppHref}
        whatsAppLabel={tWhatsApp("label")}
        reserveLabel={tCommon("reserve_spot")}
      />

      <PaperZone density="default" tornBottom={1}>
        <Container className="space-y-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.86fr)_minmax(360px,1.14fr)] lg:items-end">
            <div className="max-w-4xl space-y-3">
              <Eyebrow rule>{t("process_eyebrow")}</Eyebrow>
              <DisplayHeading size="xl" as="h2" className="max-w-[18ch]">
                {t("process_heading")}
              </DisplayHeading>
            </div>
            <p className="max-w-prose whitespace-pre-line font-sans text-lg leading-relaxed opacity-85">
              {localize(locale, HOW_WE_TEST_COPY)}
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.86fr)_minmax(360px,1.14fr)] lg:items-start">
            <ol className="grid gap-4 sm:grid-cols-2">
              {processItems.map((item, index) => (
                <li
                  key={item.title}
                  className="border-ink/35 bg-paper-light/45 border-2 p-5 md:p-6"
                >
                  <p className="font-display text-accent-on-paper/70 text-5xl leading-none">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <DisplayHeading size="md" as="h3" distress={false} className="mt-5">
                    {item.title}
                  </DisplayHeading>
                  <p className="mt-4 font-sans text-sm leading-relaxed opacity-85">{item.body}</p>
                </li>
              ))}
            </ol>

            <div className="grid gap-5 sm:grid-cols-2 lg:gap-6">
              {processPhotos.map((image, index) => (
                <WorkshopPhoto
                  key={image.src}
                  image={image}
                  label={localize(locale, image.label)}
                  sizes="(min-width: 1024px) 24vw, (min-width: 640px) 46vw, 92vw"
                  aspectClassName="aspect-[4/3]"
                  className={index % 2 === 0 ? "lg:-rotate-1" : "lg:rotate-1"}
                  compact
                  showCaption={false}
                />
              ))}
            </div>
          </div>
        </Container>
      </PaperZone>

      <RedZone density="default" tornBottom={3}>
        <WorkshopStoryWall
          entries={entries}
          cases={storyCases}
          locale={locale}
          eyebrow={t("stories_eyebrow")}
          heading={t("stories_heading")}
          readMoreLabel={tGrid("read_more")}
          emptyMessage={t("empty")}
        />
      </RedZone>

      <PaperZone density="default">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(360px,1.08fr)] lg:items-start lg:gap-16">
            <div className="space-y-6">
              <Eyebrow rule>{t("proof_eyebrow")}</Eyebrow>
              <DisplayHeading size="xl" as="h2" className="max-w-[10ch]">
                {t("proof_heading")}
              </DisplayHeading>
              <p className="max-w-prose font-sans text-lg leading-relaxed">{t("proof_body")}</p>
              <ul className="space-y-4">
                {proofItems.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckMarkIcon className="text-accent-on-paper mt-1.5 h-5 w-5 shrink-0" />
                    <span className="font-sans leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {stats.map((stat, index) => (
                  <div
                    key={`${stat.value}-${stat.label}`}
                    className={`bg-paper-light border-ink/30 p-5 ${
                      index % 2 === 0 ? "lg:-rotate-1" : "lg:rotate-1"
                    } border-2`}
                  >
                    <p className="font-display text-accent-on-paper text-4xl leading-none uppercase sm:text-5xl">
                      {stat.value}
                    </p>
                    <p className="tracking-eyebrow mt-3 font-sans text-xs font-bold uppercase opacity-75">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
              {proofImage ? (
                <WorkshopPhoto
                  image={proofImage}
                  label={localize(locale, proofImage.label)}
                  sizes="(min-width: 1024px) 44vw, 92vw"
                  aspectClassName="aspect-[16/9]"
                  className="lg:rotate-1"
                  showCaption={false}
                />
              ) : null}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {proofGalleryPhotos.map((image, index) => (
                  <WorkshopPhoto
                    key={image.src}
                    image={image}
                    label={localize(locale, image.label)}
                    sizes="(min-width: 1024px) 20vw, 46vw"
                    aspectClassName="aspect-[4/3]"
                    className={index % 2 === 0 ? "lg:-rotate-1" : "lg:rotate-1"}
                    compact
                    showCaption={false}
                  />
                ))}
              </div>
            </div>
          </div>
        </Container>
      </PaperZone>
    </>
  );
}

function RouteWorkshopHero({
  locale,
  eyebrow,
  headline,
  intro,
  whatsAppHref,
  whatsAppLabel,
  reserveLabel,
}: {
  locale: Locale;
  eyebrow: string;
  headline: string;
  intro: string;
  whatsAppHref: string;
  whatsAppLabel: string;
  reserveLabel: string;
}) {
  return (
    <RedZone density="light" tornBottom={2} className="overflow-hidden pb-4 md:pb-6">
      <RouteWorkshopBackdrop />

      <Container className="relative z-10 grid min-h-[54vh] gap-10 pt-24 md:pt-16 lg:min-h-[56vh] lg:grid-cols-[minmax(0,1fr)_minmax(24rem,0.74fr)] lg:items-center xl:min-h-[60vh]">
        <div className="max-w-[62rem] space-y-6">
          <Eyebrow>{eyebrow}</Eyebrow>
          <DisplayHeading
            size="2xl"
            as="h1"
            className="leading-display max-w-[18ch] text-[clamp(4.25rem,6.8vw,5.7rem)] xl:max-w-[19ch]"
          >
            {headline}
          </DisplayHeading>
          <p className="text-paper/85 max-w-2xl font-sans text-lg leading-relaxed md:text-xl">
            {intro}
          </p>
          <div className="flex flex-col items-start gap-4 pt-1 sm:flex-row sm:items-center">
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <Button
                href={whatsAppHref}
                external
                variant="sticker-filled"
                edge={1}
                tilt="left"
                className="whitespace-nowrap"
              >
                {whatsAppLabel}
              </Button>
              <Button
                href={`/${locale}/reservas`}
                edge={2}
                tilt="right"
                className="hidden whitespace-nowrap md:inline-flex"
              >
                {reserveLabel}
              </Button>
            </div>
            <Button
              href={`/${locale}/tours`}
              variant="ghost"
              tilt="left"
              className="whitespace-nowrap"
            >
              {localize(locale, "Ver las rutas")}
            </Button>
            <Stamp tilt={2} className="text-paper/85">
              {localize(locale, "Rutas probadas")}
            </Stamp>
          </div>
        </div>

        <RouteWorkshopArt locale={locale} />
      </Container>
    </RedZone>
  );
}

function CheckMarkIcon({ className = "" }: { className?: string }) {
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

function RouteWorkshopBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute top-24 -right-16 h-64 w-[42rem] -rotate-6 opacity-20"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent 0 22px, color-mix(in srgb, var(--color-paper) 60%, transparent) 22px 28px, transparent 28px 42px)",
        }}
      />
      <div className="bg-paper-grain border-paper/60 absolute top-28 -right-24 h-72 w-72 rotate-6 border-2 opacity-25 mix-blend-screen lg:hidden">
        <svg className="text-ink h-full w-full p-7" viewBox="0 0 260 260" fill="none">
          <path
            d="M18 176C58 122 96 200 130 132C164 66 204 88 242 42"
            stroke="currentColor"
            strokeWidth="12"
            strokeLinecap="round"
            className="opacity-25"
          />
          <path
            d="M18 176C58 122 96 200 130 132C164 66 204 88 242 42"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="2 12"
            className="opacity-80"
          />
          <path d="M38 64h92M38 86h62M38 214h148" stroke="currentColor" strokeWidth="5" />
          <circle cx="130" cy="132" r="15" stroke="currentColor" strokeWidth="5" />
          <circle cx="242" cy="42" r="15" stroke="currentColor" strokeWidth="5" />
        </svg>
      </div>
      <div
        className="absolute -bottom-8 left-0 h-44 w-full opacity-25 mix-blend-multiply"
        style={{
          backgroundImage: "url(/textures/halftone-overlay.svg)",
          backgroundRepeat: "repeat",
        }}
      />
      <div className="border-paper/25 absolute right-[8%] bottom-10 h-72 w-72 rotate-12 border-2 opacity-30" />
      <div className="border-paper/20 absolute right-[14%] bottom-24 h-48 w-48 -rotate-12 border-2 opacity-30" />
    </div>
  );
}

function RouteWorkshopArt({ locale }: { locale: Locale }) {
  const notes = [
    localize(locale, "Altura"),
    localize(locale, "Ripio"),
    localize(locale, "Combustible"),
  ];

  return (
    <div className="relative -mx-3 min-h-[26rem] sm:mx-0 lg:min-h-[31rem]" aria-hidden="true">
      <div className="border-paper/40 bg-ink/10 absolute top-8 right-0 left-6 h-[24rem] rotate-3 border-2" />

      <figure
        className="bg-paper-grain text-on-paper shadow-sticker-ink border-paper/80 absolute inset-x-0 top-2 isolate min-h-[25rem] -rotate-2 overflow-hidden border-2 p-5 sm:p-7 lg:min-h-[29rem]"
        style={{
          clipPath: "polygon(0 3%, 98% 0, 100% 92%, 84% 100%, 2% 96%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "linear-gradient(color-mix(in srgb, var(--color-ink) 13%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--color-ink) 13%, transparent) 1px, transparent 1px)",
            backgroundSize: "34px 34px",
          }}
        />
        <div
          className="absolute inset-0 opacity-20 mix-blend-multiply"
          style={{
            backgroundImage: "url(/textures/halftone-overlay.svg)",
            backgroundRepeat: "repeat",
          }}
        />

        <div className="relative z-10 flex items-start justify-between gap-5">
          <div>
            <p className="font-display text-accent-on-paper text-3xl leading-none uppercase sm:text-4xl">
              {localize(locale, "Mesa de trazado")}
            </p>
            <p className="tracking-eyebrow mt-2 font-sans text-[0.65rem] font-bold uppercase opacity-70">
              {localize(locale, "trazar / probar / ajustar")}
            </p>
          </div>
          <Stamp tilt={3} className="text-accent-on-paper">
            Rev. 04
          </Stamp>
        </div>

        <RouteBlueprint className="absolute inset-x-4 top-[5.5rem] h-[17.5rem] sm:inset-x-8 sm:h-[20rem] lg:top-24 lg:h-[20rem]" />

        <div className="absolute right-6 bottom-7 left-6 z-20 grid grid-cols-3 gap-2 sm:gap-3">
          {notes.map((note, index) => (
            <div key={note} className="border-ink/60 bg-paper-light/80 border-2 px-3 py-2">
              <p className="font-display text-accent-on-paper text-xl leading-none">
                {String(index + 1).padStart(2, "0")}
              </p>
              <p className="tracking-eyebrow mt-1 font-sans text-[0.58rem] font-bold uppercase opacity-75">
                {note}
              </p>
            </div>
          ))}
        </div>
      </figure>

      <div className="bg-paper-grain text-on-paper shadow-sticker-ink absolute top-1 right-2 z-20 rotate-6 border-2 border-current px-4 py-3 sm:right-8">
        <p className="font-display text-accent-on-paper text-2xl leading-none uppercase">4895</p>
        <p className="tracking-eyebrow font-sans text-[0.58rem] font-bold uppercase opacity-75">
          msnm test
        </p>
      </div>

      <div className="bg-paper-grain text-on-paper shadow-sticker-ink absolute -bottom-2 left-10 z-30 -rotate-3 border-2 border-current px-4 py-3 sm:left-16">
        <p className="font-display text-xl leading-none uppercase">
          {localize(locale, "GPX probado")}
        </p>
        <p className="tracking-eyebrow mt-1 font-sans text-[0.58rem] font-bold uppercase opacity-75">
          S24 47.210 / W66 12.884
        </p>
      </div>
    </div>
  );
}

function RouteBlueprint({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 640 360" fill="none" role="img">
      <path
        d="M20 268C94 216 130 308 198 236C258 172 300 232 352 148C405 62 488 98 618 42"
        stroke="currentColor"
        strokeWidth="22"
        strokeLinecap="round"
        className="text-ink/10"
      />
      <path
        d="M28 264C98 214 134 300 202 230C262 168 302 226 358 144C410 68 492 100 612 48"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray="1 17"
        className="text-ink/55"
      />
      <path
        d="M28 264C98 214 134 300 202 230C262 168 302 226 358 144C410 68 492 100 612 48"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        className="text-accent-on-paper"
      />

      <path
        d="M60 88C112 54 170 54 218 92C266 130 334 126 390 86C442 50 514 54 576 96"
        stroke="currentColor"
        strokeWidth="2"
        className="text-ink/20"
      />
      <path
        d="M42 132C126 96 176 120 238 150C318 190 392 122 464 144C520 162 556 198 612 170"
        stroke="currentColor"
        strokeWidth="2"
        className="text-ink/20"
      />
      <path
        d="M42 316C126 276 190 304 252 284C330 258 374 300 446 252C506 212 552 232 612 206"
        stroke="currentColor"
        strokeWidth="2"
        className="text-ink/20"
      />

      {[
        { x: 28, y: 264, label: "A" },
        { x: 202, y: 230, label: "B" },
        { x: 358, y: 144, label: "C" },
        { x: 612, y: 48, label: "D" },
      ].map((point) => (
        <g key={point.label} transform={`translate(${point.x} ${point.y})`}>
          <circle r="18" className="fill-paper-light stroke-ink" strokeWidth="3" />
          <text y="6" textAnchor="middle" className="fill-accent-on-paper font-display text-xl">
            {point.label}
          </text>
        </g>
      ))}

      <g className="text-ink/50" stroke="currentColor" strokeWidth="2">
        <circle cx="526" cy="286" r="38" />
        <path d="M526 238v18M526 316v18M478 286h18M556 286h18" />
        <path d="M512 302l28-48-10 54-28 12z" className="fill-accent-on-paper/70" stroke="none" />
      </g>
    </svg>
  );
}

function WorkshopStoryWall({
  entries,
  cases,
  locale,
  eyebrow,
  heading,
  readMoreLabel,
  emptyMessage,
}: {
  entries: JournalEntry[];
  cases: WorkshopCase[];
  locale: Locale;
  eyebrow: string;
  heading: string;
  readMoreLabel: string;
  emptyMessage: string;
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
          {localize(
            locale,
            "Abrimos cada ruta para mostrar qué se probó, qué se descartó y qué decisión terminó marcando el camino.",
          )}
        </p>
      </div>

      {entries.length === 0 ? (
        <p className="font-sans text-sm opacity-70">{emptyMessage}</p>
      ) : (
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {entries.map((entry, index) => {
            const item = caseBySlug.get(entry.slug);
            const image = item?.hero ?? {
              src: entry.image ?? "/images/halftone/hero-rider-cutout.png",
              alt: entry.imageAlt ?? entry.title,
              label: entry.title,
              caption: entry.excerpt,
            };
            const large = index === 0;

            return (
              <li key={entry.slug} className={large ? "lg:col-span-2 lg:row-span-2" : ""}>
                <I18nLink
                  href={`/taller-de-rutas/${entry.slug}`}
                  className="bg-paper-light text-on-paper shadow-sticker-ink group hover:shadow-sticker-red block h-full border-2 border-current transition-[box-shadow,transform] duration-200 hover:-translate-y-1"
                >
                  <div
                    className={`relative overflow-hidden border-b-2 border-current ${
                      large ? "aspect-[16/10]" : "aspect-[4/3]"
                    }`}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes={
                        large ? "(min-width: 1024px) 44vw, 92vw" : "(min-width: 1024px) 22vw, 46vw"
                      }
                      draggable={false}
                      className="object-cover opacity-85 mix-blend-multiply contrast-125 grayscale transition-[filter,opacity,transform] duration-300 group-hover:scale-[1.02] group-hover:opacity-100 group-hover:grayscale-0"
                    />
                    <div
                      className="pointer-events-none absolute inset-0 z-[1] opacity-25 mix-blend-multiply"
                      style={{
                        backgroundImage: "url(/textures/halftone-overlay.svg)",
                        backgroundRepeat: "repeat",
                      }}
                      aria-hidden="true"
                    />
                    {item ? (
                      <div className="absolute top-4 left-4 z-[2]">
                        <Stamp tilt={index % 2 === 0 ? -2 : 2}>
                          {localize(locale, item.region)}
                        </Stamp>
                      </div>
                    ) : null}
                  </div>
                  <div className="space-y-3 p-5 md:p-6">
                    <p className="text-eyebrow tracking-eyebrow text-accent-on-paper font-bold uppercase">
                      {item ? localize(locale, item.routeName) : localize(locale, "Taller")}
                    </p>
                    <DisplayHeading
                      size={large ? "lg" : "md"}
                      as="h3"
                      distress={false}
                      className="text-accent-on-paper"
                    >
                      {entry.title}
                    </DisplayHeading>
                    {entry.excerpt ? (
                      <p className="font-sans text-sm leading-relaxed opacity-80">
                        {entry.excerpt}
                      </p>
                    ) : null}
                    <p className="text-eyebrow tracking-eyebrow pt-1 font-semibold uppercase underline-offset-4 group-hover:underline">
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
          className="object-cover opacity-90 mix-blend-multiply contrast-125 grayscale transition-[filter,opacity,transform] duration-300 group-hover/photo:scale-[1.02] group-hover/photo:opacity-100 group-hover/photo:grayscale-0"
        />
        <div
          className="pointer-events-none absolute inset-0 z-[1] opacity-25 mix-blend-multiply"
          style={{
            backgroundImage: "url(/textures/halftone-overlay.svg)",
            backgroundRepeat: "repeat",
          }}
          aria-hidden="true"
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

function localize(locale: Locale, value: string) {
  return locale === "es" ? value : `${value}`;
}
