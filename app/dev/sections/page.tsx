import { redirect } from "next/navigation";
import { defaultLocale } from "@/lib/i18n/config";

/**
 * /dev/sections — top-level alias that redirects to the locale-scoped showcase
 * at /[locale]/dev/sections. The actual page lives under [locale] so it
 * inherits the next-intl request context and getTranslations() works inside
 * Phase 8 sections.
 */
export default function DevSectionsRedirect() {
  redirect(`/${defaultLocale}/dev/sections`);
}
