import { type ElementType, type HTMLAttributes } from "react";

type EyebrowProps = HTMLAttributes<HTMLElement> & {
  /** Render as a different element. Defaults to "p". */
  as?: ElementType;
  /** Show the hairline rule below — design.md §3 default ornament. */
  rule?: boolean;
};

/**
 * Eyebrow — uppercase, tracked, small label sitting above a section heading
 * or display headline. Color follows zone via [data-zone] CSS selectors.
 *
 * Pattern: `<Eyebrow>field notes & dusty thoughts</Eyebrow>`
 *
 * Larger than typical eyebrows (~13px) because it has to read on textured
 * surfaces — see design.md §3 type scale.
 */
export function Eyebrow({
  as: Element = "p",
  rule = false,
  className = "",
  children,
  ...rest
}: EyebrowProps) {
  return (
    <Element
      className={`eyebrow text-eyebrow tracking-eyebrow font-semibold uppercase ${rule ? "after:mt-2 after:block after:h-px after:w-12 after:bg-current after:opacity-60 after:content-['']" : ""} ${className}`}
      {...rest}
    >
      {children}
    </Element>
  );
}
