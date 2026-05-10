import { Container, DisplayHeading, Eyebrow, Stamp } from "@/components/primitives";
import { Link as I18nLink } from "@/lib/i18n/navigation";

export type JournalPost = {
  slug: string;
  title: string;
  /** Hand-written excerpt or dek, ~120 chars. */
  excerpt?: string;
  /** ISO date string. Renders as a stamped pill. */
  date: string;
  /** Locale code used by the date formatter. */
  locale?: "es" | "en" | "pt";
  /**
   * Hero image path. Phase 8 callers may pass undefined and rely on the
   * placeholder block; Phase 9 wires this to MDX frontmatter and Phase 10
   * swaps in real halftone PNGs via <HalftoneImage>.
   */
  image?: string;
  /** Alt text for the hero image. Required when `image` is set. */
  imageAlt?: string;
};

type JournalGridProps = {
  posts: JournalPost[];
  /** Override the dictionary eyebrow. */
  eyebrow?: string;
  /** Override the dictionary heading. */
  heading?: string;
  /** Cap the number of cards rendered. Default: all. */
  limit?: number;
  /** "Read the post" CTA label, sourced from dictionary in caller. */
  readMoreLabel?: string;
  /** Empty-state copy when posts is []. */
  emptyMessage?: string;
};

/**
 * JournalGrid — 3-up cards (responsive 1-up → 2-up → 3-up). Each card has a
 * halftone image well + paper title bar + stamped date.
 *
 * Per CLAUDE.md §15 step 13 + design.md §5 (TourCard sibling). Cards link
 * to /journal/[slug] via locale-aware navigation.
 *
 * Phase 9 wires this to a real MDX-driven journal source; Phase 8 hands
 * posts in via prop so the section is reuse-ready independent of data
 * plumbing. The component is zone-agnostic: titles/eyebrows use currentColor.
 *
 * Image slot uses an inline placeholder block (not <HalftoneImage>) when the
 * caller doesn't pass an image — runtime-filtering JPEGs would warn (Phase 10
 * gate) and shipping a real PNG is the journal author's job.
 */
export function JournalGrid({
  posts,
  eyebrow,
  heading,
  limit,
  readMoreLabel,
  emptyMessage,
}: JournalGridProps) {
  const visible = typeof limit === "number" ? posts.slice(0, limit) : posts;

  return (
    <Container className="space-y-10">
      {(eyebrow || heading) && (
        <div className="space-y-3">
          {eyebrow ? <Eyebrow rule>{eyebrow}</Eyebrow> : null}
          {heading ? (
            <DisplayHeading size="xl" as="h2">
              {heading}
            </DisplayHeading>
          ) : null}
        </div>
      )}
      {visible.length === 0 ? (
        emptyMessage ? (
          <p className="font-sans text-sm opacity-70">{emptyMessage}</p>
        ) : null
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {visible.map((post) => (
            <li key={post.slug}>
              <JournalCard post={post} readMoreLabel={readMoreLabel} />
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}

function JournalCard({
  post,
  readMoreLabel,
}: {
  post: JournalPost;
  readMoreLabel: string | undefined;
}) {
  const dateFormatter = new Intl.DateTimeFormat(
    post.locale === "en" ? "en-US" : post.locale === "pt" ? "pt-BR" : "es-AR",
    { day: "2-digit", month: "short", year: "numeric" },
  );
  const dateLabel = dateFormatter.format(new Date(post.date)).toUpperCase();

  return (
    <I18nLink
      href={`/journal/${post.slug}`}
      className="group block border-2 border-current transition-transform duration-200 hover:-translate-y-1"
    >
      {/* Image well — placeholder for Phase 8, real halftone in Phase 9/10 */}
      <div className="bg-paper-aged relative aspect-[4/3] overflow-hidden border-b-2 border-current">
        {post.image ? (
          // Intentionally an <img> rather than HalftoneImage for plain compatibility
          // with arbitrary asset extensions during Phase 8/9 — swapped to
          // <HalftoneImage> once the halftone pipeline produces these assets.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.image}
            alt={post.imageAlt ?? ""}
            className="h-full w-full object-cover transition-[filter] duration-300 group-hover:[filter:contrast(1.15)]"
            draggable={false}
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center opacity-60">
            <span className="text-eyebrow tracking-eyebrow font-mono text-xs uppercase">
              {/* Decorative — date stamps the slot for editors */}
              {dateLabel}
            </span>
          </div>
        )}
      </div>
      {/* Title + meta strip */}
      <div className="space-y-3 p-5">
        <Stamp tilt={-2} className="self-start">
          {dateLabel}
        </Stamp>
        <DisplayHeading size="md" as="h3">
          {post.title}
        </DisplayHeading>
        {post.excerpt ? (
          <p className="font-sans text-sm leading-relaxed opacity-80">{post.excerpt}</p>
        ) : null}
        {readMoreLabel ? (
          <p className="text-eyebrow tracking-eyebrow pt-1 font-semibold uppercase underline-offset-4 group-hover:underline">
            {readMoreLabel} →
          </p>
        ) : null}
      </div>
    </I18nLink>
  );
}
