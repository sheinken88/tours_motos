"use client";

import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { type ManifestoVariant, FADE_MS, pickLongest, seoSiblings } from "./shared";
import { useRotator } from "./useRotator";

type Props = { variants: ManifestoVariant[] };

/**
 * Variant 5 — Left ink rule + dots.
 * Vertical paper-color rule on the left edge of the line and small
 * pagination dots below. Quietest possible "this rotates" affordance —
 * the rule provides anchor, the dots provide narrative.
 */
export function Variant5RuleAndDots({ variants }: Props) {
  const { index, reduceMotion, onMouseEnter, onMouseLeave } = useRotator(variants.length);
  const longest = useMemo(() => pickLongest(variants), [variants]);
  const active = variants[index] ?? variants[0];
  if (!active || !longest) return null;

  return (
    <div
      className="max-w-prose space-y-3"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="border-paper relative border-l-2 pl-4">
        <p
          aria-hidden
          className="text-paper invisible font-sans text-lg leading-relaxed sm:text-xl"
        >
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
            className="text-paper absolute inset-0 pl-4 font-sans text-lg leading-relaxed sm:text-xl"
          >
            {active.teaser}
          </motion.p>
        </AnimatePresence>
      </div>
      {/* Pagination dots */}
      <div className="flex items-center gap-2 pl-4" aria-hidden>
        {variants.map((v, i) => (
          <span
            key={v.slug}
            className={`h-1.5 w-1.5 ${i === index ? "bg-paper" : "bg-paper/30"} transition-colors`}
            style={{ transition: `background-color ${FADE_MS}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
