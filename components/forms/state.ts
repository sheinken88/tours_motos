import { type Locale } from "@/lib/i18n/config";

export type SuccessfulInquiryAnalytics = {
  eventId: string;
  formKind: "contact" | "tour" | "custom";
  locale: Locale;
  tourSlug?: string;
};

export type FormState =
  | { status: "idle" }
  | { status: "success"; analytics?: SuccessfulInquiryAnalytics }
  | { status: "error"; field?: string; message?: string };

export const initialInquiryState: FormState = { status: "idle" };
