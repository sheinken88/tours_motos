import { Button, Container, DisplayHeading, Eyebrow } from "@/components/primitives";

type PageTeaserProps = {
  eyebrow: string;
  heading: string;
  body: string;
  /** Locale-aware path the CTA links to (e.g. "/custom"). */
  href: string;
  ctaLabel: string;
  /** Optional alignment override. Default left. */
  align?: "left" | "center";
  /** Sticker-edge variant for the CTA. Defaults to 1. */
  edge?: 1 | 2 | 3;
  /** CTA tilt direction. Defaults left. */
  tilt?: "left" | "right" | "none";
  /**
   * Use the prominent filled-sticker CTA. Reserved for top-priority links —
   * one max per zone (CLAUDE.md §13). Defaults outline.
   */
  emphasis?: boolean;
};

/**
 * PageTeaser — small two-line teaser composition: eyebrow + display heading
 * + one-paragraph body + sticker CTA. Used on the home page to give each
 * primary surface (custom, about, journal) a one-scroll preview that links
 * onward.
 *
 * Self-contained — caller wraps in <PaperZone> or <RedZone>. Zone foreground
 * cascade handles colors via data-zone, so the same component renders on
 * either surface.
 */
export function PageTeaser({
  eyebrow,
  heading,
  body,
  href,
  ctaLabel,
  align = "left",
  edge = 1,
  tilt = "left",
  emphasis = false,
}: PageTeaserProps) {
  const alignmentClass = align === "center" ? "items-center text-center" : "items-start";
  return (
    <Container>
      <div className={`flex max-w-prose flex-col gap-6 ${alignmentClass}`}>
        <Eyebrow rule>{eyebrow}</Eyebrow>
        <DisplayHeading size="xl" as="h2">
          {heading}
        </DisplayHeading>
        <p className="font-sans text-lg leading-relaxed sm:text-xl">{body}</p>
        <Button
          href={href}
          edge={edge}
          tilt={tilt}
          variant={emphasis ? "sticker-filled" : "sticker-outline"}
        >
          {ctaLabel}
        </Button>
      </div>
    </Container>
  );
}
