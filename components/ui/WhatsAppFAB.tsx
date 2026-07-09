"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { buildWhatsAppLink } from "@/lib/contact/whatsappLink";
import { usePathname } from "@/lib/i18n/navigation";

/**
 * WhatsAppFAB — sticker-styled floating action stack that stays available
 * from page load while the user scrolls.
 *
 * Number is read from NEXT_PUBLIC_WHATSAPP_NUMBER via buildWhatsAppLink().
 * Per-locale message template is read from the dictionary's
 * `whatsapp.default_message` key.
 *
 * The WhatsApp button uses the channel's green by request; the secondary
 * reserve sticker links into the contact landing page.
 *
 * It hides only over explicit contact/form surfaces marked with
 * `data-whatsapp-fab="hide"` so the floating stack does not cover a nearby
 * primary action.
 */
export function WhatsAppFAB() {
  const [suppressed, setSuppressed] = useState(false);
  const locale = useLocale();
  const pathname = usePathname();
  const activePathname =
    pathname === `/${locale}`
      ? "/"
      : pathname.startsWith(`/${locale}/`)
        ? pathname.slice(locale.length + 1)
        : pathname;
  const hideOnRoute = activePathname === "/contact" || activePathname.startsWith("/contact/");

  useEffect(() => {
    function readState() {
      const probeX = window.innerWidth - 48;
      const probeY = window.innerHeight - 48;
      const elements =
        typeof document !== "undefined" && typeof document.elementsFromPoint === "function"
          ? document.elementsFromPoint(probeX, probeY)
          : [];
      let hideForContent = false;
      for (const el of elements) {
        if (el instanceof HTMLElement && el.closest("[data-whatsapp-fab='hide']")) {
          hideForContent = true;
          break;
        }
      }
      setSuppressed(hideForContent);
    }
    readState();
    window.addEventListener("scroll", readState, { passive: true });
    window.addEventListener("resize", readState);
    return () => {
      window.removeEventListener("scroll", readState);
      window.removeEventListener("resize", readState);
    };
  }, []);

  return (
    <WhatsAppActionButtons
      className={`fixed right-3 bottom-5 z-30 flex flex-col items-end gap-3 transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none md:right-5 md:bottom-6 ${
        !suppressed && !hideOnRoute
          ? "translate-y-0 rotate-[-3deg] opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    />
  );
}

export function WhatsAppActionButtons({ className }: { className?: string }) {
  const t = useTranslations("whatsapp");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  const href = buildWhatsAppLink({ message: t("default_message") });

  return (
    <div className={className ?? "flex flex-col items-end gap-3"}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("label")}
        className="bg-whatsapp-green text-ink shadow-sticker-ink inline-flex h-14 w-14 items-center justify-center transition-[transform,background-color,color] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1 hover:rotate-3 motion-reduce:transition-none"
      >
        {/* WhatsApp glyph */}
        <svg className="h-7 w-7" viewBox="0 0 24 24" aria-hidden fill="currentColor">
          <path d="M12.04 2C6.5 2 2 6.5 2 12.04c0 1.78.46 3.51 1.34 5.04L2 22l5.06-1.32c1.48.81 3.13 1.24 4.98 1.24h.01C17.6 21.92 22 17.42 22 11.88 22 9.21 20.96 6.7 19.08 4.82A9.93 9.93 0 0 0 12.04 2zm0 18.16h-.01a8.16 8.16 0 0 1-4.16-1.13l-.3-.18-3.09.81.83-3.01-.2-.31a8.16 8.16 0 0 1 12.62-10.26 8.1 8.1 0 0 1 2.4 5.78c0 4.5-3.66 8.16-8.16 8.16zm4.47-6.11c-.24-.12-1.45-.71-1.67-.79-.22-.08-.39-.12-.55.12-.16.24-.63.79-.77.95-.14.16-.28.18-.53.06-.24-.12-1.03-.38-1.97-1.21-.73-.65-1.22-1.45-1.36-1.7-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.81-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.42.06-.64.3-.22.24-.84.83-.84 2.02 0 1.19.86 2.34.98 2.5.12.16 1.69 2.59 4.1 3.63.57.25 1.02.4 1.37.51.58.18 1.1.16 1.51.1.46-.07 1.45-.59 1.65-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28z" />
        </svg>
      </a>
      <a
        href={`/${locale}/contact`}
        className="bg-paper text-brand-red shadow-sticker-ink font-display inline-flex min-h-11 max-w-[10rem] items-center px-4 py-3 text-center text-xs leading-tight tracking-[var(--tracking-cta)] uppercase transition-transform duration-200 hover:-translate-y-1 hover:rotate-3"
      >
        {tCommon("reserve_spot")}
      </a>
    </div>
  );
}
