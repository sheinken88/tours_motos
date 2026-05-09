import { type HTMLAttributes, type ReactNode } from "react";

type StickyNoteProps = HTMLAttributes<HTMLDivElement> & {
  /** Tilt angle in degrees. Default -3. design.md §5: 3–5deg, never straight. */
  tilt?: number;
  /** Hand-drawn X scribble decoration in the corner. Default true. */
  withX?: boolean;
  children: ReactNode;
};

/**
 * StickyNote — paper rectangle with a hand-script callout, slight rotation,
 * sits over a halftone illustration or near a zone boundary.
 *
 * Use ONCE PER PAGE MAXIMUM (CLAUDE.md §13). The callout should be:
 *   - 3–5 words max
 *   - Declarative
 *   - Achievement-framed ("Ridden. Earned. Remembered.")
 *
 * The component itself doesn't enforce the cap — that's a code review concern
 * since enforcing requires a client-side counter context. Treat the rule
 * as binding regardless.
 *
 * Positioning is the consumer's job — wrap in `relative` parent and use
 * `absolute` className to place. Example:
 *
 *   <div className="relative">
 *     <CutoutFigure ... />
 *     <StickyNote className="absolute right-12 top-1/2">
 *       Ridden. Earned. Remembered.
 *     </StickyNote>
 *   </div>
 */
export function StickyNote({
  tilt = -3,
  withX = true,
  className = "",
  style,
  children,
  ...rest
}: StickyNoteProps) {
  return (
    <div
      className={`bg-paper-light shadow-sticker-ink text-on-paper font-script relative max-w-[220px] px-5 py-4 text-2xl leading-tight ${className}`}
      style={{ transform: `rotate(${tilt}deg)`, ...style }}
      {...rest}
    >
      {children}
      {withX ? (
        <svg
          aria-hidden
          className="text-ink/80 absolute -right-2 -bottom-3 h-7 w-7"
          viewBox="0 0 28 28"
        >
          <path
            d="M5,5 L23,23 M23,5 L5,23"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </svg>
      ) : null}
    </div>
  );
}
