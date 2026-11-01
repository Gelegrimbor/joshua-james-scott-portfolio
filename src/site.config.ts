/**
 * site.config.ts — THE single source of truth for every tunable value.
 *
 * Components and islands read from here. Do NOT hardcode config, copy, URLs,
 * audio paths, or feature flags into JSX/.astro files — change it here once.
 */

/* ------------------------------------------------------------------ *
 * Site metadata (SEO / Open Graph / Twitter)
 * ------------------------------------------------------------------ */
export const SITE = {
  /** Full name — appears in the hero and <title>. */
  name: "Joshua James Scott",
  /** Professional title line, shown under the name. */
  title: "Full Stack Developer + AI & Automation Engineer",
  /** SEO meta / Open Graph description (~150 chars). */
  description:
    "Full stack developer building web apps, n8n automation and AI tools end to end. Laravel, React, n8n, Claude. Kuala Lumpur.",
  /** Canonical site URL. Used for sitemap + OG tags. Set to the real domain when ready. */
  url: "https://joshua-james-scott-portfolio.vercel.app",
  /** Author for meta tags. */
  author: "Joshua James Scott",
  /** Locale for OG tags. */
  locale: "en_GB",
  /** Path (in /public) to the 1200x630 social share image. */
  ogImage: "/og.png",
  /** Twitter/X handle for twitter:site (with @), or empty to omit. */
  twitter: "",
} as const;

/* ------------------------------------------------------------------ *
 * Hero
 * ------------------------------------------------------------------ */
export const HERO = {
  /** Intro paragraph shown under the title (distinct from the SEO description). */
  intro:
    "I build web apps, automations and AI tools end to end, from the interface down to the server.",
  /** The command typed after the ">" prompt (one-time typing effect). */
  promptCommand: "whoami",
  /** Output line rendered after the typing effect completes. Each "·"-separated
      phrase is kept on one line via white-space:nowrap in Hero.astro, so plain
      hyphens are safe (no U+2011, which some phone fonts render as a box). */
  promptOutput:
    "full stack dev · n8n automation · Claude-powered AI · self-hosted infra",
  /** Availability badge shown in the hero. */
  statusBadge: {
    label: "Available for work",
    /** One of the status keys below — drives the pill colour. */
    tone: "live" as StatusTone,
  },
  /** Primary/secondary calls to action. */
  ctas: {
    primaryLabel: "View Projects",
    primaryHref: "#projects",
    secondaryLabel: "Download CV",
    secondaryHref: "/cv.pdf",
  },
} as const;

/* ------------------------------------------------------------------ *
 * "Now building" card shown in the hero (styled like a project card).
 * ------------------------------------------------------------------ */
export const NOW_BUILDING = {
  label: "now building",
  title: "Internal Finance Approval Platform",
  line: "Workflow engine, 9-role RBAC and AI invoice extraction for 5 radio stations.",
  stack: ["Laravel", "MySQL", "Claude API"],
  /** Status tone — renders "In progress" via StatusPill. */
  status: "in-progress" as StatusTone,
} as const;

/* ------------------------------------------------------------------ *
 * Contact + social links (inline SVG icons resolve by `icon` key)
 * ------------------------------------------------------------------ */
export const CONTACT = {
  email: "joshuas1177@gmail.com",
  cvHref: "/cv.pdf",
} as const;

export type SocialIcon = "github" | "linkedin" | "email" | "x";

export interface SocialLink {
  label: string;
  href: string;
  icon: SocialIcon;
}

export const SOCIALS: SocialLink[] = [
  { label: "GitHub", href: "https://github.com/Gelegrimbor", icon: "github" },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/joshua-james-scott-11a616151",
    icon: "linkedin",
  },
  { label: "Email", href: "mailto:joshuas1177@gmail.com", icon: "email" },
];

/* ------------------------------------------------------------------ *
 * Navigation (anchored, single-page)
 * ------------------------------------------------------------------ */
export interface NavLink {
  /** Zero-padded index shown as a mono label, e.g. "01". */
  index: string;
  label: string;
  href: string;
}

export const NAV_LINKS: NavLink[] = [
  { index: "01", label: "About", href: "#about" },
  { index: "02", label: "Experience", href: "#experience" },
  { index: "03", label: "Projects", href: "#projects" },
  { index: "04", label: "Skills", href: "#skills" },
  { index: "05", label: "Arcade", href: "#arcade" },
  { index: "06", label: "Contact", href: "#contact" },
];

/* ------------------------------------------------------------------ *
 * Status pill tones (keys must match project schema `status` enum)
 * ------------------------------------------------------------------ */
export type StatusTone = "live" | "in-progress" | "prototype" | "private";

export const STATUS_LABELS: Record<StatusTone, string> = {
  live: "Live",
  "in-progress": "In progress",
  prototype: "Prototype",
  private: "Private",
};

/* ------------------------------------------------------------------ *
 * Background audio player (React island, client:idle)
 * ------------------------------------------------------------------ */
export const AUDIO = {
  enabled: true,
  track: "/audio/expectation.mp3",
  label: "Expectation",
  /** Album art (in /public). Leave "" to fall back to a plain play button. */
  cover: "/audio/expectation-cover.jpg",
  defaultVolume: 0.5,
} as const;

/* ------------------------------------------------------------------ *
 * Games / Arcade (the registry in src/games/registry.ts drives the UI;
 * these are just global on/off switches referenced by that registry).
 * ------------------------------------------------------------------ */
export const ARCADE = {
  /** Master switch — set false to hide the Arcade section entirely. */
  enabled: true,
} as const;

/* ------------------------------------------------------------------ *
 * Scroll behaviour (src/scripts/smooth-scroll.ts). Both default on;
 * flip either off here without touching code. Always off under
 * prefers-reduced-motion regardless of these flags.
 * ------------------------------------------------------------------ */
export const SCROLL = {
  /** Lenis inertial smooth scrolling (wheel). */
  smooth: true,
  /** One-shot hero↔About wheel/trackpad glide (desktop only). */
  heroGlide: true,
} as const;
