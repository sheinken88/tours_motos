import { type HTMLAttributes } from "react";

type PaperPanelProps = HTMLAttributes<HTMLDivElement> & {
  /** Sticker-edge variant for the distressed border. design.md §11. */
  edge?: 1 | 2 | 3;
  /** Tilt angle in degrees. design.md §5: 1–3deg, never straight. */
  tilt?: number;
};

/**
 * PaperPanel — paper-colored card placed inside a red zone. Used for
 * founder-quote callouts, embedded testimonials, "this is for you if..."
 * lists when they sit on red.
 *
 * Self-sets data-zone="paper" so descendants render with paper-zone colors
 * (ink text, red headlines) even though the surrounding zone is red.
 *
 * Distressed edge via SVG sticker-edge mask — same path data as Button's
 * sticker-outline so the brand visual language stays cohesive.
 *
 * No border-radius (CLAUDE.md hard rule). Sits on the red field with the
 * documented sticker shadow for printed-poster depth.
 */
export function PaperPanel({
  edge = 1,
  tilt = -1,
  className = "",
  children,
  style,
  ...rest
}: PaperPanelProps) {
  const paths: Record<1 | 2 | 3, string> = {
    1: "M3,4 L18,2 L40,5 L62,3 L86,4 L110,2 L134,5 L158,3 L182,4 L196,5 L197,18 L195,32 L198,46 L196,55 L182,57 L160,55 L138,57 L114,55 L90,57 L66,55 L42,57 L20,55 L4,57 L3,44 L5,30 L2,16 Z",
    2: "M5,6 L22,3 L44,7 L68,2 L94,6 L122,3 L150,7 L176,4 L194,5 L196,20 L194,34 L197,48 L194,56 L176,58 L150,55 L120,58 L92,55 L66,58 L42,55 L20,58 L4,55 L2,42 L4,28 L1,14 Z",
    3: "M2,3 L24,4 L48,2 L74,4 L100,3 L128,4 L154,2 L178,4 L198,3 L197,16 L198,30 L196,44 L197,57 L178,56 L154,58 L128,56 L100,57 L74,56 L48,58 L24,56 L2,57 L3,44 L2,30 L4,16 Z",
  };

  return (
    <div
      data-zone="paper"
      className={`bg-paper-grain text-on-paper shadow-sticker-ink relative isolate p-8 md:p-10 ${className}`}
      style={{ transform: `rotate(${tilt}deg)`, ...style }}
      {...rest}
    >
      {/* Distressed edge overlay — same pattern as Button sticker-outline */}
      <svg
        className="text-ink pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 200 60"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d={paths[edge]}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
      <div className="relative">{children}</div>
    </div>
  );
}
