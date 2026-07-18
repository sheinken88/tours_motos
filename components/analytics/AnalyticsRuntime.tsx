"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { type Locale } from "@/lib/i18n/config";
import { trackPageView, trackWhatsAppClick } from "@/lib/analytics/client";

function isWhatsAppUrl(href: string): boolean {
  try {
    const url = new URL(href, window.location.href);
    return (
      url.hostname === "wa.me" ||
      url.hostname === "api.whatsapp.com" ||
      url.hostname === "www.whatsapp.com"
    );
  } catch {
    return false;
  }
}

function linkLocation(anchor: HTMLAnchorElement): string {
  if (anchor.dataset.analyticsLocation) return anchor.dataset.analyticsLocation;
  if (anchor.closest("[class*='fixed']")) return "floating";

  const label = anchor.getAttribute("aria-label") || anchor.textContent || "";
  const normalized = label.trim().replace(/\s+/g, " ").slice(0, 80);
  return normalized || "site";
}

export function AnalyticsRuntime({ locale }: { locale: Locale }) {
  const pathname = usePathname();

  useEffect(() => {
    trackPageView({ path: pathname, locale });
  }, [locale, pathname]);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;
      const anchor = event.target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor || !isWhatsAppUrl(anchor.href)) return;

      trackWhatsAppClick({
        path: window.location.pathname,
        locale,
        linkLocation: linkLocation(anchor),
        tourSlug: document.querySelector<HTMLElement>("[data-analytics-tour-slug]")?.dataset
          .analyticsTourSlug,
      });
    }

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, [locale]);

  return null;
}
