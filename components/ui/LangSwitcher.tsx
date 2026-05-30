"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { localeLabels, localeNames, locales, type Locale } from "@/lib/i18n/config";
import { usePathname, useRouter } from "@/lib/i18n/navigation";

/**
 * LangSwitcher — compact ES/EN/PT toggle. The current locale gets the only
 * full-opacity treatment so it stays useful without competing with primary
 * navigation or conversion CTAs.
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
    <div
      role="group"
      aria-label={t("label")}
      className="tracking-eyebrow text-paper/50 flex items-center gap-1 text-xs"
    >
      {locales.map((loc, index) => {
        const isActive = loc === active;
        return (
          <span key={loc} className="inline-flex items-center gap-1">
            <button
              type="button"
              onClick={() => setLocale(loc)}
              disabled={isPending}
              aria-current={isActive ? "true" : undefined}
              aria-label={localeNames[loc]}
              className={`inline-flex min-h-11 min-w-11 items-center justify-center px-1 py-1 font-semibold uppercase transition-colors ${
                isActive ? "text-paper" : "hover:text-paper/80"
              } disabled:cursor-wait`}
            >
              {localeLabels[loc]}
            </button>
            {index < locales.length - 1 ? (
              <span aria-hidden className="text-paper/25">
                /
              </span>
            ) : null}
          </span>
        );
      })}
    </div>
  );
}
