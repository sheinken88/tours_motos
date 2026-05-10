"use client";

import { useActionState, useId } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/primitives";
import { type Locale } from "@/lib/i18n/config";
import { type FormState, initialInquiryState, submitCustomInquiry } from "./actions";
import { FormFeedback } from "./FormFeedback";
import { FormField, FormTextarea, Honeypot } from "./FormField";

/**
 * CustomTourForm — extended intake for /custom (CLAUDE.md §15 step 16).
 *
 * Default field set per /docs/open-questions.md:
 *   - name (required)
 *   - email (required)
 *   - group_size
 *   - experience (free text — years, bike, terrain)
 *   - region (free text — Patagonia / Norte / Cordillera)
 *   - window (preferred date window)
 *   - pitch (multi-line "the ride you have in your head")
 *
 * Honeypot, aria-live, in-place success — same contract as InquiryForm.
 * The fields here intentionally collect *intent* rather than fixed picklists
 * because every custom request is bespoke; over-structuring early kills
 * the conversation we're trying to start.
 */
type CustomTourFormProps = {
  locale: Locale;
};

export function CustomTourForm({ locale }: CustomTourFormProps) {
  const t = useTranslations("form");
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    submitCustomInquiry,
    initialInquiryState,
  );
  const formId = useId();

  if (state.status === "success") {
    return (
      <FormFeedback variant="success" heading={t("success_heading")} body={t("success_body")} />
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="locale" value={locale} />
      <Honeypot />

      <div className="grid gap-5 md:grid-cols-2">
        <FormField
          id={`${formId}-name`}
          name="name"
          label={t("name_label")}
          placeholder={t("name_placeholder")}
          required
          autoComplete="name"
          error={state.status === "error" && state.field === "name" ? t("required") : undefined}
        />
        <FormField
          id={`${formId}-email`}
          name="email"
          type="email"
          label={t("email_label")}
          placeholder={t("email_placeholder")}
          required
          autoComplete="email"
          error={
            state.status === "error" && state.field === "email" ? t("invalid_email") : undefined
          }
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <FormField
          id={`${formId}-group-size`}
          name="group_size"
          inputMode="numeric"
          pattern="[0-9]*"
          label={t("group_size_label")}
          placeholder={t("group_size_placeholder")}
        />
        <FormField
          id={`${formId}-window`}
          name="window"
          label={t("window_label")}
          placeholder={t("window_placeholder")}
        />
      </div>

      <FormField
        id={`${formId}-experience`}
        name="experience"
        label={t("experience_label")}
        placeholder={t("experience_placeholder")}
      />

      <FormField
        id={`${formId}-region`}
        name="region"
        label={t("region_label")}
        placeholder={t("region_placeholder")}
      />

      <FormTextarea
        id={`${formId}-pitch`}
        name="pitch"
        rows={6}
        label={t("pitch_label")}
        placeholder={t("pitch_placeholder")}
      />

      {state.status === "error" && state.message && state.message !== "missing_fields" ? (
        <FormFeedback variant="error" heading={t("error_heading")} body={t("error_body")} />
      ) : null}

      <div className="flex flex-wrap items-center gap-4 pt-2">
        <Button type="submit" edge={1} tilt="left" variant="sticker-filled" disabled={isPending}>
          {isPending ? t("sending") : t("submit")}
        </Button>
      </div>
    </form>
  );
}
