import "server-only";
import { z } from "zod";
import { locales, type Locale } from "@/lib/i18n/config";
import { appendSheetRow, hasRealCredentials, readSheet } from "./client";

const INQUIRIES_RANGE = "Inquiries!A1:H";
const DEDUPLICATION_WINDOW_MS = 5 * 60 * 1000;
const DEDUPLICATION_ROWS = 100;

const INQUIRY_HEADERS = [
  "date",
  "name",
  "email",
  "phone",
  "tour",
  "language",
  "message",
  "status",
] as const;

const InquiryRowSchema = z.object({
  date: z.string().datetime(),
  name: z.string().trim().min(1),
  email: z.string().trim().email(),
  phone: z.string(),
  tour: z.string(),
  language: z.enum(locales),
  message: z.string(),
  status: z.literal("new"),
});

type InquiryRow = z.infer<typeof InquiryRowSchema>;

export type InquirySheetInput = {
  name: string;
  email: string;
  phone?: string;
  tour?: string;
  language: Locale;
  message?: string;
};

export type AppendInquiryResult =
  | { ok: true; status: "appended" | "duplicate" | "skipped" }
  | { ok: false; error: "storage" };

function rowValues(row: InquiryRow): string[] {
  return [
    row.date,
    row.name,
    row.email,
    row.phone,
    row.tour,
    row.language,
    row.message,
    row.status,
  ];
}

function normalizeCell(value: unknown): string {
  return String(value ?? "")
    .normalize("NFKC")
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("es");
}

function payloadSignature(values: unknown[]): string {
  // Exclude date and status: status may be edited by the client after capture.
  return values.slice(1, 7).map(normalizeCell).join("\u001f");
}

function hasExpectedHeaders(headers: string[]): boolean {
  return (
    headers.length === INQUIRY_HEADERS.length &&
    INQUIRY_HEADERS.every((header, index) => headers[index]?.trim() === header)
  );
}

function isRecentDuplicate(candidate: string[], existingRows: unknown[][]): boolean {
  const candidateSignature = payloadSignature(candidate);
  const cutoff = Date.now() - DEDUPLICATION_WINDOW_MS;

  return existingRows.slice(-DEDUPLICATION_ROWS).some((row) => {
    const timestamp = Date.parse(String(row[0] ?? ""));
    return (
      Number.isFinite(timestamp) &&
      timestamp >= cutoff &&
      payloadSignature(row) === candidateSignature
    );
  });
}

/**
 * Persist one valid inquiry in the fixed eight-column Inquiries contract.
 *
 * The recent-row check prevents normal double-click/retry duplicates. It is
 * intentionally best-effort: strict atomic idempotency would require a
 * persistent submission ID column or an external store.
 */
export async function appendInquiry(input: InquirySheetInput): Promise<AppendInquiryResult> {
  if (!hasRealCredentials()) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[inquiry] Sheets not configured — skipping Inquiries append");
      return { ok: true, status: "skipped" };
    }
    console.error("[inquiry] Sheets credentials are missing in production");
    return { ok: false, error: "storage" };
  }

  const parsed = InquiryRowSchema.safeParse({
    date: new Date().toISOString(),
    name: input.name,
    email: input.email,
    phone: input.phone ?? "",
    tour: input.tour ?? "",
    language: input.language,
    message: input.message ?? "",
    status: "new",
  });

  if (!parsed.success) {
    console.error("[inquiry] invalid Sheets row", {
      issues: parsed.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
    return { ok: false, error: "storage" };
  }

  try {
    const { headers, rows } = await readSheet(INQUIRIES_RANGE);
    if (!hasExpectedHeaders(headers)) {
      console.error("[inquiry] Inquiries headers do not match the expected contract", {
        expected: INQUIRY_HEADERS,
        received: headers,
      });
      return { ok: false, error: "storage" };
    }

    const values = rowValues(parsed.data);
    if (isRecentDuplicate(values, rows)) {
      console.info("[inquiry] duplicate submission suppressed");
      return { ok: true, status: "duplicate" };
    }

    await appendSheetRow(INQUIRIES_RANGE, values);
    return { ok: true, status: "appended" };
  } catch (error) {
    console.error("[inquiry] Sheets append failed", error);
    return { ok: false, error: "storage" };
  }
}
