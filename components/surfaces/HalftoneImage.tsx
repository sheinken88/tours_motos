import Image, { type ImageProps } from "next/image";

type HalftoneImageProps = Omit<ImageProps, "priority"> & {
  /** Set true ONLY for above-the-fold hero images (LCP). One per page max. */
  priority?: boolean;
};

const RECOMMENDED_SIZES = "(min-width: 1280px) 1240px, (min-width: 768px) 80vw, 100vw";

/**
 * HalftoneImage — wrapper around next/image that enforces the halftone
 * pipeline contract.
 *
 * Phase 3–9: lenient mode. Accepts any image source so we can build pages
 * with placeholder PNGs. A dev-only warning fires if the source is not
 * a `.png` (halftones MUST have alpha — design.md §7).
 *
 * Phase 10: this gate flips to a hard runtime assertion.
 *
 * Defaults:
 *   - sizes = recommended responsive sizes for content-width images
 *   - draggable = false (prevents accidental "save image as" UX leak)
 *   - priority is false unless explicitly opted in
 *
 * The component does NOT add borders, shadows, or filters — those are
 * specified by the consumer or by wrapping primitives like CutoutFigure.
 */
export function HalftoneImage({
  src,
  alt,
  sizes = RECOMMENDED_SIZES,
  priority = false,
  draggable = false,
  className = "",
  ...rest
}: HalftoneImageProps) {
  if (process.env.NODE_ENV !== "production" && typeof src === "string") {
    if (!src.toLowerCase().endsWith(".png")) {
      console.warn(
        `[HalftoneImage] Source "${src}" is not a .png — halftone cutouts must have alpha. ` +
          `This warning will become an error in Phase 10. See /docs/halftone-pipeline.md.`,
      );
    }
  }

  return (
    <Image
      src={src}
      alt={alt}
      sizes={sizes}
      priority={priority}
      draggable={draggable}
      className={className}
      {...rest}
    />
  );
}
