export type FormState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; field?: string; message?: string };

export const initialInquiryState: FormState = { status: "idle" };
