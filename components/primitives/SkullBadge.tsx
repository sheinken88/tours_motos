type SkullSize = "sm" | "md" | "lg" | "xl";

type SkullBadgeProps = {
  size?: SkullSize;
  className?: string;
};

const sizeClass: Record<SkullSize, string> = {
  sm: "h-6 w-6",
  md: "h-10 w-10",
  lg: "h-16 w-16",
  xl: "h-24 w-24",
};

/**
 * SkullBadge — brand mark, used in:
 *   - Logo lockup (skull + wordmark)
 *   - Footer center as a section ornament
 *   - Stamp / seal moments throughout the site
 *
 * Geometry is a placeholder until the client confirms the brand mark
 * (open question §16). Refine the symbol in /components/ui/DistressSprite.tsx.
 */
export function SkullBadge({ size = "md", className = "" }: SkullBadgeProps) {
  return (
    <svg
      className={`${sizeClass[size]} ${className}`}
      viewBox="0 0 64 64"
      aria-hidden
      focusable="false"
    >
      <use href="#skull-badge" />
    </svg>
  );
}
