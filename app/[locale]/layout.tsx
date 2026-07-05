import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { DistressSprite } from "@/components/ui/DistressSprite";
import { Footer } from "@/components/ui/Footer";
import { Nav } from "@/components/ui/Nav";
import { WhatsAppFAB } from "@/components/ui/WhatsAppFAB";
import { localeCodes, locales } from "@/lib/i18n/config";
import { routing } from "@/lib/i18n/routing";
import { fontBody, fontDisplay, fontScript } from "../fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: "Moto On/Off",
  description: "Motorcycle expeditions for riders who ride to conquer.",
};

/**
 * Per-locale root layout. Validates the URL locale, opts into static rendering,
 * emits the locale-specific <html lang>, and provides the next-intl context to
 * client components below.
 */

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  return (
    <html
      lang={localeCodes[locale]}
      className={`${fontDisplay.variable} ${fontBody.variable} ${fontScript.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <DistressSprite />
        <NextIntlClientProvider locale={locale}>
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppFAB />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
