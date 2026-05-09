import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container, DisplayHeading, Eyebrow } from "@/components/primitives";
import { TourGrid } from "@/components/sections/TourGrid";
import { PaperZone, RedZone } from "@/components/surfaces";
import { isLocale, type Locale, locales } from "@/lib/i18n/config";
import { localeAlternates } from "@/lib/seo/metadata";
import { SITE_NAME, getSiteUrl } from "@/lib/seo/site";
import { getTours } from "@/lib/sheets/queries";

export const revalidate = 600;

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: "tours_index" });
  const site = getSiteUrl();
  const url = `${site}/${locale}/tours`;
  const title = `${t("headline")} | ${SITE_NAME}`;
  const description = t("intro");

  const pathByLocale = Object.fromEntries(locales.map((loc) => [loc, "/tours"])) as Record<
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
  };
}

export default async function ToursIndex({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  setRequestLocale(locale);

  const t = await getTranslations("tours_index");
  const tours = await getTours(locale);

  return (
    <>
      <RedZone density="heavy" tornBottom={3}>
        <Container className="space-y-6">
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <DisplayHeading size="2xl" as="h1">
            {t("headline")}
          </DisplayHeading>
          <p className="max-w-prose font-sans text-lg leading-relaxed">{t("intro")}</p>
        </Container>
      </RedZone>

      <PaperZone density="default">
        <TourGrid
          tours={tours}
          locale={locale}
          eyebrow={t("all_routes_eyebrow")}
          heading={t("all_routes_heading")}
          emptyMessage={t("empty")}
        />
      </PaperZone>
    </>
  );
}
