"use client";

import { useEffect, useState } from "react";

/**
 * HeroVideo — looping background footage for the home hero.
 *
 * The poster paints immediately; video sources attach after initial render so
 * the decorative footage does not compete with the hero's first paint.
 */
export function HeroVideo() {
  const [loadVideo, setLoadVideo] = useState(false);

  useEffect(() => {
    const revealVideo = () => setLoadVideo(true);

    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(revealVideo, { timeout: 1600 });
      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = globalThis.setTimeout(revealVideo, 700);
    return () => globalThis.clearTimeout(timeoutId);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <video
        key={loadVideo ? "loaded" : "poster"}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster="/video/hero-bg-poster.jpg"
        aria-hidden="true"
        disablePictureInPicture
        className="h-full w-full object-cover"
      >
        {loadVideo ? (
          <>
            <source src="/video/hero-bg.mp4" type="video/mp4" media="(min-width: 768px)" />
            <source src="/video/hero-bg-mobile.mp4" type="video/mp4" />
          </>
        ) : null}
      </video>
      <div
        aria-hidden="true"
        className="from-brand-red/[0.70] via-brand-red/[0.24] pointer-events-none absolute inset-0 bg-gradient-to-r to-transparent mix-blend-multiply"
      />
      <div
        aria-hidden="true"
        className="from-ink/[0.30] via-ink/[0.08] pointer-events-none absolute inset-0 bg-gradient-to-r to-transparent mix-blend-multiply"
      />
      <div
        aria-hidden="true"
        className="from-ink/[0.24] via-ink/[0.07] pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t to-transparent [mask-image:linear-gradient(to_right,black_0%,black_46%,transparent_78%)]"
      />
      <div
        aria-hidden="true"
        className="from-ink/[0.16] pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b to-transparent [mask-image:linear-gradient(to_right,black_0%,black_46%,transparent_78%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgb(31_20_14)_0%,rgb(31_20_14/.28)_45%,transparent_78%),url('/textures/halftone-overlay.svg')] [background-size:100%_100%,18px_18px] opacity-10 mix-blend-multiply"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgb(168_52_42/.82)_0%,rgb(168_52_42/.24)_45%,transparent_78%),url('/textures/red-grunge.svg')] [background-size:100%_100%,320px_320px] opacity-[0.08] mix-blend-multiply"
      />
    </div>
  );
}
