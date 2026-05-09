"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Eyebrow } from "@/components/primitives";

/**
 * NewsletterForm — paper input + ink arrow button. Inline footer form.
 *
 * Phase 4: stubbed — submission is captured client-side and shows a
 * thank-you message. Phase 9 wires this to a Server Action posting to
 * the Resend audience configured via RESEND_API_KEY.
 */
export function NewsletterForm() {
  const t = useTranslations("footer");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;
    // TODO(phase-9): replace with Server Action → Resend audience.
    setSubmitted(true);
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Eyebrow rule>{t("newsletter_eyebrow")}</Eyebrow>
      <p className="font-display text-display-md text-accent-on-paper uppercase">
        {t("newsletter_title")}
      </p>
      {submitted ? (
        <p className="font-sans text-sm" aria-live="polite">
          ✓ {t("newsletter_submit")}
        </p>
      ) : (
        <div className="flex items-center gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("newsletter_placeholder")}
            aria-label={t("newsletter_placeholder")}
            className="bg-paper-light border-ink/30 text-on-paper focus-visible:border-ink w-full border-2 px-4 py-3 text-sm focus-visible:outline-none"
          />
          <button
            type="submit"
            aria-label={t("newsletter_submit")}
            className="bg-ink text-paper hover:bg-brand-red ease-out-soft inline-flex h-12 w-12 shrink-0 items-center justify-center transition-colors duration-200"
          >
            →
          </button>
        </div>
      )}
    </form>
  );
}
