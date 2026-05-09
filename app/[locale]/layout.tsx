import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Footer } from "@/components/ui/Footer";
import { Nav } from "@/components/ui/Nav";
import { WhatsAppFAB } from "@/components/ui/WhatsAppFAB";
import { localeCodes, locales } from "@/lib/i18n/config";
import { routing } from "@/lib/i18n/routing";
import { HtmlLang } from "./HtmlLang";

/**
 * Per-locale layout. Validates the URL locale, opts into static rendering,
 * and provides the next-intl context to client components below.
 *
 * The root <html> element lives in app/layout.tsx; HtmlLang updates its
 * `lang` attribute on the client to match the resolved locale (so SSR
 * defaults to es and the user's actual locale takes over post-hydration).
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
    <NextIntlClientProvider locale={locale}>
      <HtmlLang code={localeCodes[locale]} />
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppFAB />
    </NextIntlClientProvider>
  );
}
