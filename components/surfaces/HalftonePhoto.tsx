import Image, { type ImageProps } from "next/image";

/**
 * HalftonePhoto — runtime halftone treatment for a photographic source.
 * Used in Phase 6 to land the gonzo/pulp aesthetic on the hero before
 * the offline halftone pipeline (Phase 10) produces real PNG cutouts.
 *
 * Aesthetic goal (matching the inspiration image): high-contrast B&W
 * silhouette in ink color, with the photo's bright areas becoming
 * transparent so the red zone shows through. Result reads as an ink-
 * print pulled off a red field.
 *
 * Filter pipeline (defined in HalftoneFilterDefs below):
 *   1. feColorMatrix     — luminance to grayscale
 *   2. feComponentTransfer — gamma crush + luminance becomes alpha
 *      (bright→transparent, dark→opaque ink)
 *   3. feFlood + feComposite — fill the opaque region with ink color
 *   4. feTurbulence + feDisplacementMap — micro-jitter for printed feel
 *
 * design.md §7 says "avoid runtime CSS halftone filters at hero sizes".
 * Accepting the trade-off until Phase 10. The filter is GPU-accelerated
 * and runs once per image render, not per scroll.
 *
 * Usage:
 *   <HalftoneFilterDefs />              // mount once at the app root
 *   <HalftonePhoto src="..." alt="..." width={...} height={...} />
 */

type HalftonePhotoProps = Omit<ImageProps, "priority"> & {
  priority?: boolean;
  /** Tilt angle in degrees (slight rotation reads as pinned-to-page). */
  tilt?: number;
};

export function HalftonePhoto({
  src,
  alt,
  sizes = "(min-width: 1280px) 760px, (min-width: 768px) 60vw, 80vw",
  priority = false,
  draggable = false,
  className = "",
  tilt = 0,
  style,
  ...rest
}: HalftonePhotoProps) {
  return (
    <div
      className={`halftone-photo ${className}`}
      style={{
        ...style,
        transform: tilt ? `rotate(${tilt}deg)` : undefined,
        filter: "url(#halftone-pipeline)",
      }}
    >
      <Image
        src={src}
        alt={alt}
        sizes={sizes}
        priority={priority}
        draggable={draggable}
        width={typeof rest.width === "number" ? rest.width : undefined}
        height={typeof rest.height === "number" ? rest.height : undefined}
        fill={rest.fill}
        className="h-auto w-full object-contain"
      />
    </div>
  );
}

/**
 * Inline SVG filter definition. Mount once at app root.
 */
export function HalftoneFilterDefs() {
  return (
    <svg
      width="0"
      height="0"
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
      aria-hidden="true"
    >
      <defs>
        <filter
          id="halftone-pipeline"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          {/* 1. Luminance to grayscale, write luminance into alpha so darker
                 input becomes more opaque ink. The RGB channels become
                 the ink color in step 3. */}
          <feColorMatrix
            type="matrix"
            values="0     0     0     0   0.122
                    0     0     0     0   0.078
                    0     0     0     0   0.055
                    -0.299 -0.587 -0.114 0  1"
            result="inkLayer"
          />

          {/* 2. Crush the alpha curve so midtones bias toward solid ink
                 (gives the printed-poster feel rather than photographic
                 grayscale). Bright pixels still go transparent. */}
          <feComponentTransfer in="inkLayer" result="crushed">
            <feFuncA type="gamma" amplitude="1.6" exponent="0.55" offset="-0.05" />
          </feComponentTransfer>

          {/* 3. Subtle displacement — edges feel hand-printed, not pixel-perfect. */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.7"
            numOctaves="1"
            seed="4"
            result="grain"
          />
          <feDisplacementMap
            in="crushed"
            in2="grain"
            scale="1.2"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
