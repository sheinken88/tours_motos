import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Button, Container, DisplayHeading, Eyebrow, XIcon } from "@/components/primitives";
import { CustomTourForm } from "@/components/forms";
import { PaperZone, RedZone } from "@/components/surfaces";
import { buildWhatsAppLink } from "@/lib/contact/whatsappLink";
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
  const t = await getTranslations({ locale, namespace: "custom" });
  const site = getSiteUrl();
  const url = `${site}/${locale}/custom`;
  const title = `${t("title")} | ${SITE_NAME}`;
  const description = t("metadata_description");

  const pathByLocale = Object.fromEntries(locales.map((loc) => [loc, "/custom"])) as Record<
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

export default async function CustomPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const [t, tWhatsApp] = await Promise.all([
    getTranslations({ locale, namespace: "custom" }),
    getTranslations({ locale, namespace: "whatsapp" }),
  ]);

  const whatsAppHref = buildWhatsAppLink({ message: tWhatsApp("default_message") });
  const includesItems = t.raw("includes_items") as string[];
  const extrasItems = t.raw("extras_items") as string[];

  return (
    <>
      {/* Hero red zone */}
      <RedZone density="heavy" tornBottom={1}>
        <Container className="space-y-6">
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <DisplayHeading size="2xl" as="h1">
            {t("headline")}
          </DisplayHeading>
          <p className="max-w-prose font-sans text-lg leading-relaxed">{t("subheadline")}</p>
        </Container>
      </RedZone>

      {/* Explanation + Qué incluye + Opcionales */}
      <PaperZone density="default" tornBottom={2}>
        <Container className="space-y-16">
          <div className="grid gap-12 md:grid-cols-2 md:gap-16">
            <div className="space-y-5">
              <p className="font-sans text-lg leading-relaxed sm:text-xl">{t("p1")}</p>
              <p className="font-sans text-lg leading-relaxed sm:text-xl">{t("p2")}</p>
            </div>
            <div className="space-y-5">
              <Eyebrow rule>{t("includes_eyebrow")}</Eyebrow>
              <DisplayHeading size="lg" as="h2">
                {t("includes_heading")}
              </DisplayHeading>
              <ul className="space-y-4">
                {includesItems.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <XIcon className="mt-1.5 h-5 w-5 shrink-0" />
                    <span className="font-sans text-base leading-relaxed sm:text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Opcionales — separated visually so it reads as an add-on, not part of the includes list */}
          <div className="border-t-2 border-dashed border-current/25 pt-12">
            <div className="grid gap-8 md:grid-cols-[1fr_2fr] md:gap-12">
              <div className="space-y-3">
                <Eyebrow rule>{t("extras_eyebrow")}</Eyebrow>
                <DisplayHeading size="md" as="h3">
                  {t("extras_heading")}
                </DisplayHeading>
              </div>
              <ul className="space-y-4">
                {extrasItems.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <XIcon className="mt-1.5 h-5 w-5 shrink-0" />
                    <span className="font-sans text-base leading-relaxed sm:text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </PaperZone>

      {/* WhatsApp talk-direct */}
      <RedZone density="default" tornBottom={3}>
        <Container className="space-y-6">
          <Eyebrow rule>{t("talk_eyebrow")}</Eyebrow>
          <DisplayHeading size="lg" as="h2">
            {t("talk_heading")}
          </DisplayHeading>
          <p className="max-w-prose font-sans text-base leading-relaxed">{t("talk_body")}</p>
          <Button href={whatsAppHref} edge={2} tilt="right" external>
            WhatsApp
          </Button>
        </Container>
      </RedZone>

      {/* Form */}
      <PaperZone density="default">
        <Container width="narrow" className="space-y-8">
          <div className="space-y-3">
            <Eyebrow rule>{t("form_eyebrow")}</Eyebrow>
            <DisplayHeading size="xl" as="h2">
              {t("form_heading")}
            </DisplayHeading>
          </div>
          <CustomTourForm locale={locale} />
        </Container>
      </PaperZone>
    </>
  );
}
