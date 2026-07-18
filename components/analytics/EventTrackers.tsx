"use client";

import { useEffect } from "react";
import { type Locale } from "@/lib/i18n/config";
import { trackLead, trackTourView } from "@/lib/analytics/client";

export function TourViewTracker({
  tourSlug,
  tourName,
  locale,
}: {
  tourSlug: string;
  tourName: string;
  locale: Locale;
}) {
  useEffect(() => {
    trackTourView({ tourSlug, tourName, locale });
  }, [locale, tourName, tourSlug]);

  return <span hidden data-analytics-tour-slug={tourSlug} />;
}

export function LeadTracker({
  eventId,
  formKind,
  locale,
  tourSlug,
}: {
  eventId: string;
  formKind: "contact" | "tour" | "custom";
  locale: Locale;
  tourSlug?: string;
}) {
  useEffect(() => {
    trackLead({ eventId, formKind, locale, tourSlug });
  }, [eventId, formKind, locale, tourSlug]);

  return null;
}
