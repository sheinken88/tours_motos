import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { Container } from "@/components/primitives";
import { Hero } from "@/components/sections/Hero";
import { TourGrid } from "@/components/sections/TourGrid";
import { PaperZone, RedZone } from "@/components/surfaces";
import { isLocale } from "@/lib/i18n/config";
import { Link as I18nLink } from "@/lib/i18n/navigation";
import { getTours } from "@/lib/sheets/queries";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  setRequestLocale(locale);

  const t = await getTranslations("tours_index");
  const tours = await getTours(locale);

  return (
    <>
      <Hero locale={locale} />

      {/* Tours preview — exercises the Phase 5 Sheets pipeline */}
      <PaperZone density="default" tornBottom={3}>
        <div className="flex flex-col gap-8">
          <TourGrid
            tours={tours}
            locale={locale}
            limit={3}
            eyebrow={t("eyebrow")}
            heading={t("headline")}
          />
          <Container>
            <I18nLink
              href="/tours"
              className="text-eyebrow tracking-eyebrow text-accent-on-paper font-semibold uppercase underline-offset-4 hover:underline"
            >
              {t("all_routes_eyebrow")} →
            </I18nLink>
          </Container>
        </div>
      </PaperZone>

      {/* Dev surfaces — kept for development convenience; remove when the
          marketing surface is feature-complete. */}
      <RedZone density="light">
        <Container className="space-y-3">
          <p className="text-eyebrow tracking-eyebrow font-mono text-xs uppercase opacity-70">
            dev surfaces
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <Link className="underline-offset-4 hover:underline" href="/dev/tokens">
              /dev/tokens
            </Link>
            <Link className="underline-offset-4 hover:underline" href="/dev/components">
              /dev/components
            </Link>
            <Link className="underline-offset-4 hover:underline" href="/dev/zones">
              /dev/zones
            </Link>
          </div>
        </Container>
      </RedZone>
    </>
  );
}
