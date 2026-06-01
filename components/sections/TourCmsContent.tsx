import { type ComponentType } from "react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Container, DisplayHeading, Eyebrow, XIcon } from "@/components/primitives";
import { PaperZone, RedZone, RoutePlaceholderPanel, TourImagePoster } from "@/components/surfaces";
import { type Locale } from "@/lib/i18n/config";
import {
  type GalleryImage,
  type ItineraryDay,
  type Tour,
  type TourPageContent,
  type TourSection,
} from "@/lib/sheets/schemas";

type TourCmsContentProps = {
  content: TourPageContent;
  locale: Locale;
};

type TourMdxContentProps = {
  tour: Tour;
  locale: Locale;
  gallery: GalleryImage[];
  MdxBody: ComponentType | null;
};

type StatRow = {
  label: string;
  value: string;
};

type GalleryFrame = {
  key: string;
  imageSrc?: string;
  colorSrc?: string;
  alt?: string;
  caption?: string;
  label?: string;
};

const sectionOrder: TourSection["type"][] = ["included", "not_included", "need_to_know"];

type IconProps = {
  className?: string;
};

function MapPinIcon({ className = "" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" aria-hidden focusable="false">
      <path
        d="M10 2.5c-3 0-5.3 2.2-5.3 5.1 0 3.7 4.1 8.2 5.3 9.5 1.2-1.3 5.3-5.8 5.3-9.5 0-2.9-2.3-5.1-5.3-5.1Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="7.7" r="1.7" fill="currentColor" />
    </svg>
  );
}

function CheckIcon({ className = "" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" aria-hidden focusable="false">
      <path
        d="m3.4 10.1 4.1 4.1 9.1-9.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

function InfoIcon({ className = "" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" aria-hidden focusable="false">
      <path d="M9 8.5h3v7H8v-2h1.5v-3H8v-2h1Zm.7-4.2h2.5v2.4H9.7V4.3Z" fill="currentColor" />
      <path
        d="M10 2.2 17.8 10 10 17.8 2.2 10 10 2.2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function buildStatRows({
  tour,
  formatter,
  labels,
}: {
  tour: Tour;
  formatter: Intl.NumberFormat;
  labels: {
    duration: string;
    days: string;
    distance: string;
    ripio: string;
    altitude: string;
  };
}): StatRow[] {
  return [
    { label: labels.duration, value: `${tour.duration_days} ${labels.days}` },
    { label: labels.distance, value: `${formatter.format(tour.distance_km)} km` },
    tour.ripio_percent !== null ? { label: labels.ripio, value: `${tour.ripio_percent}%` } : null,
    tour.max_altitude_m !== null
      ? { label: labels.altitude, value: `${formatter.format(tour.max_altitude_m)} msnm` }
      : null,
  ].filter(Boolean) as StatRow[];
}

function buildGalleryFrames(tour: Tour, gallery: GalleryImage[], locale: Locale): GalleryFrame[] {
  const frames: GalleryFrame[] = gallery.map((image) => ({
    key: `${image.tour_slug}-${image.sort_order}`,
    imageSrc: image.image_url,
    alt: image.alt[locale],
    caption: image.caption[locale],
  }));

  if (frames.length === 0 && (tour.hero_image || tour.hero_image_color)) {
    frames.push({
      key: `${tour.slug}-hero`,
      imageSrc: tour.hero_image,
      colorSrc: tour.hero_image_color,
      alt: tour.hero_image_alt[locale] || tour.title[locale],
      caption: tour.summary[locale],
    });
  }

  while (frames.length < 3) {
    frames.push({
      key: `${tour.slug}-placeholder-${frames.length}`,
      label: tour.region[locale],
    });
  }

  return frames;
}

function StatGrid({ rows }: { rows: StatRow[] }) {
  return (
    <dl className="border-ink/30 bg-paper-light grid border-2 sm:grid-cols-2">
      {rows.map((row) => (
        <div key={row.label} className="border-ink/20 border-b p-5 sm:border-r even:sm:border-r-0">
          <dt className="text-eyebrow tracking-eyebrow text-accent-on-paper font-semibold uppercase">
            {row.label}
          </dt>
          <dd className="font-display text-display-md text-on-paper mt-2 uppercase">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function StatStrip({ rows }: { rows: StatRow[] }) {
  return (
    <dl className="shadow-sticker-ink border-ink/30 bg-paper-light grid border-2 sm:grid-cols-2 lg:grid-cols-4">
      {rows.map((row) => (
        <div
          key={row.label}
          className="border-ink/20 border-b p-5 lg:border-r lg:border-b-0 last:lg:border-r-0"
        >
          <dt className="text-eyebrow tracking-eyebrow text-accent-on-paper font-semibold uppercase">
            {row.label}
          </dt>
          <dd className="font-display text-display-md text-on-paper mt-2 uppercase">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function RouteOverview({
  tour,
  locale,
  statRows,
  gallery,
}: {
  tour: Tour;
  locale: Locale;
  statRows: StatRow[];
  gallery: GalleryImage[];
}) {
  const featured = gallery.find((image) => image.featured) ?? gallery[0];

  return (
    <section className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.74fr)] lg:items-center">
      <div className="space-y-6">
        <Eyebrow rule>{tour.region[locale]}</Eyebrow>
        <DisplayHeading size="xl" as="h2">
          {tour.title[locale]}
        </DisplayHeading>
        <p className="max-w-3xl font-sans text-xl leading-relaxed md:text-2xl">
          {tour.summary[locale]}
        </p>
        <StatGrid rows={statRows} />
      </div>

      <TourImagePoster
        tour={tour}
        locale={locale}
        imageSrc={featured?.image_url || tour.hero_image}
        colorSrc={featured ? undefined : tour.hero_image_color}
        alt={featured?.alt[locale] || tour.hero_image_alt[locale] || tour.title[locale]}
        caption={featured?.caption[locale]}
        label={tour.region[locale]}
        aspectClassName="aspect-[4/3]"
        sizes="(min-width: 1024px) 480px, 100vw"
        tilt={1}
      />
    </section>
  );
}

function GalleryCollage({
  tour,
  locale,
  gallery,
  eyebrow,
}: {
  tour: Tour;
  locale: Locale;
  gallery: GalleryImage[];
  eyebrow: string;
}) {
  const frames = buildGalleryFrames(tour, gallery, locale);
  const extraFrames = frames.slice(4);

  return (
    <section className="space-y-6">
      <Eyebrow rule>{eyebrow}</Eyebrow>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.68fr)_minmax(18rem,0.32fr)] lg:items-start">
        <TourImagePoster
          tour={tour}
          locale={locale}
          imageSrc={frames[0]?.imageSrc}
          colorSrc={frames[0]?.colorSrc}
          alt={frames[0]?.alt || tour.title[locale]}
          caption={frames[0]?.caption || frames[0]?.alt}
          aspectClassName="aspect-[16/10]"
          useTourFallback={Boolean(frames[0]?.imageSrc || frames[0]?.colorSrc)}
          sizes="(min-width: 1024px) 700px, 100vw"
          tilt={-1}
          compact
          showLabel={false}
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
          {frames.slice(1, 3).map((frame, index) => (
            <TourImagePoster
              key={frame.key}
              tour={tour}
              locale={locale}
              imageSrc={frame.imageSrc}
              colorSrc={frame.colorSrc}
              alt={frame.alt || tour.title[locale]}
              caption={frame.caption || frame.alt}
              aspectClassName="aspect-[4/3]"
              useTourFallback={Boolean(frame.imageSrc || frame.colorSrc)}
              sizes="(min-width: 1024px) 360px, 100vw"
              tilt={index % 2 === 0 ? 1 : -1}
              compact
              showLabel={false}
            />
          ))}
        </div>
        {frames.slice(3, 4).map((frame) => (
          <TourImagePoster
            key={frame.key}
            tour={tour}
            locale={locale}
            imageSrc={frame.imageSrc}
            colorSrc={frame.colorSrc}
            alt={frame.alt || tour.title[locale]}
            caption={frame.caption || frame.alt}
            aspectClassName="aspect-[16/9]"
            useTourFallback={Boolean(frame.imageSrc || frame.colorSrc)}
            sizes="(min-width: 1024px) 1240px, 100vw"
            tilt={1}
            compact
            showLabel={false}
            className="lg:col-span-2"
          />
        ))}
      </div>
      {extraFrames.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {extraFrames.map((frame, index) => (
            <TourImagePoster
              key={frame.key}
              tour={tour}
              locale={locale}
              imageSrc={frame.imageSrc}
              colorSrc={frame.colorSrc}
              alt={frame.alt || tour.title[locale]}
              caption={frame.caption || frame.alt}
              aspectClassName="aspect-[4/3]"
              useTourFallback={Boolean(frame.imageSrc || frame.colorSrc)}
              sizes="(min-width: 1024px) 300px, (min-width: 640px) 50vw, 100vw"
              tilt={index % 3 === 0 ? -1 : index % 3 === 1 ? 1 : 0}
              compact
              showLabel={false}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}

type DayMetadataLabels = {
  surfacePending: string;
  distancePending: string;
  altitudePending: string;
};

function buildDayMetadata({
  day,
  locale,
  formatter,
  labels,
}: {
  day: ItineraryDay;
  locale: Locale;
  formatter: Intl.NumberFormat;
  labels: DayMetadataLabels;
}) {
  return [
    day.surface[locale] || labels.surfacePending,
    day.distance_km !== null ? `${formatter.format(day.distance_km)} km` : labels.distancePending,
    day.max_altitude_m !== null
      ? `${formatter.format(day.max_altitude_m)} msnm`
      : labels.altitudePending,
  ];
}

function RoadbookStrip({
  itinerary,
  locale,
  formatter,
  dayLabel,
  labels,
}: {
  itinerary: ItineraryDay[];
  locale: Locale;
  formatter: Intl.NumberFormat;
  dayLabel: string;
  labels: DayMetadataLabels;
}) {
  return (
    <nav
      aria-label={dayLabel}
      className="border-paper/30 bg-brand-red/95 z-20 -mx-5 border-y-2 px-5 py-3 backdrop-blur-sm sm:-mx-8 sm:px-8 md:sticky md:top-16 md:mx-0 md:border-2 xl:top-20"
    >
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-7">
        {itinerary.map((day) => (
          <a
            key={`${day.tour_slug}-strip-${day.day_number}`}
            href={`#day-${day.day_number}`}
            className="border-paper/30 bg-brand-red-deep/20 hover:bg-brand-red-deep/45 focus-visible:outline-paper min-h-16 border-2 p-3 transition-[transform,background-color] duration-200 ease-out hover:-translate-y-0.5 sm:min-h-20"
          >
            <span className="font-display text-paper block text-sm tracking-[var(--tracking-cta)] uppercase">
              {dayLabel} {day.day_number}
            </span>
            <span className="text-paper/75 mt-2 block font-sans text-xs leading-snug">
              {buildDayMetadata({ day, locale, formatter, labels }).slice(1).join(" · ")}
            </span>
          </a>
        ))}
      </div>
    </nav>
  );
}

function DayRouteImage({
  day,
  tour,
  locale,
  dayLabel,
  image,
}: {
  day: ItineraryDay;
  tour: Tour;
  locale: Locale;
  dayLabel: string;
  image?: GalleryImage;
}) {
  const label = `${dayLabel} ${day.day_number}`;

  if (!image) {
    return (
      <RoutePlaceholderPanel
        id={`${tour.slug}-day-${day.day_number}`}
        label={label}
        className="border-ink/20 min-h-56 border-b-2 md:min-h-full md:border-r-2 md:border-b-0"
      />
    );
  }

  return (
    <div className="group/day-image bg-paper-aged border-ink/20 relative isolate min-h-56 overflow-hidden border-b-2 md:min-h-full md:border-r-2 md:border-b-0">
      <Image
        src={image.image_url}
        alt={image.alt[locale] || tour.title[locale]}
        fill
        sizes="(min-width: 1024px) 440px, (min-width: 768px) 42vw, 100vw"
        className="object-cover opacity-90 mix-blend-multiply contrast-125 grayscale saturate-0 transition-transform duration-300 ease-out group-hover/day-card:scale-[1.03]"
      />
      <Image
        src={image.image_url}
        alt=""
        aria-hidden="true"
        fill
        sizes="(min-width: 1024px) 440px, (min-width: 768px) 42vw, 100vw"
        className="object-cover opacity-0 transition-[opacity,transform] duration-300 ease-out group-hover/day-card:scale-[1.03] group-hover/day-card:opacity-100 group-hover/day-image:opacity-100"
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
      <div className="absolute top-4 left-4 z-[2]">
        <span className="bg-paper-light font-display text-accent-on-paper inline-block border-2 border-current px-3 py-1.5 text-xs tracking-[var(--tracking-cta)] uppercase">
          {label}
        </span>
      </div>
    </div>
  );
}

function DayRoadbookCard({
  day,
  tour,
  locale,
  formatter,
  dayLabel,
  highlightsLabel,
  metadataLabels,
  image,
  featured = false,
}: {
  day: ItineraryDay;
  tour: Tour;
  locale: Locale;
  formatter: Intl.NumberFormat;
  dayLabel: string;
  highlightsLabel: string;
  metadataLabels: DayMetadataLabels;
  image?: GalleryImage;
  featured?: boolean;
}) {
  const metadata = buildDayMetadata({ day, locale, formatter, labels: metadataLabels });
  const highlights = day.highlights[locale];

  return (
    <li
      id={`day-${day.day_number}`}
      data-zone="paper"
      className={`group/day-card bg-paper-grain text-on-paper shadow-sticker-ink hover:shadow-sticker-red border-paper/30 overflow-hidden border-2 transition-[box-shadow,transform] duration-200 ease-out hover:-translate-y-1 ${
        featured ? "scroll-mt-24 md:scroll-mt-40 lg:col-span-2" : "scroll-mt-24 md:scroll-mt-40"
      }`}
    >
      <article
        className={`grid h-full ${
          featured
            ? "md:grid-cols-[minmax(16rem,0.45fr)_minmax(0,0.55fr)]"
            : "md:grid-cols-[minmax(12rem,0.38fr)_minmax(0,0.62fr)]"
        }`}
      >
        <DayRouteImage day={day} tour={tour} locale={locale} dayLabel={dayLabel} image={image} />

        <div className="flex h-full flex-col gap-4 p-5 md:p-6">
          <p className="text-eyebrow tracking-eyebrow text-accent-on-paper font-semibold uppercase">
            {metadata.join(" · ")}
          </p>

          <h3 className="font-display text-display-md text-on-paper uppercase">
            {day.title[locale]}
          </h3>
          <p
            className={`text-muted-on-paper font-sans leading-relaxed ${
              featured ? "text-base md:text-lg" : "text-sm"
            }`}
          >
            {day.body[locale]}
          </p>

          {highlights.length > 0 ? (
            <div className="mt-auto space-y-3 pt-2">
              <p className="text-eyebrow tracking-eyebrow text-accent-on-paper font-semibold uppercase">
                {highlightsLabel}
              </p>
              <ul className="flex flex-wrap gap-2">
                {highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="border-ink/20 flex items-center gap-2 border px-2.5 py-1.5"
                  >
                    <MapPinIcon className="text-accent-on-paper h-3.5 w-3.5 shrink-0" />
                    <span className="font-sans text-xs leading-tight">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </article>
    </li>
  );
}

function isFeaturedRoadbookDay(tour: Tour, day: ItineraryDay) {
  return (
    day.day_number === 1 ||
    day.day_number % 5 === 0 ||
    (tour.slug === "cruces-del-sur" && day.day_number === 4)
  );
}

/**
 * TourCmsContent — renders the client-editable Google Sheets tour body as a
 * set of poster zones: route dossier, day-by-day route, and practical details.
 */
export async function TourCmsContent({ content, locale }: TourCmsContentProps) {
  const t = await getTranslations({ locale, namespace: "tour_detail" });
  const { tour, itinerary, sections, gallery } = content;
  const numberLocale = locale === "en" ? "en-US" : locale === "pt" ? "pt-BR" : "es-AR";
  const formatter = new Intl.NumberFormat(numberLocale);
  const statRows = buildStatRows({
    tour,
    formatter,
    labels: {
      duration: t("duration_label"),
      days: t("days_unit"),
      distance: t("distance_label"),
      ripio: t("ripio_label"),
      altitude: t("max_altitude_label"),
    },
  });
  const metadataLabels: DayMetadataLabels = {
    surfacePending: t("surface_pending"),
    distancePending: t("distance_pending"),
    altitudePending: t("altitude_pending"),
  };

  const sectionsByType = new Map<TourSection["type"], TourSection[]>();
  for (const section of sections) {
    const bucket = sectionsByType.get(section.type);
    if (bucket) {
      bucket.push(section);
    } else {
      sectionsByType.set(section.type, [section]);
    }
  }

  const practicalDetails =
    sections.length > 0 ? (
      <section className="space-y-8">
        <div className="space-y-3">
          <Eyebrow rule>{t("practical_eyebrow")}</Eyebrow>
          <DisplayHeading size="xl" as="h2">
            {t("practical_heading")}
          </DisplayHeading>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {sectionOrder.map((type) => {
            const items = sectionsByType.get(type) ?? [];
            if (items.length === 0) return null;

            const heading =
              type === "included"
                ? t("included_heading")
                : type === "not_included"
                  ? t("not_included_heading")
                  : t("good_to_know_heading");
            const ItemIcon =
              type === "included" ? CheckIcon : type === "not_included" ? XIcon : InfoIcon;

            return (
              <article key={type} className="border-ink/30 bg-paper-light border-2 p-6">
                <DisplayHeading size="md" as="h3" distress={false} className="mb-5">
                  {heading}
                </DisplayHeading>
                <ul className="space-y-3">
                  {items.map((item) => (
                    <li key={`${item.type}-${item.sort_order}`} className="flex items-start gap-3">
                      <ItemIcon className="text-accent-on-paper mt-1 h-4 w-4 shrink-0" />
                      <span className="font-sans text-sm leading-relaxed">{item.text[locale]}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </section>
    ) : null;

  return (
    <>
      <PaperZone density={itinerary.length > 0 ? "light" : "default"} tornBottom={3}>
        <Container className={itinerary.length > 0 ? "" : "space-y-16"}>
          {itinerary.length > 0 ? (
            <StatStrip rows={statRows} />
          ) : (
            <>
              <RouteOverview tour={tour} locale={locale} statRows={statRows} gallery={gallery} />
              <GalleryCollage
                tour={tour}
                locale={locale}
                gallery={gallery}
                eyebrow={t("gallery_eyebrow")}
              />
              {practicalDetails}
            </>
          )}
        </Container>
      </PaperZone>

      {itinerary.length > 0 ? (
        <RedZone density="default" tornBottom={2} data-whatsapp-fab="hide">
          <Container className="space-y-10">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,0.76fr)_minmax(18rem,0.34fr)] lg:items-end">
              <div className="space-y-5">
                <Eyebrow>{t("itinerary_eyebrow")}</Eyebrow>
                <DisplayHeading size="xl" as="h2">
                  {t("itinerary_heading")}
                </DisplayHeading>
              </div>
              <p className="text-muted-on-red max-w-md font-sans text-base leading-relaxed">
                {t("itinerary_hook")}
              </p>
            </div>

            <RoadbookStrip
              itinerary={itinerary}
              locale={locale}
              formatter={formatter}
              dayLabel={t("day_label")}
              labels={metadataLabels}
            />

            <ol className="grid gap-6 lg:grid-cols-2">
              {itinerary.map((day) => {
                const image = gallery.length
                  ? gallery[(day.day_number - 1) % gallery.length]
                  : undefined;
                return (
                  <DayRoadbookCard
                    key={`${day.tour_slug}-${day.day_number}`}
                    day={day}
                    tour={tour}
                    locale={locale}
                    formatter={formatter}
                    dayLabel={t("day_label")}
                    highlightsLabel={t("highlights_label")}
                    metadataLabels={metadataLabels}
                    image={image}
                    featured={isFeaturedRoadbookDay(tour, day)}
                  />
                );
              })}
            </ol>
          </Container>
        </RedZone>
      ) : null}

      {itinerary.length > 0 ? (
        <PaperZone density="default" tornBottom={1}>
          <Container className="space-y-16">
            <GalleryCollage
              tour={tour}
              locale={locale}
              gallery={gallery}
              eyebrow={t("gallery_eyebrow")}
            />
            {practicalDetails}
          </Container>
        </PaperZone>
      ) : null}
    </>
  );
}

/**
 * TourMdxContent — fallback for routes whose structured Sheets itinerary has
 * not been filled yet. It still gives the route a designed dossier layout
 * instead of dropping the MDX into one bare vertical article.
 */
export async function TourMdxContent({ tour, locale, gallery, MdxBody }: TourMdxContentProps) {
  const t = await getTranslations({ locale, namespace: "tour_detail" });
  const numberLocale = locale === "en" ? "en-US" : locale === "pt" ? "pt-BR" : "es-AR";
  const formatter = new Intl.NumberFormat(numberLocale);
  const statRows = buildStatRows({
    tour,
    formatter,
    labels: {
      duration: t("duration_label"),
      days: t("days_unit"),
      distance: t("distance_label"),
      ripio: t("ripio_label"),
      altitude: t("max_altitude_label"),
    },
  });

  return (
    <PaperZone density="default" tornBottom={1}>
      <Container className="space-y-12">
        <RouteOverview tour={tour} locale={locale} statRows={statRows} gallery={gallery} />
        <GalleryCollage
          tour={tour}
          locale={locale}
          gallery={gallery}
          eyebrow={t("gallery_eyebrow")}
        />

        <section className="grid gap-8 lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-start">
          <aside className="border-ink/30 bg-paper-light border-2 p-5 lg:sticky lg:top-28">
            <Eyebrow>{t("overview_eyebrow")}</Eyebrow>
            <dl className="mt-5 space-y-4">
              {statRows.map((row) => (
                <div key={row.label} className="border-ink/20 border-t pt-4">
                  <dt className="text-eyebrow tracking-eyebrow text-accent-on-paper font-semibold uppercase">
                    {row.label}
                  </dt>
                  <dd className="font-display text-display-md mt-1 uppercase">{row.value}</dd>
                </div>
              ))}
            </dl>
          </aside>

          <article className="prose-tour prose-tour-columns border-ink/30 bg-paper-light border-2 p-6 md:p-10">
            {MdxBody ? (
              <MdxBody />
            ) : (
              <p className="font-sans text-base opacity-70">{t("missing_content")}</p>
            )}
          </article>
        </section>
      </Container>
    </PaperZone>
  );
}
