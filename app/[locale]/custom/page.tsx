import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button, Container, DisplayHeading, Eyebrow, Stamp } from "@/components/primitives";
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
  hero: "/images/optimized/heroes/custom.jpg",
  puna: "/images/optimized/tours/sobre-las-nubes.jpg",
  cuyo: "/images/optimized/tours/gigantes-del-oeste.jpg",
  patagonia: "/images/optimized/tours/cruces-del-sur.jpg",
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
  mirrored = false,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes: string;
  priority?: boolean;
  mirrored?: boolean;
}) {
  const imageTransformClass = mirrored
    ? "scale-x-[-1] group-hover/photo:scale-x-[-1.015] group-hover/photo:scale-y-[1.015]"
    : "group-hover/photo:scale-[1.015]";

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
        className={`object-cover transition-transform duration-300 ease-out ${imageTransformClass}`}
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

function HeroGroundPrint({ label }: { label: string }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[34svh] min-h-64 overflow-hidden"
    >
      <svg
        className="text-ink absolute inset-x-0 bottom-0 h-full w-full opacity-35 mix-blend-multiply"
        viewBox="0 0 1440 360"
        preserveAspectRatio="none"
        focusable="false"
      >
        <path
          d="M0 262 L80 232 L150 252 L230 204 L310 226 L390 180 L470 222 L560 168 L650 214 L740 156 L820 206 L900 178 L980 220 L1060 188 L1140 228 L1220 198 L1310 238 L1440 216 L1440 360 L0 360 Z"
          fill="currentColor"
        />
        <path
          d="M0 286 C160 238 282 270 420 242 C568 212 694 218 842 246 C982 272 1122 246 1440 188"
          fill="none"
          stroke="var(--color-paper)"
          strokeWidth="5"
          strokeDasharray="28 18 7 18"
          strokeLinecap="square"
          opacity="0.62"
        />
        <path
          d="M64 308 C226 278 336 292 494 268 C654 244 796 270 928 286 C1086 304 1228 274 1390 244"
          fill="none"
          stroke="var(--color-paper)"
          strokeWidth="2"
          strokeDasharray="8 18"
          strokeLinecap="square"
          opacity="0.45"
        />
      </svg>

      <div
        className="absolute inset-0 opacity-20 mix-blend-multiply"
        style={{
          backgroundImage: "url(/textures/halftone-overlay.svg)",
          backgroundRepeat: "repeat",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="absolute -bottom-14 left-[-6rem] hidden h-48 w-[44rem] -rotate-12 opacity-20 mix-blend-multiply md:block">
        <div className="grid h-full grid-cols-[repeat(18,minmax(0,1fr))] gap-3">
          {Array.from({ length: 18 }).map((_, index) => (
            <span
              key={index}
              className="bg-ink block h-full"
              style={{
                clipPath:
                  index % 2 === 0
                    ? "polygon(18% 0, 100% 0, 82% 100%, 0 100%)"
                    : "polygon(0 0, 82% 0, 100% 100%, 18% 100%)",
              }}
            />
          ))}
        </div>
      </div>

      <div className="text-paper font-display absolute right-[8vw] bottom-14 hidden -rotate-2 text-8xl leading-none uppercase opacity-10 lg:block">
        {label}
      </div>
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

function ProcessStep({
  title,
  body,
  index,
  stepLabel,
}: TextCard & { index: number; stepLabel: string }) {
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
        <Stamp tilt={index % 2 === 0 ? -2 : 2}>
          {stepLabel} {index + 1}
        </Stamp>
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

function CheckMarkIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={className} fill="none">
      <path
        d="M4 12.8 9.2 18 20 5.5"
        stroke="currentColor"
        strokeLinecap="square"
        strokeLinejoin="miter"
        strokeWidth="3.5"
      />
    </svg>
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
        <HeroGroundPrint label={t("ground_print")} />
        <Container className="relative z-10 lg:flex lg:min-h-[calc(100svh-14rem)] lg:items-center">
          <div className="grid w-full gap-12 lg:grid-cols-[1fr_0.82fr] lg:items-center">
            <div className="relative z-10 space-y-8 lg:-translate-y-8">
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
              <div className="absolute right-[-1.25rem] bottom-8 left-[-1rem] h-[30rem] -rotate-1 md:right-[1rem] md:left-[2rem] md:h-[34rem] lg:right-[-3.5rem] lg:left-[-2rem] lg:h-[38rem]">
                <PosterPhoto
                  src={customImages.hero}
                  alt={t("hero_image_alt")}
                  sizes="(min-width: 1280px) 48vw, (min-width: 1024px) 44vw, 88vw"
                  priority
                  mirrored
                  className="border-paper/80 shadow-sticker-ink h-full"
                />
              </div>
              <HeroRouteSlip
                label={t("permit_label")}
                value={t("permit_value")}
                meta={t("permit_meta")}
              />
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
                <DisplayHeading size="xl" as="h2" className="leading-[1.08]">
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
            <div className="grid min-h-[36rem] grid-cols-5 grid-rows-[repeat(3,minmax(0,1fr))_repeat(2,minmax(0,1.45fr))] gap-4">
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
              <ProcessStep key={item.title} {...item} index={index} stepLabel={t("step_label")} />
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
                    <CheckMarkIcon className="mt-1.5 h-5 w-5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div
              data-zone="paper"
              className="bg-paper-light bg-paper-grain text-on-paper shadow-sticker-ink border-paper rotate-1 border-2 p-6 md:p-8"
            >
              <div className="space-y-4">
                <Eyebrow rule style={{ color: "var(--color-brand-red)", opacity: 1 }}>
                  {t("extras_eyebrow")}
                </Eyebrow>
                <DisplayHeading size="lg" as="h3" style={{ color: "var(--color-brand-red)" }}>
                  {t("extras_heading")}
                </DisplayHeading>
              </div>
              <ul className="mt-7 space-y-4 font-sans text-lg leading-relaxed">
                {extrasItems.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckMarkIcon className="text-brand-red mt-1.5 h-5 w-5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </RedZone>

      <PaperZone density="default" id="custom-form" className="overflow-hidden">
        <Container className="max-w-[92rem]">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(36rem,1fr)] lg:items-start lg:gap-14 xl:gap-16">
            <aside className="space-y-8 lg:max-w-[36rem]">
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
            </aside>

            <div className="space-y-7 lg:mt-7 xl:mt-9">
              <div className="bg-paper-light shadow-sticker-red border-ink border-2 p-5 md:p-8">
                <CustomTourForm locale={locale} />
              </div>

              <div
                data-zone="red"
                className="bg-red-grunge text-on-red border-ink border-2 p-6 md:p-7"
              >
                <Eyebrow rule>{t("talk_eyebrow")}</Eyebrow>
                <p className="font-display mt-5 text-4xl leading-none uppercase md:text-5xl">
                  {t("talk_heading")}
                </p>
                <p className="mt-4 font-sans text-base leading-relaxed opacity-85">
                  {t("talk_body")}
                </p>
                <ul className="mt-5 space-y-3 font-sans text-sm leading-relaxed">
                  {promptItems.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckMarkIcon className="mt-1 h-4 w-4 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button href={whatsAppHref} edge={2} tilt="right" className="mt-6" external>
                  {t("talk_cta")}
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </PaperZone>
    </>
  );
}
