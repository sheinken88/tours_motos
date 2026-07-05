import Image, { type ImageProps } from "next/image";
import { HalftoneImage } from "./HalftoneImage";
import { RoutePlaceholderPanel } from "./TourImagePoster";

type RoutePrintProps = {
  alt: string;
  colorSrc?: ImageProps["src"] | null;
  halftoneSrc?: ImageProps["src"] | null;
  fallbackId?: string;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  width?: number;
  height?: number;
  showHalftoneOverlay?: boolean;
};

/**
 * RoutePrint — printed route image treatment for red hero zones.
 *
 * Color photos are clipped, washed with brand red, and overlaid with the
 * halftone texture so they read as screen-printed route proof rather than a
 * clean photo card. When a true halftone PNG exists, it can sit over the color
 * source as the ink layer.
 */
export function RoutePrint({
  alt,
  colorSrc,
  halftoneSrc,
  fallbackId = "route-print",
  priority = false,
  className = "",
  imageClassName = "object-bottom",
  sizes = "(min-width: 1024px) 58vw, 100vw",
  width = 1846,
  height = 852,
  showHalftoneOverlay = true,
}: RoutePrintProps) {
  return (
    <figure
      className={`group/route-print border-paper/30 relative isolate overflow-hidden border-y-2 bg-transparent ${className}`}
      style={{
        clipPath: "polygon(0 10%, 100% 0, 100% 90%, 80% 100%, 0 88%)",
      }}
    >
      {colorSrc ? (
        <Image
          src={colorSrc}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          priority={priority}
          loading={priority ? "eager" : undefined}
          className={`h-full w-full object-cover opacity-95 contrast-125 saturate-75 ${imageClassName}`}
        />
      ) : halftoneSrc ? (
        <HalftoneImage
          src={halftoneSrc}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          priority={priority}
          loading={priority ? "eager" : undefined}
          className={`h-full w-full object-cover opacity-95 contrast-125 ${imageClassName}`}
        />
      ) : (
        <RoutePlaceholderPanel
          id={fallbackId}
          className="absolute inset-0 opacity-80 mix-blend-multiply"
        />
      )}

      <div className="bg-brand-red pointer-events-none absolute inset-0 opacity-20 mix-blend-multiply" />

      {colorSrc && halftoneSrc ? (
        <HalftoneImage
          src={halftoneSrc}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          priority={priority}
          loading={priority ? "eager" : undefined}
          className={`pointer-events-none absolute inset-0 h-full w-full object-cover opacity-35 mix-blend-multiply contrast-125 ${imageClassName}`}
        />
      ) : null}

      {showHalftoneOverlay ? (
        <div
          className="pointer-events-none absolute inset-0 opacity-20 mix-blend-multiply"
          style={{
            backgroundImage: "url(/textures/halftone-overlay.svg)",
            backgroundRepeat: "repeat",
          }}
          aria-hidden="true"
        />
      ) : null}
    </figure>
  );
}
