import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react";

/**
 * Form primitives for the brand. Paper-input + ink-arrow aesthetic that
 * matches the NewsletterForm in the footer (CLAUDE.md §15 step 16).
 *
 * Hard rules enforced here:
 *   - No border-radius (CLAUDE.md §13).
 *   - No box-shadow on focus (only the documented sticker shadow, used on
 *     CTAs, qualifies — inputs use a 2px focus ring instead).
 *   - aria-live errors so SRs announce validation per CLAUDE.md §12.
 *
 * Each component is data-zone-aware via currentColor — drops into red or
 * paper zones unchanged.
 */

type FieldShellProps = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
  required?: boolean;
};

function FieldShell({ id, label, error, hint, required, children }: FieldShellProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="text-eyebrow tracking-eyebrow flex items-center gap-2 font-semibold uppercase"
      >
        {label}
        {required ? (
          <span aria-hidden className="opacity-60">
            *
          </span>
        ) : null}
      </label>
      {children}
      {hint && !error ? (
        <p id={`${id}-hint`} className="font-sans text-xs leading-relaxed opacity-70">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          aria-live="polite"
          className="font-sans text-xs leading-relaxed text-current opacity-90"
        >
          ✗ {error}
        </p>
      ) : null}
    </div>
  );
}

// ── Text/email/number input ─────────────────────────────────────────────────

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  error?: string;
  hint?: string;
};

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(function FormField(
  { id, label, error, hint, required, className = "", ...rest },
  ref,
) {
  const describedBy =
    [error ? `${id}-error` : null, hint && !error ? `${id}-hint` : null]
      .filter(Boolean)
      .join(" ") || undefined;
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} required={required}>
      <input
        ref={ref}
        id={id}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={`bg-paper-light border-ink/30 text-on-paper placeholder:text-on-paper/40 focus-visible:border-ink focus-visible:outline-ink w-full border-2 px-4 py-3 font-sans text-sm focus-visible:outline-2 focus-visible:outline-offset-2 ${className}`}
        {...rest}
      />
    </FieldShell>
  );
});

// ── Textarea ─────────────────────────────────────────────────────────────────

type FormTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  id: string;
  label: string;
  error?: string;
  hint?: string;
};

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  function FormTextarea(
    { id, label, error, hint, required, className = "", rows = 5, ...rest },
    ref,
  ) {
    const describedBy =
      [error ? `${id}-error` : null, hint && !error ? `${id}-hint` : null]
        .filter(Boolean)
        .join(" ") || undefined;
    return (
      <FieldShell id={id} label={label} error={error} hint={hint} required={required}>
        <textarea
          ref={ref}
          id={id}
          rows={rows}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={`bg-paper-light border-ink/30 text-on-paper placeholder:text-on-paper/40 focus-visible:border-ink focus-visible:outline-ink w-full resize-y border-2 px-4 py-3 font-sans text-sm leading-relaxed focus-visible:outline-2 focus-visible:outline-offset-2 ${className}`}
          {...rest}
        />
      </FieldShell>
    );
  },
);

// ── Select ───────────────────────────────────────────────────────────────────

type FormSelectProps = InputHTMLAttributes<HTMLSelectElement> & {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
};

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(function FormSelect(
  { id, label, error, hint, required, className = "", children, ...rest },
  ref,
) {
  const describedBy =
    [error ? `${id}-error` : null, hint && !error ? `${id}-hint` : null]
      .filter(Boolean)
      .join(" ") || undefined;
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} required={required}>
      <select
        ref={ref}
        id={id}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={`bg-paper-light border-ink/30 text-on-paper focus-visible:border-ink focus-visible:outline-ink w-full border-2 px-4 py-3 font-sans text-sm focus-visible:outline-2 focus-visible:outline-offset-2 ${className}`}
        {...(rest as React.SelectHTMLAttributes<HTMLSelectElement>)}
      >
        {children}
      </select>
    </FieldShell>
  );
});

// ── Honeypot — hidden field bots love to fill ───────────────────────────────

type HoneypotProps = {
  /** Form field name. Default: "company". */
  name?: string;
};

export function Honeypot({ name = "company" }: HoneypotProps) {
  return (
    <div aria-hidden className="absolute h-0 w-0 overflow-hidden opacity-0">
      <label htmlFor={`hp-${name}`}>Leave this field empty</label>
      <input
        id={`hp-${name}`}
        type="text"
        name={name}
        tabIndex={-1}
        autoComplete="off"
        defaultValue=""
      />
    </div>
  );
}
