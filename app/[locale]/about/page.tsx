import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Button, Container, DisplayHeading, Eyebrow } from "@/components/primitives";
import { Manifesto } from "@/components/sections";
import { PaperZone, RedZone } from "@/components/surfaces";
import { buildWhatsAppLink } from "@/lib/contact/whatsappLink";
import { getPageFrontmatter } from "@/lib/content/getPageMdx";
import { getPageMdxComponent } from "@/lib/content/pageMdxRegistry";
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
  const t = await getTranslations({ locale, namespace: "about" });
  const fm = await getPageFrontmatter("about", locale);
  const site = getSiteUrl();
  const url = `${site}/${locale}/about`;
  const title = `${t("title")} | ${SITE_NAME}`;
  const description = fm?.description ?? t("metadata_description");

  const pathByLocale = Object.fromEntries(locales.map((loc) => [loc, "/about"])) as Record<
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

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const [t, tWhatsApp, tCommon, MdxBody] = await Promise.all([
    getTranslations({ locale, namespace: "about" }),
    getTranslations({ locale, namespace: "whatsapp" }),
    getTranslations({ locale, namespace: "common" }),
    getPageMdxComponent("about", locale),
  ]);

  const whatsAppHref = buildWhatsAppLink({ message: tWhatsApp("default_message") });

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

      {/*
        Paper zone — founder bio + MDX body.
        Founder portrait slot is documented inline. Phase 10 swaps in the
        real halftone PNG via <CutoutFigure src="/images/halftone/founder.png" />.
      */}
      <PaperZone density="default" tornBottom={2}>
        <Container width="narrow">
          <div className="mb-12 space-y-3">
            <Eyebrow rule>{t("founder_eyebrow")}</Eyebrow>
            <DisplayHeading size="lg" as="h2">
              {t("founder_name")}
            </DisplayHeading>
            <p className="font-sans text-sm opacity-80">{t("founder_caption")}</p>
            {/*
              Halftone portrait slot — pending CLAUDE.md §16 open question on
              founder portrait source. Phase 10 fills in the real PNG.
            */}
          </div>
          {MdxBody ? (
            <article className="prose-tour">
              <MdxBody />
            </article>
          ) : null}
        </Container>
      </PaperZone>

      {/* Manifesto echo + CTA */}
      <RedZone density="default" tornBottom={3}>
        <Manifesto />
      </RedZone>

      <PaperZone density="default">
        <Container className="flex flex-col items-start gap-6">
          <Eyebrow rule>{tCommon("talk_to_us")}</Eyebrow>
          <Button href={whatsAppHref} edge={1} tilt="left" variant="sticker-filled" external>
            {t("cta")}
          </Button>
        </Container>
      </PaperZone>
    </>
  );
}
