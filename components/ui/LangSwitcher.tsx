"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { localeLabels, localeNames, locales, type Locale } from "@/lib/i18n/config";
import { usePathname, useRouter } from "@/lib/i18n/navigation";

/**
 * LangSwitcher — three-letter ES/EN/PT button group. The current locale
 * is highlighted with the brand hand-underline. Clicking another letter
 * navigates to the same path in that locale and persists the choice
 * via the NEXT_LOCALE cookie (handled by next-intl's router).
 */
export function LangSwitcher() {
  const t = useTranslations("lang_switcher");
  const router = useRouter();
  const pathname = usePathname();
  const active = useLocale() as Locale;
  const [isPending, startTransition] = useTransition();

  function setLocale(next: Locale) {
    if (next === active) return;
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  }

  return (
    <div role="group" aria-label={t("label")} className="flex items-center gap-3">
      {locales.map((loc) => {
        const isActive = loc === active;
        return (
          <button
            key={loc}
            type="button"
            onClick={() => setLocale(loc)}
            disabled={isPending}
            aria-current={isActive ? "true" : undefined}
            aria-label={localeNames[loc]}
            className={`text-eyebrow tracking-eyebrow relative font-semibold uppercase transition-opacity ${
              isActive ? "" : "opacity-60 hover:opacity-100"
            } disabled:cursor-wait`}
          >
            {localeLabels[loc]}
            {isActive ? (
              <svg
                aria-hidden
                className="absolute -bottom-1 left-0 h-1.5 w-full"
                viewBox="0 0 200 12"
                preserveAspectRatio="none"
              >
                <use href="#hand-underline" />
              </svg>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
