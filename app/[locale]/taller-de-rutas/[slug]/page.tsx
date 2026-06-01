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
  type WorkshopCaseImage,
  type WorkshopDecisionSection,
} from "@/lib/content/workshopCases";
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
  const dateLabel = dateFormatter.format(new Date(fm.date)).toUpperCase();
  const others = entries.filter((entry) => entry.slug !== slug).slice(0, 2);
  const dossier = getWorkshopCase(slug);
  const fallbackImage = buildFallbackImage(fm);
  const heroImage = dossier?.hero ?? fallbackImage;
  const galleryImages = dossier ? [dossier.hero, ...dossier.images] : [fallbackImage];
  const decisionSection: WorkshopDecisionSection = dossier?.decisionSection ?? {
    eyebrow: "Decisiones de diseño",
    title: "LO QUE ENTRÓ Y LO QUE QUEDÓ AFUERA",
    intro:
      "Una ruta se diseña cuando alguien decide qué no entra. Acá está la parte que no suele verse en una ficha comercial.",
  };

  return (
    <>
      <RedZone density="light" tornBottom={1} className="overflow-hidden !pt-0 !pb-0">
        {/* Full-bleed cinematic banner: one halftone landscape, headline + CTA
            overlaid bottom-left over an ink gradient. The whole zone IS the poster. */}
        <div className="relative w-full">
          {/* Background layers fill the banner; the in-flow Container below sets the
              height, so a tall headline grows the banner instead of clipping.
              Banner image — duotone/halftone treatment to match CasePhoto jpgs */}
          <Image
            src={heroImage.src}
            alt={heroImage.alt}
            fill
            priority
            sizes="100vw"
            draggable={false}
            className="object-cover object-center opacity-90 contrast-125 grayscale"
          />
          {/* Halftone dot texture, multiplied into the photo */}
          <div
            className="pointer-events-none absolute inset-0 z-[1] opacity-25 mix-blend-multiply"
            style={{
              backgroundImage: "url(/textures/halftone-overlay.svg)",
              backgroundRepeat: "repeat",
            }}
            aria-hidden="true"
          />
          {/* Brand-red veil descending from the top so the fixed navbar reads,
              matching the red zone the nav normally sits over on the home hero. */}
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

          {/* Back link, pinned below the fixed navbar over the banner */}
          <Container className="absolute inset-x-0 top-0 z-[4] pt-24 md:pt-28">
            <I18nLink
              href="/taller-de-rutas"
              className="text-eyebrow tracking-eyebrow text-paper inline-flex min-h-11 items-center py-1 font-semibold uppercase underline-offset-4 hover:underline"
            >
              ← {t("back")}
            </I18nLink>
          </Container>

          {/* In-flow copy — bottom-left. min-height makes the banner cinematic, but
              tall content grows it past that, with top padding clearing nav + back link. */}
          <Container className="relative z-[3] flex min-h-[80vh] flex-col justify-end pt-40 pb-14 md:min-h-[86vh] md:pt-44 md:pb-20">
            <div className="max-w-2xl space-y-5">
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
              <DisplayHeading size="2xl" as="h1" className="max-w-[14ch]">
                {fm.title}
              </DisplayHeading>
              {fm.excerpt ? (
                <p className="text-paper/85 max-w-prose font-sans text-lg leading-relaxed">
                  {fm.excerpt}
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
          </Container>
        </div>
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
                  <blockquote className="border-brand-red mt-6 border-l-4 pl-4 font-sans text-sm leading-relaxed font-semibold">
                    “{dossier.quote}”
                  </blockquote>
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
                            {related?.region ?? dateFormatter.format(new Date(entry.date))}
                          </Stamp>
                        </div>
                      </div>
                      <div className="p-5">
                        <DisplayHeading size="md" as="h3" distress={false}>
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
