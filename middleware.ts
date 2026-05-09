import createMiddleware from "next-intl/middleware";
import { routing } from "@/lib/i18n/routing";

/**
 * next-intl locale middleware. Inspects every incoming request and either
 * redirects locale-less paths (/) to the default locale (/es) or resolves
 * the locale from the URL prefix and the NEXT_LOCALE cookie for return visits.
 *
 * Excluded by the matcher below:
 *   - /api/*  — API routes are locale-neutral
 *   - /_next  — Next internals
 *   - /dev/*  — local development surfaces (already noindex'd; locale-free
 *               keeps the URLs short for /dev/tokens, /dev/components, etc.)
 *   - any path containing a `.` — static files (favicon.ico, og.png, etc.)
 */
export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|_next|_vercel|dev|.*\\..*).*)"],
};
