"use client";

import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { type ManifestoVariant, FADE_MS, pickLongest, seoSiblings } from "./shared";
import { useRotator } from "./useRotator";

type Props = { variants: ManifestoVariant[] };

/**
 * Variant 6 — Torn-paper strip on red.
 * Horizontal kraft strip with hand-torn top and bottom edges, ink text
 * inside. Reuses the brand's signature TornEdge SVG vocabulary at strip
 * scale (rather than zone-transition scale).
 *
 * Implementation: a paper-grain block with two SVG torn shapes layered
 * above and below. Both torn shapes fill in --color-brand-red so the
 * strip appears torn out of the surrounding red zone.
 */
export function Variant6TornStrip({ variants }: Props) {
  const { index, reduceMotion, onMouseEnter, onMouseLeave } = useRotator(variants.length);
  const longest = useMemo(() => pickLongest(variants), [variants]);
  const active = variants[index] ?? variants[0];
  if (!active || !longest) return null;

  return (
    <div
      data-zone="paper"
      className="bg-paper text-on-paper bg-paper-grain relative max-w-prose"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Torn top edge — red overlay reveals red zone above */}
      <svg
        className="pointer-events-none absolute -top-px right-0 left-0 h-6 w-full"
        viewBox="0 0 1440 24"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path d={TORN_TOP} fill="var(--color-brand-red)" />
      </svg>
      {/* Torn bottom edge — red overlay reveals red zone below */}
      <svg
        className="pointer-events-none absolute right-0 -bottom-px left-0 h-6 w-full"
        viewBox="0 0 1440 24"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path d={TORN_BOTTOM} fill="var(--color-brand-red)" />
      </svg>

      <div className="relative px-6 py-7">
        <p
          aria-hidden
          className="text-on-paper invisible font-sans text-lg leading-relaxed sm:text-xl"
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
            className="text-on-paper absolute inset-0 px-6 py-7 font-sans text-lg leading-relaxed sm:text-xl"
          >
            {active.teaser}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

/** Top edge — overlay red shape sits above the paper, jagged on its lower edge. */
const TORN_TOP =
  "M0,0 L1440,0 L1440,12 L1414,8 L1380,16 L1346,6 L1310,14 L1274,4 L1240,12 L1204,6 L1168,16 L1132,8 L1098,14 L1062,6 L1028,16 L992,8 L958,14 L922,6 L886,16 L850,8 L816,14 L780,6 L748,16 L712,4 L678,14 L640,6 L604,16 L568,4 L532,14 L500,6 L468,16 L432,4 L402,14 L370,6 L338,16 L300,4 L262,14 L228,6 L196,16 L168,4 L142,14 L110,6 L82,16 L52,4 L24,14 L0,8 Z";

/** Bottom edge — overlay red shape sits below the paper, jagged on its upper edge. */
const TORN_BOTTOM =
  "M0,16 L18,18 L42,12 L78,20 L112,14 L148,22 L186,12 L222,20 L260,12 L296,22 L332,14 L370,22 L408,12 L446,20 L482,12 L520,22 L558,14 L596,22 L634,12 L672,20 L710,12 L748,22 L786,14 L824,22 L862,12 L900,20 L938,12 L976,22 L1014,14 L1052,22 L1090,12 L1128,20 L1166,12 L1204,22 L1242,14 L1280,22 L1318,12 L1356,20 L1394,12 L1432,22 L1440,16 L1440,24 L0,24 Z";
