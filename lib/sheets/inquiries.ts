import "server-only";
import { z } from "zod";
import { locales, type Locale } from "@/lib/i18n/config";
import { appendSheetRow, formatSheetDateColumn, hasRealCredentials, readSheet } from "./client";

const INQUIRIES_RANGE = "Inquiries!A1:H";
const INQUIRIES_SHEET_TITLE = "Inquiries";
const INQUIRIES_TIME_ZONE = "America/Argentina/Buenos_Aires";
const INQUIRIES_DATE_PATTERN = "dd/mm/yyyy hh:mm";
const DEDUPLICATION_WINDOW_MS = 5 * 60 * 1000;
const DEDUPLICATION_ROWS = 100;
const SHEETS_EPOCH_MS = Date.UTC(1899, 11, 30);
const MS_PER_DAY = 24 * 60 * 60 * 1000;

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

function sheetsSerialFor(date: Date): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: INQUIRIES_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  const localWallClockMs = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
    Number(values.hour),
    Number(values.minute),
    Number(values.second),
    date.getUTCMilliseconds(),
  );
  return (localWallClockMs - SHEETS_EPOCH_MS) / MS_PER_DAY;
}

function rowValues(row: InquiryRow, date: Date): Array<string | number> {
  return [
    sheetsSerialFor(date),
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

function isRecentDuplicate(candidate: unknown[], existingRows: unknown[][]): boolean {
  const candidateSignature = payloadSignature(candidate);
  const cutoff = Date.now() - DEDUPLICATION_WINDOW_MS;

  return existingRows.slice(-DEDUPLICATION_ROWS).some((row) => {
    const timestamp = sheetsDateToEpochMs(row[0]);
    return (
      Number.isFinite(timestamp) &&
      timestamp >= cutoff &&
      payloadSignature(row) === candidateSignature
    );
  });
}

function sheetsDateToEpochMs(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return SHEETS_EPOCH_MS + value * MS_PER_DAY;
  }
  return Date.parse(String(value ?? ""));
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

    const submissionDate = new Date();
    const values = rowValues(parsed.data, submissionDate);
    if (isRecentDuplicate(values, rows)) {
      console.info("[inquiry] duplicate submission suppressed");
      return { ok: true, status: "duplicate" };
    }

    await appendSheetRow(INQUIRIES_RANGE, values);
    try {
      await formatSheetDateColumn(
        INQUIRIES_SHEET_TITLE,
        INQUIRIES_DATE_PATTERN,
        INQUIRIES_TIME_ZONE,
      );
    } catch (error) {
      // The lead is already persisted. A formatting failure should not make a
      // visitor retry and create another inquiry.
      console.error("[inquiry] date formatting failed after Sheets append", error);
    }
    return { ok: true, status: "appended" };
  } catch (error) {
    console.error("[inquiry] Sheets append failed", error);
    return { ok: false, error: "storage" };
  }
}
