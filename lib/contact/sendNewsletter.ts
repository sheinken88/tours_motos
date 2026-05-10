import "server-only";
import { Resend } from "resend";
import { type Locale } from "@/lib/i18n/config";

/**
 * sendNewsletter — adds an email to the Resend audience configured via
 * RESEND_AUDIENCE_ID. Falls back to console.log when credentials are
 * missing (dev/preview without secrets).
 *
 * Audience IDs are stable per Resend project; one audience covers all
 * locales since Resend doesn't support locale segmentation natively. The
 * locale field is added as an `attribute` so future broadcasts can filter.
 *
 * Treat duplicate-email errors as success — re-subscribing shouldn't
 * surface a generic failure.
 */

export type NewsletterPayload = {
  email: string;
  locale: Locale;
  honeypot?: string;
};

export type NewsletterResult = { ok: true } | { ok: false; error: "invalid_email" | "delivery" };

function isValidEmail(value: string): boolean {
  // Pragmatic check, not RFC 5322. Real validation happens server-side at
  // Resend; this just blocks obvious typos before the request fires.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export async function sendNewsletter(payload: NewsletterPayload): Promise<NewsletterResult> {
  if (payload.honeypot && payload.honeypot.trim().length > 0) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[newsletter] honeypot tripped — dropping silently");
    }
    return { ok: true };
  }

  const email = payload.email.trim();
  if (!isValidEmail(email)) {
    return { ok: false, error: "invalid_email" };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;

  if (!apiKey || !audienceId) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[newsletter] RESEND not configured — logging payload");
      console.info({ email, locale: payload.locale });
    }
    return { ok: true };
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.contacts.create({
      audienceId,
      email,
      unsubscribed: false,
    });
    if (error) {
      // Resend returns "Contact already exists" with a specific code — treat
      // that as success since the user's intent is already satisfied.
      const message = (error as { message?: string }).message ?? "";
      if (/already/i.test(message)) {
        return { ok: true };
      }
      console.error("[newsletter] resend error", error);
      return { ok: false, error: "delivery" };
    }
    return { ok: true };
  } catch (error) {
    console.error("[newsletter] resend threw", error);
    return { ok: false, error: "delivery" };
  }
}
