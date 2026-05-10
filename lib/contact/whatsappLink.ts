import { type Locale } from "@/lib/i18n/config";

/**
 * WhatsApp deep-link builder. CLAUDE.md §10 requires WhatsApp as the primary
 * contact channel — every CTA that opens WhatsApp routes through this helper
 * so we have one place to set fallback numbers, encode messages, and apply
 * per-locale templates.
 *
 * NEXT_PUBLIC_WHATSAPP_NUMBER is the production source. CLAUDE.md §13 forbids
 * hardcoding the number anywhere else. The fallback string keeps dev/preview
 * working without leaking a real number.
 */

const FALLBACK_NUMBER = "5491100000000";

type BuildOptions = {
  /** Pre-filled message text — emoji-safe, no URL-encoding needed by caller. */
  message?: string;
};

export function getWhatsAppNumber(): string {
  return process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? FALLBACK_NUMBER;
}

/**
 * Build a wa.me URL with optional pre-filled text.
 *
 *   buildWhatsAppLink({ message: "Hola, me interesa Sobre las Nubes." })
 *   → https://wa.me/5491141234567?text=Hola%2C%20me%20interesa%20Sobre%20las%20Nubes.
 *
 * Empty / undefined message returns the bare contact link with no `text`
 * query string — keeps the URL short for the FAB / footer surface.
 */
export function buildWhatsAppLink({ message }: BuildOptions = {}): string {
  const number = getWhatsAppNumber();
  if (!message) return `https://wa.me/${number}`;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

type TourLinkInput = {
  /** ICU template — typically the dictionary's `whatsapp.tour_message`. */
  template: string;
  /** Tour title in the active locale (substituted into `{tour}`). */
  tourTitle: string;
};

/**
 * Render a tour-specific WhatsApp message from the dictionary template
 * and build the full URL. Used by per-tour CTAs (price strip, tour hero).
 *
 * The dictionary key uses `{tour}` as the substitution token; this helper
 * does the swap so callers can stay synchronous and avoid pulling in
 * full ICU machinery for one variable.
 */
export function buildTourWhatsAppLink({ template, tourTitle }: TourLinkInput): string {
  const message = template.replace(/\{tour\}/g, tourTitle);
  return buildWhatsAppLink({ message });
}

/**
 * Locale-aware default link — used by the floating FAB and footer. The
 * caller passes the locale so the function is portable across server/client
 * boundaries without depending on next-intl's request context.
 */
type LocaleLinkInput = {
  locale: Locale;
  /** Locale dictionary message. Caller resolves this via getTranslations(). */
  defaultMessage: string;
};

export function buildDefaultWhatsAppLink({ defaultMessage }: LocaleLinkInput): string {
  return buildWhatsAppLink({ message: defaultMessage });
}
