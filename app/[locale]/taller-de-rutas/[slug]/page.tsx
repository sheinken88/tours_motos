import Image from "next/image";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Button, Container, DisplayHeading, Eyebrow, Stamp } from "@/components/primitives";
import { PlaceholderMountains } from "@/components/surfaces/PlaceholderHalftones";
import { PaperZone, RedZone } from "@/components/surfaces";
import { getJournalFrontmatter, listJournalEntries } from "@/lib/content/getJournalMdx";
import {
  getJournalMdxComponent,
  listJournalSlugs,
  listLocalesForPost,
} from "@/lib/content/journalMdxRegistry";
import {
  getWorkshopCase,
  type WorkshopCase,
  type WorkshopCaseImage,
  type WorkshopDecisionSection,
} from "@/lib/content/workshopCases";
import { parseCalendarDate } from "@/lib/date";
import { isLocale, localeCodes, type Locale } from "@/lib/i18n/config";
import { Link as I18nLink } from "@/lib/i18n/navigation";
import { SITE_NAME, getSiteUrl } from "@/lib/seo/site";

export const revalidate = 600;

const decisionIconKinds = ["in", "out", "adjust"] as const;

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

/**
 * Pre-render every (locale, slug) pair where the MDX file exists. Posts that
 * haven't been translated yet are skipped from static generation; visitors
 * to /[uncovered-locale]/taller-de-rutas/[slug] hit notFound().
 */
export async function generateStaticParams() {
  const params: Array<{ locale: Locale; slug: string }> = [];
  for (const slug of listJournalSlugs()) {
    for (const loc of listLocalesForPost(slug)) {
      params.push({ locale: loc, slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const fm = await getJournalFrontmatter(slug, locale);
  if (!fm) return {};

  const site = getSiteUrl();
  const url = `${site}/${locale}/taller-de-rutas/${slug}`;
  const title = `${fm.title} | ${SITE_NAME}`;
  const description = fm.excerpt;

  const availableLocales = listLocalesForPost(slug);
  const languages = Object.fromEntries(
    availableLocales.map((loc) => [localeCodes[loc], `${site}/${loc}/taller-de-rutas/${slug}`]),
  );
  languages["x-default"] = `${site}/es/taller-de-rutas/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages,
    },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      siteName: SITE_NAME,
      images: fm.image ? [{ url: `${site}${fm.image}`, alt: fm.imageAlt ?? fm.title }] : undefined,
    },
  };
}

export default async function TallerDeRutasPost({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const [fm, MdxBody, t, entries] = await Promise.all([
    getJournalFrontmatter(slug, locale),
    getJournalMdxComponent(slug, locale),
    getTranslations({ locale, namespace: "journal_post" }),
    listJournalEntries(locale),
  ]);

  if (!fm || !MdxBody) notFound();

  const numberLocale = locale === "en" ? "en-US" : locale === "pt" ? "pt-BR" : "es-AR";
  const dateFormatter = new Intl.DateTimeFormat(numberLocale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const dateLabel = dateFormatter.format(parseCalendarDate(fm.date)).toUpperCase();
  const others = entries.filter((entry) => entry.slug !== slug).slice(0, 2);
  const dossier = getWorkshopCase(slug);
  const fallbackImage = buildFallbackImage(fm);
  const heroImage = dossier?.hero ?? fallbackImage;
  const heroPrintHalftone = fm.image;
  const heroTitle = dossier?.routeName ?? fm.title;
  const heroIntro = dossier?.fieldNote ?? fm.excerpt;
  const galleryImages = dossier ? [dossier.hero, ...dossier.images] : [fallbackImage];
  const decisionSection: WorkshopDecisionSection = dossier?.decisionSection ?? {
    eyebrow: "Decisiones de diseño",
    title: "LO QUE ENTRÓ Y LO QUE QUEDÓ AFUERA",
    intro:
      "Una ruta se diseña cuando alguien decide qué no entra. Acá está la parte que no suele verse en una ficha comercial.",
  };

  return (
    <>
      <RedZone density="heavy" tornBottom={1} className="overflow-hidden">
        <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden" aria-hidden>
          <div
            className="absolute top-28 -right-24 h-72 w-[44rem] -rotate-6 opacity-20 mix-blend-screen"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, transparent 0 22px, color-mix(in srgb, var(--color-paper) 64%, transparent) 22px 28px, transparent 28px 42px)",
            }}
          />
          <div
            className="absolute -bottom-8 left-0 h-44 w-full opacity-20 mix-blend-multiply"
            style={{
              backgroundImage: "url(/textures/halftone-overlay.svg)",
              backgroundRepeat: "repeat",
            }}
          />
          <PlaceholderMountains
            className="absolute inset-x-0 bottom-0 h-[48%] w-full opacity-70"
            tint="ink"
          />
        </div>

        <Container className="relative z-10 grid min-h-[72vh] gap-10 pt-14 lg:min-h-[76vh] lg:grid-cols-[minmax(0,0.95fr)_minmax(24rem,0.85fr)] lg:items-center xl:min-h-[78vh]">
          <div className="max-w-[50rem] space-y-6 lg:pl-8 xl:pl-14 2xl:pl-20">
            <I18nLink
              href="/taller-de-rutas"
              className="text-eyebrow tracking-eyebrow text-paper inline-flex min-h-11 items-center py-1 font-semibold uppercase underline-offset-4 hover:underline"
            >
              ← {t("back")}
            </I18nLink>
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <Stamp className="text-paper self-start" tilt={-2}>
                  {dateLabel}
                </Stamp>
                {dossier ? (
                  <Stamp className="text-paper self-start" tilt={2}>
                    {dossier.region}
                  </Stamp>
                ) : null}
              </div>
              <div className="space-y-3">
                <Eyebrow>{dossier ? "Taller de ruta" : "Taller de rutas"}</Eyebrow>
                <DisplayHeading size="2xl" as="h1" className="leading-display max-w-[11ch]">
                  {heroTitle}
                </DisplayHeading>
              </div>
              {heroIntro ? (
                <p className="text-paper/90 max-w-2xl font-sans text-lg leading-relaxed md:text-xl">
                  {heroIntro}
                </p>
              ) : null}
              {dossier ? (
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2">
                  <Button
                    href={`/${locale}/tours/${dossier.tourSlug}`}
                    variant="sticker-filled"
                    edge={2}
                    tilt="left"
                  >
                    Ver tour final
                  </Button>
                </div>
              ) : null}
            </div>
          </div>

          <WorkshopHeroDossier
            dossier={dossier}
            halftoneSrc={heroPrintHalftone}
            image={heroImage}
          />
        </Container>
      </RedZone>

      <PaperZone density="default" tornBottom={2}>
        <Container>
          <div className="grid gap-8 lg:grid-cols-[20rem_minmax(0,1fr)] lg:items-start">
            <aside className="bg-paper-light border-ink/30 shadow-sticker-ink border-2 p-6 md:p-8 lg:sticky lg:top-28 lg:p-10">
              <Eyebrow>{dossier ? "Dossier de ruta" : "Taller de ruta"}</Eyebrow>
              <DisplayHeading size="md" as="h2" distress={false} className="mt-4">
                {dossier ? dossier.routeName : "Ruta probada"}
              </DisplayHeading>
              {dossier ? (
                <>
                  <p className="mt-4 font-sans text-sm leading-relaxed opacity-80">
                    {dossier.fieldNote}
                  </p>
                  <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4">
                    {dossier.stats.map((stat) => (
                      <div
                        key={`${stat.value}-${stat.label}`}
                        className="border-ink/25 min-h-20 border-t pt-3"
                      >
                        <dt className="text-eyebrow tracking-eyebrow text-accent-on-paper font-bold uppercase">
                          {stat.label}
                        </dt>
                        <dd className="font-display text-display-md mt-1 leading-none uppercase">
                          {stat.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </>
              ) : null}
            </aside>

            <article
              className="prose-tour prose-tour-columns bg-paper-light border-ink/30 border-2 p-6 md:p-10"
              data-whatsapp-fab="hide"
            >
              <MdxBody />
            </article>
          </div>
        </Container>
      </PaperZone>

      {dossier ? (
        <RedZone density="default" tornBottom={3} className="!pb-14 md:!pb-16">
          <Container className="space-y-10">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(320px,0.65fr)] lg:items-end">
              <div className="space-y-3">
                <Eyebrow rule>{decisionSection.eyebrow}</Eyebrow>
                <DisplayHeading size="xl" as="h2" className="max-w-[11ch]">
                  {decisionSection.title}
                </DisplayHeading>
              </div>
              {decisionSection.intro ? (
                <p className="max-w-prose font-sans text-lg leading-relaxed opacity-85">
                  {decisionSection.intro}
                </p>
              ) : null}
            </div>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.72fr)]">
              <CasePhoto
                image={decisionSection.image ?? dossier.images[1] ?? dossier.hero}
                sizes="(min-width: 1024px) 52vw, 92vw"
                aspectClassName="aspect-[16/9]"
                className="lg:-rotate-1"
                treatment="color"
              />
              <ul className="grid gap-4" data-whatsapp-fab="hide">
                {dossier.decisions.map((decision, index) => (
                  <li key={decision.label} className="border-paper/45 border-2 p-5">
                    <div className="flex items-start gap-3">
                      <DecisionIcon
                        kind={decision.kind ?? decisionIconKinds[index] ?? "adjust"}
                        className="mt-1 h-5 w-5 shrink-0"
                      />
                      <div>
                        <p className="text-eyebrow tracking-eyebrow font-bold uppercase opacity-75">
                          {decision.label}
                        </p>
                        <p className="mt-2 font-sans text-sm leading-relaxed opacity-85">
                          {decision.body}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </RedZone>
      ) : null}

      <PaperZone
        density="default"
        tornBottom={others.length > 0 ? 2 : undefined}
        className="!pb-14 md:!pb-16"
      >
        <Container className="space-y-10">
          <div className="space-y-3">
            <Eyebrow rule>Fotos de scouting</Eyebrow>
            <DisplayHeading size="xl" as="h2" className="max-w-[18ch] lg:max-w-[22ch]">
              EL TERRENO ANTES DEL TOUR
            </DisplayHeading>
          </div>
          <div
            className="grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-4"
            data-whatsapp-fab="hide"
          >
            {galleryImages.slice(0, 4).map((image, index) => (
              <CasePhoto
                key={`${image.src}-${index}`}
                image={image}
                sizes="(min-width: 1024px) 24vw, (min-width: 640px) 46vw, 92vw"
                aspectClassName="aspect-[4/3]"
                className={index % 2 === 0 ? "lg:-rotate-1" : "lg:rotate-1"}
                compact
              />
            ))}
          </div>
        </Container>
      </PaperZone>

      {others.length > 0 ? (
        <RedZone density="default" className="overflow-visible !pb-24 md:!pb-28">
          <Container className="space-y-8">
            <div>
              <Eyebrow rule>{t("share_eyebrow")}</Eyebrow>
              <DisplayHeading size="lg" as="h2" className="mt-3">
                {t("back")}
              </DisplayHeading>
            </div>
            <ul className="grid gap-6 sm:grid-cols-2" data-whatsapp-fab="hide">
              {others.map((entry, index) => {
                const related = getWorkshopCase(entry.slug);
                const image = related?.hero ?? buildFallbackImage(entry);
                return (
                  <li key={entry.slug}>
                    <I18nLink
                      href={`/taller-de-rutas/${entry.slug}`}
                      className="bg-paper-light text-on-paper shadow-sticker-ink group hover:shadow-sticker-red block h-full border-2 border-current transition-[box-shadow,transform] duration-200 hover:-translate-y-1"
                    >
                      <div className="relative aspect-[16/9] overflow-hidden border-b-2 border-current">
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          sizes="(min-width: 1024px) 42vw, 92vw"
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
                        <div className="absolute top-4 left-4 z-[2]">
                          <Stamp tilt={index % 2 === 0 ? -2 : 2}>
                            {related?.region ?? dateFormatter.format(parseCalendarDate(entry.date))}
                          </Stamp>
                        </div>
                      </div>
                      <div className="p-5">
                        <DisplayHeading
                          size="md"
                          as="h3"
                          distress={false}
                          style={{ color: "var(--color-brand-red)" }}
                        >
                          {entry.title}
                        </DisplayHeading>
                        {entry.excerpt ? (
                          <p className="mt-3 font-sans text-sm leading-relaxed opacity-80">
                            {entry.excerpt}
                          </p>
                        ) : null}
                      </div>
                    </I18nLink>
                  </li>
                );
              })}
            </ul>
          </Container>
        </RedZone>
      ) : null}
    </>
  );
}

function WorkshopHeroDossier({
  dossier,
  halftoneSrc,
  image,
}: {
  dossier?: WorkshopCase | null;
  halftoneSrc?: string;
  image: WorkshopCaseImage;
}) {
  const workshopStats = (dossier?.stats ?? []).slice(0, 3);
  const workshopDecisions = (dossier?.decisions ?? []).slice(0, 2);
  const imageSrc = halftoneSrc ?? image.src;

  return (
    <div className="relative -mx-5 py-4 sm:-mx-8 md:mx-0 lg:py-6">
      <div className="border-paper/25 absolute top-8 right-5 bottom-3 left-8 rotate-2 border-2 opacity-45" />
      <div
        className="bg-paper-grain text-on-paper shadow-sticker-ink border-paper/80 relative isolate overflow-hidden border-2 p-5 sm:p-6 lg:p-7"
        style={{
          clipPath: "polygon(0 2.5%, 98% 0, 100% 94%, 88% 100%, 2% 97%)",
          transform: "rotate(1.1deg)",
        }}
      >
        <div
          className="absolute inset-0 opacity-45"
          style={{
            backgroundImage:
              "linear-gradient(color-mix(in srgb, var(--color-ink) 10%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--color-ink) 10%, transparent) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 opacity-20 mix-blend-multiply"
          style={{
            backgroundImage: "url(/textures/halftone-overlay.svg)",
            backgroundRepeat: "repeat",
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 flex items-start justify-between gap-5">
          <div>
            <p className="font-display text-accent-on-paper text-3xl leading-none uppercase sm:text-4xl lg:text-[2.7rem]">
              Mesa de taller
            </p>
            <p className="tracking-eyebrow mt-2 font-sans text-[0.65rem] font-bold uppercase opacity-70">
              trazar / probar / ajustar
            </p>
          </div>
          <Stamp tilt={3} className="text-accent-on-paper">
            Rev.{" "}
            {String(Math.max(workshopStats.length + workshopDecisions.length, 1)).padStart(2, "0")}
          </Stamp>
        </div>

        <div className="relative z-10 mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_11rem]">
          <div className="border-ink/70 bg-paper-light relative aspect-[16/10] overflow-hidden border-2">
            <Image
              src={imageSrc}
              alt={image.alt}
              fill
              priority
              sizes="(min-width: 1024px) 30vw, 92vw"
              draggable={false}
              className="object-cover opacity-90 mix-blend-multiply contrast-125 grayscale"
            />
            <div
              className="pointer-events-none absolute inset-0 opacity-20 mix-blend-multiply"
              style={{
                backgroundImage: "url(/textures/halftone-overlay.svg)",
                backgroundRepeat: "repeat",
              }}
              aria-hidden="true"
            />
            <div className="absolute top-3 left-3">
              <span className="bg-paper-light font-display text-accent-on-paper inline-block border-2 border-current px-3 py-1.5 text-xs tracking-[var(--tracking-cta)] uppercase">
                Foto de prueba
              </span>
            </div>
          </div>

          <dl className="border-ink/50 bg-paper-light/65 grid content-start border-2">
            {workshopStats.map((stat, index) => (
              <div
                key={`${stat.value}-${stat.label}`}
                className={`border-ink/30 px-3 py-3 ${index < workshopStats.length - 1 ? "border-b" : ""}`}
              >
                <dt className="tracking-eyebrow font-sans text-[0.55rem] leading-tight font-bold uppercase opacity-70">
                  {stat.label}
                </dt>
                <dd className="font-display text-accent-on-paper mt-1 text-3xl leading-none uppercase">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative z-10 mt-5 grid gap-4 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)] lg:items-stretch">
          <div className="border-ink/50 bg-paper-light/80 border-2 p-4">
            <p className="font-display text-accent-on-paper text-base leading-none uppercase sm:text-lg">
              {image.label}
            </p>
            <p className="mt-2 font-sans text-sm leading-relaxed opacity-80">{image.caption}</p>
          </div>

          {workshopDecisions.length > 0 ? (
            <div className="bg-brand-red text-on-red border-paper/75 border-2 p-4">
              <p className="tracking-eyebrow font-sans text-[0.6rem] font-bold uppercase opacity-75">
                Quedó afuera
              </p>
              <div className="mt-3 grid gap-3">
                {workshopDecisions.map((decision) => (
                  <div
                    key={decision.label}
                    className="border-paper/35 border-t pt-3 first:border-t-0 first:pt-0"
                  >
                    <p className="font-display text-base leading-none uppercase">
                      {decision.label}
                    </p>
                    <p className="mt-1 line-clamp-2 font-sans text-xs leading-relaxed opacity-80">
                      {decision.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function CasePhoto({
  image,
  priority = false,
  loading,
  sizes,
  aspectClassName,
  className = "",
  compact = false,
  treatment = "halftone",
}: {
  image: WorkshopCaseImage;
  priority?: boolean;
  loading?: "eager" | "lazy";
  sizes: string;
  aspectClassName: string;
  className?: string;
  compact?: boolean;
  treatment?: "halftone" | "color";
}) {
  const isColor = treatment === "color";
  const imageClassName = isColor
    ? "object-cover opacity-100 transition-[filter,opacity,transform] duration-300 group-hover/photo:scale-[1.02] group-hover/photo:brightness-105"
    : "object-cover opacity-90 mix-blend-multiply contrast-125 grayscale transition-[filter,opacity,transform] duration-300 group-hover/photo:scale-[1.02] group-hover/photo:opacity-100 group-hover/photo:grayscale-0";
  const overlayClassName = isColor
    ? "pointer-events-none absolute inset-0 z-[1] opacity-10 mix-blend-multiply"
    : "pointer-events-none absolute inset-0 z-[1] opacity-25 mix-blend-multiply";

  return (
    <figure className={`group/photo self-start ${className}`}>
      <div
        className={`bg-paper-grain shadow-sticker-ink border-ink/70 relative overflow-hidden border-2 ${aspectClassName}`}
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          priority={priority}
          loading={priority ? undefined : loading}
          draggable={false}
          className={imageClassName}
        />
        <div
          className={overlayClassName}
          style={{
            backgroundImage: "url(/textures/halftone-overlay.svg)",
            backgroundRepeat: "repeat",
          }}
          aria-hidden="true"
        />
        <div className="absolute top-4 left-4 z-[2]">
          <span className="bg-paper-light font-display text-accent-on-paper inline-block border-2 border-current px-3 py-1.5 text-xs tracking-[var(--tracking-cta)] uppercase">
            {image.label}
          </span>
        </div>
      </div>
      <figcaption
        className={`mt-3 max-w-prose font-sans leading-relaxed opacity-85 ${
          compact ? "text-sm" : "text-sm md:text-base"
        }`}
      >
        {image.caption}
      </figcaption>
    </figure>
  );
}

function buildFallbackImage(fm: {
  title: string;
  excerpt?: string;
  image?: string;
  imageAlt?: string;
}): WorkshopCaseImage {
  return {
    src: fm.image ?? "/images/halftone/hero-rider-cutout.png",
    alt: fm.imageAlt ?? fm.title,
    label: "Taller de ruta",
    caption: fm.excerpt ?? "",
  };
}

function DecisionIcon({
  kind,
  className = "",
}: {
  kind: (typeof decisionIconKinds)[number];
  className?: string;
}) {
  if (kind === "in") {
    return (
      <svg className={className} viewBox="0 0 20 20" aria-hidden focusable="false">
        <path d="M9 3h2v14H9V3Z" fill="currentColor" />
        <path d="M3 9h14v2H3V9Z" fill="currentColor" />
      </svg>
    );
  }

  if (kind === "adjust") {
    return (
      <svg className={className} viewBox="0 0 20 20" aria-hidden focusable="false">
        <path
          d="M4 6h9.4l-2.2-2.2 1.5-1.4L17.4 7l-4.7 4.6-1.5-1.4L13.4 8H4V6Z"
          fill="currentColor"
        />
        <path
          d="M16 14H6.6l2.2 2.2-1.5 1.4L2.6 13l4.7-4.6 1.5 1.4L6.6 12H16v2Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  return (
    <svg className={className} viewBox="0 0 20 20" aria-hidden focusable="false">
      <path d="m4.2 3.1 12.7 12.7-1.4 1.4L2.8 4.5l1.4-1.4Z" fill="currentColor" />
      <path d="M15.5 3.1 2.8 15.8l1.4 1.4L16.9 4.5l-1.4-1.4Z" fill="currentColor" />
    </svg>
  );
}
