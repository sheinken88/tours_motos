import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Container, DisplayHeading, Eyebrow } from "@/components/primitives";
import { JournalGrid, type JournalPost } from "@/components/sections";
import { PaperZone, RedZone } from "@/components/surfaces";
import { listJournalEntries } from "@/lib/content/getJournalMdx";
import { isLocale, type Locale, locales } from "@/lib/i18n/config";
import { localeAlternates } from "@/lib/seo/metadata";
import { SITE_NAME, getSiteUrl } from "@/lib/seo/site";

export const revalidate = 600;

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: "journal_index" });
  const site = getSiteUrl();
  const url = `${site}/${locale}/journal`;
  const title = `${t("title")} | ${SITE_NAME}`;
  const description = t("metadata_description");

  const pathByLocale = Object.fromEntries(locales.map((loc) => [loc, "/journal"])) as Record<
    Locale,
    string
  >;

  return {
    title,
    description,
    alternates: { canonical: url, ...localeAlternates({ pathByLocale }) },
    openGraph: { type: "website", title, description, url, siteName: SITE_NAME },
  };
}

export default async function JournalIndex({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const [t, entries] = await Promise.all([
    getTranslations({ locale, namespace: "journal_index" }),
    listJournalEntries(locale),
  ]);

  const posts: JournalPost[] = entries.map((entry) => ({
    slug: entry.slug,
    title: entry.title,
    excerpt: entry.excerpt,
    date: entry.date,
    locale: entry.locale,
    image: entry.image,
    imageAlt: entry.imageAlt,
  }));

  const tGrid = await getTranslations({ locale, namespace: "journal_grid" });

  return (
    <>
      <RedZone density="heavy" tornBottom={2}>
        <Container className="space-y-6">
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <DisplayHeading size="2xl" as="h1">
            {t("headline")}
          </DisplayHeading>
          <p className="max-w-prose font-sans text-lg leading-relaxed">{t("intro")}</p>
        </Container>
      </RedZone>

      <PaperZone density="default">
        <JournalGrid
          posts={posts}
          eyebrow={tGrid("eyebrow")}
          heading={tGrid("heading")}
          readMoreLabel={tGrid("read_more")}
          emptyMessage={t("empty")}
        />
      </PaperZone>
    </>
  );
}
