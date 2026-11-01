/**
 * content.config.ts — Astro 5 Content Layer API (glob loader).
 *
 * This is the CURRENT collections API (src/content.config.ts + glob loader),
 * NOT the legacy src/content/config.ts approach.
 *
 * To add a project: drop a new .mdx file into src/content/projects/ that
 * satisfies the schema below. No code change needed.
 */
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    category: z.enum(["Dev", "Automation", "DevOps", "AI App"]),
    /** Coerced so `date: 2025-01-01` (YAML date) or a string both work. */
    date: z.coerce.date(),
    stack: z.array(z.string()),
    /** 1–2 sentence summary shown on the card. */
    summary: z.string(),
    highlights: z.array(z.string()).default([]),
    demoUrl: z.string().url().optional(),
    sourceUrl: z.string().url().optional(),
    status: z.enum(["live", "in-progress", "prototype", "private"]),
    featured: z.boolean().default(false),
  }),
});

export const collections = { projects };
