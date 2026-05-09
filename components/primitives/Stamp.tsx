import { type HTMLAttributes } from "react";

type StampProps = HTMLAttributes<HTMLSpanElement> & {
  /** Tilt angle in degrees. Default -3 per design.md §5. */
  tilt?: number;
};

/**
 * Stamp — small rotated text chip with a 2px bordered frame. Reinforces
 * the printed-object feel on dates, expedition numbers, region tags
 * (design.md §5).
 *
 * Pattern: `<Stamp>EXPEDITION 14</Stamp>`
 *
 * Uses currentColor — pair with text color utilities for zone awareness.
 */
export function Stamp({ tilt = -3, className = "", style, children, ...rest }: StampProps) {
  return (
    <span
      className={`font-display inline-block border-2 border-current px-3 py-1.5 text-xs tracking-[var(--tracking-cta)] uppercase ${className}`}
      style={{ transform: `rotate(${tilt}deg)`, ...style }}
      {...rest}
    >
      {children}
    </span>
  );
}
