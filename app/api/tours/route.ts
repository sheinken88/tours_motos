import { NextResponse } from "next/server";
import { defaultLocale } from "@/lib/i18n/config";
import { getTours, getUpcomingDepartures } from "@/lib/sheets/queries";

/**
 * Content smoke endpoint — returns static tour content plus cached departures
 * as JSON. Useful for manually verifying the route catalog and the
 * Sheets-backed calendar payload.
 */
export async function GET() {
  const [tours, departures] = await Promise.all([getTours(defaultLocale), getUpcomingDepartures()]);

  return NextResponse.json({
    tours,
    departures,
    counts: { tours: tours.length, departures: departures.length },
    departuresSource: process.env.GOOGLE_SHEETS_CREDENTIALS ? "sheets" : "mock",
  });
}
