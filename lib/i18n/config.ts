/**
 * Locale configuration. Source of truth for the three-locale rule
 * (CLAUDE.md §8). Spanish (Rioplatense) is the default — Argentine voice
 * comes first, then English, then Portuguese.
 */

export const locales = ["es", "en", "pt"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "es";

/** Human-readable labels for the LangSwitcher. */
export const localeLabels: Record<Locale, string> = {
  es: "ES",
  en: "EN",
  pt: "PT",
};

/** Full names for hreflang tags / accessible labels. */
export const localeNames: Record<Locale, string> = {
  es: "Español",
  en: "English",
  pt: "Português",
};

/** ISO codes for the lang attribute and hreflang. */
export const localeCodes: Record<Locale, string> = {
  es: "es-AR",
  en: "en",
  pt: "pt-BR",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
