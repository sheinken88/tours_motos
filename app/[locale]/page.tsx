import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/primitives";
import {
  CalendarStrip,
  Hero,
  JournalGrid,
  type JournalPost,
  PageTeaser,
  QuoteWithFigure,
  TourGrid,
} from "@/components/sections";
import { PaperZone, RedZone } from "@/components/surfaces";
import { listJournalEntries } from "@/lib/content/getJournalMdx";
import { isLocale } from "@/lib/i18n/config";
import { Link as I18nLink } from "@/lib/i18n/navigation";
import { getTours } from "@/lib/sheets/queries";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  setRequestLocale(locale);

  const [tToursIdx, tCustom, tAbout, tJournal, tQuote, tours, journalEntries] = await Promise.all([
    getTranslations({ locale, namespace: "tours_index" }),
    getTranslations({ locale, namespace: "home_custom" }),
    getTranslations({ locale, namespace: "home_about" }),
    getTranslations({ locale, namespace: "home_journal" }),
    getTranslations({ locale, namespace: "quote_section" }),
    getTours(locale),
    listJournalEntries(locale),
  ]);

  const tGrid = await getTranslations({ locale, namespace: "journal_grid" });

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
              className="text-eyebrow tracking-eyebrow text-accent-on-paper font-semibold uppercase underline-offset-4 hover:underline"
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
                href="/journal"
                className="text-eyebrow tracking-eyebrow text-accent-on-paper font-semibold uppercase underline-offset-4 hover:underline"
              >
                {tJournal("see_all")} →
              </I18nLink>
            </Container>
          ) : null}
        </div>
      </PaperZone>

      {/* 7 · Quote anchor with halftone figure (red) ────────────────────────
          Photo uses mix-blend-multiply so the source's white sky drops out
          and only the figure reads against the red field. A radial mask
          feathers all four edges (~6%) so the figure diffuses into the
          field uniformly without eating structural detail like the wheel. */}
      <RedZone density="default" tornBottom={1}>
        <QuoteWithFigure
          quote={tQuote("hunter_thompson_quote")}
          attribution={tQuote("hunter_thompson_attribution")}
          figure={
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src="/images/halftone/hunter-thompson-bike.webp"
              alt="Hunter S. Thompson aiming a revolver while seated on a motorcycle"
              className="absolute inset-0 h-full w-full object-contain object-right-bottom mix-blend-multiply [-webkit-mask-image:radial-gradient(ellipse_at_center,black_75%,transparent_100%)] [mask-image:radial-gradient(ellipse_at_center,black_75%,transparent_100%)]"
              draggable={false}
            />
          }
        />
      </RedZone>
    </>
  );
}
