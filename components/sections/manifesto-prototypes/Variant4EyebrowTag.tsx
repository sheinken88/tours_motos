"use client";

import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Eyebrow } from "@/components/primitives";
import { type ManifestoVariant, FADE_MS, pickLongest, seoSiblings } from "./shared";
import { useRotator } from "./useRotator";

type Props = { variants: ManifestoVariant[] };

/**
 * Variant 4 — Eyebrow tag + plain line.
 * The eyebrow above the line is what rotates and signals "this changes".
 * The teaser below stays in the current paper-on-red treatment. Subtlest
 * of the six.
 */
export function Variant4EyebrowTag({ variants }: Props) {
  const { index, reduceMotion, onMouseEnter, onMouseLeave } = useRotator(variants.length);
  const longestTeaser = useMemo(() => pickLongest(variants), [variants]);
  const longestLabel = useMemo(() => {
    let best = variants[0];
    for (const v of variants) {
      if (v.label.length > (best?.label.length ?? 0)) best = v;
    }
    return best;
  }, [variants]);
  const active = variants[index] ?? variants[0];
  if (!active || !longestTeaser || !longestLabel) return null;

  return (
    <div
      className="relative max-w-prose space-y-3"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Rotating eyebrow */}
      <div className="text-paper relative">
        <Eyebrow aria-hidden className="invisible">
          {longestLabel.label}
        </Eyebrow>
        <AnimatePresence initial={false}>
          <motion.div
            key={`eyebrow-${index}`}
            initial={{ opacity: reduceMotion ? 1 : 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: reduceMotion ? 1 : 0 }}
            transition={{ duration: reduceMotion ? 0 : FADE_MS / 1000 }}
            className="absolute inset-0"
          >
            <Eyebrow rule>{active.label}</Eyebrow>
          </motion.div>
        </AnimatePresence>
      </div>
      {/* Static-style teaser line, but rotates in sync */}
      <div className="relative">
        <p
          aria-hidden
          className="text-paper invisible font-sans text-lg leading-relaxed sm:text-xl"
        >
          {longestTeaser.teaser}
        </p>
        {seoSiblings(variants, longestTeaser.slug).map((v) => (
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
            key={`teaser-${index}`}
            initial={{ opacity: reduceMotion ? 1 : 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: reduceMotion ? 1 : 0 }}
            transition={{ duration: reduceMotion ? 0 : FADE_MS / 1000 }}
            className="text-paper absolute inset-0 font-sans text-lg leading-relaxed sm:text-xl"
          >
            {active.teaser}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
