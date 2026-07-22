/**
 * Site-level SEO constants. Single source of truth for the canonical
 * origin URL — used by sitemap, robots, OG image generation, and
 * hreflang alternates.
 */

export const SITE_NAME = "Moto On/Off";
export const INSTAGRAM_URL = "https://www.instagram.com/motoonofftours/";

/**
 * Canonical site origin (no trailing slash). Reads from NEXT_PUBLIC_SITE_URL
 * with a localhost fallback so dev and CI work without env config.
 */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  return "http://localhost:3000";
}
