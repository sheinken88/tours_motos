import { Container, Eyebrow, Stamp } from "@/components/primitives";

type QuoteSectionProps = {
  /** The quote itself. Don't include surrounding quote marks — the component draws them. */
  quote: string;
  /** Attribution line: rider name, expedition name, or "Founder". */
  attribution?: string;
  /** Optional second line on the attribution (route, date, region). */
  attributionMeta?: string;
  /** Optional eyebrow above the quote (defaults to dictionary `quote_section.eyebrow`). */
  eyebrow?: string;
  /** Optional stamped tag (e.g. "EXPEDITION 14") rendered to the right of the attribution. */
  stamp?: string;
};

/**
 * QuoteSection — first-class quote block. Each quote gets its own zone with
 * breathing room (design.md §5). Per CLAUDE.md §15 step 14.
 *
 * The component renders the inner composition; the caller wraps in a
 * <RedZone density="default"> or <PaperZone> so the quote has the design.md
 * breathing room and torn-edge transitions to neighbouring sections.
 *
 * Visual pattern matches /quote1.png: hand-cut display-weight quote, large
 * typographic quote glyphs, attribution underneath. Glyphs and quote text
 * use currentColor so the section drops into either zone unchanged.
 *
 * No StickyNote here — that primitive is capped at 1 per page (CLAUDE.md
 * §13). Quotes carry their own typographic weight without it.
 */
export function QuoteSection({
  quote,
  attribution,
  attributionMeta,
  eyebrow,
  stamp,
}: QuoteSectionProps) {
  return (
    <Container width="narrow" className="space-y-10">
      {eyebrow ? <Eyebrow rule>{eyebrow}</Eyebrow> : null}
      <figure className="relative space-y-8">
        {/* Open glyph — large, hand-cut, decorative */}
        <span
          aria-hidden
          className="font-display absolute -top-12 -left-2 text-[10rem] leading-none opacity-20 select-none md:-top-16 md:-left-6 md:text-[14rem]"
        >
          “
        </span>
        <blockquote className="font-display relative text-[clamp(2rem,4vw,3.5rem)] leading-[1.15] tracking-[-0.01em] uppercase">
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
            {stamp ? (
              <Stamp tilt={2} className="ml-auto">
                {stamp}
              </Stamp>
            ) : null}
          </figcaption>
        )}
      </figure>
    </Container>
  );
}
