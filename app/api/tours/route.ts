import { NextResponse } from "next/server";
import { defaultLocale } from "@/lib/i18n/config";
import { getTours, getUpcomingDepartures } from "@/lib/sheets/queries";

/**
 * Sheets CMS smoke endpoint — returns the cached tour + departure payload
 * as JSON. Useful for manually verifying:
 *   - the cache layer works (response time after first hit)
 *   - mock fallback fires when GOOGLE_SHEETS_CREDENTIALS is unset
 *   - real Sheets data flows through Zod validation cleanly once creds land
 *
 * Phase 7 page consumers replace this as the primary surface but the
 * endpoint stays useful for debugging.
 */
export async function GET() {
  const [tours, departures] = await Promise.all([getTours(defaultLocale), getUpcomingDepartures()]);

  return NextResponse.json({
    tours,
    departures,
    counts: { tours: tours.length, departures: departures.length },
    source: process.env.GOOGLE_SHEETS_CREDENTIALS ? "configured" : "mock",
  });
}
