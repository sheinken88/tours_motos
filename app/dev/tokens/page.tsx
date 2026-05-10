import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tokens — Moto On/Off (dev)",
  robots: { index: false, follow: false },
};

/**
 * Dev-only sanity page. Renders every Phase 1 token so we can eyeball the
 * visual baseline before any component code lands. Excluded from sitemap
 * and noindex'd. Delete once Phase 2 primitives exist and we have a
 * proper component playground.
 */
export default function TokensPage() {
  return (
    <div className="text-on-paper bg-paper-grain min-h-screen">
      <header className="border-b-ink/30 border-b-2 px-6 py-12 md:px-16">
        <p className="text-eyebrow tracking-eyebrow text-accent-on-paper uppercase">
          design tokens · phase 1 sanity check
        </p>
        <h1 className="font-display text-display-xl mt-2 uppercase">Tokens</h1>
      </header>

      <ColorsSection />
      <TypographySection />
      <ShadowsSection />
      <TexturesSection />
      <SpritesSection />
      <ZonePreviewSection />
    </div>
  );
}

/* ── Colors ─────────────────────────────────────────────────────────────── */

const colorTokens = [
  { name: "brand-red", value: "#A8342A", className: "bg-brand-red text-paper" },
  { name: "brand-red-deep", value: "#8A2820", className: "bg-brand-red-deep text-paper" },
  { name: "brand-red-bright", value: "#C04032", className: "bg-brand-red-bright text-paper" },
  { name: "ink", value: "#1F140E", className: "bg-ink text-paper" },
  { name: "ink-soft", value: "#3A2820", className: "bg-ink-soft text-paper" },
  { name: "paper", value: "#E8DCC4", className: "bg-paper text-ink border-2 border-ink/20" },
  {
    name: "paper-light",
    value: "#F0E5CE",
    className: "bg-paper-light text-ink border-2 border-ink/20",
  },
  { name: "paper-aged", value: "#D4C5A8", className: "bg-paper-aged text-ink" },
  { name: "paper-dark", value: "#B8A684", className: "bg-paper-dark text-ink" },
  { name: "success", value: "#4A6B2E", className: "bg-success text-paper" },
  { name: "warning", value: "#C08530", className: "bg-warning text-ink" },
  { name: "danger", value: "#7A2018", className: "bg-danger text-paper" },
  { name: "info", value: "#3D556C", className: "bg-info text-paper" },
];

function ColorsSection() {
  return (
    <section className="px-6 py-12 md:px-16">
      <h2 className="font-display text-display-lg uppercase">Colors</h2>
      <p className="text-on-paper mt-2 max-w-prose text-sm">
        Brand and ink and paper are the marketing palette. Functional colors
        (success/warning/danger/info) are reserved for booking flow and forms only — never marketing
        surfaces.
      </p>
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {colorTokens.map((c) => (
          <div key={c.name} className={`flex flex-col gap-1 px-4 py-6 ${c.className}`}>
            <span className="font-display text-sm tracking-wider uppercase">{c.name}</span>
            <span className="font-mono text-xs">{c.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Typography ─────────────────────────────────────────────────────────── */

function TypographySection() {
  return (
    <section className="border-t-ink/30 border-t-2 px-6 py-12 md:px-16">
      <h2 className="font-display text-display-lg uppercase">Typography</h2>

      <div className="mt-8 space-y-6">
        <div>
          <p className="text-eyebrow tracking-eyebrow text-accent-on-paper uppercase">
            display-2xl
          </p>
          <p
            className="font-display text-display-2xl text-accent-on-paper uppercase"
            style={{ filter: "url(#woodblock-distress)" }}
          >
            Trips that leave marks
          </p>
        </div>

        <div>
          <p className="text-eyebrow tracking-eyebrow text-accent-on-paper uppercase">display-xl</p>
          <p
            className="font-display text-display-xl text-accent-on-paper uppercase"
            style={{ filter: "url(#woodblock-distress)" }}
          >
            Cross the Andes
          </p>
        </div>

        <div>
          <p className="text-eyebrow tracking-eyebrow text-accent-on-paper uppercase">display-lg</p>
          <p
            className="font-display text-display-lg text-accent-on-paper uppercase"
            style={{ filter: "url(#woodblock-distress)" }}
          >
            Sobre las Nubes
          </p>
        </div>

        <div>
          <p className="text-eyebrow tracking-eyebrow text-accent-on-paper uppercase">
            display-md (no distress)
          </p>
          <p className="font-display text-display-md text-on-paper uppercase">14 days · 2200 km</p>
        </div>

        <div>
          <p className="text-eyebrow tracking-eyebrow text-accent-on-paper uppercase">eyebrow</p>
          <p className="text-eyebrow tracking-eyebrow text-on-paper uppercase">
            field notes & dusty thoughts
          </p>
        </div>

        <div>
          <p className="text-eyebrow tracking-eyebrow text-accent-on-paper uppercase">body</p>
          <p className="text-on-paper max-w-prose font-sans text-base/relaxed">
            We ride remote roads, sleep in real places, eat local food, and chase the kind of
            moments you can&rsquo;t book online. Just you, your bike, and everything that makes you
            feel alive.
          </p>
        </div>

        <div>
          <p className="text-eyebrow tracking-eyebrow text-accent-on-paper uppercase">script</p>
          <p className="font-script text-on-paper text-3xl leading-tight">
            Ridden. Earned. Remembered.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ── Shadows ────────────────────────────────────────────────────────────── */

function ShadowsSection() {
  return (
    <section className="border-t-ink/30 border-t-2 px-6 py-12 md:px-16">
      <h2 className="font-display text-display-lg uppercase">Sticker Shadows</h2>
      <p className="text-on-paper mt-2 max-w-prose text-sm">
        Hard-offset, deep-toned shadow. The only shadow this design system permits.
      </p>
      <div className="mt-6 flex flex-wrap gap-8">
        <div className="bg-paper text-on-paper border-ink shadow-sticker-ink inline-block border-2 px-6 py-4">
          <span className="font-display text-sm tracking-wider uppercase">shadow-sticker-ink</span>
        </div>
        <div className="bg-brand-red text-on-red border-paper shadow-sticker-red inline-block border-2 px-6 py-4">
          <span className="font-display text-sm tracking-wider uppercase">shadow-sticker-red</span>
        </div>
      </div>
    </section>
  );
}

/* ── Textures ───────────────────────────────────────────────────────────── */

function TexturesSection() {
  return (
    <section className="border-t-ink/30 border-t-2 px-6 py-12 md:px-16">
      <h2 className="font-display text-display-lg uppercase">Texture overlays</h2>
      <p className="text-on-paper mt-2 max-w-prose text-sm">
        Procedural placeholders for Phase 1. Replaced with hand-authored scans in Phase 10. All
        zones in production must carry one of these — no flat-color surfaces anywhere.
      </p>
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <TextureSwatch
          label="bg-paper-grain"
          className="bg-paper-grain"
          textColor="text-on-paper"
        />
        <TextureSwatch label="bg-red-grunge" className="bg-red-grunge" textColor="text-on-red" />
        <div className="text-on-paper border-ink/40 relative h-40 border-2 border-dashed p-4">
          <span className="font-display text-sm tracking-wider uppercase">
            halftone-overlay (decorative)
          </span>
          <div
            className="absolute inset-0 mt-10 mr-4 mb-4 ml-4 opacity-60"
            style={{ backgroundImage: "url(/textures/halftone-overlay.svg)" }}
          />
        </div>
      </div>
    </section>
  );
}

function TextureSwatch({
  label,
  className,
  textColor,
}: {
  label: string;
  className: string;
  textColor: string;
}) {
  return (
    <div className={`relative h-40 ${className} ${textColor} flex items-end p-4`}>
      <span className="font-display text-sm tracking-wider uppercase">{label}</span>
    </div>
  );
}

/* ── Sprites ────────────────────────────────────────────────────────────── */

function SpritesSection() {
  return (
    <section className="border-t-ink/30 border-t-2 px-6 py-12 md:px-16">
      <h2 className="font-display text-display-lg uppercase">Distress sprite</h2>
      <p className="text-on-paper mt-2 max-w-prose text-sm">
        Inline SVG sprite mounted in app/layout.tsx. Filter and symbols defined once, referenced
        everywhere.
      </p>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <SpriteCell label="x-bullet">
          <svg className="text-accent-on-paper h-10 w-10" aria-hidden>
            <use href="#x-bullet" />
          </svg>
        </SpriteCell>
        <SpriteCell label="hand-underline">
          <svg
            className="text-accent-on-paper h-3 w-32"
            aria-hidden
            viewBox="0 0 200 12"
            preserveAspectRatio="none"
          >
            <use href="#hand-underline" />
          </svg>
        </SpriteCell>
        <SpriteCell label="stamp-frame">
          <svg className="text-on-paper h-12 w-32" aria-hidden viewBox="0 0 120 40">
            <use href="#stamp-frame" />
          </svg>
        </SpriteCell>
        <SpriteCell label="skull-badge (placeholder)">
          <svg className="text-accent-on-paper h-16 w-16" aria-hidden viewBox="0 0 64 64">
            <use href="#skull-badge" />
          </svg>
        </SpriteCell>
      </div>
    </section>
  );
}

function SpriteCell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-ink/40 flex flex-col items-center gap-3 border-2 border-dashed p-4">
      <div className="flex h-20 items-center justify-center">{children}</div>
      <span className="font-mono text-xs">{label}</span>
    </div>
  );
}

/* ── Zone preview ───────────────────────────────────────────────────────── */

function ZonePreviewSection() {
  return (
    <section className="border-t-ink/30 border-t-2">
      <h2 className="font-display text-display-lg px-6 py-12 uppercase md:px-16">
        Zone preview (Phase 3 sneak peek)
      </h2>

      {/* Red zone preview */}
      <div className="bg-red-grunge text-on-red relative px-6 py-16 md:px-16">
        <p className="text-eyebrow tracking-eyebrow uppercase opacity-70">red zone</p>
        <p
          className="font-display text-display-xl mt-2 uppercase"
          style={{ filter: "url(#woodblock-distress)" }}
        >
          Red field, paper headlines.
        </p>
        <p className="mt-4 max-w-prose text-base/relaxed">
          On red zones primary text is paper. Halftones are ink. Headlines display in paper. CTAs
          are outlined in paper.
        </p>
        {/* Torn-edge transition to paper below — Phase 3 wraps this into <TornEdge>. */}
        <svg
          className="text-paper absolute right-0 -bottom-px left-0 h-10 w-full"
          viewBox="0 0 1440 40"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            d="M0,0 L0,16 L24,30 L52,12 L82,34 L110,18 L142,28 L168,10 L196,32 L228,16 L262,30 L300,12 L338,34 L370,18 L402,28 L432,10 L468,32 L500,16 L532,30 L568,12 L604,34 L640,18 L678,28 L712,10 L748,32 L780,16 L816,30 L850,12 L886,34 L922,18 L958,28 L992,10 L1028,32 L1062,16 L1098,30 L1132,12 L1168,34 L1204,18 L1240,28 L1274,10 L1310,32 L1346,16 L1380,30 L1414,12 L1440,28 L1440,40 L0,40 Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* Paper zone preview */}
      <div className="bg-paper-grain text-on-paper px-6 py-16 md:px-16">
        <p className="text-eyebrow tracking-eyebrow text-accent-on-paper uppercase">paper zone</p>
        <p
          className="font-display text-display-xl text-accent-on-paper mt-2 uppercase"
          style={{ filter: "url(#woodblock-distress)" }}
        >
          Paper field, red headlines.
        </p>
        <p className="mt-4 max-w-prose text-base/relaxed">
          On paper zones primary text is ink. Headlines display in red — the signature pattern.
          Halftones remain ink. CTAs are outlined in ink.
        </p>
      </div>
    </section>
  );
}
