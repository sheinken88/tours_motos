import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Button, Container, DisplayHeading, Eyebrow } from "@/components/primitives";
import { TourGrid } from "@/components/sections/TourGrid";
import { PlaceholderMountains } from "@/components/surfaces/PlaceholderHalftones";
import { PaperZone, RedZone, RoutePrint } from "@/components/surfaces";
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
      <RedZone density="heavy" tornBottom={3} className="overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[52%] opacity-90">
          <PlaceholderMountains className="absolute inset-0 h-full w-full" tint="ink" />
        </div>

        <Container className="relative z-10 grid min-h-[64vh] gap-10 lg:min-h-[68vh] lg:grid-cols-[minmax(0,1fr)_minmax(24rem,0.8fr)] lg:items-center xl:min-h-[72vh]">
          <div className="max-w-[50rem] space-y-6">
            <Eyebrow>{t("eyebrow")}</Eyebrow>
            <DisplayHeading size="2xl" as="h1">
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

          <div className="relative -mx-5 sm:-mx-8 md:mx-0">
            <RoutePrint
              alt={t("hero_image_alt")}
              colorSrc="/images/nosotros/428-DSC09893.jpg"
              priority
              sizes="(min-width: 1024px) 44vw, 100vw"
              className="h-72 sm:h-[22rem] md:rotate-1 lg:h-[30rem] lg:-rotate-1 xl:h-[34rem]"
            />
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
          variant="posterWall"
        />
      </PaperZone>
    </>
  );
}
