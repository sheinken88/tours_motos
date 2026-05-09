import "server-only";
import { google, type sheets_v4 } from "googleapis";

/**
 * Google Sheets client. Lazily instantiated, singleton per process.
 *
 * Auth: service account JSON (base64-encoded) in GOOGLE_SHEETS_CREDENTIALS.
 * Sheet ID in GOOGLE_SHEETS_TOURS_ID.
 *
 * Phase 5 ships with a mock fallback (lib/sheets/mock.ts) when credentials
 * are missing OR set to the placeholder. Production swaps in real values
 * with no code change.
 */

const PLACEHOLDER_SENTINEL = "PLACEHOLDER_BASE64_SERVICE_ACCOUNT_JSON";

export type ReadResult = {
  /** Header row, position 0. */
  headers: string[];
  /** Data rows, position 1+. */
  rows: unknown[][];
};

export function hasRealCredentials(): boolean {
  const creds = process.env.GOOGLE_SHEETS_CREDENTIALS;
  const sheetId = process.env.GOOGLE_SHEETS_TOURS_ID;
  return Boolean(
    creds && creds !== PLACEHOLDER_SENTINEL && sheetId && sheetId !== "PLACEHOLDER_SHEET_ID",
  );
}

let client: sheets_v4.Sheets | null = null;

function getClient(): sheets_v4.Sheets {
  if (client) return client;

  const credentials = process.env.GOOGLE_SHEETS_CREDENTIALS;
  if (!credentials) throw new Error("GOOGLE_SHEETS_CREDENTIALS is not set");

  const json = JSON.parse(Buffer.from(credentials, "base64").toString("utf8")) as {
    client_email: string;
    private_key: string;
  };

  const auth = new google.auth.JWT({
    email: json.client_email,
    key: json.private_key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  client = google.sheets({ version: "v4", auth });
  return client;
}

/**
 * Read a single range from the configured spreadsheet. The first row is
 * always the header — we split it out so callers can shape rows by
 * column name rather than positional index.
 *
 * Throws if the Sheets API call fails — upstream `unstable_cache` keeps
 * the last good response on the next-data cache, so transient failures
 * don't break pages.
 */
export async function readSheet(range: string): Promise<ReadResult> {
  const spreadsheetId = process.env.GOOGLE_SHEETS_TOURS_ID;
  if (!spreadsheetId) throw new Error("GOOGLE_SHEETS_TOURS_ID is not set");

  const response = await getClient().spreadsheets.values.get({
    spreadsheetId,
    range,
    valueRenderOption: "UNFORMATTED_VALUE",
    dateTimeRenderOption: "FORMATTED_STRING",
  });

  const values = response.data.values ?? [];
  const [headerRow, ...dataRows] = values;
  const headers = (headerRow ?? []).map((h) => (typeof h === "string" ? h : String(h)));
  return { headers, rows: dataRows };
}
