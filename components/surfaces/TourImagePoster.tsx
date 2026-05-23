import Image from "next/image";
import { type Locale } from "@/lib/i18n/config";
import { type Tour } from "@/lib/sheets/schemas";
import { HalftoneImage } from "./HalftoneImage";

type TourImagePosterProps = {
  tour: Tour;
  locale: Locale;
  imageSrc?: string;
  colorSrc?: string;
  alt?: string;
  caption?: string;
  label?: string;
  aspectClassName?: string;
  sizes?: string;
  priority?: boolean;
  tilt?: number;
  className?: string;
  imageClassName?: string;
  showColorOnHover?: boolean;
  compact?: boolean;
  useTourFallback?: boolean;
};

function safeId(value: string) {
  return value.replace(/[^a-z0-9-]/gi, "-").toLowerCase();
}

function placeholderVariant(id: string) {
  return (
    Array.from(id).reduce((total, char) => total + char.charCodeAt(0), 0) % routeForegrounds.length
  );
}

const routeForegrounds = [
  "M0 540 116 468 236 498 360 410 506 486 620 420 760 520 900 454 1040 542 1200 480V820H0Z",
  "M0 590 120 520 250 560 390 455 520 530 690 438 830 552 980 488 1200 566V820H0Z",
  "M0 508 96 438 210 502 318 424 470 474 600 390 742 470 904 414 1030 488 1200 398V820H0Z",
];

const routeRoads = [
  "M552 820c22-66 44-121 66-166 22-44 44-78 66-102",
  "M710 820c-24-72-36-134-36-186 0-54 18-100 54-138",
  "M472 820c42-58 80-106 114-144 34-36 74-68 120-96",
];

function RoutePlaceholderArt({ id, className = "" }: { id: string; className?: string }) {
  const dotId = `route-placeholder-dots-${safeId(id)}`;
  const ridgeId = `route-placeholder-ridge-${safeId(id)}`;
  const variant = placeholderVariant(id);

  return (
    <svg
      className={`absolute inset-0 h-full w-full ${className}`}
      viewBox="0 0 1200 820"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern id={dotId} x="0" y="0" width="18" height="18" patternUnits="userSpaceOnUse">
          <circle cx="8" cy="8" r="4.2" fill="currentColor" />
        </pattern>
        <linearGradient id={ridgeId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.18" />
          <stop offset="68%" stopColor="currentColor" stopOpacity="0.42" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.76" />
        </linearGradient>
      </defs>
      <rect width="1200" height="820" fill="var(--color-paper-aged)" />
      <rect width="1200" height="820" fill={`url(#${dotId})`} opacity="0.08" />
      <path
        d="M0 408 90 330 182 366 278 266 382 342 486 250 612 380 734 292 836 370 938 306 1048 388 1200 286V820H0Z"
        fill={`url(#${ridgeId})`}
      />
      <path d={routeForegrounds[variant]} fill="currentColor" opacity="0.82" />
      <path
        d="M630 820C612 738 588 665 560 602c-28-62-52-108-72-138 74 52 134 110 180 174 47 64 88 124 124 182Z"
        fill="var(--color-paper)"
        opacity="0.82"
      />
      <path
        d={routeRoads[variant]}
        fill="none"
        stroke="currentColor"
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray="42 34"
        opacity="0.42"
      />
      <path
        d="M86 182c118-48 238-74 360-78 146-5 284 18 414 70 78 31 164 45 258 42"
        fill="none"
        stroke="currentColor"
        strokeWidth="10"
        strokeLinecap="round"
        opacity="0.2"
      />
    </svg>
  );
}

export function RoutePlaceholderPanel({
  id,
  label,
  className = "",
}: {
  id: string;
  label?: string;
  className?: string;
}) {
  return (
    <div className={`bg-paper-aged relative isolate overflow-hidden ${className}`}>
      <div
        className="pointer-events-none absolute inset-0 z-[1] opacity-20 mix-blend-multiply"
        style={{
          backgroundImage: "url(/textures/halftone-overlay.svg)",
          backgroundRepeat: "repeat",
        }}
        aria-hidden="true"
      />
      <RoutePlaceholderArt id={id} className="text-ink" />
      {label ? (
        <div className="absolute top-4 left-4 z-[2]">
          <span className="bg-paper-light font-display text-accent-on-paper inline-block border-2 border-current px-3 py-1.5 text-xs tracking-[var(--tracking-cta)] uppercase">
            {label}
          </span>
        </div>
      ) : null}
    </div>
  );
}

/**
 * TourImagePoster — framed route image surface for tour-detail pages.
 *
 * Existing route images are landscape halftones, not rider cutouts, so this
 * component treats them as torn poster panels. When the client has not uploaded
 * a route image yet, the same frame renders an in-system placeholder illustration.
 */
export function TourImagePoster({
  tour,
  locale,
  imageSrc,
  colorSrc,
  alt,
  caption,
  label,
  aspectClassName = "aspect-[4/3]",
  sizes = "(min-width: 1024px) 44vw, 100vw",
  priority = false,
  tilt = -1,
  className = "",
  imageClassName = "object-cover",
  showColorOnHover = true,
  compact = false,
  useTourFallback = true,
}: TourImagePosterProps) {
  const resolvedImage = imageSrc || (useTourFallback ? tour.hero_image : "");
  const resolvedColor = colorSrc || (useTourFallback ? tour.hero_image_color : "");
  const title = tour.title[locale];
  const region = tour.region[locale];
  const imageAlt = alt || tour.hero_image_alt[locale] || title;

  return (
    <figure
      data-zone="paper"
      className={`group/poster text-on-paper ${className}`}
      style={{ transform: tilt ? `rotate(${tilt}deg)` : undefined }}
    >
      <div
        className={`bg-paper-grain shadow-sticker-ink border-ink/70 relative overflow-hidden border-2 ${aspectClassName}`}
      >
        <div
          className="pointer-events-none absolute inset-0 z-[1] opacity-25 mix-blend-multiply"
          style={{
            backgroundImage: "url(/textures/halftone-overlay.svg)",
            backgroundRepeat: "repeat",
          }}
          aria-hidden="true"
        />
        {resolvedImage ? (
          <HalftoneImage
            src={resolvedImage}
            alt={imageAlt}
            fill
            sizes={sizes}
            priority={priority}
            className={`mix-blend-multiply ${imageClassName}`}
          />
        ) : (
          <RoutePlaceholderPanel id={tour.slug} className="absolute inset-0" />
        )}
        {resolvedColor ? (
          <Image
            src={resolvedColor}
            alt=""
            aria-hidden="true"
            fill
            sizes={sizes}
            draggable={false}
            className={`absolute inset-0 ${imageClassName} transition-opacity duration-300 ease-out ${
              showColorOnHover ? "opacity-0 group-hover/poster:opacity-100" : "opacity-20"
            }`}
          />
        ) : null}
        <div className="absolute top-4 left-4 z-[2] flex flex-wrap gap-2">
          <span className="bg-paper-light font-display text-accent-on-paper inline-block border-2 border-current px-3 py-1.5 text-xs tracking-[var(--tracking-cta)] uppercase">
            {label || region}
          </span>
        </div>
      </div>
      {caption ? (
        <figcaption
          className={`text-muted-on-paper mt-4 max-w-prose font-sans leading-relaxed ${
            compact ? "text-xs" : "text-sm"
          }`}
        >
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
