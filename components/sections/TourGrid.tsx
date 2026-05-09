import { Container, Eyebrow, TourCard } from "@/components/primitives";
import { DisplayHeading } from "@/components/primitives/DisplayHeading";
import { type Locale } from "@/lib/i18n/config";
import { type Tour } from "@/lib/sheets/schemas";

type TourGridProps = {
  tours: Tour[];
  locale: Locale;
  /** Optional eyebrow label above the heading (e.g. "Rutas"). */
  eyebrow?: string;
  /** Optional heading above the grid. */
  heading?: string;
  /** Cap the number of cards rendered. Default: all. */
  limit?: number;
  /** Empty-state copy when tours is []. */
  emptyMessage?: string;
};

/**
 * TourGrid — responsive 3-up → 2-up → 1-up grid of TourCard primitives.
 *
 * Caller fetches tours via getTours(locale) and passes them in. Sits in
 * either zone — data-zone cascade handles the headline color.
 *
 * Limit prop is useful for the home page (3 hero tours) without a separate
 * SlicedTourGrid component.
 */
export function TourGrid({ tours, locale, eyebrow, heading, limit, emptyMessage }: TourGridProps) {
  const visible = typeof limit === "number" ? tours.slice(0, limit) : tours;

  return (
    <Container className="space-y-8">
      {(eyebrow || heading) && (
        <div className="space-y-3">
          {eyebrow ? <Eyebrow rule>{eyebrow}</Eyebrow> : null}
          {heading ? (
            <DisplayHeading size="xl" as="h2">
              {heading}
            </DisplayHeading>
          ) : null}
        </div>
      )}
      {visible.length === 0 ? (
        emptyMessage ? (
          <p className="font-sans text-sm opacity-70">{emptyMessage}</p>
        ) : null
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {visible.map((tour) => (
            <li key={tour.slug}>
              <TourCard tour={tour} locale={locale} />
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
