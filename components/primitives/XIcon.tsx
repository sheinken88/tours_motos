type XIconProps = {
  className?: string;
};

/**
 * XIcon — the bullet glyph for all lists in this system. Replaces native
 * <ul> markers, dots, and checkmarks (CLAUDE.md hard rule §13).
 *
 * Pattern:
 *   <ul className="space-y-3">
 *     <li className="flex items-start gap-3">
 *       <XIcon className="w-5 h-5 mt-1 shrink-0 text-current" />
 *       <span>You ride to feel something.</span>
 *     </li>
 *   </ul>
 *
 * Uses currentColor so the X inherits the surrounding text color
 * (paper on red zones, ink on paper zones).
 */
export function XIcon({ className = "" }: XIconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" aria-hidden focusable="false">
      <use href="#x-bullet" />
    </svg>
  );
}
