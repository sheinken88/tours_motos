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
 *   - `content` (default): 1536px max — normal poster-width page content
 *   - `narrow`: 720px max — prose-heavy body copy, journal posts
 *
 * Padding follows --container-padding so wide screens gain canvas without
 * letting mobile gutters collapse.
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
      className={`mx-auto w-full px-[var(--container-padding)] ${widthClass} ${className}`}
      {...rest}
    />
  );
}
