"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export type ManifestoVariant = {
  slug: string;
  teaser: string;
};

type RotatingManifestoProps = {
  variants: ManifestoVariant[];
};

const CYCLE_MS = 6000;
const FADE_MS = 400;

/**
 * Cycles through per-route teasers with a cross-fade. Pauses on hover and
 * when the tab is hidden so users can finish reading. Honors
 * prefers-reduced-motion (CLAUDE.md §7) — picks one variant statically
 * and skips both cycle and fade.
 *
 * Visual: plain paper-color body type set straight on the red field — no
 * background, no stamp silhouette. The rotation itself carries the
 * dynamism; the red zone provides all the contrast the type needs.
 *
 * SEO: every variant is rendered into the SSR HTML — the longest as the
 * visible-height sizer, the rest as visibility:hidden absolute siblings
 * that take no space but remain in the layout tree. Googlebot reads them
 * as ordinary text on first crawl, so all named places (Abra del Acay,
 * Laguna Brava, Carretera Austral, etc.) are indexed in one fetch.
 *
 * Layout: the longest teaser pins the wrapper height; the active variant
 * is absolute-positioned over it so AnimatePresence enter/exit never
 * reflows surrounding content.
 */
export function RotatingManifesto({ variants }: RotatingManifestoProps) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const pausedRef = useRef(false);

  const { longest, others } = useMemo(() => {
    if (variants.length === 0) return { longest: undefined, others: [] };
    let l = variants[0]!;
    for (const v of variants) {
      if (v.teaser.length > l.teaser.length) l = v;
    }
    return {
      longest: l,
      others: variants.filter((v) => v.slug !== l.slug),
    };
  }, [variants]);

  useEffect(() => {
    if (variants.length <= 1 || reduceMotion) return;

    function onVisibility() {
      pausedRef.current = document.hidden ? true : pausedRef.current;
    }
    document.addEventListener("visibilitychange", onVisibility);

    const id = window.setInterval(() => {
      if (document.hidden || pausedRef.current) return;
      setIndex((i) => (i + 1) % variants.length);
    }, CYCLE_MS);

    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [variants.length, reduceMotion]);

  const active = variants[index] ?? variants[0];
  if (!active || !longest) return null;

  return (
    <div
      className="relative max-w-prose"
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
    >
      <div className="text-paper relative">
        {/* Sizer — longest teaser, invisible but in flow. Pins wrapper height. */}
        <p aria-hidden className="invisible font-sans text-lg leading-relaxed sm:text-xl">
          {longest.teaser}
        </p>

        {/* SEO siblings — every other variant in HTML, visibility:hidden so
            they're text in the layout tree without taking visible space.
            Googlebot reads them on first crawl, indexes all named places. */}
        {others.map((v) => (
          <p
            key={`seo-${v.slug}`}
            aria-hidden
            className="invisible absolute -z-10 h-0 w-0 overflow-hidden"
          >
            {v.teaser}
          </p>
        ))}

        {/* Animated layer — absolute over the sizer so AnimatePresence
            enter/exit never reflows surrounding content. */}
        <AnimatePresence initial={false}>
          <motion.p
            key={index}
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
