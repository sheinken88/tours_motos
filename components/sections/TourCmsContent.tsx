import { type ComponentType } from "react";
import { getTranslations } from "next-intl/server";
import { Container, DisplayHeading, Eyebrow, Stamp, XIcon } from "@/components/primitives";
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
  const frames: GalleryFrame[] = gallery.slice(0, 4).map((image) => ({
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

  return frames.slice(0, 4);
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
        colorSrc={tour.hero_image_color}
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
          caption={frames[0]?.caption}
          label={frames[0]?.label || tour.region[locale]}
          aspectClassName="aspect-[16/10]"
          useTourFallback={Boolean(frames[0]?.imageSrc || frames[0]?.colorSrc)}
          sizes="(min-width: 1024px) 700px, 100vw"
          tilt={-1}
          compact
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
              caption={frame.caption}
              label={frame.label || tour.region[locale]}
              aspectClassName="aspect-[4/3]"
              useTourFallback={Boolean(frame.imageSrc || frame.colorSrc)}
              sizes="(min-width: 1024px) 360px, 100vw"
              tilt={index % 2 === 0 ? 1 : -1}
              compact
            />
          ))}
        </div>
        {frames.slice(3).map((frame) => (
          <TourImagePoster
            key={frame.key}
            tour={tour}
            locale={locale}
            imageSrc={frame.imageSrc}
            colorSrc={frame.colorSrc}
            alt={frame.alt || tour.title[locale]}
            caption={frame.caption}
            label={frame.label || tour.region[locale]}
            aspectClassName="aspect-[16/9]"
            useTourFallback={Boolean(frame.imageSrc || frame.colorSrc)}
            sizes="(min-width: 1024px) 1240px, 100vw"
            tilt={1}
            compact
            className="lg:col-span-2"
          />
        ))}
      </div>
    </section>
  );
}

function RoadbookStrip({ itinerary, dayLabel }: { itinerary: ItineraryDay[]; dayLabel: string }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-7">
      {itinerary.map((day) => (
        <div
          key={`${day.tour_slug}-strip-${day.day_number}`}
          className="border-paper/30 bg-brand-red-deep/20 min-h-24 border-2 p-3"
        >
          <p className="font-display text-paper text-sm tracking-[var(--tracking-cta)] uppercase">
            {dayLabel} {day.day_number}
          </p>
          <p className="text-paper/75 mt-2 font-sans text-xs leading-snug">
            {day.route_from && day.route_to
              ? `${day.route_from} → ${day.route_to}`
              : day.title.es || day.title.en || day.title.pt}
          </p>
        </div>
      ))}
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
  featured = false,
}: {
  day: ItineraryDay;
  tour: Tour;
  locale: Locale;
  formatter: Intl.NumberFormat;
  dayLabel: string;
  highlightsLabel: string;
  featured?: boolean;
}) {
  const metadata = [
    day.surface[locale],
    day.distance_km !== null ? `${formatter.format(day.distance_km)} km` : "",
    day.max_altitude_m !== null ? `${formatter.format(day.max_altitude_m)} msnm` : "",
  ].filter(Boolean);
  const highlights = day.highlights[locale];

  return (
    <li
      data-zone="paper"
      className={`bg-paper-grain text-on-paper shadow-sticker-ink border-paper/30 overflow-hidden border-2 ${
        featured ? "lg:col-span-2" : ""
      }`}
    >
      <article
        className={`grid h-full ${
          featured
            ? "md:grid-cols-[minmax(16rem,0.45fr)_minmax(0,0.55fr)]"
            : "md:grid-cols-[minmax(12rem,0.38fr)_minmax(0,0.62fr)]"
        }`}
      >
        <RoutePlaceholderPanel
          id={`${tour.slug}-day-${day.day_number}`}
          label={`${dayLabel} ${day.day_number}`}
          className="border-ink/20 min-h-56 border-b-2 md:min-h-full md:border-r-2 md:border-b-0"
        />

        <div className="flex h-full flex-col gap-4 p-5 md:p-6">
          <div className="flex flex-wrap items-center gap-3">
            <Stamp tilt={day.day_number % 2 === 0 ? 1 : -2}>
              {dayLabel} {day.day_number}
            </Stamp>
            {metadata.length > 0 ? (
              <p className="text-eyebrow tracking-eyebrow text-accent-on-paper font-semibold uppercase">
                {metadata.join(" · ")}
              </p>
            ) : null}
          </div>

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
                    <XIcon className="h-3.5 w-3.5 shrink-0" />
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
          <Eyebrow rule>{t("need_to_know_heading")}</Eyebrow>
          <DisplayHeading size="xl" as="h2">
            {t("included_heading")}
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
                  : t("need_to_know_heading");

            return (
              <article key={type} className="border-ink/30 bg-paper-light border-2 p-6">
                <DisplayHeading size="md" as="h3" distress={false} className="mb-5">
                  {heading}
                </DisplayHeading>
                <ul className="space-y-3">
                  {items.map((item) => (
                    <li key={`${item.type}-${item.sort_order}`} className="flex items-start gap-3">
                      <XIcon className="mt-1 h-4 w-4 shrink-0" />
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
      <PaperZone density="default" tornBottom={3}>
        <Container className="space-y-16">
          <RouteOverview tour={tour} locale={locale} statRows={statRows} gallery={gallery} />
          {itinerary.length === 0 ? (
            <>
              <GalleryCollage
                tour={tour}
                locale={locale}
                gallery={gallery}
                eyebrow={t("gallery_eyebrow")}
              />
              {practicalDetails}
            </>
          ) : null}
        </Container>
      </PaperZone>

      {itinerary.length > 0 ? (
        <RedZone density="default" tornBottom={2}>
          <Container className="space-y-10">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,0.76fr)_minmax(18rem,0.34fr)] lg:items-end">
              <div className="space-y-3">
                <Eyebrow>{t("itinerary_eyebrow")}</Eyebrow>
                <DisplayHeading size="xl" as="h2">
                  {t("itinerary_heading")}
                </DisplayHeading>
              </div>
              <p className="text-muted-on-red max-w-md font-sans text-base leading-relaxed">
                {tour.tagline[locale] || tour.summary[locale]}
              </p>
            </div>

            <RoadbookStrip itinerary={itinerary} dayLabel={t("day_label")} />

            <ol className="grid gap-6 lg:grid-cols-2">
              {itinerary.map((day) => {
                return (
                  <DayRoadbookCard
                    key={`${day.tour_slug}-${day.day_number}`}
                    day={day}
                    tour={tour}
                    locale={locale}
                    formatter={formatter}
                    dayLabel={t("day_label")}
                    highlightsLabel={t("highlights_label")}
                    featured={day.day_number === 1 || day.day_number % 5 === 0}
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
export async function TourMdxContent({ tour, locale, MdxBody }: TourMdxContentProps) {
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
        <RouteOverview tour={tour} locale={locale} statRows={statRows} gallery={[]} />
        <GalleryCollage tour={tour} locale={locale} gallery={[]} eyebrow={t("gallery_eyebrow")} />

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
