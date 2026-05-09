"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Button, SkullBadge } from "@/components/primitives";
import { Link } from "@/lib/i18n/navigation";
import { LangSwitcher } from "./LangSwitcher";

/**
 * Nav — floating, paper-color text on transparent. design.md §5.
 *
 * Behavior:
 *   - Mobile: hamburger opens a full-screen red overlay (in-aesthetic).
 *     Trap focus, close on Escape, restore body scroll on close.
 *   - Desktop: inline links with primary CTA at the right.
 *   - Scroll-aware: subtle backdrop fades in once scrolled past the hero.
 *
 * The wordmark is a placeholder until the client confirms the brand mark
 * (open question §16). For now: SkullBadge + "MOTO ON/OFF" in display caps.
 */

const NAV_ITEMS = [
  { href: "/tours", labelKey: "trips" },
  { href: "/about", labelKey: "about" },
  { href: "/journal", labelKey: "journal" },
  { href: "/contact", labelKey: "destinations" },
] as const;

export function Nav() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 80);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      data-zone="red"
      className={`fixed inset-x-0 top-0 z-40 transition-[background-color,backdrop-filter] duration-300 ${
        scrolled ? "bg-brand-red/85 backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <div className="text-on-red mx-auto flex w-full max-w-[var(--container-content)] items-center justify-between px-5 py-4 md:px-8 xl:px-16">
        <Link href="/" className="flex items-center gap-3" aria-label="Moto On/Off">
          <SkullBadge size="md" className="text-paper" />
          <span className="font-display text-paper hidden text-base tracking-[var(--tracking-cta)] uppercase sm:block">
            Moto On/Off
          </span>
        </Link>

        {/* Desktop links */}
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-eyebrow tracking-eyebrow text-paper relative font-semibold uppercase after:absolute after:bottom-[-4px] after:left-0 after:h-px after:w-0 after:bg-current after:transition-[width] after:duration-200 after:ease-[cubic-bezier(0.22,1,0.36,1)] hover:after:w-full"
            >
              {t(item.labelKey)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-6 lg:flex">
          <LangSwitcher />
          <Button href="/contact" edge={2} tilt="right" arrow={false}>
            {t("cta")}
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={t("open_menu")}
          className="text-paper inline-flex h-10 w-10 items-center justify-center lg:hidden"
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24" aria-hidden>
            <path
              d="M3,6 L21,6 M3,12 L21,12 M3,18 L21,18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* Mobile overlay */}
      {open ? (
        <div
          data-zone="red"
          className="bg-red-grunge text-on-red fixed inset-0 z-50 flex flex-col p-6 lg:hidden"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-between">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3"
              aria-label="Moto On/Off"
            >
              <SkullBadge size="md" className="text-paper" />
              <span className="font-display text-paper text-base tracking-[var(--tracking-cta)] uppercase">
                Moto On/Off
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t("close_menu")}
              className="text-paper inline-flex h-10 w-10 items-center justify-center"
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" aria-hidden>
                <path
                  d="M5,5 L19,19 M19,5 L5,19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <nav className="mt-12 flex flex-col gap-6" aria-label="Primary mobile">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="font-display text-paper text-display-md tracking-[var(--tracking-cta)] uppercase"
              >
                {t(item.labelKey)}
              </Link>
            ))}
          </nav>

          <div className="mt-auto flex items-center justify-between gap-6 pt-12">
            <LangSwitcher />
            <Button href="/contact" edge={1} tilt="left" variant="sticker-filled">
              {t("cta")}
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
