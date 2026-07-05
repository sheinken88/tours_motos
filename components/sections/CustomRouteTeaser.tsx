import { Button, Container, DisplayHeading, Eyebrow } from "@/components/primitives";

type RouteStat = {
  value: string;
  label: string;
};

type CustomRouteTeaserProps = {
  eyebrow: string;
  heading: string;
  body: string;
  href: string;
  ctaLabel: string;
  boardEyebrow: string;
  boardTitle: string;
  boardBody: string;
  stats: RouteStat[];
  items: string[];
  routeStops: string[];
};

/**
 * CustomRouteTeaser — richer home-page teaser for the custom-trip offer.
 *
 * The section stays server-rendered and zone-aware. It turns the simple CTA
 * into a route brief: a rough planning board, route marks, and X-bullets.
 */
export function CustomRouteTeaser({
  eyebrow,
  heading,
  body,
  href,
  ctaLabel,
  boardEyebrow,
  boardTitle,
  boardBody,
  stats,
  items,
  routeStops,
}: CustomRouteTeaserProps) {
  return (
    <Container>
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(28rem,1fr)] lg:items-center lg:gap-16">
        <div className="max-w-3xl space-y-8">
          <div className="space-y-4">
            <Eyebrow rule>{eyebrow}</Eyebrow>
            <DisplayHeading size="xl" as="h2">
              {heading}
            </DisplayHeading>
            <p className="max-w-prose font-sans text-lg leading-relaxed sm:text-xl">{body}</p>
          </div>

          <div className="grid max-w-2xl border-y-2 border-current sm:grid-cols-3 sm:border-y-0 sm:border-l-2">
            {stats.map((stat) => (
              <div
                key={`${stat.value}-${stat.label}`}
                className="border-current py-4 sm:border-r-2 sm:px-5"
              >
                <p className="font-display text-display-lg text-accent-on-paper uppercase">
                  {stat.value}
                </p>
                <p className="text-eyebrow tracking-eyebrow font-semibold uppercase opacity-75">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <Button href={href} edge={1} tilt="left" variant="sticker-filled">
            {ctaLabel}
          </Button>
        </div>

        <div className="relative">
          <div
            className="border-brand-red bg-paper-grain font-display text-display-md text-brand-red shadow-sticker-red absolute -top-6 right-8 z-10 hidden -rotate-2 border-2 px-4 py-2 uppercase md:block"
            aria-hidden="true"
          >
            100% ON/OFF
          </div>

          <div className="border-ink bg-paper-grain shadow-sticker-ink relative border-2 p-5 sm:p-6 md:p-8">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b-2 border-current pb-5">
              <div>
                <p className="text-eyebrow tracking-eyebrow text-brand-red font-semibold uppercase">
                  {boardEyebrow}
                </p>
                <h3 className="font-display text-display-lg text-brand-red mt-2 leading-none uppercase">
                  {boardTitle}
                </h3>
              </div>
              <p className="text-muted-on-paper max-w-xs font-sans text-sm leading-relaxed">
                {boardBody}
              </p>
            </div>

            <div className="relative my-7 border-2 border-current px-4 py-5">
              <svg viewBox="0 0 520 180" className="text-brand-red h-36 w-full" aria-hidden="true">
                <path
                  d="M25 135 C90 35 150 145 220 70 S335 25 395 88 455 145 500 45"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="square"
                  strokeWidth="9"
                  strokeDasharray="2 18"
                />
                <path
                  d="M25 135 C90 35 150 145 220 70 S335 25 395 88 455 145 500 45"
                  fill="none"
                  stroke="var(--color-ink)"
                  strokeLinecap="square"
                  strokeWidth="2"
                  opacity="0.72"
                />
                {[25, 220, 395, 500].map((x, index) => {
                  const y = [135, 70, 88, 45][index];
                  return (
                    <g key={x}>
                      <circle cx={x} cy={y} r="11" fill="var(--color-paper)" />
                      <circle
                        cx={x}
                        cy={y}
                        r="8"
                        fill="none"
                        stroke="var(--color-ink)"
                        strokeWidth="3"
                      />
                    </g>
                  );
                })}
              </svg>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {routeStops.slice(0, 3).map((stop, index) => (
                  <p
                    key={stop}
                    className="text-eyebrow tracking-eyebrow border-t-2 border-current pt-2 font-semibold uppercase"
                  >
                    <span className="text-brand-red">0{index + 1}</span> {stop}
                  </p>
                ))}
              </div>
            </div>

            <ul className="grid gap-4 sm:grid-cols-2">
              {items.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckMarkIcon className="text-brand-red mt-1 h-5 w-5 shrink-0" />
                  <span className="font-sans text-base leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Container>
  );
}

function CheckMarkIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={className} fill="none">
      <path
        d="M4 12.8 9.2 18 20 5.5"
        stroke="currentColor"
        strokeLinecap="square"
        strokeLinejoin="miter"
        strokeWidth="3.5"
      />
    </svg>
  );
}
