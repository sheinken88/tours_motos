"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { CYCLE_MS } from "./shared";

/**
 * Shared rotation hook for the manifesto prototypes. Cycles 0..count-1
 * every CYCLE_MS, pauses on hover and tab blur, halts entirely on
 * prefers-reduced-motion.
 *
 * Returns the current index plus mouse handlers to wire onto the wrapper.
 */
export function useRotator(count: number) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    if (count <= 1 || reduceMotion) return;

    function onVisibility() {
      pausedRef.current = document.hidden ? true : pausedRef.current;
    }
    document.addEventListener("visibilitychange", onVisibility);

    const id = window.setInterval(() => {
      if (document.hidden || pausedRef.current) return;
      setIndex((i) => (i + 1) % count);
    }, CYCLE_MS);

    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [count, reduceMotion]);

  return {
    index,
    reduceMotion: !!reduceMotion,
    onMouseEnter: () => {
      pausedRef.current = true;
    },
    onMouseLeave: () => {
      pausedRef.current = false;
    },
  };
}
