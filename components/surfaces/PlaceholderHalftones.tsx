/**
 * Placeholder halftone-style SVG components used by the Phase 6 hero
 * before real photography lands.
 *
 * Geometry: hand-authored paths (silhouettes), with a halftone dot
 * pattern composited via SVG mask so the rendered result feels like
 * a printed halftone rather than a vector silhouette.
 *
 * Replaced in Phase 10 with PNG files run through the Photoshop pipeline
 * (/docs/halftone-pipeline.md). The Hero will import HalftoneImage +
 * CutoutFigure pointing at /images/halftone/*.png at that point.
 */

const HALFTONE_DEFS_ID = "ph-halftone-pattern";

type Tint = "ink" | "paper";

const tintColor: Record<Tint, string> = {
  ink: "var(--color-ink)",
  paper: "var(--color-paper)",
};

/**
 * Halftone dot pattern shared by both placeholders. Renders dot density
 * gradient: tighter near the bottom, sparser near the top. Used as an
 * alpha mask so the silhouette appears halftone-shaded rather than
 * flat-filled.
 */
function HalftoneDefs({ idSuffix = "" }: { idSuffix?: string }) {
  const id = `${HALFTONE_DEFS_ID}${idSuffix}`;
  return (
    <defs>
      <pattern id={id} x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
        <circle cx="3" cy="3" r="2.1" fill="white" />
      </pattern>
      <linearGradient id={`${id}-grad`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="white" stopOpacity="0.65" />
        <stop offset="60%" stopColor="white" stopOpacity="0.92" />
        <stop offset="100%" stopColor="white" stopOpacity="1" />
      </linearGradient>
    </defs>
  );
}

// ── Mountain ridge ──────────────────────────────────────────────────────────

type PlaceholderMountainsProps = {
  className?: string;
  tint?: Tint;
};

/**
 * Layered halftone mountain ridge anchored to the bottom of the parent.
 * Two layers of peaks (back, fore) with halftone fill so the ridge reads
 * as a printed silhouette rather than a flat shape.
 */
export function PlaceholderMountains({ className = "", tint = "ink" }: PlaceholderMountainsProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 1440 320"
      preserveAspectRatio="none"
      aria-hidden
      focusable="false"
    >
      <HalftoneDefs idSuffix="-mtn" />
      <mask id="mtn-mask">
        <rect width="1440" height="320" fill="black" />
        {/* Back ridge */}
        <path
          d="M0,320 L0,200 L80,150 L160,180 L240,120 L340,170 L420,130 L520,180 L640,140 L760,200 L880,150 L1000,200 L1120,160 L1260,200 L1380,140 L1440,170 L1440,320 Z"
          fill="url(#ph-halftone-pattern-mtn-grad)"
          opacity="0.55"
        />
        {/* Fore ridge */}
        <path
          d="M0,320 L0,250 L60,200 L140,240 L220,180 L320,230 L420,200 L540,250 L660,210 L780,250 L900,220 L1020,260 L1160,220 L1280,260 L1400,230 L1440,250 L1440,320 Z"
          fill="white"
        />
      </mask>
      <rect width="1440" height="320" fill={tintColor[tint]} mask="url(#mtn-mask)" />
      <rect
        width="1440"
        height="320"
        fill="url(#ph-halftone-pattern-mtn)"
        mask="url(#mtn-mask)"
        opacity="0.18"
      />
    </svg>
  );
}
