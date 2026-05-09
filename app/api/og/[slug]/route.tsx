import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";
import { defaultLocale, isLocale } from "@/lib/i18n/config";
import { getTourBySlug } from "@/lib/sheets/queries";

// Node runtime — getTourBySlug pulls through googleapis (Node-only).
// next/og works under nodejs runtime, slightly slower cold start than edge
// but the SSR + Sheets pipeline can't run on edge anyway.
export const runtime = "nodejs";

const BRAND_RED = "#A8342A";
const BRAND_RED_DEEP = "#8A2820";
const PAPER = "#E8DCC4";
const INK = "#1F140E";

/**
 * Dynamic OG image — 1200×630 share card per CLAUDE.md §9.
 *
 * Renders a brand-aesthetic version of the tour:
 *   - Red field with the deep-red as a sticker shadow
 *   - Eyebrow (region) + display headline (tour title) in paper color
 *   - Metadata strip (days · km · difficulty)
 *   - Brand wordmark bottom-right
 *
 * Edge runtime — needed by next/og to deliver fast image responses.
 *
 * Usage from tour metadata:
 *   /api/og/{tour.slug}?locale=es
 */
export async function GET(request: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const localeParam = request.nextUrl.searchParams.get("locale") ?? defaultLocale;
  const locale = isLocale(localeParam) ? localeParam : defaultLocale;

  const tour = await getTourBySlug(locale, slug);
  if (!tour) {
    return new Response("Tour not found", { status: 404 });
  }

  const title = tour.title[locale];
  const numberLocale = locale === "en" ? "en-US" : locale === "pt" ? "pt-BR" : "es-AR";
  const km = tour.distance_km.toLocaleString(numberLocale);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 80px",
        background: BRAND_RED,
        color: PAPER,
        position: "relative",
        fontFamily: "sans-serif",
      }}
    >
      {/* Subtle texture via stripes (skips loading external textures in edge) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `repeating-linear-gradient(135deg, ${BRAND_RED_DEEP}11 0 1px, transparent 1px 6px)`,
        }}
      />
      {/* Eyebrow */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          fontSize: 22,
          letterSpacing: 4,
          textTransform: "uppercase",
          fontWeight: 700,
        }}
      >
        <span>{tour.region}</span>
        <span style={{ opacity: 0.5 }}>·</span>
        <span>
          {tour.duration_days} {locale === "en" ? "days" : locale === "pt" ? "dias" : "días"}
        </span>
        <span style={{ opacity: 0.5 }}>·</span>
        <span>{km} km</span>
      </div>

      {/* Title */}
      <div
        style={{
          display: "flex",
          fontSize: 96,
          lineHeight: 0.95,
          letterSpacing: -2,
          textTransform: "uppercase",
          fontWeight: 900,
          maxWidth: "85%",
        }}
      >
        {title}
      </div>

      {/* Footer wordmark */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 22,
          letterSpacing: 4,
          textTransform: "uppercase",
          fontWeight: 700,
        }}
      >
        <span>Moto On/Off</span>
        <span
          style={{
            border: `2px solid ${PAPER}`,
            padding: "10px 18px",
            transform: "rotate(-2deg)",
            color: INK,
            background: PAPER,
          }}
        >
          motoonoff.com
        </span>
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
}
