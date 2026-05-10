"use client";

import { useActionState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Eyebrow } from "@/components/primitives";
import { Honeypot } from "@/components/forms/FormField";
import {
  type FormState,
  initialNewsletterState,
  submitNewsletter,
} from "@/components/forms/actions";
import { type Locale } from "@/lib/i18n/config";

/**
 * NewsletterForm — paper input + ink arrow button. Inline footer form.
 *
 * Wired to a Server Action that calls sendNewsletter(). Falls back to a
 * console.log when RESEND_API_KEY / RESEND_AUDIENCE_ID are missing so dev
 * environments still let users submit and see the success state.
 *
 * Client component because it owns the in-flight UI state (sending →
 * success/error). The actual delivery happens server-side.
 */
export function NewsletterForm() {
  const t = useTranslations("footer");
  const tForm = useTranslations("form");
  const locale = useLocale() as Locale;

  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    submitNewsletter,
    initialNewsletterState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="locale" value={locale} />
      <Honeypot />
      <Eyebrow rule>{t("newsletter_eyebrow")}</Eyebrow>
      <p className="font-display text-display-md text-accent-on-paper uppercase">
        {t("newsletter_title")}
      </p>
      {state.status === "success" ? (
        <p className="font-sans text-sm" aria-live="polite">
          ✓ {t("newsletter_success")}
        </p>
      ) : (
        <>
          <div className="flex items-center gap-3">
            <input
              type="email"
              name="email"
              required
              placeholder={t("newsletter_placeholder")}
              aria-label={t("newsletter_placeholder")}
              className="bg-paper-light border-ink/30 text-on-paper focus-visible:border-ink w-full border-2 px-4 py-3 text-sm focus-visible:outline-none"
            />
            <button
              type="submit"
              disabled={isPending}
              aria-label={t("newsletter_submit")}
              className="bg-ink text-paper hover:bg-brand-red ease-out-soft inline-flex h-12 w-12 shrink-0 items-center justify-center transition-colors duration-200 disabled:opacity-60"
            >
              →
            </button>
          </div>
          {state.status === "error" ? (
            <p
              role="alert"
              aria-live="polite"
              className="font-sans text-xs leading-relaxed opacity-90"
            >
              ✗ {state.message === "invalid_email" ? tForm("invalid_email") : t("newsletter_error")}
            </p>
          ) : null}
        </>
      )}
    </form>
  );
}
