"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Button, SkullBadge } from "@/components/primitives";
import { buildWhatsAppLink } from "@/lib/contact/whatsappLink";
import { Link, usePathname } from "@/lib/i18n/navigation";
import { INSTAGRAM_URL } from "@/lib/seo/site";
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

const PRIMARY_NAV_ITEMS = [
  { href: "/tours", labelKey: "trips" },
  { href: "/calendar", labelKey: "calendar" },
  { href: "/custom", labelKey: "custom" },
] as const;

const SECONDARY_NAV_ITEMS = [
  { href: "/about", labelKey: "about" },
  { href: "/taller-de-rutas", labelKey: "journal" },
] as const;

const CONTACT_NAV_ITEM = { href: "/contact#contact-form", labelKey: "contact" } as const;

function hrefPath(href: string) {
  return href.split("#")[0] || "/";
}

function isActivePath(pathname: string, href: string) {
  const path = hrefPath(href);
  return pathname === path || (path !== "/" && pathname.startsWith(`${path}/`));
}

function localePath(pathname: string, locale: string) {
  if (pathname === `/${locale}`) return "/";
  if (pathname.startsWith(`/${locale}/`)) return pathname.slice(locale.length + 1);
  return pathname;
}

function WhatsAppGlyph() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden fill="currentColor">
      <path d="M12.04 2C6.5 2 2 6.5 2 12.04c0 1.78.46 3.51 1.34 5.04L2 22l5.06-1.32c1.48.81 3.13 1.24 4.98 1.24h.01C17.6 21.92 22 17.42 22 11.88 22 9.21 20.96 6.7 19.08 4.82A9.93 9.93 0 0 0 12.04 2zm0 18.16h-.01a8.16 8.16 0 0 1-4.16-1.13l-.3-.18-3.09.81.83-3.01-.2-.31a8.16 8.16 0 0 1 12.62-10.26 8.1 8.1 0 0 1 2.4 5.78c0 4.5-3.66 8.16-8.16 8.16zm4.47-6.11c-.24-.12-1.45-.71-1.67-.79-.22-.08-.39-.12-.55.12-.16.24-.63.79-.77.95-.14.16-.28.18-.53.06-.24-.12-1.03-.38-1.97-1.21-.73-.65-1.22-1.45-1.36-1.7-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.81-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.42.06-.64.3-.22.24-.84.83-.84 2.02 0 1.19.86 2.34.98 2.5.12.16 1.69 2.59 4.1 3.63.57.25 1.02.4 1.37.51.58.18 1.1.16 1.51.1.46-.07 1.45-.59 1.65-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28z" />
    </svg>
  );
}

function InstagramGlyph() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden fill="none">
      <path
        d="M7.4 2.8h9.2c2.6 0 4.6 2 4.6 4.6v9.2c0 2.6-2 4.6-4.6 4.6H7.4c-2.6 0-4.6-2-4.6-4.6V7.4c0-2.6 2-4.6 4.6-4.6Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M15.7 11.4a3.8 3.8 0 1 1-7.4 1.2 3.8 3.8 0 0 1 7.4-1.2Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M17.5 6.8h.1" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function Nav() {
  const t = useTranslations("nav");
  const tWhatsApp = useTranslations("whatsapp");
  const locale = useLocale();
  const pathname = usePathname();
  const activePathname = localePath(pathname, locale);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const whatsAppHref = buildWhatsAppLink({ message: tWhatsApp("default_message") });
  const instagramHref = INSTAGRAM_URL;

  function handleLogoClick() {
    if (pathname !== "/") return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

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

  const mobileOverlay = open ? (
    <div
      data-zone="red"
      className="bg-red-grunge text-on-red fixed inset-0 z-50 flex flex-col overflow-y-auto p-5 sm:p-6 md:hidden"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-center justify-between">
        <Link
          href="/"
          onClick={() => {
            setOpen(false);
            handleLogoClick();
          }}
          className="flex min-h-11 min-w-11 items-center gap-3"
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
          className="text-paper inline-flex h-11 w-11 items-center justify-center"
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

      <nav className="mt-10 flex flex-col gap-4 sm:mt-12 sm:gap-6" aria-label="Primary mobile">
        {[...PRIMARY_NAV_ITEMS, ...SECONDARY_NAV_ITEMS, CONTACT_NAV_ITEM].map((item) => {
          const active = isActivePath(activePathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              aria-current={active ? "page" : undefined}
              className="font-display text-paper text-display-md inline-flex min-h-11 items-center tracking-[var(--tracking-cta)] uppercase"
            >
              <span className="relative">
                {t(item.labelKey)}
                <svg
                  aria-hidden
                  className={`pointer-events-none absolute -bottom-1 left-0 h-2 w-full transition-opacity duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    active ? "opacity-100" : "opacity-0"
                  }`}
                  viewBox="0 0 200 12"
                  preserveAspectRatio="none"
                >
                  <use href="#hand-underline" />
                </svg>
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col items-start gap-4 pt-8 pb-4">
        <div className="flex flex-wrap items-center gap-3">
          <LangSwitcher mode="inline" />
          <a
            href={instagramHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-paper hover:bg-paper hover:text-brand-red inline-flex h-12 w-12 -rotate-2 items-center justify-center transition-[transform,color,background-color] duration-200 hover:-translate-y-0.5 hover:rotate-0"
          >
            <InstagramGlyph />
          </a>
        </div>
        <Button
          href={whatsAppHref}
          external
          edge={1}
          tilt="left"
          variant="sticker-filled"
          arrow={false}
        >
          <span className="inline-flex items-center gap-2">
            <WhatsAppGlyph />
            {t("cta")}
          </span>
        </Button>
      </div>
    </div>
  ) : null;

  return (
    <>
      <header
        data-zone="red"
        className={`fixed inset-x-0 top-0 z-40 transition-[background-color,backdrop-filter] duration-300 ${
          scrolled ? "bg-red-grunge backdrop-blur-sm" : "bg-transparent"
        }`}
      >
        <div className="text-on-red mx-auto flex w-full max-w-[var(--container-content)] items-center justify-between px-[var(--container-padding)] py-4">
          <Link
            href="/"
            onClick={handleLogoClick}
            className="flex min-h-11 min-w-11 items-center gap-3"
            aria-label="Moto On/Off"
          >
            <SkullBadge size="md" className="text-paper" />
            <span className="font-display text-paper hidden text-base tracking-[var(--tracking-cta)] uppercase sm:block">
              Moto On/Off
            </span>
          </Link>

          {/* Desktop links — hover reveals the brand hand-underline SVG. */}
          <nav
            className="hidden items-center gap-4 md:flex xl:gap-6 2xl:gap-7"
            aria-label="Primary"
          >
            {PRIMARY_NAV_ITEMS.map((item) => {
              const active = isActivePath(activePathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className="group/navlink tracking-eyebrow text-paper 2xl:text-eyebrow relative text-sm font-bold uppercase lg:text-base"
                >
                  {t(item.labelKey)}
                  <svg
                    aria-hidden
                    className={`pointer-events-none absolute -bottom-1 left-0 h-1.5 w-full transition-opacity duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/navlink:opacity-100 ${
                      active ? "opacity-100" : "opacity-0"
                    }`}
                    viewBox="0 0 200 12"
                    preserveAspectRatio="none"
                  >
                    <use href="#hand-underline" />
                  </svg>
                </Link>
              );
            })}
            <span
              aria-hidden
              className="font-display text-paper/35 hidden -rotate-6 text-sm xl:inline"
            >
              /
            </span>
            {SECONDARY_NAV_ITEMS.map((item) => {
              const active = isActivePath(activePathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`group/navlink tracking-eyebrow hover:text-paper relative hidden text-xs font-semibold uppercase transition-colors xl:inline-flex ${
                    active ? "text-paper" : "text-paper/65"
                  }`}
                >
                  {t(item.labelKey)}
                  <svg
                    aria-hidden
                    className={`pointer-events-none absolute -bottom-1 left-0 h-1.5 w-full transition-opacity duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/navlink:opacity-100 ${
                      active ? "opacity-100" : "opacity-0"
                    }`}
                    viewBox="0 0 200 12"
                    preserveAspectRatio="none"
                  >
                    <use href="#hand-underline" />
                  </svg>
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 md:flex 2xl:gap-3">
            <LangSwitcher />
            <a
              href={instagramHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-paper hover:bg-paper hover:text-brand-red focus-visible:outline-paper hidden h-11 w-11 -rotate-2 items-center justify-center transition-[transform,color,background-color] duration-200 hover:-translate-y-0.5 hover:rotate-0 xl:inline-flex"
            >
              <InstagramGlyph />
            </a>
            <div className="hidden xl:block">
              <Button
                href={`/${locale}/contact#contact-form`}
                edge={1}
                tilt="left"
                arrow={false}
                className="px-6"
              >
                {t("contact")}
              </Button>
            </div>
            <div className="hidden lg:block">
              <Button
                href={whatsAppHref}
                external
                edge={2}
                tilt="right"
                arrow={false}
                className="px-5 2xl:px-6"
              >
                <span className="inline-flex items-center gap-2">
                  <WhatsAppGlyph />
                  {t("cta")}
                </span>
              </Button>
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={t("open_menu")}
            className="text-paper inline-flex h-11 w-11 items-center justify-center md:hidden"
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
      </header>
      {mobileOverlay}
    </>
  );
}
