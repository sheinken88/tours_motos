"use client";

import { useActionState, useId } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/primitives";
import { type Locale } from "@/lib/i18n/config";
import {
  type FormState,
  initialInquiryState,
  submitContactInquiry,
  submitTourInquiry,
} from "./actions";
import { FormFeedback } from "./FormFeedback";
import { FormField, FormSelect, FormTextarea, Honeypot } from "./FormField";

/**
 * InquiryForm — multi-field contact form (CLAUDE.md §15 step 16).
 *
 * Used on /contact (kind="contact") and as the "tour" variant when invoked
 * from a tour detail page (kind="tour"). The tour variant pre-fills the
 * tour selection and sends the slug along so the inbox knows which route
 * the inquiry refers to.
 *
 * No useForm/Zod runtime — server action validates and returns
 * FormState. Native HTML required + email constraints catch most bad input
 * before submission; server is the source of truth.
 *
 * Honors aria-live errors via FormField. Thank-you state replaces the form
 * inline (no redirect — CLAUDE.md §15 step 16 exit criterion).
 */

export type InquiryTourOption = {
  slug: string;
  title: string;
};

type InquiryFormProps = {
  locale: Locale;
  kind?: "contact" | "tour";
  /** Tours offered in the dropdown. When kind="tour", caller should pass [{tour}] only. */
  tours?: InquiryTourOption[];
  /** Pre-selected tour slug — pre-fills the dropdown without locking it. */
  defaultTourSlug?: string;
  /** When kind="tour", sent along as a hidden field for the inbox trail. */
  tourSlug?: string;
};

export function InquiryForm({
  locale,
  kind = "contact",
  tours,
  defaultTourSlug,
  tourSlug,
}: InquiryFormProps) {
  const t = useTranslations("form");
  const action = kind === "tour" ? submitTourInquiry : submitContactInquiry;
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    action,
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
      {tourSlug ? <input type="hidden" name="tour_slug" value={tourSlug} /> : null}
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
          id={`${formId}-dates`}
          name="preferred_dates"
          label={t("preferred_dates_label")}
          placeholder={t("preferred_dates_placeholder")}
        />
      </div>

      {tours && tours.length > 0 ? (
        <FormSelect
          id={`${formId}-tour`}
          name="tour"
          label={t("tour_label")}
          defaultValue={defaultTourSlug ?? ""}
        >
          <option value="">{t("tour_any")}</option>
          {tours.map((tour) => (
            <option key={tour.slug} value={tour.slug}>
              {tour.title}
            </option>
          ))}
        </FormSelect>
      ) : null}

      <FormTextarea
        id={`${formId}-message`}
        name="message"
        label={t("message_label")}
        placeholder={t("message_placeholder")}
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
