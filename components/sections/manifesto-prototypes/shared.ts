export type ManifestoVariant = {
  slug: string;
  /** Short uppercase label for the eyebrow tag option (e.g. "SOBRE LAS NUBES · 7 DÍAS"). */
  label: string;
  /** Full teaser line. */
  teaser: string;
};

export const CYCLE_MS = 6000;
export const FADE_MS = 400;

export function pickLongest(variants: ManifestoVariant[]): ManifestoVariant | undefined {
  let best = variants[0];
  for (const v of variants) {
    if (v.teaser.length > (best?.teaser.length ?? 0)) best = v;
  }
  return best;
}

/** Renders the every-other-variant SEO sizers used by all prototypes. */
export function seoSiblings(variants: ManifestoVariant[], skipSlug: string) {
  return variants
    .filter((v) => v.slug !== skipSlug)
    .map((v) => ({ slug: v.slug, teaser: v.teaser }));
}
