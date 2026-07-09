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
 *   - Logo lockup (helmet mark + wordmark)
 *   - Footer center as a section ornament
 *   - Stamp / seal moments throughout the site
 *
 * Kept under the existing component name so all prior brand-mark placements
 * pick up the confirmed logo without broad import churn.
 */
export function SkullBadge({ size = "md", className = "" }: SkullBadgeProps) {
  return (
    <span
      className={`inline-block shrink-0 bg-current ${sizeClass[size]} ${className}`}
      style={{
        WebkitMaskImage: "url('/images/logo/moto-on-off-logo-mask.png')",
        maskImage: "url('/images/logo/moto-on-off-logo-mask.png')",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "contain",
        maskSize: "contain",
      }}
      aria-hidden="true"
    />
  );
}
