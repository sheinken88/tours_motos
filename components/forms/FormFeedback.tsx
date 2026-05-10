import { type ReactNode } from "react";
import { DisplayHeading } from "@/components/primitives";

/**
 * FormFeedback — success / error block shown after a form submission.
 * Replaces the form in place (no redirect — CLAUDE.md §15 step 16).
 *
 * data-zone-aware via currentColor; works on red and paper surfaces.
 */
type FormFeedbackProps = {
  variant: "success" | "error";
  heading: string;
  body: ReactNode;
};

export function FormFeedback({ variant, heading, body }: FormFeedbackProps) {
  return (
    <div role="status" aria-live="polite" className="space-y-4">
      <DisplayHeading size="lg" as="h3">
        {variant === "success" ? "✓" : "✗"} {heading}
      </DisplayHeading>
      <p className="font-sans text-base leading-relaxed">{body}</p>
    </div>
  );
}
