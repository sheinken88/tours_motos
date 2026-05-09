import { defineRouting } from "next-intl/routing";
import { defaultLocale, locales } from "./config";

/**
 * next-intl routing definition. Drives middleware and locale-aware
 * navigation helpers.
 *
 * Strategy: "always" prefix — every URL carries its locale (/es/..., /en/...,
 * /pt/...). The root / redirects to /es per CLAUDE.md §8. Cookie remembers
 * the user's choice for return visits.
 */
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
});
