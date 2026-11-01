# Joshua James Scott — Portfolio

A single-page developer portfolio with a "refined dev-terminal" aesthetic:
dark-first, editorial spacing, monospace as an accent. Structure, design system,
interactive systems, and content are all in place; see the content model below
for how to keep it updated.

## Stack

- **Astro 5** + **TypeScript** (strict) — static output, zero-JS by default
- **Tailwind CSS v4** via `@tailwindcss/vite` (not the legacy integration)
- **React islands** for the only interactive bits, all lazy-loaded:
  - Project filter (`client:visible`)
  - Background audio player (`client:idle`)
  - Arcade / games switcher (`client:visible`)
- Self-hosted variable fonts (Fontsource): Space Grotesk, Inter, JetBrains Mono
- `@astrojs/mdx`, `@astrojs/react`, `@astrojs/sitemap`

## Getting started

```bash
npm install
npm run dev      # local dev server
npm run build    # static build → dist/
npm run preview  # preview the production build
npm run check    # astro check (TypeScript / content diagnostics)
```

## Project structure

```
src/
  site.config.ts        # ← ALL tunables: meta, socials, audio, feature flags
  content.config.ts     # projects collection schema (Content Layer API)
  content/projects/     # project entries (.mdx)
  data/                 # experience.ts, skills.ts (typed placeholder data)
  styles/global.css     # design tokens defined ONCE (colours, fonts, motion)
  layouts/BaseLayout.astro
  components/           # static .astro sections + shared pieces
    islands/            # React islands (ProjectFilter, AudioPlayer, Arcade)
  games/                # registry.ts + one game per file
  pages/index.astro     # assembles the page
public/                 # favicon, og image, cv.pdf, audio/
```

The design system lives in **one place**: `src/styles/global.css`. Colours are
semantic CSS variables (`--bg`, `--accent`, …) mapped to Tailwind utilities via
`@theme inline`, so light/dark toggling and every component read the same tokens.
**Never hardcode a hex, font, or shadow in a component** — add or use a token.

## How to add a project

Drop a new `.mdx` file into `src/content/projects/`. It must satisfy the schema
in `src/content.config.ts`:

```mdx
---
title: "My Project"
category: "Dev"          # Dev | Automation | DevOps | AI App
date: 2025-06-01
stack: ["Astro", "TypeScript"]
summary: "One or two sentences about it."
highlights:
  - "A notable thing."
demoUrl: "https://…"     # optional
sourceUrl: "https://…"   # optional
status: "live"           # live | in-progress | prototype | private
featured: true
---

Optional longer write-up (MDX).
```

It appears in the Projects grid automatically (featured items first, then
newest). No code change needed.

## How to add a game

1. Create `src/games/MyGame.tsx` with a **default-exported** React component.
2. Add an entry to `src/games/registry.ts`:

   ```ts
   {
     id: "my-game",
     name: "My Game",
     description: "One line.",
     enabled: true,
     load: () => import("./MyGame"),
   }
   ```

3. That's it — the Arcade switcher builds itself from the registry and
   lazy-loads your game's chunk only when selected.

**If your game has an animation loop:** use `requestAnimationFrame`, cap the
frame rate, and pause on `visibilitychange`. Each game is sandboxed in its own
island, so a bug can't break the rest of the page. See the `SpaceInvaders` /
`WpmTest` stubs for the disabled-entry pattern.

## Swap the audio track

1. Put an audio file in `public/audio/` (e.g. `theme.mp3`).
2. Change one line in `src/site.config.ts`:

   ```ts
   export const AUDIO = {
     enabled: true,
     track: "/audio/theme.mp3", // ← here
     label: "Track name",
     defaultVolume: 0.5,
   };
   ```

The player **never autoplays** — it starts paused and only plays after a click.
Set `enabled: false` to remove it entirely.

## Deploy to Vercel

This is a **static** site — no adapter needed. Vercel auto-detects Astro:

1. Push the repo to GitHub/GitLab/Bitbucket.
2. Import it in Vercel. It detects Astro and uses:
   - Build command: `astro build` (or `npm run build`)
   - Output directory: `dist`
3. Set the real domain, then update `SITE.url` in `src/site.config.ts` (used for
   canonical URLs + the sitemap) and the `Sitemap:` line in `public/robots.txt`.

No environment variables, backend, or database required.

## Before it goes live — replace the placeholders

- `src/site.config.ts` — name is set; fill description, socials, email, CV path,
  hero copy, status.
- `src/data/experience.ts` and `src/data/skills.ts` — real entries.
- `src/content/projects/*.mdx` — real projects (delete the placeholders).
- `public/cv.pdf` — real CV (a placeholder PDF ships so the link resolves).
- `public/og.png` (1200×630) and `public/apple-touch-icon.png` — real images
  (solid-colour placeholders ship so nothing 404s).
- `public/audio/theme.mp3` — the real track.

## Accessibility & performance notes

- Semantic HTML, visible keyboard focus (never removed), AA-contrast tokens,
  SVG icons (no emoji), `prefers-reduced-motion` fully respected.
- Zero JS by default; islands are lazy-loaded; images via `astro:assets`.
- Dark is the default theme; the toggle respects `prefers-color-scheme` and
  persists the choice in `localStorage` (with a no-flash pre-paint script).
