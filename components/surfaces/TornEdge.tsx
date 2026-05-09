import { type Zone } from "@/lib/zone";

export type TornEdgeVariant = 1 | 2 | 3 | 4;

type TornEdgeProps = {
  /** Path variant 1–4. design.md §5: randomize across pages. Default 1. */
  variant?: TornEdgeVariant;
  /**
   * Edge orientation:
   *   - "down" (default): edge sits at the BOTTOM of the parent zone, pointing
   *     toward the next zone below. Use when this zone is on TOP.
   *   - "up": edge sits at the TOP of the parent zone, pointing toward the
   *     previous zone above. Use when this zone is on BOTTOM.
   */
  direction?: "up" | "down";
  /**
   * The DESTINATION zone — the one this edge transitions TOWARD.
   * The torn-paper shape gets filled in this color so it visually
   * "lifts" off and reveals the next zone underneath.
   */
  to: Zone;
  className?: string;
};

/**
 * TornEdge — the signature zone-transition pattern (design.md §5).
 *
 * Hand-torn SVG path filling the boundary between two zones. Renders as
 * an absolutely-positioned SVG inside the source zone; consumers should
 * place it via <RedZone tornBottom> / <PaperZone tornTop> rather than
 * mounting it directly.
 *
 * Always static (no animation, design.md §6).
 *
 * Direction encoding:
 *   - down + to=paper:  red zone above, torn lower edge revealing paper below.
 *   - up   + to=red:    paper zone below, torn upper edge revealing red above.
 *
 * The four path variants come from /public/textures/torn-edge-{1..4}.svg.
 * They're embedded inline here (rather than fetched) so CSS currentColor
 * controls the fill without needing an external mask.
 */
export function TornEdge({ variant = 1, direction = "down", to, className = "" }: TornEdgeProps) {
  const path = TORN_PATHS[variant];
  const fillColor = to === "red" ? "var(--color-brand-red)" : "var(--color-paper)";
  // Shift one pixel into the destination zone so sub-pixel rounding can't
  // open a hairline seam between the torn shape and the next zone's fill.
  const positionClass =
    direction === "down" ? "-bottom-px left-0 right-0" : "-top-px left-0 right-0";
  const transformClass = direction === "up" ? "scale-y-[-1]" : "";

  return (
    <svg
      className={`pointer-events-none absolute h-10 w-full ${positionClass} ${transformClass} ${className}`}
      viewBox="0 0 1440 42"
      preserveAspectRatio="none"
      aria-hidden
      focusable="false"
    >
      <path d={path} fill={fillColor} />
    </svg>
  );
}

// Paths overshoot to y=42 (viewBox is 0 0 1440 42) so the destination color
// extends one user-unit past the SVG's nominal bottom. Combined with the
// -bottom-px / -top-px offset on the wrapper, this guarantees no hairline
// seam at the zone boundary regardless of viewport width.
const TORN_PATHS: Record<TornEdgeVariant, string> = {
  1: "M0,0 L0,22 L18,28 L42,18 L78,30 L112,22 L148,32 L186,20 L222,28 L260,18 L296,30 L332,22 L370,32 L408,20 L446,28 L482,18 L520,30 L558,22 L596,32 L634,20 L672,28 L710,18 L748,30 L786,22 L824,32 L862,20 L900,28 L938,18 L976,30 L1014,22 L1052,32 L1090,20 L1128,28 L1166,18 L1204,30 L1242,22 L1280,32 L1318,20 L1356,28 L1394,18 L1432,30 L1440,22 L1440,42 L0,42 Z",
  2: "M0,0 L0,16 L24,30 L52,12 L82,34 L110,18 L142,28 L168,10 L196,32 L228,16 L262,30 L300,12 L338,34 L370,18 L402,28 L432,10 L468,32 L500,16 L532,30 L568,12 L604,34 L640,18 L678,28 L712,10 L748,32 L780,16 L816,30 L850,12 L886,34 L922,18 L958,28 L992,10 L1028,32 L1062,16 L1098,30 L1132,12 L1168,34 L1204,18 L1240,28 L1274,10 L1310,32 L1346,16 L1380,30 L1414,12 L1440,28 L1440,42 L0,42 Z",
  3: "M0,0 L0,24 L12,18 L24,28 L38,20 L52,30 L66,22 L80,28 L96,18 L112,30 L128,22 L144,28 L160,18 L178,32 L196,22 L214,28 L232,18 L250,30 L268,22 L286,28 L304,18 L322,30 L340,22 L358,28 L376,18 L394,30 L412,22 L430,28 L448,18 L466,30 L484,22 L502,28 L520,18 L538,30 L556,22 L574,28 L592,18 L610,30 L628,22 L646,28 L664,18 L682,30 L700,22 L718,28 L736,18 L754,30 L772,22 L790,28 L808,18 L826,30 L844,22 L862,28 L880,18 L898,30 L916,22 L934,28 L952,18 L970,30 L988,22 L1006,28 L1024,18 L1042,30 L1060,22 L1078,28 L1096,18 L1114,30 L1132,22 L1150,28 L1168,18 L1186,30 L1204,22 L1222,28 L1240,18 L1258,30 L1276,22 L1294,28 L1312,18 L1330,30 L1348,22 L1366,28 L1384,18 L1402,30 L1420,22 L1438,28 L1440,42 L0,42 Z",
  4: "M0,0 L0,20 L36,32 L74,14 L96,28 L132,10 L168,30 L204,18 L228,34 L262,16 L298,28 L322,10 L362,32 L394,18 L426,30 L458,12 L490,28 L522,16 L558,34 L592,20 L628,12 L660,30 L694,18 L728,28 L762,14 L796,32 L832,18 L866,28 L898,12 L934,30 L968,18 L1002,32 L1036,14 L1070,28 L1104,18 L1138,32 L1170,16 L1204,28 L1238,12 L1272,30 L1304,18 L1340,28 L1372,14 L1406,32 L1440,20 L1440,42 L0,42 Z",
};
