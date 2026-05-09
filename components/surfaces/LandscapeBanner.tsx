import { type ImageProps } from "next/image";
import { HalftoneImage } from "./HalftoneImage";

type LandscapeBannerProps = Omit<ImageProps, "priority"> & {
  /** Vertical position relative to the parent zone. */
  anchor?: "bottom" | "top";
  /** Height in viewport units; default scales with the zone. */
  heightVh?: number;
  priority?: boolean;
};

/**
 * LandscapeBanner — full-width halftone landscape strip. Used as section
 * transitions and hero base; horizons frequently bleed across the zone
 * boundary into the next band (design.md §5).
 *
 * Parent should be `position: relative` so absolute anchoring works.
 *
 * Pre-processed PNGs only (the source comes from the halftone pipeline at
 * 2× size for retina). For Phase 6 hero, the banner sits at the bottom
 * of the red zone bleeding into the paper zone below.
 *
 * Parallax: design.md §6 allows up to 8% parallax. Implementing as CSS
 * `transform: translateY(...)` with a passive scroll listener belongs
 * in Phase 12 (motion pass). For Phase 3 we ship without parallax — it's
 * trivial to add later without breaking the API.
 */
export function LandscapeBanner({
  anchor = "bottom",
  heightVh = 35,
  className = "",
  alt,
  ...imageProps
}: LandscapeBannerProps) {
  const anchorClass = anchor === "bottom" ? "bottom-0" : "top-0";
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 ${anchorClass} ${className}`}
      style={{ height: `${heightVh}vh` }}
    >
      <HalftoneImage
        alt={alt}
        sizes="100vw"
        fill
        className="object-cover object-bottom"
        {...imageProps}
      />
    </div>
  );
}
