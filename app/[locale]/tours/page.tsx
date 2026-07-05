import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Button, Container, DisplayHeading, Eyebrow } from "@/components/primitives";
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

  const [t, tCommon, tours] = await Promise.all([
    getTranslations("tours_index"),
    getTranslations("common"),
    getTours(locale),
  ]);

  return (
    <>
      <RedZone density="heavy" tornBottom={3} className="min-h-[100svh] overflow-hidden !py-0">
        <Image
          src="/images/nosotros/428-DSC09893.jpg"
          alt={t("hero_image_alt")}
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 z-0 h-full w-full object-cover object-[54%_center]"
        />
        <div className="from-brand-red/[0.70] via-brand-red/[0.24] pointer-events-none absolute inset-0 z-[3] bg-gradient-to-r to-transparent mix-blend-multiply" />
        <div className="from-ink/[0.30] via-ink/[0.08] pointer-events-none absolute inset-0 z-[3] bg-gradient-to-r to-transparent mix-blend-multiply" />
        <div className="from-ink/[0.24] via-ink/[0.07] pointer-events-none absolute inset-x-0 bottom-0 z-[4] h-2/5 bg-gradient-to-t to-transparent [mask-image:linear-gradient(to_right,black_0%,black_46%,transparent_78%)]" />
        <div className="from-ink/[0.16] pointer-events-none absolute inset-x-0 top-0 z-[4] h-48 bg-gradient-to-b to-transparent [mask-image:linear-gradient(to_right,black_0%,black_46%,transparent_78%)]" />
        <div
          className="pointer-events-none absolute inset-0 z-[5] opacity-10 mix-blend-multiply [background-image:linear-gradient(to_right,rgb(31_20_14)_0%,rgb(31_20_14/.28)_45%,transparent_78%),url('/textures/halftone-overlay.svg')] [background-size:100%_100%,18px_18px]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 z-[5] opacity-[0.08] mix-blend-multiply [background-image:linear-gradient(to_right,rgb(168_52_42/.82)_0%,rgb(168_52_42/.24)_45%,transparent_78%),url('/textures/red-grunge.svg')] [background-size:100%_100%,320px_320px]"
          aria-hidden="true"
        />

        <Container className="relative z-10 flex min-h-[100svh] items-center pt-32 pb-24 md:pt-40 md:pb-28">
          <div className="max-w-[48rem] space-y-6">
            <Eyebrow>{t("eyebrow")}</Eyebrow>
            <DisplayHeading size="2xl" as="h1" className="max-w-[9ch] leading-[0.88]">
              {t("headline")}
            </DisplayHeading>
            <p className="text-on-red max-w-2xl font-sans text-xl leading-relaxed md:text-2xl">
              {t("intro")}
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Button href="#rutas" edge={1} tilt="left" variant="sticker-filled">
                {tCommon("see_routes")}
              </Button>
              <Button href={`/${locale}/contact`} edge={2} tilt="right">
                {tCommon("talk_to_us")}
              </Button>
            </div>
          </div>
        </Container>
      </RedZone>

      <PaperZone id="rutas" density="heavy" className="overflow-hidden">
        <TourGrid
          tours={tours}
          locale={locale}
          eyebrow={t("all_routes_eyebrow")}
          heading={t("all_routes_heading")}
          emptyMessage={t("empty")}
          variant="homeShowcase"
          showHalftoneAccent={false}
        />
      </PaperZone>
    </>
  );
}
