"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState, useTransition } from "react";
import { localeLabels, localeNames, locales, type Locale } from "@/lib/i18n/config";
import { usePathname, useRouter } from "@/lib/i18n/navigation";

/**
 * LangSwitcher — compact by default so it stays useful without competing with
 * primary navigation or conversion CTAs. The mobile drawer can opt into the
 * inline ES/EN/PT treatment where space is less constrained.
 */
type LangSwitcherProps = {
  mode?: "menu" | "inline";
};

function ChevronGlyph({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-3 w-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      viewBox="0 0 12 8"
      aria-hidden
      fill="none"
    >
      <path
        d="M1 1.5 6 6.5 11 1.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

export function LangSwitcher({ mode = "menu" }: LangSwitcherProps) {
  const t = useTranslations("lang_switcher");
  const router = useRouter();
  const pathname = usePathname();
  const active = useLocale() as Locale;
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const menuRef = useRef<HTMLDivElement>(null);

  function setLocale(next: Locale) {
    if (next === active) return;
    startTransition(() => {
      setOpen(false);
      router.replace(pathname, { locale: next });
    });
  }

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (mode === "inline") {
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

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        disabled={isPending}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`${t("label")}: ${localeNames[active]}`}
        className="tracking-eyebrow text-paper hover:bg-paper hover:text-brand-red focus-visible:outline-paper inline-flex h-11 min-w-14 -rotate-1 items-center justify-center gap-1 px-3 text-xs font-bold uppercase transition-[transform,color,background-color] duration-200 hover:-translate-y-0.5 hover:rotate-0 disabled:cursor-wait"
      >
        {localeLabels[active]}
        <ChevronGlyph open={open} />
      </button>

      {open ? (
        <div
          role="menu"
          aria-label={t("label")}
          className="bg-red-grunge absolute right-0 top-[calc(100%+0.55rem)] z-50 min-w-32 -rotate-1 border border-paper/65 p-1 text-paper"
        >
          {locales.map((loc) => {
            const isActive = loc === active;
            return (
              <button
                key={loc}
                type="button"
                role="menuitemradio"
                aria-checked={isActive}
                onClick={() => setLocale(loc)}
                disabled={isPending}
                className={`tracking-eyebrow flex min-h-10 w-full items-center justify-between gap-4 px-3 text-left text-xs font-bold uppercase transition-colors ${
                  isActive ? "bg-paper text-brand-red" : "hover:bg-paper/15"
                } disabled:cursor-wait`}
              >
                <span>{localeLabels[loc]}</span>
                <span className="font-sans text-[0.62rem] font-semibold tracking-[var(--tracking-uppercase)]">
                  {t(loc)}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
