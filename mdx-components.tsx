import type { MDXComponents } from "mdx/types";
import { DisplayHeading } from "@/components/primitives/DisplayHeading";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { Stamp } from "@/components/primitives/Stamp";
import { XIcon } from "@/components/primitives/XIcon";

/**
 * MDX → design-system component mapping.
 *
 * Keeps tour MDX files close to plain markdown while still rendering with
 * the brand voice: H2/H3 use DisplayHeading (uppercase, distress filter
 * on h2), <ul> uses XIcon bullets, blockquote becomes a paper-toned aside.
 *
 * Authors can also import primitives directly in MDX:
 *   import { Stamp } from "@/components/primitives";
 *   <Stamp>EXPEDITION 14</Stamp>
 *
 * The barrel exports are also available globally below for convenience.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children, ...rest }) => (
      <DisplayHeading size="xl" as="h2" {...rest}>
        {children}
      </DisplayHeading>
    ),
    h2: ({ children, ...rest }) => (
      <DisplayHeading size="lg" as="h2" className="mt-12" {...rest}>
        {children}
      </DisplayHeading>
    ),
    h3: ({ children, ...rest }) => (
      <DisplayHeading size="md" as="h3" distress={false} className="mt-8" {...rest}>
        {children}
      </DisplayHeading>
    ),
    p: ({ children, ...rest }) => (
      <p className="my-4 max-w-prose font-sans text-base leading-relaxed" {...rest}>
        {children}
      </p>
    ),
    ul: ({ children, ...rest }) => (
      <ul className="my-4 space-y-2" {...rest}>
        {children}
      </ul>
    ),
    li: ({ children, ...rest }) => (
      <li className="flex items-start gap-3" {...rest}>
        <XIcon className="mt-1.5 h-4 w-4 shrink-0" />
        <span className="flex-1">{children}</span>
      </li>
    ),
    ol: ({ children, ...rest }) => (
      <ol
        className="marker:font-display marker:text-accent-on-paper my-4 list-decimal space-y-2 pl-6"
        {...rest}
      >
        {children}
      </ol>
    ),
    strong: ({ children, ...rest }) => (
      <strong className="font-semibold" {...rest}>
        {children}
      </strong>
    ),
    blockquote: ({ children, ...rest }) => (
      <blockquote
        className="bg-paper-light my-6 border-l-2 border-current/40 px-6 py-4 italic"
        {...rest}
      >
        {children}
      </blockquote>
    ),
    a: ({ children, href, ...rest }) => (
      <a href={href} className="text-accent-on-paper underline-offset-4 hover:underline" {...rest}>
        {children}
      </a>
    ),
    // Make brand primitives available without explicit imports inside MDX:
    Eyebrow,
    Stamp,
    ...components,
  };
}
