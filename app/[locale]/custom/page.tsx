import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Button,
  Container,
  DisplayHeading,
  Eyebrow,
  Stamp,
  StickyNote,
  XIcon,
} from "@/components/primitives";
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

type StatItem = {
  value: string;
  label: string;
};

type TextCard = {
  title: string;
  body: string;
};

type RouteIdea = TextCard & {
  meta: string;
};

const customImages = {
  hero: "/images/halftone/hero-rider-cutout.png",
  puna: "/images/tours/sobre_las_nubes/sobre_las_nubes_1_color.jpg",
  cuyo: "/images/tours/gigantes_del_oeste/gigantes_del_oeste_1_color.jpg",
  patagonia: "/images/tours/cruces_del_sur/cruces_del_sur_1_color.jpeg",
} as const;

function ProofStat({ value, label }: StatItem) {
  return (
    <div className="border-r-2 border-current px-4 py-4 text-current last:border-r-0">
      <p className="font-display text-4xl leading-none uppercase md:text-5xl">{value}</p>
      <p className="mt-2 font-sans text-xs leading-tight font-semibold tracking-[var(--tracking-uppercase)] uppercase opacity-80">
        {label}
      </p>
    </div>
  );
}

function PosterPhoto({
  src,
  alt,
  className = "",
  sizes,
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <div
      className={`bg-paper-aged border-ink/25 group/photo relative isolate overflow-hidden border-2 ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover opacity-90 mix-blend-multiply contrast-125 grayscale saturate-0"
      />
      <Image
        src={src}
        alt=""
        aria-hidden="true"
        fill
        sizes={sizes}
        className="object-cover opacity-0 transition-opacity duration-300 ease-out group-hover/photo:opacity-100"
      />
      <div className="bg-brand-red pointer-events-none absolute inset-0 opacity-15 mix-blend-multiply" />
      <div
        className="pointer-events-none absolute inset-0 opacity-25 mix-blend-multiply"
        style={{
          backgroundImage: "url(/textures/halftone-overlay.svg)",
          backgroundRepeat: "repeat",
        }}
        aria-hidden="true"
      />
    </div>
  );
}

function HeroRouteSlip({ label, value, meta }: { label: string; value: string; meta: string }) {
  return (
    <div className="bg-paper-grain text-on-paper shadow-sticker-ink border-ink absolute bottom-4 left-0 z-10 w-64 -rotate-2 border-2 p-5 md:left-4 md:w-72">
      <p className="text-eyebrow tracking-eyebrow font-semibold uppercase opacity-75">{label}</p>
      <p className="text-accent-on-paper font-display mt-3 text-4xl leading-none uppercase md:text-5xl">
        {value}
      </p>
      <p className="mt-3 font-sans text-sm leading-relaxed opacity-80">{meta}</p>
    </div>
  );
}

function BriefCard({ title, body, index }: TextCard & { index: number }) {
  return (
    <article
      className={`border-ink/35 min-h-48 border-b-2 p-6 md:border-r-2 md:border-b-0 md:p-7 ${index === 3 ? "md:border-r-0" : ""}`}
    >
      <p className="font-display text-accent-on-paper text-3xl leading-none uppercase">{title}</p>
      <p className="mt-4 font-sans text-base leading-relaxed">{body}</p>
    </article>
  );
}

function ProcessStep({ title, body, index }: TextCard & { index: number }) {
  return (
    <article
      className="border-paper/55 relative min-h-72 border-2 p-6"
      style={{ transform: `rotate(${index % 2 === 0 ? -0.6 : 0.6}deg)` }}
    >
      <span
        aria-hidden="true"
        className="text-paper/20 font-display absolute right-4 bottom-2 text-8xl leading-none"
      >
        {index + 1}
      </span>
      <div className="relative space-y-4">
        <Stamp tilt={index % 2 === 0 ? -2 : 2}>Paso {index + 1}</Stamp>
        <p className="font-display text-3xl leading-none uppercase md:text-4xl">{title}</p>
        <p className="font-sans text-base leading-relaxed opacity-85">{body}</p>
      </div>
    </article>
  );
}

function RouteIdeaCard({ title, meta, body, index }: RouteIdea & { index: number }) {
  return (
    <article
      className="border-ink/35 border-2 p-5"
      style={{ transform: `rotate(${index - 1}deg)` }}
    >
      <p className="font-display text-accent-on-paper text-3xl leading-none uppercase">{title}</p>
      <p className="text-eyebrow tracking-eyebrow mt-3 font-semibold uppercase opacity-70">
        {meta}
      </p>
      <p className="mt-4 font-sans text-base leading-relaxed">{body}</p>
    </article>
  );
}

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
  const heroStats = t.raw("hero_stats") as StatItem[];
  const briefCards = t.raw("brief_cards") as TextCard[];
  const processSteps = t.raw("process_steps") as TextCard[];
  const routeIdeas = t.raw("route_ideas") as RouteIdea[];
  const promptItems = t.raw("prompt_items") as string[];

  return (
    <>
      <RedZone density="heavy" tornBottom={1} className="overflow-hidden">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_0.82fr] lg:items-end">
            <div className="relative z-10 space-y-8">
              <div className="space-y-6">
                <Eyebrow>{t("eyebrow")}</Eyebrow>
                <DisplayHeading size="2xl" as="h1">
                  {t("headline")}
                </DisplayHeading>
                <p className="max-w-3xl font-sans text-xl leading-relaxed md:text-2xl">
                  {t("subheadline")}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Button href={whatsAppHref} edge={1} tilt="left" variant="sticker-filled" external>
                  {t("hero_primary_cta")}
                </Button>
                <Button href="#custom-form" edge={3} tilt="right">
                  {t("hero_secondary_cta")}
                </Button>
              </div>

              <div className="border-paper/45 grid max-w-3xl grid-cols-3 border-2">
                {heroStats.map((item) => (
                  <ProofStat key={`${item.value}-${item.label}`} {...item} />
                ))}
              </div>
            </div>

            <div className="relative min-h-[32rem] md:min-h-[37rem] lg:min-h-[43rem]">
              <div className="absolute right-[-1.25rem] bottom-[-0.75rem] left-[-1rem] h-[34rem] md:right-[1rem] md:left-[2rem] md:h-[39rem] lg:right-[-3.5rem] lg:left-[-2rem] lg:h-[47rem]">
                <Image
                  src={customImages.hero}
                  alt={t("hero_image_alt")}
                  fill
                  sizes="(min-width: 1280px) 48vw, (min-width: 1024px) 44vw, 88vw"
                  priority
                  className="object-contain object-bottom"
                />
              </div>
              <HeroRouteSlip
                label={t("permit_label")}
                value={t("permit_value")}
                meta={t("permit_meta")}
              />
              <StickyNote className="absolute top-5 right-0 z-20 md:right-8" tilt={3}>
                {t("sticky_note")}
              </StickyNote>
            </div>
          </div>
        </Container>
      </RedZone>

      <PaperZone density="default" tornBottom={2}>
        <Container className="space-y-14">
          <div className="grid gap-12 lg:grid-cols-[0.82fr_1fr] lg:items-start lg:gap-16">
            <div className="space-y-8">
              <div className="space-y-4">
                <Eyebrow rule>{t("brief_eyebrow")}</Eyebrow>
                <DisplayHeading size="xl" as="h2">
                  {t("brief_heading")}
                </DisplayHeading>
              </div>
              <div className="space-y-5 font-sans text-lg leading-relaxed sm:text-xl">
                <p>{t("p1")}</p>
                <p>{t("p2")}</p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Stamp tilt={-2}>{t("brief_stamp_1")}</Stamp>
                <Stamp tilt={2}>{t("brief_stamp_2")}</Stamp>
              </div>
            </div>
            <div className="grid min-h-[31rem] grid-cols-5 grid-rows-5 gap-4">
              <PosterPhoto
                src={customImages.puna}
                alt={t("brief_image_alt_1")}
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="col-span-5 row-span-3 -rotate-1"
              />
              <PosterPhoto
                src={customImages.cuyo}
                alt={t("brief_image_alt_2")}
                sizes="(min-width: 1024px) 24vw, 55vw"
                className="col-span-3 row-span-2 rotate-1"
              />
              <PosterPhoto
                src={customImages.patagonia}
                alt={t("brief_image_alt_3")}
                sizes="(min-width: 1024px) 18vw, 45vw"
                className="col-span-2 row-span-2 -rotate-1"
              />
            </div>
          </div>

          <div className="border-ink grid border-2 md:grid-cols-4">
            {briefCards.map((item, index) => (
              <BriefCard key={item.title} {...item} index={index} />
            ))}
          </div>
        </Container>
      </PaperZone>

      <RedZone density="default" tornBottom={3} className="overflow-hidden">
        <Container className="space-y-12">
          <div className="grid gap-8 lg:grid-cols-[0.82fr_1fr] lg:items-end">
            <div className="space-y-4">
              <Eyebrow rule>{t("process_eyebrow")}</Eyebrow>
              <DisplayHeading size="xl" as="h2">
                {t("process_heading")}
              </DisplayHeading>
            </div>
            <p className="max-w-3xl font-sans text-xl leading-relaxed md:text-2xl">
              {t("process_body")}
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {processSteps.map((item, index) => (
              <ProcessStep key={item.title} {...item} index={index} />
            ))}
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
            <div className="border-paper/45 border-2 p-6 md:p-8">
              <div className="space-y-4">
                <Eyebrow rule>{t("includes_eyebrow")}</Eyebrow>
                <DisplayHeading size="lg" as="h3">
                  {t("includes_heading")}
                </DisplayHeading>
              </div>
              <ul className="mt-7 grid gap-4 font-sans text-lg leading-relaxed sm:grid-cols-2">
                {includesItems.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <XIcon className="mt-1.5 h-5 w-5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div
              data-zone="red"
              className="bg-ink bg-paper-grain text-on-red shadow-sticker-red border-paper/70 rotate-1 border-2 p-6 md:p-8"
            >
              <div className="space-y-4">
                <Eyebrow rule>{t("extras_eyebrow")}</Eyebrow>
                <DisplayHeading size="lg" as="h3">
                  {t("extras_heading")}
                </DisplayHeading>
              </div>
              <ul className="mt-7 space-y-4 font-sans text-lg leading-relaxed">
                {extrasItems.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <XIcon className="text-brand-red-bright mt-1.5 h-5 w-5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </RedZone>

      <PaperZone density="default" id="custom-form">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.72fr_1fr] lg:items-start">
            <aside className="space-y-8">
              <div className="space-y-4">
                <Eyebrow rule>{t("form_eyebrow")}</Eyebrow>
                <DisplayHeading size="xl" as="h2">
                  {t("form_heading")}
                </DisplayHeading>
                <p className="max-w-2xl font-sans text-lg leading-relaxed">{t("form_intro")}</p>
              </div>

              <div className="grid gap-4">
                {routeIdeas.map((item, index) => (
                  <RouteIdeaCard key={item.title} {...item} index={index} />
                ))}
              </div>

              <div data-zone="red" className="bg-red-grunge text-on-red border-ink border-2 p-6">
                <Eyebrow rule>{t("talk_eyebrow")}</Eyebrow>
                <p className="font-display mt-5 text-4xl leading-none uppercase">
                  {t("talk_heading")}
                </p>
                <p className="mt-4 font-sans text-base leading-relaxed opacity-85">
                  {t("talk_body")}
                </p>
                <ul className="mt-5 space-y-3 font-sans text-sm leading-relaxed">
                  {promptItems.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <XIcon className="mt-1 h-4 w-4 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button href={whatsAppHref} edge={2} tilt="right" className="mt-6" external>
                  {t("talk_cta")}
                </Button>
              </div>
            </aside>

            <div className="bg-paper-light shadow-sticker-red border-ink border-2 p-5 md:p-8">
              <CustomTourForm locale={locale} />
            </div>
          </div>
        </Container>
      </PaperZone>
    </>
  );
}
