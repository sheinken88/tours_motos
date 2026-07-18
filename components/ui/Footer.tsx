import { getLocale, getTranslations } from "next-intl/server";
import { Button, Container, Eyebrow, SkullBadge } from "@/components/primitives";
import { PaperZone } from "@/components/surfaces";
import { buildWhatsAppLink } from "@/lib/contact/whatsappLink";
import { Link } from "@/lib/i18n/navigation";

/**
 * Footer — paper zone with nav-matched link groups, contact paths, and a
 * conversion CTA for riders who are ready to talk through a route.
 *
 * Server Component. Keep the footer free of speculative forms; WhatsApp and
 * email are the real conversion paths for v1.
 *
 * Trust signals (Google Reviews summary, tire-track ornaments) are deferred
 * until the GMB profile is confirmed (open Q §16) and the design specifies
 * the ornament artwork.
 */
export async function Footer() {
  const locale = await getLocale();
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");
  const tCommon = await getTranslations("common");
  const tWhatsApp = await getTranslations("whatsapp");
  const whatsAppHref = buildWhatsAppLink({ message: tWhatsApp("default_message") });

  const primaryLinks = [
    { href: "/tours", label: tNav("trips") },
    { href: "/calendar", label: tNav("calendar") },
    { href: "/custom", label: tNav("custom") },
  ] as const;

  const secondaryLinks = [
    { href: "/about", label: tNav("about") },
    { href: "/taller-de-rutas", label: tNav("journal") },
  ] as const;

  return (
    <footer>
      {/*
        No tornTop here — pages end with a paper zone, and the footer is also
        paper, so a torn-red edge between two paper surfaces would render as
        a stripe (it has nowhere to "tear toward"). Pages own zone transitions
        on their own bottom edges; the footer joins the last page zone seamlessly.
      */}
      <PaperZone density="default">
        <Container className="grid gap-12 md:grid-cols-3">
          <div>
            <Eyebrow rule>{t("section_trips")}</Eyebrow>
            <ul className="mt-3 text-sm">
              {primaryLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-11 min-w-11 items-center py-1 hover:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <Eyebrow rule>{t("section_journal")}</Eyebrow>
            <ul className="mt-3 text-sm">
              {secondaryLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-11 min-w-11 items-center py-1 hover:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <Eyebrow rule>{t("section_contact")}</Eyebrow>
            <ul className="mt-3 text-sm">
              <li>
                <a
                  href={whatsAppHref}
                  className="inline-flex min-h-11 min-w-11 items-center py-1 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/mototoursonoff/"
                  className="inline-flex min-h-11 min-w-11 items-center py-1 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("instagram")}
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@motoonofftours.com.ar"
                  className="inline-flex min-h-11 min-w-11 items-center py-1 hover:underline"
                >
                  info@motoonofftours.com.ar
                </a>
              </li>
            </ul>
          </div>
        </Container>

        <Container className="mt-16">
          <div className="grid gap-12 border-t-2 border-dashed border-current/20 pt-12 md:grid-cols-2">
            <div className="flex flex-col items-start gap-6">
              <SkullBadge size="xl" className="text-brand-red" />
              <p className="text-on-paper max-w-prose text-sm">
                Moto On/Off · 2019 — {t("rights")}
              </p>
            </div>
            <div className="flex flex-col items-start gap-5">
              <Eyebrow rule>{t("cta_eyebrow")}</Eyebrow>
              <div className="max-w-xl space-y-4">
                <p className="font-display text-display-md text-accent-on-paper uppercase">
                  {t("cta_title")}
                </p>
                <p className="text-muted-on-paper max-w-prose text-sm leading-relaxed">
                  {t("cta_body")}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <Button href={whatsAppHref} external edge={2} tilt="right" variant="sticker-filled">
                  {tNav("cta")}
                </Button>
                <Button href={`/${locale}/tours`} edge={3} tilt="left">
                  {tCommon("see_routes")}
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </PaperZone>
    </footer>
  );
}
