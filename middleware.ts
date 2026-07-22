import createMiddleware from "next-intl/middleware";
import { routing } from "@/lib/i18n/routing";

/**
 * next-intl locale middleware. Inspects every incoming request and either
 * redirects locale-less paths (/) to the default locale (/es) or resolves
 * the locale from the explicit URL prefix. Locale detection is disabled so
 * browser language and stale cookies cannot send a new root visitor to /en.
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
