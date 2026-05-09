/**
 * Zone — the two-zone color rhythm CLAUDE.md §4 enforces.
 * Pages alternate between red and paper zones; primitives adapt their
 * colors based on the surface they're inside.
 *
 * Implementation: surfaces (RedZone / PaperZone — Phase 3) set
 * `data-zone="red"` or `data-zone="paper"` on their root element.
 * CSS attribute selectors in app/globals.css cascade zone-appropriate
 * colors to descendant primitives.
 *
 * Component authors who need the zone in TypeScript (e.g. the OG image
 * route, or tooling) can import this type and the small helper map.
 */

export type Zone = "red" | "paper";

/** Tailwind class name for a zone's foreground text color. */
export const zoneForegroundClass: Record<Zone, string> = {
  red: "text-on-red",
  paper: "text-on-paper",
};

/** Tailwind class name for a zone's background fill. */
export const zoneBackgroundClass: Record<Zone, string> = {
  red: "bg-red-grunge",
  paper: "bg-paper-grain",
};

/** The opposite zone — useful for transition logic in TornEdge (Phase 3). */
export const opposite: Record<Zone, Zone> = {
  red: "paper",
  paper: "red",
};
