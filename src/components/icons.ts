/**
 * icons.ts — inline SVG icon paths (no emoji, no icon font).
 * Kept as a plain module (not in .astro frontmatter) so the SVG markup in
 * these strings is never mistaken for template HTML by the compiler.
 *
 * Add an icon: extend IconName and ICONS with a { kind, body } entry.
 * `kind: "fill"` renders filled (brand marks); `kind: "stroke"` renders as a
 * 2px currentColor stroke (UI glyphs).
 */
export type IconName =
  | "github"
  | "linkedin"
  | "x"
  | "email"
  | "sun"
  | "moon"
  | "arrow-up-right"
  | "download"
  | "external"
  | "terminal"
  | "chevron-down";

export type IconDef = { kind: "stroke" | "fill"; body: string };

export const ICONS: Record<IconName, IconDef> = {
  github: {
    kind: "fill",
    body: `<path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.36-3.88-1.36-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z"/>`,
  },
  linkedin: {
    kind: "fill",
    body: `<path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z"/>`,
  },
  x: {
    kind: "fill",
    body: `<path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.4l-5.8-7.58-6.64 7.58H.47l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93Zm-1.29 19.5h2.04L6.48 3.24H4.29l13.32 17.4Z"/>`,
  },
  email: {
    kind: "stroke",
    body: `<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>`,
  },
  sun: {
    kind: "stroke",
    body: `<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>`,
  },
  moon: {
    kind: "stroke",
    body: `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/>`,
  },
  "arrow-up-right": {
    kind: "stroke",
    body: `<path d="M7 17 17 7M7 7h10v10"/>`,
  },
  download: {
    kind: "stroke",
    body: `<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>`,
  },
  external: {
    kind: "stroke",
    body: `<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>`,
  },
  terminal: {
    kind: "stroke",
    body: `<path d="m4 17 6-6-6-6M12 19h8"/>`,
  },
  "chevron-down": {
    kind: "stroke",
    body: `<path d="m6 9 6 6 6-6"/>`,
  },
};
