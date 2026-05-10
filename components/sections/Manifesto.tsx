import { getTranslations } from "next-intl/server";
import { Container, DisplayHeading, Eyebrow, HandUnderline } from "@/components/primitives";

/**
 * Manifesto — long-form red-zone block stating the brand position. Per
 * CLAUDE.md §15 + design.md §5 manifesto pattern.
 *
 * Two paragraphs, founder-led voice, with one HandUnderline emphasis word.
 * Honors the §1.5 voice rules: confident, never defensive, names what the
 * rider becomes (CLAUDE.md §13).
 *
 * Self-contained — caller wraps in <RedZone density="default"> with the
 * canonical torn edge transitions to the neighbouring zones. Text sizing
 * is generous (text-xl on desktop) to give the manifesto presence; the
 * narrow Container caps line length so it stays readable.
 */
export async function Manifesto() {
  const t = await getTranslations("manifesto");
  const emphasis = t("emphasis");
  const p2Raw = t("p2");
  // p2 surfaces the emphasis word with a HandUnderline. The dictionary stores
  // the underlined fragment in `emphasis` so we can wrap it without HTML in
  // the JSON. If the fragment is absent from p2 (translator edge), we still
  // render the paragraph cleanly without underline.
  const p2Parts = emphasis ? p2Raw.split(emphasis) : [p2Raw];

  return (
    <Container width="narrow" className="space-y-10">
      <div className="space-y-4">
        <Eyebrow rule>{t("eyebrow")}</Eyebrow>
        <DisplayHeading size="xl" as="h2">
          {t("heading")}
        </DisplayHeading>
      </div>
      <div className="space-y-6 font-sans text-lg leading-relaxed sm:text-xl">
        <p>{t("p1")}</p>
        {p2Parts.length === 2 ? (
          <p>
            {p2Parts[0]}
            <HandUnderline>{emphasis}</HandUnderline>
            {p2Parts[1]}
          </p>
        ) : (
          <p>{p2Raw}</p>
        )}
      </div>
    </Container>
  );
}
