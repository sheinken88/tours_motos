import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import Image from "next/image";
import { Container, DisplayHeading, Eyebrow } from "@/components/primitives";
import { InquiryForm, type InquiryTourOption } from "@/components/forms";
import {
  CalendarStrip,
  Hero,
  JournalGrid,
  type JournalPost,
  PageTeaser,
  TourGrid,
} from "@/components/sections";
import { PaperZone, RedZone } from "@/components/surfaces";
import { listJournalEntries } from "@/lib/content/getJournalMdx";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";
import { Link as I18nLink } from "@/lib/i18n/navigation";
import { localeAlternates } from "@/lib/seo/metadata";
import { SITE_NAME, getSiteUrl } from "@/lib/seo/site";
import { getTours } from "@/lib/sheets/queries";

type Props = {
  params: Promise<{ locale: string }>;
};

const homeTitle = "Moto On/Off — Expediciones en moto por Argentina";
const homeDescription =
  "Travesías en moto por Argentina: Salta, Jujuy, Mendoza, Catamarca y Patagonia. Ripio, altura y distancia para riders que quieren cruzar más.";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const site = getSiteUrl();
  const url = `${site}/${locale}`;
  const pathByLocale = Object.fromEntries(locales.map((loc) => [loc, ""])) as Record<
    Locale,
    string
  >;

  return {
    title: homeTitle,
    description: homeDescription,
    alternates: {
      canonical: url,
      ...localeAlternates({ pathByLocale }),
    },
    openGraph: {
      type: "website",
      title: homeTitle,
      description: homeDescription,
      url,
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title: homeTitle,
      description: homeDescription,
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
  const journalPosts: JournalPost[] = journalEntries.slice(0, 3).map((entry) => ({
    slug: entry.slug,
    title: entry.title,
    excerpt: entry.excerpt,
    date: entry.date,
    locale: entry.locale,
    image: entry.image,
    imageAlt: entry.imageAlt,
  }));

  return (
    <>
      {/* 1 · Hero (red) ─────────────────────────────────────────────────── */}
      <Hero locale={locale} />

      {/* 2 · Tours preview (paper) ──────────────────────────────────────── */}
      <PaperZone density="default" tornBottom={3}>
        <div className="flex flex-col gap-8">
          <TourGrid
            tours={tours}
            locale={locale}
            limit={3}
            eyebrow={tToursIdx("eyebrow")}
            heading={tToursIdx("headline")}
          />
          <Container>
            <I18nLink
              href="/tours"
              className="text-eyebrow tracking-eyebrow text-accent-on-paper inline-flex min-h-11 items-center py-1 font-semibold uppercase underline-offset-4 hover:underline"
            >
              {tToursIdx("all_routes_eyebrow")} →
            </I18nLink>
          </Container>
        </div>
      </PaperZone>

      {/* 3 · Calendar strip (red) ───────────────────────────────────────── */}
      <RedZone density="default" tornBottom={2}>
        <CalendarStrip locale={locale} limit={3} />
      </RedZone>

      {/* 4 · Custom teaser (paper) ──────────────────────────────────────── */}
      <PaperZone density="default" tornBottom={4}>
        <PageTeaser
          eyebrow={tCustom("eyebrow")}
          heading={tCustom("heading")}
          body={tCustom("body")}
          href={`/${locale}/custom`}
          ctaLabel={tCustom("cta")}
          edge={1}
          tilt="left"
          emphasis
        />
      </PaperZone>

      {/* 5 · About teaser (red) ─────────────────────────────────────────── */}
      <RedZone density="default" tornBottom={1}>
        <PageTeaser
          eyebrow={tAbout("eyebrow")}
          heading={tAbout("heading")}
          body={tAbout("body")}
          href={`/${locale}/about`}
          ctaLabel={tAbout("cta")}
          edge={2}
          tilt="right"
        />
      </RedZone>

      {/* 6 · Journal preview (paper) ────────────────────────────────────── */}
      <PaperZone density="default" tornBottom={3}>
        <div className="flex flex-col gap-8">
          <JournalGrid
            posts={journalPosts}
            limit={3}
            eyebrow={tGrid("eyebrow")}
            heading={tJournal("heading")}
            readMoreLabel={tGrid("read_more")}
            emptyMessage={tJournal("intro")}
          />
          {journalPosts.length > 0 ? (
            <Container>
              <I18nLink
                href="/taller-de-rutas"
                className="text-eyebrow tracking-eyebrow text-accent-on-paper inline-flex min-h-11 items-center py-1 font-semibold uppercase underline-offset-4 hover:underline"
              >
                {tJournal("see_all")} →
              </I18nLink>
            </Container>
          ) : null}
        </div>
      </PaperZone>

      {/* 7 · Contact form (red) ──────────────────────────────────────────
          Two-column grid: form on the left, rider cutout on the right.
          The red band sits above the following paper footer so the scaled
          cutout can bleed across that boundary instead of being painted over. */}
      <RedZone density="default" className="z-10 overflow-visible">
        <Container>
          <div className="grid items-stretch gap-12 md:grid-cols-[1fr_1.4fr] md:gap-16">
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
            <div className="relative hidden h-full w-full translate-x-16 overflow-visible md:block lg:translate-x-24 xl:translate-x-32">
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
