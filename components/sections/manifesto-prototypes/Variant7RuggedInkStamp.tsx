"use client";

import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { type ManifestoVariant, FADE_MS, pickLongest, seoSiblings } from "./shared";
import { useRotator } from "./useRotator";

type Props = {
  variants: ManifestoVariant[];
  /** Which sticker-edge silhouette to use (1, 2, or 3). Default 2. */
  edge?: 1 | 2 | 3;
};

/**
 * Variant 7 — Rugged ink stamp.
 * Hybrid of variant 1 (ink fill) + variant 2 (tilt + chipped edges).
 * Reuses the sticker-edge silhouettes from Button/PaperPanel so the
 * irregular outline is consistent with the rest of the design system —
 * but filled in --color-ink instead of being a stroke. Reads as a rubber
 * stamp pressed onto the poster: edges chipped from heavy use, ink slightly
 * uneven via the red-grunge texture overlay.
 *
 * Implementation: SVG path defines the shape; an inner div clipped to that
 * path holds the ink fill + texture. Text sits on top of both, inset
 * slightly so the irregular edges don't crop the typography.
 */
export function Variant7RuggedInkStamp({ variants, edge = 2 }: Props) {
  const { index, reduceMotion, onMouseEnter, onMouseLeave } = useRotator(variants.length);
  const longest = useMemo(() => pickLongest(variants), [variants]);
  const active = variants[index] ?? variants[0];
  if (!active || !longest) return null;

  const path = STAMP_PATHS[edge];

  return (
    <div
      className="relative max-w-prose"
      style={{ transform: "rotate(-1.5deg)" }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Rugged ink shape — SVG path filled with --color-ink, layered with
          a subtle red-grunge texture for the "uneven ink" feel. */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 200 60"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <pattern id={`stamp-grain-${edge}`} patternUnits="userSpaceOnUse" width="4" height="4">
            <rect width="4" height="4" fill="var(--color-ink)" />
            <circle cx="1" cy="1" r="0.5" fill="var(--color-brand-red-deep)" opacity="0.18" />
            <circle cx="3" cy="3" r="0.4" fill="var(--color-paper)" opacity="0.06" />
          </pattern>
        </defs>
        <path d={path} fill={`url(#stamp-grain-${edge})`} />
      </svg>

      {/* Padding wrapper — slightly larger than the visible frame border so
          the chipped edges don't bite into the text. */}
      <div className="text-paper relative px-7 py-6">
        <p aria-hidden className="invisible font-sans text-lg leading-relaxed sm:text-xl">
          {longest.teaser}
        </p>

        {seoSiblings(variants, longest.slug).map((v) => (
          <p
            key={`seo-${v.slug}`}
            aria-hidden
            className="invisible absolute -z-10 h-0 w-0 overflow-hidden"
          >
            {v.teaser}
          </p>
        ))}

        <AnimatePresence initial={false}>
          <motion.p
            key={index}
            initial={{ opacity: reduceMotion ? 1 : 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: reduceMotion ? 1 : 0 }}
            transition={{ duration: reduceMotion ? 0 : FADE_MS / 1000 }}
            className="text-paper absolute inset-0 px-7 py-6 font-sans text-lg leading-relaxed sm:text-xl"
          >
            {active.teaser}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

/** Same irregular silhouettes used by Button's sticker-outline + PaperPanel. */
const STAMP_PATHS: Record<1 | 2 | 3, string> = {
  1: "M3,4 L18,2 L40,5 L62,3 L86,4 L110,2 L134,5 L158,3 L182,4 L196,5 L197,18 L195,32 L198,46 L196,55 L182,57 L160,55 L138,57 L114,55 L90,57 L66,55 L42,57 L20,55 L4,57 L3,44 L5,30 L2,16 Z",
  2: "M5,6 L22,3 L44,7 L68,2 L94,6 L122,3 L150,7 L176,4 L194,5 L196,20 L194,34 L197,48 L194,56 L176,58 L150,55 L120,58 L92,55 L66,58 L42,55 L20,58 L4,55 L2,42 L4,28 L1,14 Z",
  3: "M2,3 L24,4 L48,2 L74,4 L100,3 L128,4 L154,2 L178,4 L198,3 L197,16 L198,30 L196,44 L197,57 L178,56 L154,58 L128,56 L100,57 L74,56 L48,58 L24,56 L2,57 L3,44 L2,30 L4,16 Z",
};
