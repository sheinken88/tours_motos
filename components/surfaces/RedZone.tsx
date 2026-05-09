import { type HTMLAttributes } from "react";
import { TornEdge, type TornEdgeVariant } from "./TornEdge";

type ZoneDensity = "default" | "heavy" | "light";

type RedZoneProps = HTMLAttributes<HTMLElement> & {
  /**
   * Vertical padding tier — design.md §4 spacing scale.
   *   - "default" (~80px each side, py-20): standard storytelling zone.
   *   - "heavy" (~128px, py-32): hero / showcase zones.
   *   - "light" (~48px, py-12): tight transition zones.
   */
  density?: ZoneDensity;
  /** Render torn edge at top, transitioning FROM a paper zone above. */
  tornTop?: boolean | TornEdgeVariant;
  /** Render torn edge at bottom, transitioning TO a paper zone below. */
  tornBottom?: boolean | TornEdgeVariant;
};

const densityClass: Record<ZoneDensity, string> = {
  default: "py-20 md:py-24",
  heavy: "py-28 md:py-32",
  light: "py-12 md:py-16",
};

/**
 * RedZone — burgundy-rust band with red-grunge texture overlay (design.md §1).
 *
 * Pages alternate RedZone and PaperZone. Sets data-zone="red" so descendant
 * primitives pick up paper-color foreground via the [data-zone] CSS cascade
 * in app/globals.css.
 *
 * Optional torn edges at top and/or bottom — their `to` color is paper,
 * since red→paper is the only transition shape we draw from this zone.
 *
 * No flat-color fills: paper-grain texture is implied by the bg-red-grunge
 * utility (which composites the SVG noise over --color-brand-red).
 */
export function RedZone({
  density = "default",
  tornTop = false,
  tornBottom = false,
  className = "",
  children,
  ...rest
}: RedZoneProps) {
  return (
    <section
      data-zone="red"
      className={`bg-red-grunge text-on-red relative isolate ${densityClass[density]} ${className}`}
      {...rest}
    >
      {tornTop ? (
        <TornEdge variant={typeof tornTop === "number" ? tornTop : 1} direction="up" to="paper" />
      ) : null}
      {children}
      {tornBottom ? (
        <TornEdge
          variant={typeof tornBottom === "number" ? tornBottom : 1}
          direction="down"
          to="paper"
        />
      ) : null}
    </section>
  );
}
