"use server";

import { type Locale, isLocale } from "@/lib/i18n/config";
import { sendInquiry, type InquiryKind } from "@/lib/contact/sendInquiry";
import { sendNewsletter } from "@/lib/contact/sendNewsletter";

/**
 * Server Actions for the brand's three forms. Kept in one file so all the
 * form-side wire-up sits next to its server counterpart and shares the
 * FormState shape that the client useActionState hook reads.
 *
 * Each action accepts FormData and returns a `FormState` discriminated
 * union: `idle | success | error`. The form components render the correct
 * UI off the state shape — no redirect, no full-page reload.
 */

export type FormState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; field?: string; message?: string };

const initialState: FormState = { status: "idle" };

function readLocale(formData: FormData): Locale {
  const raw = String(formData.get("locale") ?? "es");
  return isLocale(raw) ? raw : "es";
}

function readString(formData: FormData, key: string): string {
  const raw = formData.get(key);
  return typeof raw === "string" ? raw.trim() : "";
}

// ── Inquiry / Contact ────────────────────────────────────────────────────────

type InquiryActionInput = {
  kind: InquiryKind;
};

function inquiryActionFor({ kind }: InquiryActionInput) {
  return async function inquiryAction(_prev: FormState, formData: FormData): Promise<FormState> {
    const locale = readLocale(formData);
    const name = readString(formData, "name");
    const email = readString(formData, "email");
    const honeypot = readString(formData, "company");

    if (!name || !email) {
      return { status: "error", field: !name ? "name" : "email", message: "missing_fields" };
    }

    const fieldKeys = [
      "group_size",
      "preferred_dates",
      "tour",
      "experience",
      "region",
      "window",
      "pitch",
      "message",
    ] as const;
    const fields: Record<string, string> = {};
    for (const key of fieldKeys) {
      const value = readString(formData, key);
      if (value) fields[key] = value;
    }

    const tourSlug = readString(formData, "tour_slug") || undefined;

    const result = await sendInquiry({
      kind,
      locale,
      name,
      email,
      tourSlug,
      fields,
      honeypot,
    });

    if (!result.ok) {
      return { status: "error", message: result.error };
    }
    return { status: "success" };
  };
}

export const submitContactInquiry = inquiryActionFor({ kind: "contact" });
export const submitTourInquiry = inquiryActionFor({ kind: "tour" });
export const submitCustomInquiry = inquiryActionFor({ kind: "custom" });

export const initialInquiryState: FormState = initialState;

// ── Newsletter ───────────────────────────────────────────────────────────────

export async function submitNewsletter(_prev: FormState, formData: FormData): Promise<FormState> {
  const locale = readLocale(formData);
  const email = readString(formData, "email");
  const honeypot = readString(formData, "company");

  const result = await sendNewsletter({ email, locale, honeypot });
  if (!result.ok) {
    return { status: "error", message: result.error };
  }
  return { status: "success" };
}

export const initialNewsletterState: FormState = initialState;
