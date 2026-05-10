import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Container, DisplayHeading, Eyebrow, Stamp } from "@/components/primitives";
import { PaperZone, RedZone } from "@/components/surfaces";
import { getJournalFrontmatter, listJournalEntries } from "@/lib/content/getJournalMdx";
import {
  getJournalMdxComponent,
  listJournalSlugs,
  listLocalesForPost,
} from "@/lib/content/journalMdxRegistry";
import { isLocale, type Locale, locales } from "@/lib/i18n/config";
import { Link as I18nLink } from "@/lib/i18n/navigation";
import { localeAlternates } from "@/lib/seo/metadata";
import { SITE_NAME, getSiteUrl } from "@/lib/seo/site";

export const revalidate = 600;

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

/**
 * Pre-render every (locale, slug) pair where the MDX file exists. Posts that
 * haven't been translated yet are skipped from static generation; visitors
 * to /[uncovered-locale]/journal/[slug] hit notFound().
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
  const url = `${site}/${locale}/journal/${slug}`;
  const title = `${fm.title} | ${SITE_NAME}`;
  const description = fm.excerpt;

  // Hreflang only points at locales where the MDX exists — sending a tag at
  // a missing translation would be a bad signal to search engines.
  const availableLocales = listLocalesForPost(slug);
  const pathByLocale = Object.fromEntries(
    locales.filter((loc) => availableLocales.includes(loc)).map((loc) => [loc, `/journal/${slug}`]),
  ) as Record<Locale, string>;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      ...(Object.keys(pathByLocale).length > 0
        ? localeAlternates({
            pathByLocale: { ...pathByLocale, es: pathByLocale.es ?? `/journal/${slug}` },
          })
        : {}),
    },
    openGraph: { type: "article", title, description, url, siteName: SITE_NAME },
  };
}

export default async function JournalPost({ params }: Props) {
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

  // "More from the journal" — show up to 2 other posts.
  const others = entries.filter((entry) => entry.slug !== slug).slice(0, 2);

  return (
    <>
      <RedZone density="heavy" tornBottom={1}>
        <Container width="narrow" className="space-y-6">
          <I18nLink
            href="/journal"
            className="text-eyebrow tracking-eyebrow font-semibold uppercase underline-offset-4 hover:underline"
          >
            ← {t("back")}
          </I18nLink>
          <Stamp className="self-start" tilt={-2}>
            {dateLabel}
          </Stamp>
          <DisplayHeading size="2xl" as="h1">
            {fm.title}
          </DisplayHeading>
          {fm.excerpt ? (
            <p className="max-w-prose font-sans text-lg leading-relaxed">{fm.excerpt}</p>
          ) : null}
        </Container>
      </RedZone>

      <PaperZone density="default" tornBottom={others.length > 0 ? 2 : undefined}>
        <Container width="narrow">
          <article className="prose-tour">
            <MdxBody />
          </article>
        </Container>
      </PaperZone>

      {others.length > 0 ? (
        <RedZone density="default">
          <Container className="space-y-8">
            <div>
              <Eyebrow rule>{t("share_eyebrow")}</Eyebrow>
              <DisplayHeading size="lg" as="h2" className="mt-3">
                {t("back")}
              </DisplayHeading>
            </div>
            <ul className="grid gap-6 sm:grid-cols-2">
              {others.map((entry) => (
                <li key={entry.slug}>
                  <I18nLink
                    href={`/journal/${entry.slug}`}
                    className="block border-2 border-current p-5 transition-transform duration-200 hover:-translate-y-1"
                  >
                    <Stamp tilt={2} className="mb-3 self-start">
                      {dateFormatter.format(new Date(entry.date)).toUpperCase()}
                    </Stamp>
                    <DisplayHeading size="md" as="h3">
                      {entry.title}
                    </DisplayHeading>
                    {entry.excerpt ? (
                      <p className="mt-3 font-sans text-sm leading-relaxed opacity-80">
                        {entry.excerpt}
                      </p>
                    ) : null}
                  </I18nLink>
                </li>
              ))}
            </ul>
          </Container>
        </RedZone>
      ) : null}
    </>
  );
}
