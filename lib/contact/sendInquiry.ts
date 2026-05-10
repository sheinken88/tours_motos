import "server-only";
import { Resend } from "resend";
import { type Locale } from "@/lib/i18n/config";

/**
 * sendInquiry — server-side delivery for inquiry / contact / custom-tour
 * forms. Uses Resend when RESEND_API_KEY is set; falls back to console.log
 * in dev so unconfigured environments still let forms submit and the rest
 * of the flow (validation, success state) is testable end-to-end.
 *
 * Email destination is INQUIRY_NOTIFICATION_EMAIL (CLAUDE.md §14). The
 * subject line and body are server-rendered plain text — no MIME, no
 * templates — to keep dependencies minimal and the trail audit-friendly.
 *
 * Throws on Resend HTTP errors; the calling Server Action catches and
 * returns an `error` shape so the form can render the error state without
 * leaking provider details.
 */

export type InquiryKind = "contact" | "tour" | "custom";

export type InquiryPayload = {
  kind: InquiryKind;
  locale: Locale;
  name: string;
  email: string;
  /** Optional tour slug when the form was opened from a tour page. */
  tourSlug?: string;
  /** Free-form data: group size, dates, message, experience, region, pitch. */
  fields: Record<string, string | number | undefined>;
  /** Honeypot value — non-empty = silent drop. */
  honeypot?: string;
};

export type InquiryResult =
  | { ok: true; id?: string }
  | { ok: false; error: "honeypot" | "delivery" | "missing_fields" };

const SUBJECT_BY_KIND: Record<InquiryKind, string> = {
  contact: "Nuevo mensaje · Moto On/Off",
  tour: "Consulta de ruta · Moto On/Off",
  custom: "Consulta a medida · Moto On/Off",
};

function formatBody(payload: InquiryPayload): string {
  const lines: string[] = [
    `Tipo: ${payload.kind}`,
    `Idioma: ${payload.locale}`,
    `Nombre: ${payload.name}`,
    `Correo: ${payload.email}`,
  ];
  if (payload.tourSlug) lines.push(`Ruta: ${payload.tourSlug}`);
  for (const [key, value] of Object.entries(payload.fields)) {
    if (value === undefined || value === "") continue;
    lines.push(`${key}: ${value}`);
  }
  return lines.join("\n");
}

export async function sendInquiry(payload: InquiryPayload): Promise<InquiryResult> {
  // Honeypot — bots fill hidden fields. Silently succeed so the bot doesn't
  // retry; never deliver mail.
  if (payload.honeypot && payload.honeypot.trim().length > 0) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[inquiry] honeypot tripped — dropping silently");
    }
    return { ok: true };
  }

  if (!payload.name.trim() || !payload.email.trim()) {
    return { ok: false, error: "missing_fields" };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.INQUIRY_NOTIFICATION_EMAIL;
  const subject = SUBJECT_BY_KIND[payload.kind];
  const body = formatBody(payload);

  // Dev / preview without credentials: log and pretend success so the form
  // surface stays testable. Production deploys MUST set both env vars or
  // delivery silently degrades.
  if (!apiKey || !to) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[inquiry] RESEND not configured — logging payload");
      console.info({ subject, body });
    }
    return { ok: true };
  }

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: "Moto On/Off <hello@motoonoff.com>",
      to,
      replyTo: payload.email,
      subject,
      text: body,
    });
    if (error) {
      console.error("[inquiry] resend error", error);
      return { ok: false, error: "delivery" };
    }
    return { ok: true, id: data?.id };
  } catch (error) {
    console.error("[inquiry] resend threw", error);
    return { ok: false, error: "delivery" };
  }
}
