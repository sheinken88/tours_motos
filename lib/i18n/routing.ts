import { defineRouting } from "next-intl/routing";
import { defaultLocale, locales } from "./config";

/**
 * next-intl routing definition. Drives middleware and locale-aware
 * navigation helpers.
 *
 * Strategy: "always" prefix — every URL carries its locale (/es/..., /en/...
 * /pt/...). Locale detection is intentionally disabled so a locale-less visit
 * to the domain root always resolves to the Argentine Spanish default instead
 * of changing based on browser language or a stale NEXT_LOCALE cookie.
 */
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
  localeDetection: false,
  alternateLinks: false,
});
