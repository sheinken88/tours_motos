"use client";

import { type Locale } from "@/lib/i18n/config";

type AnalyticsValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | AnalyticsValue[]
  | { [key: string]: AnalyticsValue };

type AnalyticsParams = Record<string, AnalyticsValue>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

const recentEvents = new Map<string, number>();

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function wasRecentlyTracked(key: string, windowMs: number): boolean {
  const now = Date.now();
  const previous = recentEvents.get(key);
  if (previous !== undefined && now - previous < windowMs) return true;

  recentEvents.set(key, now);
  if (recentEvents.size > 200) {
    for (const [storedKey, timestamp] of recentEvents) {
      if (now - timestamp > 60_000) recentEvents.delete(storedKey);
    }
  }
  return false;
}

function ensureDataLayer(): unknown[] {
  window.dataLayer = window.dataLayer ?? [];
  return window.dataLayer;
}

function pushToDataLayer(event: string, params: AnalyticsParams): void {
  if (!isBrowser()) return;
  ensureDataLayer().push({ event, ...params });
}

function sendToGa4(event: string, params: AnalyticsParams): void {
  if (!isBrowser()) return;
  if (!window.gtag) {
    window.gtag = function gtag(..._args: unknown[]) {
      // gtag.js expects the function's Arguments object in the data layer.
      // eslint-disable-next-line prefer-rest-params
      ensureDataLayer().push(arguments);
    };
  }
  window.gtag("event", event, params);
}

function sendToMeta(args: unknown[], attempt = 0): void {
  if (!isBrowser()) return;
  if (window.fbq) {
    window.fbq(...args);
    return;
  }
  if (attempt < 10) {
    window.setTimeout(() => sendToMeta(args, attempt + 1), 200);
  }
}

function tourSlugFromPath(path: string): string | undefined {
  const segments = path.split("/").filter(Boolean);
  const toursIndex = segments.indexOf("tours");
  return toursIndex >= 0 ? segments[toursIndex + 1] : undefined;
}

export function trackPageView({ path, locale }: { path: string; locale: Locale }): void {
  if (!isBrowser() || wasRecentlyTracked(`page:${path}`, 1_000)) return;

  const params = {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
    language: locale,
  };
  pushToDataLayer("moto_page_view", params);
  sendToGa4("page_view", params);
  sendToMeta(["track", "PageView"]);
}

export function trackTourView({
  tourSlug,
  tourName,
  locale,
}: {
  tourSlug: string;
  tourName: string;
  locale: Locale;
}): void {
  if (!isBrowser() || wasRecentlyTracked(`tour:${tourSlug}:${window.location.pathname}`, 1_500)) {
    return;
  }

  const shared = {
    tour_slug: tourSlug,
    tour_name: tourName,
    language: locale,
  };
  pushToDataLayer("moto_tour_view", shared);
  sendToGa4("view_item", {
    language: locale,
    items: [
      {
        item_id: tourSlug,
        item_name: tourName,
        item_brand: "Moto On/Off",
        item_category: "Motorcycle tour",
      },
    ],
  });
  sendToMeta([
    "track",
    "ViewContent",
    {
      content_ids: [tourSlug],
      content_name: tourName,
      content_type: "product",
    },
  ]);
}

export function trackWhatsAppClick({
  path,
  locale,
  linkLocation,
  tourSlug,
}: {
  path: string;
  locale: Locale;
  linkLocation: string;
  tourSlug?: string;
}): void {
  const resolvedTourSlug = tourSlug || tourSlugFromPath(path);
  const dedupeKey = `whatsapp:${path}:${linkLocation}`;
  if (!isBrowser() || wasRecentlyTracked(dedupeKey, 750)) return;

  const params = {
    page_path: path,
    language: locale,
    link_location: linkLocation,
    tour_slug: resolvedTourSlug,
  };
  pushToDataLayer("moto_whatsapp_click", params);
  sendToGa4("whatsapp_click", params);
  sendToMeta(["trackCustom", "WhatsAppClick", params]);
}

export function trackLead({
  eventId,
  formKind,
  locale,
  tourSlug,
}: {
  eventId: string;
  formKind: "contact" | "tour" | "custom";
  locale: Locale;
  tourSlug?: string;
}): void {
  if (!isBrowser()) return;

  const storageKey = `moto:analytics:lead:${eventId}`;
  try {
    if (window.sessionStorage.getItem(storageKey)) return;
    window.sessionStorage.setItem(storageKey, "1");
  } catch {
    if (wasRecentlyTracked(storageKey, 60_000)) return;
  }

  const params = {
    event_id: eventId,
    form_kind: formKind,
    language: locale,
    tour_slug: tourSlug,
  };
  pushToDataLayer("moto_lead", params);
  sendToGa4("generate_lead", {
    ...params,
    lead_source: "website_form",
  });
  sendToMeta(["track", "Lead", params, { eventID: eventId }]);
}
