import { getTranslations } from "next-intl/server";
import { type ReactNode } from "react";
import { Container, DisplayHeading, Eyebrow, XIcon } from "@/components/primitives";

type XListSectionProps = {
  /** Override the default dictionary items with custom strings (e.g. tour-page variants). */
  items?: string[];
  /** Override the section eyebrow. */
  eyebrow?: string;
  /** Override the section heading. */
  heading?: string;
  /**
   * Optional illustration slot (right column on desktop, below on mobile).
   * Reserved for a halftone group-shot CutoutFigure once Phase 10 lands.
   * When omitted, the section collapses to a single column.
   */
  illustration?: ReactNode;
};

/**
 * XListSection — "ESTO ES PARA VOS SI…" pattern with X-bullets and an
 * optional halftone illustration on the right.
 *
 * Per CLAUDE.md §15 step 12. Copy is rewritten to avoid the inspiration's
 * defensive framing — every bullet describes who the rider IS, not what
 * the brand isn't (CLAUDE.md §13 voice rule).
 *
 * Two-column layout on desktop when an `illustration` prop is supplied;
 * collapses to a single column when it isn't. XIcon and text use currentColor
 * so red/paper zones both render correctly via the data-zone cascade.
 *
 * Phase 10 callers will pass <CutoutFigure src="/images/halftone/group.png" />
 * for the illustration slot — Phase 8 leaves it null by default.
 */
export async function XListSection({
  items,
  eyebrow,
  heading,
  illustration,
}: XListSectionProps = {}) {
  const t = await getTranslations("x_list");
  const resolvedItems = items ?? (t.raw("items") as string[]);
  const resolvedEyebrow = eyebrow ?? t("eyebrow");
  const resolvedHeading = heading ?? t("heading");

  return (
    <Container>
      <div
        className={`grid grid-cols-1 gap-12 ${illustration ? "md:grid-cols-[1.2fr_1fr] md:gap-16" : ""}`}
      >
        <div className="space-y-8">
          <div className="space-y-3">
            <Eyebrow rule>{resolvedEyebrow}</Eyebrow>
            <DisplayHeading size="xl" as="h2">
              {resolvedHeading}
            </DisplayHeading>
          </div>
          <ul className="space-y-5">
            {resolvedItems.map((line) => (
              <li key={line} className="flex items-start gap-4">
                <XIcon className="mt-1.5 h-5 w-5 shrink-0" />
                <span className="font-sans text-lg leading-relaxed sm:text-xl">{line}</span>
              </li>
            ))}
          </ul>
        </div>
        {illustration ? <div className="relative min-h-[280px]">{illustration}</div> : null}
      </div>
    </Container>
  );
}
