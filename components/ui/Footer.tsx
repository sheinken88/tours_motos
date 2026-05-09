import { getTranslations } from "next-intl/server";
import { Container, Eyebrow, SkullBadge } from "@/components/primitives";
import { PaperZone } from "@/components/surfaces";
import { Link } from "@/lib/i18n/navigation";
import { NewsletterForm } from "./NewsletterForm";

/**
 * Footer — paper zone with torn top edge. Skull mark center; three columns
 * (trips / journal / contact); newsletter inline form on the right; locale
 * switcher and copyright at the bottom.
 *
 * Server Component. Newsletter form is a Client Component below.
 *
 * Trust signals (Google Reviews summary, tire-track ornaments) are deferred
 * until the GMB profile is confirmed (open Q §16) and the design specifies
 * the ornament artwork.
 */
export async function Footer() {
  const t = await getTranslations("footer");

  return (
    <footer>
      <PaperZone tornTop={4} density="default">
        <Container className="grid gap-12 md:grid-cols-3">
          <div>
            <Eyebrow rule>{t("section_trips")}</Eyebrow>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/tours" className="hover:underline">
                  /tours
                </Link>
              </li>
              <li>
                <Link href="/calendar" className="hover:underline">
                  /calendar
                </Link>
              </li>
              <li>
                <Link href="/custom" className="hover:underline">
                  /custom
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <Eyebrow rule>{t("section_journal")}</Eyebrow>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/journal" className="hover:underline">
                  /journal
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:underline">
                  /about
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <Eyebrow rule>{t("section_contact")}</Eyebrow>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a
                  href="https://wa.me/5491100000000"
                  className="hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/motoonoff"
                  className="hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("instagram")}
                </a>
              </li>
              <li>
                <a href="mailto:hello@motoonoff.com" className="hover:underline">
                  hello@motoonoff.com
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
                Moto On/Off · {new Date().getFullYear()} — {t("rights")}
              </p>
            </div>
            <NewsletterForm />
          </div>
        </Container>
      </PaperZone>
    </footer>
  );
}
