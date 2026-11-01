/**
 * Arcade.tsx — the games switcher (React island, mounted client:visible).
 *
 * Built entirely FROM src/games/registry.ts: shows only enabled games and
 * lazy-loads the selected game's chunk on demand. Each game renders inside its
 * own island boundary, so a bug in one can't take down the page.
 */
import {
  Suspense,
  lazy,
  useMemo,
  useState,
  type ComponentType,
} from "react";
import { games } from "../../games/registry";

export default function Arcade() {
  const enabled = useMemo(() => games.filter((g) => g.enabled), []);
  const [activeId, setActiveId] = useState<string>(enabled[0]?.id ?? "");

  // Create one lazy component per enabled game (memoized so state survives).
  const lazyComponents = useMemo(() => {
    const map: Record<string, ComponentType> = {};
    for (const g of enabled) map[g.id] = lazy(g.load);
    return map;
  }, [enabled]);

  if (enabled.length === 0) {
    return (
      <p className="rounded-card border border-dashed border-border bg-surface/50 px-6 py-10 text-center font-mono text-sm text-text">
        No games enabled — flip one to{" "}
        <span className="text-accent">enabled: true</span> in{" "}
        <span className="text-heading">src/games/registry.ts</span>.
      </p>
    );
  }

  const Active = lazyComponents[activeId];
  const activeMeta = enabled.find((g) => g.id === activeId);

  return (
    <div>
      {/* Switcher — only when there's more than one game to choose from */}
      {enabled.length > 1 && (
        <div
          className="mb-5 flex flex-wrap gap-2"
          role="tablist"
          aria-label="Choose a game"
        >
          {enabled.map((g) => {
            const isActive = g.id === activeId;
            return (
              <button
                key={g.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveId(g.id)}
                className={
                  "rounded-md border px-3.5 py-1.5 font-mono text-xs transition-colors duration-200 " +
                  (isActive
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border text-text hover:border-accent/50 hover:text-heading")
                }
              >
                {g.name}
              </button>
            );
          })}
        </div>
      )}

      {activeMeta && (
        <p className="mb-4 font-mono text-xs text-text">
          {activeMeta.description}
        </p>
      )}

      <Suspense
        fallback={
          <div className="card flex h-40 items-center justify-center font-mono text-sm text-text">
            loading {activeMeta?.name ?? "game"}…
          </div>
        }
      >
        {Active ? <Active /> : null}
      </Suspense>
    </div>
  );
}
