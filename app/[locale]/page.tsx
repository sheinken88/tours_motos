import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { Container, DisplayHeading, Eyebrow, Stamp } from "@/components/primitives";
import { Hero } from "@/components/sections/Hero";
import { PaperZone, RedZone } from "@/components/surfaces";
import { isLocale } from "@/lib/i18n/config";
import { getTours } from "@/lib/sheets/queries";
import { Link as I18nLink } from "@/lib/i18n/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  setRequestLocale(locale);

  const tours = await getTours(locale);

  return (
    <>
      <Hero locale={locale} />

      {/* Tours preview — exercises the Phase 5 Sheets pipeline */}
      <PaperZone density="default" tornBottom={3}>
        <Container className="space-y-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Eyebrow rule>Rutas</Eyebrow>
              <DisplayHeading size="xl" as="h2" className="mt-3">
                Viajes que dejan marca
              </DisplayHeading>
            </div>
            <I18nLink
              href="/tours"
              className="text-eyebrow tracking-eyebrow font-semibold uppercase underline-offset-4 hover:underline"
            >
              Ver todos →
            </I18nLink>
          </div>

          <ul className="grid gap-6 md:grid-cols-3">
            {tours.slice(0, 3).map((tour) => (
              <li key={tour.slug}>
                <I18nLink
                  href={`/tours/${tour.slugs[locale]}`}
                  className="bg-paper-light hover:shadow-sticker-ink ease-out-soft group flex h-full flex-col gap-4 border-2 border-current/20 p-6 transition-[box-shadow,transform] duration-200 hover:-translate-y-1"
                >
                  <Stamp className="text-accent-on-paper self-start">{tour.region}</Stamp>
                  <DisplayHeading size="md" as="h3">
                    {tour.title[locale]}
                  </DisplayHeading>
                  <p className="text-on-paper font-sans text-sm leading-relaxed opacity-80">
                    {tour.duration_days} días · {tour.distance_km.toLocaleString("es-AR")} km ·{" "}
                    {tour.difficulty}
                  </p>
                </I18nLink>
              </li>
            ))}
          </ul>
        </Container>
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
