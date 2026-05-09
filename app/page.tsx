import Link from "next/link";

/**
 * Phase 0/1 placeholder home. Replaced by the locale-prefixed marketing surface
 * in Phase 4. Keep minimal — no flat black/white, no rounded buttons.
 */
export default function Home() {
  return (
    <main className="bg-paper-grain text-on-paper relative isolate flex min-h-screen flex-col items-start justify-center gap-6 px-6 py-24 md:px-16">
      <p className="text-eyebrow tracking-eyebrow text-accent-on-paper uppercase">
        Moto On/Off · in development
      </p>
      <h1
        className="font-display text-display-xl tracking-tight uppercase"
        style={{ filter: "url(#woodblock-distress)" }}
      >
        We&rsquo;re building.
      </h1>
      <p className="text-on-paper max-w-prose font-sans text-base/relaxed">
        Phase 1 design tokens are live. Visit the development tokens page to verify the visual
        baseline:
      </p>
      <Link
        href="/dev/tokens"
        className="font-display text-on-paper border-ink hover:bg-ink hover:text-on-red ease-out-soft inline-flex items-center gap-2 border-2 px-6 py-3 text-sm tracking-[var(--tracking-cta)] uppercase transition-[background-color,color,transform] duration-200 hover:-translate-y-0.5"
      >
        /dev/tokens →
      </Link>
    </main>
  );
}
