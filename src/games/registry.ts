/**
 * registry.ts — the pluggable games catalogue.
 *
 * The Arcade switcher is built FROM this array: it shows only entries with
 * `enabled: true` and lazy-loads the selected game's code on demand (each
 * `load` is a dynamic import → its own JS chunk, zero cost until picked).
 *
 * ── How to add a game ──────────────────────────────────────────────
 *  1. Create src/games/MyGame.tsx with a default-exported React component.
 *  2. Add an entry below: { id, name, description, enabled: true, load }.
 *  3. Done — it appears in the Arcade automatically.
 * ------------------------------------------------------------------
 */
import type { ComponentType } from "react";

export interface GameEntry {
  /** Stable unique id (used for tab state + keys). */
  id: string;
  /** Display name in the switcher. */
  name: string;
  /** One-line description. */
  description: string;
  /** Only enabled games render in the Arcade. */
  enabled: boolean;
  /** Dynamic import of the game module (code-split per game). */
  load: () => Promise<{ default: ComponentType }>;
}

export const games: GameEntry[] = [
  {
    id: "terminal",
    name: "Terminal",
    description: "A fake shell — type `help` to start.",
    enabled: true,
    load: () => import("./TerminalGame"),
  },
  {
    id: "space-invaders",
    name: "Space Invaders",
    description: "Coming soon — a canvas shoot-'em-up.",
    enabled: false, // stub — flip to true once implemented
    load: () => import("./SpaceInvaders"),
  },
  {
    id: "wpm-test",
    name: "WPM Test",
    description: "Coming soon — a typing-speed challenge.",
    enabled: false, // stub — flip to true once implemented
    load: () => import("./WpmTest"),
  },
];
