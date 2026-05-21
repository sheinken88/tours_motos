"use client";

/**
 * HeroVideo — looping background footage for the home hero.
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
        className="h-full w-full object-cover"
      />
      {/* Subtle red wash — just enough to anchor light text, footage still reads naturally. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-brand-red mix-blend-multiply opacity-40"
      />
    </div>
  );
}
