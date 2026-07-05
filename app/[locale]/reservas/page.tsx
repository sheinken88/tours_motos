import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Button, Container, DisplayHeading, Eyebrow, XIcon } from "@/components/primitives";
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
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: "reservations" });
  const site = getSiteUrl();
  const url = `${site}/${locale}/reservas`;
  const title = `${t("title")} | ${SITE_NAME}`;
  const description = t("metadata_description");

  const pathByLocale = Object.fromEntries(locales.map((loc) => [loc, "/reservas"])) as Record<
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

export default async function ReservationsPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const [t, tWhatsApp, tours] = await Promise.all([
    getTranslations({ locale, namespace: "reservations" }),
    getTranslations({ locale, namespace: "whatsapp" }),
    getTours(locale),
  ]);

  const tourOptions: InquiryTourOption[] = tours.map((tourEntry) => ({
    slug: tourEntry.slug,
    title: tourEntry.title[locale],
  }));
  const items = t.raw("items") as string[];
  const whatsAppHref = buildWhatsAppLink({ message: tWhatsApp("default_message") });

  return (
    <>
      <RedZone density="heavy" tornBottom={1}>
        <Container className="space-y-6">
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <DisplayHeading size="2xl" as="h1">
            {t("headline")}
          </DisplayHeading>
          <p className="max-w-prose font-sans text-lg leading-relaxed">{t("intro")}</p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Button href={whatsAppHref} external edge={1} tilt="left" variant="sticker-filled">
              {t("whatsapp_cta")}
            </Button>
            <Button href={`/${locale}/calendar`} edge={3} tilt="right">
              {t("calendar_cta")}
            </Button>
          </div>
        </Container>
      </RedZone>

      <PaperZone density="default" tornBottom={2}>
        <Container className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div className="space-y-4">
            <Eyebrow rule>{t("steps_eyebrow")}</Eyebrow>
            <DisplayHeading size="lg" as="h2">
              {t("steps_heading")}
            </DisplayHeading>
          </div>
          <ul className="grid gap-4 font-sans text-base leading-relaxed sm:grid-cols-2">
            {items.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <XIcon className="text-brand-red mt-1 h-5 w-5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Container>
      </PaperZone>

      <RedZone density="default">
        <Container width="narrow" className="space-y-8">
          <div className="space-y-3">
            <Eyebrow rule>{t("form_eyebrow")}</Eyebrow>
            <DisplayHeading size="xl" as="h2">
              {t("form_heading")}
            </DisplayHeading>
            <p className="max-w-prose font-sans text-base leading-relaxed">{t("form_body")}</p>
          </div>
          <InquiryForm locale={locale} kind="contact" tours={tourOptions} />
        </Container>
      </RedZone>
    </>
  );
}
