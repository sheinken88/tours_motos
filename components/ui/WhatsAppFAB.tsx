"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { buildWhatsAppLink } from "@/lib/contact/whatsappLink";

type ZoneUnderFab = "red" | "paper";

/**
 * WhatsAppFAB — sticker-styled floating button that stamps into view once
 * the user scrolls past the hero. design.md §6 microinteractions.
 *
 * Number is read from NEXT_PUBLIC_WHATSAPP_NUMBER via buildWhatsAppLink().
 * Per-locale message template is read from the dictionary's
 * `whatsapp.default_message` key.
 *
 * Color inversion: the FAB needs maximum contrast against whatever zone
 * is behind it. We sample the element under the FAB's anchor point on
 * scroll, walk up to the nearest `[data-zone]` ancestor, and flip the
 * button colors:
 *   - over a paper zone → red button + paper glyph
 *   - over a red zone   → paper button + ink glyph (default)
 *
 * Honors `prefers-reduced-motion`: skips the stamp-in animation, renders
 * final state immediately.
 */
export function WhatsAppFAB() {
  const t = useTranslations("whatsapp");
  const [visible, setVisible] = useState(false);
  const [zoneUnder, setZoneUnder] = useState<ZoneUnderFab>("red");

  useEffect(() => {
    // FAB anchor in viewport coords — bottom-right corner offset to roughly
    // the FAB's center. We probe slightly above + left of the visual button
    // so the lookup hits the underlying section, not the FAB itself.
    function readState() {
      setVisible(window.scrollY > 600);

      const probeX = window.innerWidth - 48;
      const probeY = window.innerHeight - 48;
      const elements =
        typeof document !== "undefined" && typeof document.elementsFromPoint === "function"
          ? document.elementsFromPoint(probeX, probeY)
          : [];
      // Skip the FAB's own DOM (it sits at this point) — find the first
      // ancestor with a data-zone attribute. Default to "red" so we keep
      // the current visual when the FAB is over the hero or a child without
      // a zone wrapper.
      let resolved: ZoneUnderFab = "red";
      for (const el of elements) {
        if (el instanceof HTMLElement && el.dataset.zone) {
          const dz = el.dataset.zone;
          if (dz === "paper" || dz === "red") {
            resolved = dz;
            break;
          }
        }
      }
      setZoneUnder(resolved);
    }
    readState();
    window.addEventListener("scroll", readState, { passive: true });
    window.addEventListener("resize", readState);
    return () => {
      window.removeEventListener("scroll", readState);
      window.removeEventListener("resize", readState);
    };
  }, []);

  const href = buildWhatsAppLink({ message: t("default_message") });

  // Invert button colors so the FAB always pops off the underlying zone.
  const colorClass =
    zoneUnder === "paper"
      ? "bg-brand-red text-paper shadow-sticker-ink"
      : "bg-paper text-ink shadow-sticker-ink";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("label")}
      className={`fixed right-6 bottom-6 z-30 inline-flex h-14 w-14 -rotate-3 items-center justify-center transition-[transform,opacity,background-color,color] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1 hover:rotate-0 motion-reduce:transition-none ${colorClass} ${
        visible
          ? "translate-y-0 rotate-[-3deg] opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      {/* WhatsApp glyph */}
      <svg className="h-7 w-7" viewBox="0 0 24 24" aria-hidden fill="currentColor">
        <path d="M12.04 2C6.5 2 2 6.5 2 12.04c0 1.78.46 3.51 1.34 5.04L2 22l5.06-1.32c1.48.81 3.13 1.24 4.98 1.24h.01C17.6 21.92 22 17.42 22 11.88 22 9.21 20.96 6.7 19.08 4.82A9.93 9.93 0 0 0 12.04 2zm0 18.16h-.01a8.16 8.16 0 0 1-4.16-1.13l-.3-.18-3.09.81.83-3.01-.2-.31a8.16 8.16 0 0 1 12.62-10.26 8.1 8.1 0 0 1 2.4 5.78c0 4.5-3.66 8.16-8.16 8.16zm4.47-6.11c-.24-.12-1.45-.71-1.67-.79-.22-.08-.39-.12-.55.12-.16.24-.63.79-.77.95-.14.16-.28.18-.53.06-.24-.12-1.03-.38-1.97-1.21-.73-.65-1.22-1.45-1.36-1.7-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.81-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.42.06-.64.3-.22.24-.84.83-.84 2.02 0 1.19.86 2.34.98 2.5.12.16 1.69 2.59 4.1 3.63.57.25 1.02.4 1.37.51.58.18 1.1.16 1.51.1.46-.07 1.45-.59 1.65-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28z" />
      </svg>
    </a>
  );
}
