import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Button, Container, DisplayHeading, Eyebrow } from "@/components/primitives";
import { PaperZone } from "@/components/surfaces";

type Props = {
  params: Promise<{ locale: string }>;
};

/**
 * Phase 4 placeholder home. The Phase 6 hero validation gate will replace
 * this with the full poster composition.
 *
 * For Phase 4 we just exercise the i18n + shell wiring: dictionary keys
 * resolve, the locale URL prefix routes correctly, the Nav and Footer
 * (added in 4.3 / 4.5) wrap the surface.
 */
export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tCommon = await getTranslations("common");

  return (
    <PaperZone density="heavy" className="flex min-h-screen flex-col justify-center">
      <Container className="space-y-6">
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <DisplayHeading size="xl" as="h1">
          {t("headline")}
        </DisplayHeading>
        <p className="max-w-prose font-sans text-base/relaxed">{t("manifesto")}</p>
        <div className="flex flex-wrap gap-4">
          <Button href={`/${locale}/tours`} edge={1} tilt="left" variant="sticker-filled">
            {tCommon("plan_trip")}
          </Button>
          <Button href={`/${locale}/journal`} edge={2} tilt="right">
            {tCommon("read_journal")}
          </Button>
        </div>
        <div className="mt-12 border-t-2 border-dashed border-current/20 pt-6 text-sm opacity-70">
          <p className="mb-2 font-mono text-xs uppercase">dev surfaces</p>
          <div className="flex flex-wrap gap-3">
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
        </div>
      </Container>
    </PaperZone>
  );
}
