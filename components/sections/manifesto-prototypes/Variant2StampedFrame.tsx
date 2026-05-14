"use client";

import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { type ManifestoVariant, FADE_MS, pickLongest, seoSiblings } from "./shared";
import { useRotator } from "./useRotator";

type Props = { variants: ManifestoVariant[] };

/**
 * Variant 2 — Stamped frame, no fill.
 * 2px paper border around the line, slight tilt. Reads as a passport
 * stamp on a rally pass card. Reuses the Stamp visual language but at
 * paragraph scale.
 */
export function Variant2StampedFrame({ variants }: Props) {
  const { index, reduceMotion, onMouseEnter, onMouseLeave } = useRotator(variants.length);
  const longest = useMemo(() => pickLongest(variants), [variants]);
  const active = variants[index] ?? variants[0];
  if (!active || !longest) return null;

  return (
    <div
      className="text-paper relative max-w-prose border-2 border-current px-6 py-5"
      style={{ transform: "rotate(-1deg)" }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
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
          className="text-paper absolute inset-0 px-6 py-5 font-sans text-lg leading-relaxed sm:text-xl"
        >
          {active.teaser}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
