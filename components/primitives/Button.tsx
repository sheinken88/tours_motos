import Link from "next/link";
import { type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from "react";

type Variant = "sticker-outline" | "sticker-filled" | "ghost";
type Tilt = "left" | "right" | "none";
type Edge = 1 | 2 | 3;

type CommonProps = {
  variant?: Variant;
  /** Tilt direction. design.md §5: stickers tilt 1–3deg, never straight. */
  tilt?: Tilt;
  /** Sticker-edge SVG variant. Each variant has slightly different irregularities. */
  edge?: Edge;
  /** Trailing arrow icon. Defaults true for sticker variants per design.md §5. */
  arrow?: boolean;
  className?: string;
  children: ReactNode;
};

type AsLink = CommonProps & {
  href: string;
  external?: boolean;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps | "href">;

type AsButton = CommonProps & {
  href?: undefined;
  external?: undefined;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps>;

export type ButtonProps = AsLink | AsButton;

const tiltClass: Record<Tilt, string> = {
  left: "-rotate-1",
  right: "rotate-1",
  none: "rotate-0",
};

const baseClass = [
  "group/btn relative inline-flex items-center gap-2",
  "font-display uppercase",
  "tracking-[var(--tracking-cta)]",
  "text-sm leading-none",
  "px-7 py-3.5",
  "transition-[transform,color,background-color,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
  "hover:-translate-y-0.5 hover:rotate-0",
  "focus-visible:outline-2 focus-visible:outline-offset-2",
].join(" ");

const variantClass: Record<Variant, string> = {
  "sticker-outline": "sticker-outline",
  "sticker-filled": "sticker-filled shadow-sticker-ink hover:shadow-sticker-red",
  ghost: "underline-offset-4 hover:underline px-0 py-0",
};

/**
 * StickerEdgeOutline — irregular hand-drawn border rendered as SVG behind
 * the button's text. On hover the path fills with currentColor (and the
 * parent's [data-zone] CSS rule inverts the text color).
 */
function StickerEdgeOutline({ edge }: { edge: Edge }) {
  const paths: Record<Edge, string> = {
    1: "M3,4 L18,2 L40,5 L62,3 L86,4 L110,2 L134,5 L158,3 L182,4 L196,5 L197,18 L195,32 L198,46 L196,55 L182,57 L160,55 L138,57 L114,55 L90,57 L66,55 L42,57 L20,55 L4,57 L3,44 L5,30 L2,16 Z",
    2: "M5,6 L22,3 L44,7 L68,2 L94,6 L122,3 L150,7 L176,4 L194,5 L196,20 L194,34 L197,48 L194,56 L176,58 L150,55 L120,58 L92,55 L66,58 L42,55 L20,58 L4,55 L2,42 L4,28 L1,14 Z",
    3: "M2,3 L24,4 L48,2 L74,4 L100,3 L128,4 L154,2 L178,4 L198,3 L197,16 L198,30 L196,44 L197,57 L178,56 L154,58 L128,56 L100,57 L74,56 L48,58 L24,56 L2,57 L3,44 L2,30 L4,16 Z",
  };
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 200 60"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d={paths[edge]}
        stroke="var(--sticker-fg, currentColor)"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="var(--sticker-fg, currentColor)"
        fillOpacity={0}
        className="transition-[fill-opacity] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/btn:[fill-opacity:1]"
      />
    </svg>
  );
}

/**
 * Button — the dominant CTA pattern in this design system.
 *
 * Variants (CLAUDE.md §13):
 *   - `sticker-outline` (default): irregular SVG outline in current zone
 *     foreground, fills with currentColor on hover and inverts text via
 *     the [data-zone] CSS cascade. Standard CTA.
 *   - `sticker-filled`: solid chip with hard-offset shadow. Reserved for
 *     top-priority conversion CTAs — max 1 per zone (CLAUDE.md §13).
 *   - `ghost`: text-only with hand-underline on hover.
 *
 * Renders as <Link> when given `href`, <button> otherwise.
 * Motion is CSS-only.
 */
export function Button(props: ButtonProps) {
  const variant = props.variant ?? "sticker-outline";
  const tilt = props.tilt ?? "left";
  const edge = props.edge ?? 1;
  const arrow = props.arrow ?? variant !== "ghost";
  const className = props.className ?? "";
  const finalClass = `${baseClass} ${tiltClass[tilt]} ${variantClass[variant]} ${className}`;

  const content = (
    <>
      {variant === "sticker-outline" ? <StickerEdgeOutline edge={edge} /> : null}
      <span className="relative">{props.children}</span>
      {arrow ? (
        <span aria-hidden className="relative -translate-y-[1px]">
          →
        </span>
      ) : null}
    </>
  );

  if ("href" in props && props.href !== undefined) {
    const externalProps = props.external ? { target: "_blank", rel: "noopener noreferrer" } : {};
    return (
      <Link href={props.href} className={finalClass} {...externalProps}>
        {content}
      </Link>
    );
  }

  const buttonRest: ButtonHTMLAttributes<HTMLButtonElement> = {
    type: props.type ?? "button",
    onClick: props.onClick,
    disabled: props.disabled,
    "aria-label": props["aria-label"],
    name: props.name,
    value: props.value,
    form: props.form,
  };
  return (
    <button {...buttonRest} className={finalClass}>
      {content}
    </button>
  );
}
