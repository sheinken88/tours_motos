"use client";

/**
 * HeroVideo — looping background footage for the home hero.
 *
 * Sits behind the red-grunge zone color, the mountain ridge, and copy.
 * Heavy CSS grade (grayscale + sepia + hue-rotate + saturate) pushes the
 * footage into the burgundy duotone so it reads as printed texture, not
 * legible video. The red overlay above pushes that further toward "atmosphere".
 *
 * Client component only because <video> needs autoplay attrs and playsInline
 * to start without a user gesture on iOS Safari.
 */
export function HeroVideo() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <video
        src="/video/hero-bg.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        className="h-full w-full object-cover opacity-55"
        style={{
          filter:
            "sepia(0.4) hue-rotate(-15deg) saturate(1.2) contrast(1.05)",
        }}
      />
      {/* Red multiply wash — tints the footage toward burgundy without repainting it. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-brand-red mix-blend-multiply opacity-35"
      />
    </div>
  );
}
