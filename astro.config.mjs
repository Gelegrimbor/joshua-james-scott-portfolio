// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

import { SITE } from "./src/site.config.ts";

// https://astro.build/config
// Static output (default). Vercel auto-detects Astro and serves `dist/` with
// zero config — no SSR adapter needed. See README → "Deploy to Vercel".
export default defineConfig({
  site: SITE.url,
  integrations: [
    react(),
    mdx(),
    sitemap(),
  ],
  // Tailwind CSS v4 via the official Vite plugin (NOT the legacy @astrojs/tailwind
  // integration). Tokens/utilities are configured in src/styles/global.css.
  vite: {
    plugins: [tailwindcss()],
  },
});
