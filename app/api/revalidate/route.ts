import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

/**
 * On-demand cache revalidation for the Sheets CMS.
 *
 * Auth: REVALIDATE_SECRET passed via the `x-revalidate-secret` header OR
 * the `?secret=` query param so the client can bookmark a "Refresh site"
 * URL. Returns 401 on missing or wrong secret.
 *
 * Tags (CLAUDE.md §6):
 *   - tours       — fired by default
 *   - departures  — fired by default
 *   - all         — only fired when `?tag=all` is passed; not used yet
 *
 * Usage:
 *   curl -X POST 'https://motoonoff.com/api/revalidate?secret=...'
 *   curl -X POST -H "x-revalidate-secret: ..." https://motoonoff.com/api/revalidate
 */

const TAGS = ["tours", "departures"] as const;

export async function POST(request: NextRequest) {
  const expected = process.env.REVALIDATE_SECRET;
  if (!expected) {
    return NextResponse.json({ error: "REVALIDATE_SECRET is not configured" }, { status: 500 });
  }

  const headerSecret = request.headers.get("x-revalidate-secret");
  const querySecret = request.nextUrl.searchParams.get("secret");
  const provided = headerSecret ?? querySecret;

  if (provided !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  for (const tag of TAGS) revalidateTag(tag, "default");

  return NextResponse.json({
    revalidated: true,
    tags: TAGS,
    timestamp: new Date().toISOString(),
  });
}

// GET responds 405 so a casual browser visit doesn't accidentally trigger
// (or fail silently). The bookmark client uses POST.
export async function GET() {
  return NextResponse.json({ error: "method not allowed — use POST" }, { status: 405 });
}
