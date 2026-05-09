import { Button, Container, DisplayHeading, Eyebrow } from "@/components/primitives";
import { PaperZone } from "@/components/surfaces";

/**
 * Phase 0–3 placeholder home. Replaced by the locale-prefixed marketing
 * surface in Phase 4. Uses primitives + surfaces so the APIs get exercised
 * in real usage.
 */
export default function Home() {
  return (
    <PaperZone density="heavy" className="flex min-h-screen flex-col justify-center">
      <Container className="space-y-6">
        <Eyebrow>Moto On/Off · in development</Eyebrow>
        <DisplayHeading size="xl" as="h1">
          We&rsquo;re building.
        </DisplayHeading>
        <p className="max-w-prose font-sans text-base/relaxed">
          Phase 3 surfaces are live. Visit the dev pages to verify the visual baseline:
        </p>
        <div className="flex flex-wrap gap-4">
          <Button href="/dev/tokens" edge={1} tilt="left">
            /dev/tokens
          </Button>
          <Button href="/dev/components" edge={2} tilt="right">
            /dev/components
          </Button>
          <Button href="/dev/zones" edge={3} tilt="left">
            /dev/zones
          </Button>
        </div>
      </Container>
    </PaperZone>
  );
}
