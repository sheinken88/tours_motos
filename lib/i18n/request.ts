import { getRequestConfig } from "next-intl/server";
import { defaultLocale, isLocale } from "./config";

/**
 * next-intl server request config. Loads the dictionary for the resolved
 * locale and exposes it to Server Components via `getTranslations()` and
 * to Client Components via `<NextIntlClientProvider messages={...}>`.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = requested && isLocale(requested) ? requested : defaultLocale;

  const messages = (await import(`./dictionaries/${locale}.json`)).default;

  return {
    locale,
    messages,
    timeZone: "America/Argentina/Buenos_Aires",
    now: new Date(),
  };
});
