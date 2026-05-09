import { type ElementType, type HTMLAttributes } from "react";

type ContainerProps = HTMLAttributes<HTMLElement> & {
  /** Max width tier — `content` for normal pages, `narrow` for prose-heavy text. */
  width?: "content" | "narrow";
  /** Render as a different element (e.g. "section", "article"). Defaults to "div". */
  as?: ElementType;
};

/**
 * Container — max-width wrapper with the responsive padding from design.md §4.
 *
 * Two width tiers:
 *   - `content` (default): 1240px max — normal page content
 *   - `narrow`: 720px max — prose-heavy body copy, journal posts
 *
 * Padding scales: 20px → 32px → 64px (mobile → md → xl).
 * Use inside RedZone / PaperZone wrappers to constrain content width
 * while letting the zone background bleed full-width.
 */
export function Container({
  width = "content",
  as: Element = "div",
  className = "",
  ...rest
}: ContainerProps) {
  const widthClass =
    width === "narrow" ? "max-w-[var(--container-narrow)]" : "max-w-[var(--container-content)]";
  return (
    <Element
      className={`mx-auto w-full px-5 md:px-8 xl:px-16 ${widthClass} ${className}`}
      {...rest}
    />
  );
}
