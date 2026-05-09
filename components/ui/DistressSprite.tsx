/**
 * Inline SVG sprite — must be present in the DOM (not loaded as an <img>) for
 * `filter: url(#woodblock-distress)` and `<use href="#x-bullet" />` to work
 * cross-component. Mount once at the top of <body> in app/layout.tsx.
 *
 * Symbols defined here:
 *   - #woodblock-distress  — display-text distress filter (design.md §3)
 *   - #x-bullet            — list bullet glyph (design.md §5)
 *   - #hand-underline      — emphasis brush stroke (design.md §3)
 *   - #stamp-frame         — Stamp primitive border (design.md §5)
 *   - #skull-badge         — brand mark placeholder (open question §16)
 */
export function DistressSprite() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="0"
      height="0"
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
      aria-hidden="true"
    >
      <defs>
        <filter id="woodblock-distress" x="-2%" y="-2%" width="104%" height="104%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves={2}
            seed={5}
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="1.4"
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.4"
            numOctaves={1}
            seed={9}
            result="grain"
          />
          <feColorMatrix
            in="grain"
            type="matrix"
            values="0 0 0 0 1
                    0 0 0 0 1
                    0 0 0 0 1
                    0 0 0 -0.5 1.05"
            result="grainAlpha"
          />
          <feComposite in="displaced" in2="grainAlpha" operator="in" result="distressed" />
          <feMerge>
            <feMergeNode in="displaced" />
            <feMergeNode in="distressed" />
          </feMerge>
        </filter>

        <symbol id="x-bullet" viewBox="0 0 20 20">
          <path
            d="M3,3 L17,17 M17,3 L3,17"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </symbol>

        <symbol id="hand-underline" viewBox="0 0 200 12" preserveAspectRatio="none">
          <path
            d="M2,8 C40,2 80,11 120,5 S180,9 198,4"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
          />
        </symbol>

        <symbol id="stamp-frame" viewBox="0 0 120 40">
          <rect
            x="2"
            y="2"
            width="116"
            height="36"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <rect
            x="6"
            y="6"
            width="108"
            height="28"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.7"
            strokeDasharray="2 2"
          />
        </symbol>

        <symbol id="skull-badge" viewBox="0 0 64 64">
          {/* Mask: white = visible, black = transparent cutout. Cutouts let
              the page background show through, so the skull works on red,
              paper, or any zone without hardcoding a hole color. */}
          <mask id="skull-mask">
            <rect width="64" height="64" fill="black" />
            <path
              d="M32,4 C18,4 10,14 10,28 C10,34 12,40 16,42 L16,52 L48,52 L48,42 C52,40 54,34 54,28 C54,14 46,4 32,4 Z"
              fill="white"
            />
            <ellipse cx="22" cy="28" rx="4.2" ry="5" fill="black" />
            <ellipse cx="42" cy="28" rx="4.2" ry="5" fill="black" />
            <path d="M29.5,36 L32,42 L34.5,36 Z" fill="black" />
            <rect x="21" y="46" width="3" height="6" fill="black" />
            <rect x="26.5" y="46" width="3" height="6" fill="black" />
            <rect x="32" y="46" width="3" height="6" fill="black" />
            <rect x="37.5" y="46" width="3" height="6" fill="black" />
          </mask>
          {/* Outer ring */}
          <circle cx="32" cy="32" r="29" fill="none" stroke="currentColor" strokeWidth="2" />
          {/* Skull body — masked rect tinted with currentColor */}
          <rect width="64" height="64" fill="currentColor" mask="url(#skull-mask)" />
        </symbol>
      </defs>
    </svg>
  );
}
