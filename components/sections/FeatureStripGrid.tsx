import { getTranslations } from "next-intl/server";
import { Container, DisplayHeading, Eyebrow, Stamp } from "@/components/primitives";

type FeatureKey = "remote_routes" | "local_people" | "hard_riding" | "sleep_where";

const FEATURE_ORDER: FeatureKey[] = ["remote_routes", "local_people", "hard_riding", "sleep_where"];

type FeatureStripGridProps = {
  /** Hide the section heading + eyebrow when the surrounding page already provides one. */
  hideHeading?: boolean;
};

/**
 * FeatureStripGrid — 4-cell bordered grid summarising what defines the ride.
 *
 * Per CLAUDE.md §15 step 10. Replaces the inspiration's defensive
 * "SLEEP SIMPLE / Comfort kills the edge" copy with confident, forward-facing
 * statements (CLAUDE.md §13 forbids defensive framing).
 *
 * Self-contained — caller wraps in <PaperZone> or <RedZone>; the grid uses
 * the data-zone cascade so cell text colors flip appropriately. 2-up on
 * mobile collapses to 1-up under 480px via the responsive grid utility.
 *
 * Each cell is a 2px bordered rectangle (no border-radius — CLAUDE.md hard
 * rule). The numeric stamp anchors the corner so the grid reads as printed
 * panels rather than a CSS card.
 */
export async function FeatureStripGrid({ hideHeading = false }: FeatureStripGridProps = {}) {
  const t = await getTranslations("features");

  return (
    <Container className="space-y-10">
      {hideHeading ? null : (
        <div className="space-y-3">
          <Eyebrow rule>{t("eyebrow")}</Eyebrow>
          <DisplayHeading size="xl" as="h2">
            {t("heading")}
          </DisplayHeading>
        </div>
      )}
      <ul className="grid grid-cols-1 gap-0 border-2 border-current sm:grid-cols-2">
        {FEATURE_ORDER.map((key, index) => {
          const number = String(index + 1).padStart(2, "0");
          const isLastRow = index >= FEATURE_ORDER.length - 2;
          // Borders between cells; outer border on the <ul>. We use top/right
          // borders on inner cells so the outer ring isn't doubled.
          const borderTop = index >= 2 ? "border-t-2" : "";
          const borderRight = index % 2 === 0 ? "sm:border-r-2" : "";
          const borderTopMobile = index > 0 ? "border-t-2 sm:border-t-0" : "";
          return (
            <li
              key={key}
              className={`relative flex flex-col gap-4 p-8 md:p-10 ${borderTop} ${borderRight} ${borderTopMobile} ${isLastRow ? "" : ""}`}
            >
              <Stamp tilt={index % 2 === 0 ? -3 : 2} className="self-start opacity-90" aria-hidden>
                {number}
              </Stamp>
              <DisplayHeading size="md" as="h3">
                {t(`items.${key}.title`)}
              </DisplayHeading>
              <p className="font-sans text-base leading-relaxed sm:text-lg">
                {t(`items.${key}.body`)}
              </p>
            </li>
          );
        })}
      </ul>
    </Container>
  );
}
