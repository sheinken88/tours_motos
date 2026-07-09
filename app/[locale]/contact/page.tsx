import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Container, DisplayHeading, Eyebrow } from "@/components/primitives";
import { InquiryForm, type InquiryTourOption } from "@/components/forms";
import { RedZone } from "@/components/surfaces";
import { isLocale, type Locale, locales } from "@/lib/i18n/config";
import { localeAlternates } from "@/lib/seo/metadata";
import { SITE_NAME, getSiteUrl } from "@/lib/seo/site";
import { getTours } from "@/lib/sheets/queries";

export const revalidate = 600;

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tour?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: "contact" });
  const site = getSiteUrl();
  const url = `${site}/${locale}/contact`;
  const title = `${t("title")} | ${SITE_NAME}`;
  const description = t("metadata_description");

  const pathByLocale = Object.fromEntries(locales.map((loc) => [loc, "/contact"])) as Record<
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

export default async function ContactPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { tour } = await searchParams;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const [t, tours] = await Promise.all([
    getTranslations({ locale, namespace: "contact" }),
    getTours(locale),
  ]);

  // Build tour options for the dropdown — title in the active locale, but
  // post the canonical slug so the inbox isn't sensitive to slug churn.
  const tourOptions: InquiryTourOption[] = tours.map((tourEntry) => ({
    slug: tourEntry.slug,
    title: tourEntry.title[locale],
  }));

  // Accept canonical slugs plus current/legacy public URL slugs, but post the
  // canonical slug so the inbox and Sheets joins stay stable across URL edits.
  const presetTour =
    tour &&
    tours.find(
      (tourEntry) => tourEntry.slug === tour || Object.values(tourEntry.slugs).includes(tour),
    )?.slug;

  return (
    <>
      <RedZone
        density="default"
        id="contact-form"
        className="scroll-mt-32 pt-36 pb-20 md:pt-40 md:pb-24 lg:pt-44"
      >
        <Container className="grid gap-14 lg:grid-cols-[minmax(18rem,0.72fr)_minmax(0,1.28fr)] lg:items-start lg:gap-20 xl:gap-24">
          <div className="space-y-6 lg:sticky lg:top-36">
            <Eyebrow>{t("eyebrow")}</Eyebrow>
            <DisplayHeading size="xl" as="h1">
              {t("headline")}
            </DisplayHeading>
            <p className="max-w-prose font-sans text-lg leading-relaxed">
              {t("intro")}{" "}
              <a
                href={`mailto:${t("email_body")}`}
                className="font-semibold underline underline-offset-4"
              >
                {t("email_body")}
              </a>
            </p>
          </div>

          <div className="space-y-8 lg:pt-4 xl:pt-6">
            <div className="max-w-4xl space-y-3">
              <Eyebrow rule>{t("form_eyebrow")}</Eyebrow>
              <DisplayHeading size="lg" as="h2" className="max-w-[16ch]">
                {t("form_heading")}
              </DisplayHeading>
            </div>
            <InquiryForm
              locale={locale}
              kind={presetTour ? "tour" : "contact"}
              tours={tourOptions}
              defaultTourSlug={presetTour}
              tourSlug={presetTour}
            />
          </div>
        </Container>
      </RedZone>
    </>
  );
}
