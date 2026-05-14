import { redirect } from "next/navigation";
import { defaultLocale } from "@/lib/i18n/config";

/**
 * /dev/manifesto — top-level alias that redirects to the locale-scoped
 * showcase at /[locale]/dev/manifesto. Same convention as /dev/sections.
 */
export default function DevManifestoRedirect() {
  redirect(`/${defaultLocale}/dev/manifesto`);
}
