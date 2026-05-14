"use client";

import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { type ManifestoVariant, FADE_MS, pickLongest, seoSiblings } from "./shared";
import { useRotator } from "./useRotator";

type Props = { variants: ManifestoVariant[] };

/**
 * Variant 3 — Paper card on red.
 * Kraft panel with hard-offset ink shadow. Tilted -1°. Reads as a
 * physical card pinned to the poster. Strongest contrast of the six.
 *
 * Custom rather than reusing PaperPanel because PaperPanel sets fixed
 * data-zone="paper" + heavy padding that crowds the hero column.
 */
export function Variant3PaperCard({ variants }: Props) {
  const { index, reduceMotion, onMouseEnter, onMouseLeave } = useRotator(variants.length);
  const longest = useMemo(() => pickLongest(variants), [variants]);
  const active = variants[index] ?? variants[0];
  if (!active || !longest) return null;

  return (
    <div
      data-zone="paper"
      className="bg-paper text-on-paper bg-paper-grain shadow-sticker-ink relative max-w-prose px-6 py-5"
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
          className="text-on-paper absolute inset-0 px-6 py-5 font-sans text-lg leading-relaxed sm:text-xl"
        >
          {active.teaser}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
