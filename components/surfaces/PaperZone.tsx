import { type HTMLAttributes } from "react";
import { TornEdge, type TornEdgeVariant } from "./TornEdge";

type ZoneDensity = "default" | "heavy" | "light";

type PaperZoneProps = HTMLAttributes<HTMLElement> & {
  /** Vertical padding tier — see RedZone. */
  density?: ZoneDensity;
  /** Render torn edge at top, transitioning FROM a red zone above. */
  tornTop?: boolean | TornEdgeVariant;
  /** Render torn edge at bottom, transitioning TO a red zone below. */
  tornBottom?: boolean | TornEdgeVariant;
};

const densityClass: Record<ZoneDensity, string> = {
  default: "py-20 md:py-24",
  heavy: "py-28 md:py-32",
  light: "py-12 md:py-16",
};

/**
 * PaperZone — kraft-paper band with paper-grain texture overlay (design.md §1).
 *
 * Pages alternate PaperZone and RedZone. Sets data-zone="paper" so descendant
 * primitives pick up ink-color foreground (and red headlines via the [data-zone]
 * CSS cascade in app/globals.css).
 *
 * Optional torn edges at top and/or bottom — their `to` color is red, since
 * paper→red is the only transition shape we draw from this zone.
 *
 * Pure flat fills look digital — the bg-paper-grain utility composites the
 * paper-grain SVG over --color-paper at the design.md §10 opacity.
 */
export function PaperZone({
  density = "default",
  tornTop = false,
  tornBottom = false,
  className = "",
  children,
  ...rest
}: PaperZoneProps) {
  return (
    <section
      data-zone="paper"
      className={`bg-paper-grain text-on-paper relative isolate ${densityClass[density]} ${className}`}
      {...rest}
    >
      {tornTop ? (
        <TornEdge variant={typeof tornTop === "number" ? tornTop : 1} direction="up" to="red" />
      ) : null}
      {children}
      {tornBottom ? (
        <TornEdge
          variant={typeof tornBottom === "number" ? tornBottom : 1}
          direction="down"
          to="red"
        />
      ) : null}
    </section>
  );
}
