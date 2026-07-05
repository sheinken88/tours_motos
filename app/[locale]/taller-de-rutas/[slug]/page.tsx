import Image from "next/image";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Button, Container, DisplayHeading, Eyebrow, Stamp } from "@/components/primitives";
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
  const dossier = getWorkshopCase(slug, locale);
  const fallbackImage = buildFallbackImage(fm, t("route_workshop"));
  const heroImage = dossier?.hero ?? fallbackImage;
  const heroTitle = dossier?.routeName ?? fm.title;
  const heroIntro = dossier?.fieldNote ?? fm.excerpt;
  const galleryImages = dossier ? [dossier.hero, ...dossier.images] : [fallbackImage];
  const decisionSection: WorkshopDecisionSection = dossier?.decisionSection ?? {
    eyebrow: t("fallback_decision_eyebrow"),
    title: t("fallback_decision_title"),
    intro: t("fallback_decision_intro"),
  };

  return (
    <>
      <RouteReportHero
        locale={locale}
        backLabel={t("back")}
        dateLabel={dateLabel}
        dossier={dossier}
        title={heroTitle}
        intro={heroIntro}
        image={heroImage}
        fallbackEyebrow={t("route_workshop")}
        finalTourLabel={t("final_tour_cta")}
      />

      <PaperZone density="light" tornBottom={2}>
        {dossier ? (
          <RouteReportTimeline
            dossier={dossier}
            eyebrow={t("timeline_eyebrow")}
            heading={t("timeline_heading")}
            body={t("timeline_body")}
          />
        ) : null}

        <Container className={dossier ? "mt-12 md:mt-16" : ""}>
          <div className="grid gap-8 lg:grid-cols-[minmax(16rem,0.36fr)_minmax(0,1fr)] lg:items-start">
            <aside className="bg-paper-light border-ink/30 shadow-sticker-ink border-2 p-6 md:p-8 lg:sticky lg:top-28 lg:p-9">
              <Eyebrow>{dossier ? t("workshop_table") : t("route_workshop")}</Eyebrow>
              <DisplayHeading size="md" as="h2" distress={false} className="mt-4">
                {dossier ? dossier.quote : t("tested_route")}
              </DisplayHeading>
              <p className="mt-4 font-sans text-sm leading-relaxed opacity-80">
                {dossier ? dossier.fieldNote : t("fallback_aside_body")}
              </p>
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
            <Eyebrow rule>{t("scouting_eyebrow")}</Eyebrow>
            <DisplayHeading size="xl" as="h2" className="max-w-[18ch] lg:max-w-[22ch]">
              {t("scouting_heading")}
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
                const related = getWorkshopCase(entry.slug, locale);
                const image = related?.hero ?? buildFallbackImage(entry, t("route_workshop"));
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
                          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
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

function RouteReportHero({
  locale,
  backLabel,
  dateLabel,
  dossier,
  title,
  intro,
  image,
  fallbackEyebrow,
  finalTourLabel,
}: {
  locale: Locale;
  backLabel: string;
  dateLabel: string;
  dossier?: WorkshopCase | null;
  title: string;
  intro?: string;
  image: WorkshopCaseImage;
  fallbackEyebrow: string;
  finalTourLabel: string;
}) {
  return (
    <RedZone density="heavy" tornBottom={1} className="min-h-[100svh] overflow-hidden !py-0">
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
          <I18nLink
            href="/taller-de-rutas"
            className="text-eyebrow tracking-eyebrow text-paper inline-flex min-h-11 items-center py-1 font-semibold uppercase underline-offset-4 hover:underline"
          >
            ← {backLabel}
          </I18nLink>

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
            <Eyebrow>{dossier ? image.label : fallbackEyebrow}</Eyebrow>
            <DisplayHeading size="xl" as="h1" className="max-w-[18ch] leading-[0.9]">
              {title}
            </DisplayHeading>
          </div>

          {intro ? (
            <p className="text-on-red max-w-2xl font-sans text-xl leading-relaxed md:text-2xl">
              {intro}
            </p>
          ) : null}

          {dossier ? (
            <div className="flex flex-wrap gap-4 pt-2">
              <Button
                href={`/${locale}/tours/${dossier.tourSlug}`}
                variant="sticker-filled"
                edge={2}
                tilt="left"
              >
                {finalTourLabel}
              </Button>
            </div>
          ) : null}
        </div>
      </Container>
    </RedZone>
  );
}

function RouteReportTimeline({
  dossier,
  eyebrow,
  heading,
  body,
}: {
  dossier: WorkshopCase;
  eyebrow: string;
  heading: string;
  body: string;
}) {
  const stages = [dossier.hero, ...dossier.images].slice(0, 5);
  const stageGridColumns =
    stages.length === 5 ? "md:grid-cols-2 xl:grid-cols-6" : "md:grid-cols-2 xl:grid-cols-4";
  const getStageCardClass = (index: number) => {
    if (stages.length !== 5) return "";
    return index < 3 ? "xl:col-span-2" : "xl:col-span-3";
  };
  const getStageImageSizes = (index: number) => {
    if (stages.length !== 5) return "(min-width: 1280px) 23vw, (min-width: 768px) 46vw, 92vw";
    return index < 3
      ? "(min-width: 1280px) 30vw, (min-width: 768px) 46vw, 92vw"
      : "(min-width: 1280px) 44vw, (min-width: 768px) 46vw, 92vw";
  };

  return (
    <Container className="space-y-10">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.82fr)_minmax(320px,0.58fr)] lg:items-end">
        <div className="space-y-3">
          <Eyebrow rule>{eyebrow}</Eyebrow>
          <DisplayHeading size="xl" as="h2" className="max-w-[15ch]">
            {heading}
          </DisplayHeading>
        </div>
        <p className="max-w-prose font-sans text-lg leading-relaxed opacity-85">{body}</p>
      </div>

      <dl className="border-ink/25 grid border-2 sm:grid-cols-2 lg:grid-cols-5">
        {dossier.stats.map((stat, index) => (
          <div
            key={`${stat.value}-${stat.label}`}
            className="border-ink/25 flex min-h-28 items-center gap-4 border-b px-5 py-5 last:border-b-0 sm:border-r lg:border-b-0 lg:px-6 lg:last:border-r-0 sm:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r"
          >
            <ReportStatIcon index={index} className="text-accent-on-paper h-9 w-9 shrink-0" />
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

      <ol className={`grid gap-5 ${stageGridColumns}`} data-whatsapp-fab="hide">
        {stages.map((stage, index) => (
          <li
            key={`${stage.src}-${index}`}
            className={`border-ink/25 bg-paper-light/25 min-h-full border-2 p-5 ${getStageCardClass(index)}`}
          >
            <p className="font-display text-accent-on-paper text-3xl leading-none uppercase">
              {index + 1}. {stage.label}
            </p>
            <CasePhoto
              image={stage}
              sizes={getStageImageSizes(index)}
              aspectClassName="aspect-[16/9]"
              className="mt-5"
              compact
              showLabel={false}
              showCaption={false}
            />
            <p className="mt-5 font-sans text-sm leading-relaxed opacity-85">
              {stage.caption}
            </p>
          </li>
        ))}
      </ol>
    </Container>
  );
}

function ReportStatIcon({ index, className = "" }: { index: number; className?: string }) {
  const kind = index % 5;

  if (kind === 1) {
    return (
      <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <path d="M8 34C16 18 28 38 40 14" stroke="currentColor" strokeWidth="4" />
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

function CasePhoto({
  image,
  priority = false,
  loading,
  sizes,
  aspectClassName,
  className = "",
  compact = false,
  showLabel = true,
  showCaption = true,
}: {
  image: WorkshopCaseImage;
  priority?: boolean;
  loading?: "eager" | "lazy";
  sizes: string;
  aspectClassName: string;
  className?: string;
  compact?: boolean;
  showLabel?: boolean;
  showCaption?: boolean;
}) {
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
          className="object-cover transition-[filter,transform] duration-300 group-hover/photo:scale-[1.02] group-hover/photo:brightness-105"
        />
        {showLabel ? (
          <div className="absolute top-4 left-4 z-[2]">
            <span className="bg-paper-light font-display text-accent-on-paper inline-block border-2 border-current px-3 py-1.5 text-xs tracking-[var(--tracking-cta)] uppercase">
              {image.label}
            </span>
          </div>
        ) : null}
      </div>
      {showCaption ? (
        <figcaption
          className={`mt-3 max-w-prose font-sans leading-relaxed opacity-85 ${
            compact ? "text-sm" : "text-sm md:text-base"
          }`}
        >
          {image.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function buildFallbackImage(fm: {
  title: string;
  excerpt?: string;
  image?: string;
  imageAlt?: string;
}, label: string): WorkshopCaseImage {
  return {
    src: fm.image ?? "/images/halftone/hero-rider-cutout.png",
    alt: fm.imageAlt ?? fm.title,
    label,
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
