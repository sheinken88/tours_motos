import { type ReactNode } from "react";

type HandUnderlineProps = {
  children: ReactNode;
  className?: string;
};

/**
 * HandUnderline — wraps text in an inline-block with an SVG brush stroke
 * positioned underneath. Use sparingly — once per screen, on the single
 * most important word (design.md §3).
 *
 * Pattern:
 *   <p>You ride to find out <HandUnderline>what you're made of</HandUnderline>.</p>
 *
 * Stroke color follows currentColor.
 */
export function HandUnderline({ children, className = "" }: HandUnderlineProps) {
  return (
    <span className={`relative inline-block ${className}`}>
      {children}
      <svg
        className="absolute -bottom-1 left-0 h-2 w-full"
        viewBox="0 0 200 12"
        preserveAspectRatio="none"
        aria-hidden
      >
        <use href="#hand-underline" />
      </svg>
    </span>
  );
}
