/**
 * Font loading via `next/font` — zero-CLS, self-hosted, latin-ext subset
 * for Spanish/Portuguese accents.
 *
 * Three font files maximum across the site (CLAUDE.md §11 performance budget):
 *   1. Anton            — display (heavy condensed wood-block, distress filter applied at usage site)
 *   2. Inter            — body / UI (clean grotesque counterweight)
 *   3. Permanent Marker — script (sticky-note callouts only, max 1–2 per page)
 *
 * The script font is currently loaded in the same root layout for simplicity.
 * If bundle audit shows it as load-cost dead-weight on routes that don't use
 * sticky notes, switch to lazy-loading via per-route imports.
 */

import { Anton, Inter, Permanent_Marker } from "next/font/google";

export const fontDisplay = Anton({
  variable: "--font-anton",
  subsets: ["latin", "latin-ext"],
  weight: "400",
  display: "swap",
});

export const fontBody = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const fontScript = Permanent_Marker({
  variable: "--font-permanent-marker",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});
