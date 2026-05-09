import { type HTMLAttributes } from "react";

type DisplaySize = "2xl" | "xl" | "lg" | "md";
type HeadingLevel = "h1" | "h2" | "h3";

type DisplayHeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  /** Type-scale size from design.md §3. */
  size?: DisplaySize;
  /** Heading level. Choose by document outline, not size. Default: h2. */
  as?: HeadingLevel;
  /** Apply the woodblock-distress SVG filter. Default true for the larger sizes. */
  distress?: boolean;
};

const sizeClass: Record<DisplaySize, string> = {
  "2xl": "text-display-2xl",
  xl: "text-display-xl",
  lg: "text-display-lg",
  md: "text-display-md",
};

/**
 * DisplayHeading — heavy condensed wood-block display type. Always uppercase,
 * always left-aligned (CLAUDE.md hard rule). Color is zone-aware:
 *   - paper zones → red headlines (signature pattern, design.md §2)
 *   - red zones   → paper headlines
 *
 * Distress filter via the global #woodblock-distress SVG filter — applied to
 * 2xl/xl/lg by default. Disable on md or smaller where displacement reads as noise.
 *
 * Body and UI text NEVER receive distress treatment (CLAUDE.md hard rule).
 */
export function DisplayHeading({
  size = "xl",
  as: Tag = "h2",
  distress,
  className = "",
  children,
  style,
  ...rest
}: DisplayHeadingProps) {
  const distressEnabled = distress ?? size !== "md";
  return (
    <Tag
      className={`display-heading font-display ${sizeClass[size]} text-balance uppercase ${className}`}
      style={{
        ...(distressEnabled ? { filter: "url(#woodblock-distress)" } : null),
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
