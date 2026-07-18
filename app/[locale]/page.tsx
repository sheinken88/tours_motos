import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import Image from "next/image";
import { Button, Container, DisplayHeading, Eyebrow } from "@/components/primitives";
import { InquiryForm, type InquiryTourOption } from "@/components/forms";
import {
  CalendarStrip,
  CustomRouteTeaser,
  Hero,
  JournalGrid,
  type JournalPost,
  TourGrid,
} from "@/components/sections";
import { PaperZone, RedZone } from "@/components/surfaces";
import { listJournalEntries } from "@/lib/content/getJournalMdx";
import { isLocale, localeCodes, locales, type Locale } from "@/lib/i18n/config";
import { localeAlternates } from "@/lib/seo/metadata";
import { SITE_NAME, getSiteUrl } from "@/lib/seo/site";
import { getTours } from "@/lib/sheets/queries";

type Props = {
  params: Promise<{ locale: string }>;
};

type HomeCustomStat = {
  value: string;
  label: string;
};

type HomeAboutProof = {
  value: string;
  label: string;
};

type HomeAboutSectionProps = {
  eyebrow: string;
  heading: string;
  body: string;
  href: string;
  ctaLabel: string;
  proofs: HomeAboutProof[];
  fieldNotes: string[];
  photoAlt: string;
};

const homeJournalColorImages: Record<string, string> = {
  "/images/tours/sobre_las_nubes/sobre_las_nubes_1_halftone.png":
    "/images/taller_de_rutas/sobre-las-nubes/2.jpeg",
  "/images/tours/cruces_del_sur/cruces_del_sur_1_halftone.png":
    "/images/taller_de_rutas/cruces-del-sur/cruces-del-sur-hero-mirrored.jpeg",
  "/images/tours/gigantes_del_oeste/gigantes_del_oeste_1_halftone.png":
    "/images/taller_de_rutas/gigantes-del-oeste/4.jpeg",
  "/images/tours/volcanes_del_norte/volcanes_del_norte_1_halftone.png":
    "/images/taller_de_rutas/volcanes-norte/Volvimos, ajustamos, mejoramos.jpg",
};

function resolveHomeJournalImage(image?: string): string | undefined {
  if (!image) return undefined;
  return homeJournalColorImages[image] ?? image;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const t = await getTranslations({ locale, namespace: "home" });
  const site = getSiteUrl();
  const url = `${site}/${locale}`;
  const title = t("metadata_title");
  const description = t("metadata_description");
  const pathByLocale = Object.fromEntries(locales.map((loc) => [loc, ""])) as Record<
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
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function Home({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  setRequestLocale(locale);

  const [tToursIdx, tCustom, tAbout, tJournal, tContact, tHome, tours, journalEntries] =
    await Promise.all([
      getTranslations({ locale, namespace: "tours_index" }),
      getTranslations({ locale, namespace: "home_custom" }),
      getTranslations({ locale, namespace: "home_about" }),
      getTranslations({ locale, namespace: "home_journal" }),
      getTranslations({ locale, namespace: "contact" }),
      getTranslations({ locale, namespace: "home" }),
      getTours(locale),
      listJournalEntries(locale),
    ]);

  const tGrid = await getTranslations({ locale, namespace: "journal_grid" });

  const tourOptions: InquiryTourOption[] = tours.map((tourEntry) => ({
    slug: tourEntry.slug,
    title: tourEntry.title[locale],
  }));

  // Map journal MDX entries to the JournalGrid props shape.
  const journalPosts: JournalPost[] = journalEntries.slice(0, 4).map((entry) => ({
    slug: entry.slug,
    title: entry.title,
    excerpt: entry.excerpt,
    date: entry.date,
    locale: entry.locale,
    image: resolveHomeJournalImage(entry.image),
    imageAlt: entry.imageAlt,
  }));
  const customStats = tCustom.raw("stats") as HomeCustomStat[];
  const customItems = tCustom.raw("items") as string[];
  const customRouteStops = tCustom.raw("route_stops") as string[];
  const aboutProofs = tAbout.raw("proofs") as HomeAboutProof[];
  const aboutFieldNotes = tAbout.raw("field_notes") as string[];
  const site = getSiteUrl();
  const homeHeroVideoJsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: tHome("video_name"),
    description: tHome("video_description"),
    thumbnailUrl: `${site}/video/hero-bg-poster.jpg`,
    uploadDate: "2026-06-25",
    duration: "PT50S",
    contentUrl: `${site}/video/hero-bg.mp4`,
    encodingFormat: "video/mp4",
    inLanguage: localeCodes[locale],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeHeroVideoJsonLd) }}
      />

      {/* 1 · Hero (red) ─────────────────────────────────────────────────── */}
      <Hero locale={locale} />

      {/* 2 · Tours preview (paper) ──────────────────────────────────────── */}
      <PaperZone density="default" tornBottom={3} className="overflow-x-clip">
        <TourGrid
          tours={tours}
          locale={locale}
          limit={4}
          eyebrow={tToursIdx("eyebrow")}
          heading={tToursIdx("headline")}
          variant="homeShowcase"
          ctaHref={`/${locale}/tours`}
          ctaLabel={tToursIdx("all_tours_cta")}
        />
      </PaperZone>

      {/* 3 · Calendar strip (red) ───────────────────────────────────────── */}
      <RedZone density="default" tornBottom={2}>
        <CalendarStrip locale={locale} limit={3} />
      </RedZone>

      {/* 4 · Journal preview (paper) ────────────────────────────────────── */}
      <PaperZone density="default" tornBottom={3}>
        <div className="flex flex-col gap-8">
          <JournalGrid
            posts={journalPosts}
            limit={4}
            eyebrow={tGrid("eyebrow")}
            heading={tJournal("heading")}
            readMoreLabel={tGrid("read_more")}
            emptyMessage={tJournal("intro")}
          />
          {journalPosts.length > 0 ? (
            <Container>
              <Button
                href={`/${locale}/taller-de-rutas`}
                edge={2}
                tilt="right"
                variant="sticker-outline"
                className="px-9 py-4 text-base"
              >
                {tJournal("see_all")}
              </Button>
            </Container>
          ) : null}
        </div>
      </PaperZone>

      {/* 5 · About teaser (red) ─────────────────────────────────────────── */}
      <RedZone density="default" tornBottom={1}>
        <HomeAboutSection
          eyebrow={tAbout("eyebrow")}
          heading={tAbout("heading")}
          body={tAbout("body")}
          href={`/${locale}/about`}
          ctaLabel={tAbout("cta")}
          proofs={aboutProofs}
          fieldNotes={aboutFieldNotes}
          photoAlt={tAbout("photo_alt")}
        />
      </RedZone>

      {/* 6 · Custom teaser (paper) ──────────────────────────────────────── */}
      <PaperZone density="default" tornBottom={4} className="overflow-x-clip">
        <CustomRouteTeaser
          eyebrow={tCustom("eyebrow")}
          heading={tCustom("heading")}
          body={tCustom("body")}
          href={`/${locale}/custom`}
          ctaLabel={tCustom("cta")}
          boardEyebrow={tCustom("board_eyebrow")}
          boardTitle={tCustom("board_title")}
          boardBody={tCustom("board_body")}
          stats={customStats}
          items={customItems}
          routeStops={customRouteStops}
        />
      </PaperZone>

      {/* 7 · Contact form (red) ──────────────────────────────────────────
          Two-column grid: form on the left, rider cutout on the right.
          The red band sits above the following paper footer so the scaled
          cutout can bleed across that boundary instead of being painted over. */}
      <RedZone density="default" className="z-10 overflow-x-clip overflow-y-visible">
        <Container>
          <div className="grid items-stretch gap-12 md:min-h-[clamp(42rem,45.6vw,58.5rem)] md:grid-cols-[1fr_1.4fr] md:gap-16">
            <div className="space-y-8">
              <div className="space-y-3">
                <Eyebrow rule>{tContact("eyebrow")}</Eyebrow>
                <DisplayHeading size="2xl" as="h2">
                  {tContact("headline")}
                </DisplayHeading>
                <p className="max-w-prose font-sans text-lg leading-relaxed">{tContact("intro")}</p>
              </div>
              <InquiryForm locale={locale} kind="contact" tours={tourOptions} />
            </div>
            <div className="relative hidden h-full w-full -translate-x-4 overflow-visible md:block lg:-translate-x-8 xl:-translate-x-12">
              <Image
                src="/images/halftone/hero-rider-cutout.png"
                alt={tHome("rider_alt")}
                fill
                sizes="(min-width: 768px) 60vw, 0px"
                className="pointer-events-none translate-y-16 scale-125 object-contain object-right-bottom select-none md:scale-[1.35] lg:translate-y-20 lg:scale-[1.45]"
              />
            </div>
          </div>
        </Container>
      </RedZone>
    </>
  );
}

function HomeAboutSection({
  eyebrow,
  heading,
  body,
  href,
  ctaLabel,
  proofs,
  fieldNotes,
  photoAlt,
}: HomeAboutSectionProps) {
  return (
    <Container className="relative isolate">
      <p
        className="font-display text-paper/[0.07] pointer-events-none absolute -top-10 right-0 hidden text-[8.75rem] leading-none uppercase select-none lg:block xl:text-[10rem]"
        aria-hidden="true"
      >
        Equipo
      </p>
      <div
        className="border-paper/20 pointer-events-none absolute top-16 right-10 hidden h-48 w-72 -rotate-2 border-2 border-dashed lg:block"
        aria-hidden="true"
      />

      <div className="relative z-10 grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-16">
        <div className="space-y-8">
          <div className="max-w-4xl space-y-6">
            <Eyebrow rule>{eyebrow}</Eyebrow>
            <DisplayHeading size="xl" as="h2" className="max-w-[11ch]" style={{ lineHeight: 1.18 }}>
              {heading}
            </DisplayHeading>
            <p className="max-w-2xl font-sans text-lg leading-relaxed sm:text-xl">{body}</p>
          </div>

          {proofs.length > 0 ? (
            <div className="bg-paper-grain text-ink shadow-sticker-ink grid max-w-4xl border-2 border-current sm:grid-cols-2 xl:grid-cols-4">
              {proofs.map((proof) => (
                <div
                  key={`${proof.value}-${proof.label}`}
                  className="min-w-0 border-current px-5 py-6 sm:border-r-2"
                >
                  <p className="text-ink font-display text-[2.25rem] leading-none">
                    <ProofValue value={proof.value} />
                  </p>
                  <p className="text-eyebrow tracking-eyebrow mt-2 font-semibold uppercase opacity-75">
                    {proof.label}
                  </p>
                </div>
              ))}
            </div>
          ) : null}

          {fieldNotes.length > 0 ? (
            <ul className="grid max-w-3xl gap-3 font-sans text-base leading-relaxed sm:grid-cols-2">
              {fieldNotes.map((note) => (
                <li key={note} className="flex items-start gap-3">
                  <CheckMarkIcon className="mt-1 h-5 w-5 shrink-0" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          ) : null}

          <Button href={href} edge={2} tilt="right" variant="sticker-outline">
            {ctaLabel}
          </Button>
        </div>

        <div className="relative min-h-[24rem] sm:min-h-[28rem] lg:min-h-[34rem]">
          <figure
            className="bg-paper-aged border-paper/45 absolute top-0 right-0 h-full w-[92%] rotate-1 overflow-hidden border-2 sm:w-[88%] lg:w-[86%]"
            style={{
              clipPath: "polygon(0 7%, 100% 0, 97% 91%, 78% 100%, 4% 94%)",
            }}
          >
            <Image
              src="/images/nosotros/20260402_180621.jpg"
              alt={photoAlt}
              fill
              sizes="(min-width: 1024px) 44vw, 88vw"
              className="object-cover object-center contrast-110 saturate-105"
            />
          </figure>
        </div>
      </div>
    </Container>
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

function ProofValue({ value }: { value: string }) {
  if (value.endsWith("km")) {
    return (
      <span className="block text-[2rem] whitespace-nowrap xl:text-[1.9rem]">
        {value.slice(0, -2)}
        <span className="ml-0.5 text-[0.58em]">km</span>
      </span>
    );
  }

  return <>{value}</>;
}
