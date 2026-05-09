import { type ImageProps } from "next/image";
import { HalftoneImage } from "./HalftoneImage";

type Anchor = "bottom-right" | "bottom-left" | "right" | "left" | "center";
type Bleed = "right" | "left" | "bottom" | "both" | "none";

type CutoutFigureProps = Omit<ImageProps, "priority"> & {
  /** Position inside the parent (parent must be `position: relative`). */
  anchor?: Anchor;
  /** Negative-margin escape past the container padding. design.md §4. */
  bleed?: Bleed;
  /** Add a 1px paper-color outline. Reads as scissor-cut on red zones. */
  paperOutline?: boolean;
  /** Width of the figure as a fraction of the parent. Default 50%. */
  widthFraction?: number;
  priority?: boolean;
};

const anchorClass: Record<Anchor, string> = {
  "bottom-right": "absolute bottom-0 right-0",
  "bottom-left": "absolute bottom-0 left-0",
  right: "absolute right-0 top-1/2 -translate-y-1/2",
  left: "absolute left-0 top-1/2 -translate-y-1/2",
  center: "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
};

const bleedClass: Record<Bleed, string> = {
  right: "mr-[-5vw] xl:mr-[-8vw]",
  left: "ml-[-5vw] xl:ml-[-8vw]",
  bottom: "mb-[-2vw]",
  both: "mr-[-5vw] mb-[-2vw] xl:mr-[-8vw]",
  none: "",
};

/**
 * CutoutFigure — a halftone subject silhouette positioned with optional bleed
 * past the container edge. design.md §5: figures sit on the field with no
 * border, no shadow, no container.
 *
 * Parent must be `position: relative` for the absolute anchor to land
 * correctly (e.g. wrap inside a Container with className="relative").
 *
 * Default: bottom-right anchor with right-bleed, 50% parent width — the
 * canonical hero-cutout placement from design.md §5.
 */
export function CutoutFigure({
  anchor = "bottom-right",
  bleed = "right",
  paperOutline = false,
  widthFraction = 0.5,
  className = "",
  alt,
  ...imageProps
}: CutoutFigureProps) {
  const widthStyle = { width: `${Math.round(widthFraction * 100)}%` };
  const outlineClass = paperOutline ? "outline outline-1 outline-paper" : "";

  return (
    <div
      className={`pointer-events-none ${anchorClass[anchor]} ${bleedClass[bleed]} ${className}`}
      style={widthStyle}
    >
      <HalftoneImage
        alt={alt}
        sizes={`${Math.round(widthFraction * 100)}vw`}
        className={`h-auto w-full ${outlineClass}`}
        {...imageProps}
      />
    </div>
  );
}
