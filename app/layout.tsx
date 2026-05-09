import type { Metadata } from "next";
import { DistressSprite } from "@/components/ui/DistressSprite";
import { defaultLocale, localeCodes } from "@/lib/i18n/config";
import { fontBody, fontDisplay, fontScript } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Moto On/Off",
  description: "Motorcycle expeditions for riders who ride to conquer.",
};

/**
 * Root layout — the universal shell. Provides <html>, <body>, fonts,
 * and the inline distress SVG sprite. The locale layout at app/[locale]/
 * wraps children with NextIntlClientProvider and replaces the lang
 * attribute via the HtmlLang client effect (see app/[locale]/layout.tsx).
 *
 * Dev pages at app/dev/* render directly under this root and inherit the
 * default-locale html lang since they don't traverse the [locale] layout.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={localeCodes[defaultLocale]}
      className={`${fontDisplay.variable} ${fontBody.variable} ${fontScript.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <DistressSprite />
        {children}
      </body>
    </html>
  );
}
