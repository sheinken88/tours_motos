import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Container, DisplayHeading, Eyebrow } from "@/components/primitives";
import { InquiryForm, type InquiryTourOption } from "@/components/forms";
import { PaperZone, RedZone } from "@/components/surfaces";
import { buildWhatsAppLink } from "@/lib/contact/whatsappLink";
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

  const [t, tWhatsApp, tours] = await Promise.all([
    getTranslations({ locale, namespace: "contact" }),
    getTranslations({ locale, namespace: "whatsapp" }),
    getTours(locale),
  ]);

  const whatsAppHref = buildWhatsAppLink({ message: tWhatsApp("default_message") });

  // Build tour options for the dropdown — title in the active locale, but
  // post the canonical slug so the inbox isn't sensitive to slug churn.
  const tourOptions: InquiryTourOption[] = tours.map((tourEntry) => ({
    slug: tourEntry.slug,
    title: tourEntry.title[locale],
  }));

  // If the user landed via /contact?tour=sobre-las-nubes from a tour CTA, pre-
  // select that tour and tag the submission as a tour inquiry.
  const presetTour = tour && tours.some((t) => t.slug === tour) ? tour : undefined;

  return (
    <>
      <RedZone density="heavy" tornBottom={1}>
        <Container className="space-y-6">
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <DisplayHeading size="2xl" as="h1">
            {t("headline")}
          </DisplayHeading>
          <p className="max-w-prose font-sans text-lg leading-relaxed">{t("intro")}</p>
        </Container>
      </RedZone>

      <PaperZone density="default" tornBottom={2}>
        <Container>
          <div className="grid gap-10 md:grid-cols-2">
            <article className="space-y-3">
              <Eyebrow rule>{t("channels_eyebrow")}</Eyebrow>
              <DisplayHeading size="md" as="h2">
                {t("whatsapp_label")}
              </DisplayHeading>
              <p className="font-sans text-base leading-relaxed">{t("whatsapp_body")}</p>
              <a
                href={whatsAppHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-eyebrow tracking-eyebrow text-accent-on-paper font-semibold uppercase underline-offset-4 hover:underline"
              >
                {t("whatsapp_label")} →
              </a>
            </article>
            <article className="space-y-3">
              <Eyebrow rule>{t("email_label")}</Eyebrow>
              <DisplayHeading size="md" as="h2">
                {t("email_body")}
              </DisplayHeading>
              <a
                href={`mailto:${t("email_body")}`}
                className="text-eyebrow tracking-eyebrow text-accent-on-paper font-semibold uppercase underline-offset-4 hover:underline"
              >
                {t("email_label")} →
              </a>
            </article>
          </div>
        </Container>
      </PaperZone>

      <RedZone density="default">
        <Container width="narrow" className="space-y-8">
          <div className="space-y-3">
            <Eyebrow rule>{t("form_eyebrow")}</Eyebrow>
            <DisplayHeading size="xl" as="h2">
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
        </Container>
      </RedZone>
    </>
  );
}
