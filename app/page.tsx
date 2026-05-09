import { Button, Container, DisplayHeading, Eyebrow } from "@/components/primitives";

/**
 * Phase 0–2 placeholder home. Replaced by the locale-prefixed marketing
 * surface in Phase 4. Uses primitives so the API gets exercised in real usage.
 */
export default function Home() {
  return (
    <main
      data-zone="paper"
      className="bg-paper-grain text-on-paper relative isolate flex min-h-screen flex-col justify-center"
    >
      <Container className="space-y-6 py-24">
        <Eyebrow>Moto On/Off · in development</Eyebrow>
        <DisplayHeading size="xl" as="h1">
          We&rsquo;re building.
        </DisplayHeading>
        <p className="max-w-prose font-sans text-base/relaxed">
          Phase 2 primitives are live. Visit the dev surfaces to verify the visual baseline:
        </p>
        <div className="flex flex-wrap gap-4">
          <Button href="/dev/tokens" edge={1} tilt="left">
            /dev/tokens
          </Button>
          <Button href="/dev/components" edge={2} tilt="right">
            /dev/components
          </Button>
        </div>
      </Container>
    </main>
  );
}
