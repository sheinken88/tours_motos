import Image from "next/image";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Button, Container, DisplayHeading, Eyebrow, Stamp, XIcon } from "@/components/primitives";
import { PaperZone, RedZone } from "@/components/surfaces";
import { listJournalEntries, type JournalEntry } from "@/lib/content/getJournalMdx";
import {
  WORKSHOP_CASES,
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

  const [t, entries] = await Promise.all([
    getTranslations({ locale, namespace: "journal_index" }),
    listJournalEntries(locale),
  ]);
  const tGrid = await getTranslations({ locale, namespace: "journal_grid" });

  const proofItems = t.raw("proof_items") as string[];
  const stats = t.raw("stats") as WorkshopStat[];
  const processItems = t.raw("process_items") as ProcessItem[];
  const storyCases = listWorkshopCases(entries.map((entry) => entry.slug));
  const visualCases = storyCases.length > 0 ? storyCases : Object.values(WORKSHOP_CASES);
  const heroCase = WORKSHOP_CASES["armar-volcanes-del-norte"] ?? visualCases[0];
  const ctaCase = WORKSHOP_CASES["armar-cruces-del-sur"];

  return (
    <>
      <RedZone density="light" tornBottom={2} className="overflow-hidden !pt-0 !pb-0">
        {/* Full-bleed cinematic banner — one halftone landscape, copy overlaid
            bottom-left. Red veil at the top keeps the fixed navbar legible. */}
        <div className="relative w-full">
          {/* Background layers fill the banner; the in-flow Container below sets the
              height, so a tall headline grows the banner instead of clipping. */}
          {heroCase ? (
            <Image
              src={heroCase.hero.src}
              alt={heroCase.hero.alt}
              fill
              priority
              sizes="100vw"
              draggable={false}
              className="object-cover object-center opacity-90 contrast-125 grayscale"
            />
          ) : null}
          {/* Halftone dot texture, multiplied into the photo */}
          <div
            className="pointer-events-none absolute inset-0 z-[1] opacity-25 mix-blend-multiply"
            style={{
              backgroundImage: "url(/textures/halftone-overlay.svg)",
              backgroundRepeat: "repeat",
            }}
            aria-hidden="true"
          />
          {/* Brand-red veil descending from the top so the fixed navbar reads */}
          <div
            className="pointer-events-none absolute inset-0 z-[2]"
            style={{
              background:
                "linear-gradient(to bottom, rgba(168,52,42,0.85) 0%, rgba(168,52,42,0.55) 14%, rgba(168,52,42,0.18) 28%, rgba(168,52,42,0) 42%)",
            }}
            aria-hidden="true"
          />
          {/* Ink gradient rising from the bottom-left so the headline always reads */}
          <div
            className="pointer-events-none absolute inset-0 z-[2]"
            style={{
              background:
                "linear-gradient(to top, rgba(31,20,14,0.92) 0%, rgba(31,20,14,0.78) 28%, rgba(31,20,14,0.28) 55%, rgba(31,20,14,0) 80%)",
            }}
            aria-hidden="true"
          />

          {/* In-flow copy — bottom-left. min-height makes the banner cinematic, but
              tall content grows it past that, with top padding clearing the fixed nav. */}
          <Container className="relative z-[3] flex min-h-[80vh] flex-col justify-end pt-28 pb-14 md:min-h-[86vh] md:pt-32 md:pb-20">
            <div className="w-full max-w-[74rem] space-y-5">
              <Eyebrow className="text-paper mb-10 md:mb-12">{t("eyebrow")}</Eyebrow>
              <DisplayHeading size="2xl" as="h1" className="max-w-[17ch] xl:max-w-[18ch]">
                {t("headline")}
              </DisplayHeading>
              <p className="text-paper/85 max-w-prose font-sans text-lg leading-relaxed">
                {t("intro")}
              </p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-1">
                <Button href={`/${locale}/tours`} variant="sticker-filled" edge={1} tilt="left">
                  {t("cta_primary")}
                </Button>
              </div>
            </div>
          </Container>
        </div>
      </RedZone>

      <PaperZone density="default" tornBottom={3}>
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
                    <XIcon className="text-accent-on-paper mt-1.5 h-5 w-5 shrink-0" />
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
              {heroCase ? (
                <WorkshopPhoto
                  image={heroCase.images[1] ?? heroCase.hero}
                  label={localize(locale, "Notas de campo")}
                  sizes="(min-width: 1024px) 44vw, 92vw"
                  aspectClassName="aspect-[16/9]"
                  className="lg:rotate-1"
                />
              ) : null}
            </div>
          </div>
        </Container>
      </PaperZone>

      <RedZone density="default" tornBottom={4}>
        <Container className="space-y-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.86fr)_minmax(360px,1.14fr)] lg:items-end">
            <div className="max-w-4xl space-y-3">
              <Eyebrow rule>{t("process_eyebrow")}</Eyebrow>
              <DisplayHeading size="xl" as="h2" className="max-w-[18ch]">
                {t("process_heading")}
              </DisplayHeading>
            </div>
            <p className="max-w-prose font-sans text-lg leading-relaxed opacity-85">
              {localize(
                locale,
                "La idea no es improvisar la aventura. Es diseñarla para disfrutarla de verdad.",
              )}
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.86fr)_minmax(360px,1.14fr)] lg:items-start">
            <ol className="grid gap-4 sm:grid-cols-2">
              {processItems.map((item, index) => (
                <li key={item.title} className="border-paper/45 border-2 p-5 md:p-6">
                  <p className="font-display text-paper/50 text-5xl leading-none">
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
              {visualCases.slice(0, 4).map((item, index) => (
                <WorkshopPhoto
                  key={item.slug}
                  image={item.images[index % item.images.length] ?? item.hero}
                  label={localize(locale, item.routeName)}
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
      </RedZone>

      <PaperZone density="default" tornBottom={1}>
        <WorkshopStoryWall
          entries={entries}
          cases={storyCases}
          locale={locale}
          eyebrow={t("stories_eyebrow")}
          heading={t("stories_heading")}
          readMoreLabel={tGrid("read_more")}
          emptyMessage={t("empty")}
        />
      </PaperZone>

      <RedZone density="default">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.85fr)] lg:items-end">
            <div className="space-y-4">
              <Eyebrow rule>{t("cta_eyebrow")}</Eyebrow>
              <DisplayHeading size="xl" as="h2" className="max-w-[12ch]">
                {t("cta_heading")}
              </DisplayHeading>
              <p className="max-w-prose font-sans text-lg leading-relaxed">{t("cta_body")}</p>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button href={`/${locale}/tours`} variant="sticker-filled" edge={1} tilt="left">
                  {t("cta_primary")}
                </Button>
                <Button href={`/${locale}/contact`} edge={3} tilt="right">
                  {t("cta_secondary")}
                </Button>
              </div>
            </div>

            {ctaCase ? (
              <WorkshopPhoto
                image={ctaCase.images[0] ?? ctaCase.hero}
                label={localize(locale, "Ruta que sobrevivió")}
                sizes="(min-width: 1024px) 34vw, 92vw"
                aspectClassName="aspect-[16/10]"
                className="lg:rotate-1"
              />
            ) : null}
          </div>
        </Container>
      </RedZone>
    </>
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
            "El taller tiene que mostrar proceso real: pruebas, errores, logística y decisiones tomadas en el terreno.",
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
                    <DisplayHeading size={large ? "lg" : "md"} as="h3" distress={false}>
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
  showCaption = true,
}: {
  image: WorkshopCaseImage;
  label: string;
  priority?: boolean;
  sizes: string;
  aspectClassName: string;
  className?: string;
  compact?: boolean;
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
        <div className="absolute top-4 left-4 z-[2]">
          <span className="bg-paper-light font-display text-accent-on-paper inline-block border-2 border-current px-3 py-1.5 text-xs tracking-[var(--tracking-cta)] uppercase">
            {label}
          </span>
        </div>
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
  return locale === "es" ? value : `[NEEDS_TRANSLATION] ${value}`;
}
