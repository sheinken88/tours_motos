import { type ReactNode } from "react";
import { Container, Eyebrow, Stamp } from "@/components/primitives";

type QuoteWithFigureProps = {
  /** The quote itself. Don't include surrounding marks — the component draws them. */
  quote: string;
  /** Attribution: rider name, founder, or author for public-domain quotes. */
  attribution?: string;
  /** Optional second line on the attribution (route, date, region). */
  attributionMeta?: string;
  /** Optional eyebrow. */
  eyebrow?: string;
  /** Optional stamped tag (e.g. "RIDE 14") rendered with the attribution. */
  stamp?: string;
  /**
   * Halftone figure slot — typically a <CutoutFigure>. Anchored bottom-right.
   * When omitted, the layout still reads as the asymmetric "poster quote"
   * pattern but the figure column stays empty (intentional — Phase 10 lands
   * the real PNG without a layout change).
   */
  figure?: ReactNode;
};

/**
 * QuoteWithFigure — companion to <QuoteSection>. Same red-zone-only printed-
 * quote idea but with an asymmetric two-column composition: large hand-cut
 * display quote anchored top-left, halftone figure anchored bottom-right.
 *
 * Matches the visual treatment in `/quote1.png` (the brand reference). Use
 * for the home-page brand-anchor moment when there's a halftone subject
 * worth showing alongside the line.
 *
 * Caller wraps in <RedZone density="default"> so the breathing room +
 * texture overlay come from the zone surface (CLAUDE.md §4 hard rule).
 *
 * Use <QuoteSection> instead when there's no figure — the typographic-only
 * version doesn't need the asymmetric two-column scaffold.
 */
export function QuoteWithFigure({
  quote,
  attribution,
  attributionMeta,
  eyebrow,
  stamp,
  figure,
}: QuoteWithFigureProps) {
  return (
    <Container>
      <div className="grid items-end gap-10 md:grid-cols-[1.4fr_1fr] md:gap-16">
        <figure className="relative space-y-8">
          {eyebrow ? <Eyebrow rule>{eyebrow}</Eyebrow> : null}
          {/* Open glyph — large, hand-cut, decorative. Anchored top-left,
              with extra offset so it reads as a floating mark rather than
              attached to the first line of the quote. */}
          <span
            aria-hidden
            className="font-display absolute -top-20 -left-4 text-[10rem] leading-none opacity-20 select-none md:-top-28 md:-left-10 md:text-[14rem]"
          >
            “
          </span>
          <blockquote className="font-display relative text-[clamp(2rem,4.5vw,4rem)] leading-[1.15] tracking-[-0.01em] uppercase">
            {quote}
          </blockquote>
          {(attribution || attributionMeta || stamp) && (
            <figcaption className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2">
              {attribution ? (
                <span className="text-eyebrow tracking-eyebrow font-semibold uppercase">
                  — {attribution}
                </span>
              ) : null}
              {attributionMeta ? (
                <span className="font-sans text-sm leading-relaxed opacity-70">
                  {attributionMeta}
                </span>
              ) : null}
              {stamp ? <Stamp tilt={2}>{stamp}</Stamp> : null}
            </figcaption>
          )}
        </figure>
        {/* Figure slot — when present, drops in a <CutoutFigure>. When
            absent, the column stays empty so the asymmetry still reads as
            "poster" rather than "centered quote." */}
        <div className="relative min-h-[260px] md:min-h-[420px]">{figure}</div>
      </div>
    </Container>
  );
}
