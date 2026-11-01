/**
 * ProjectFilter.tsx — the interactive centrepiece (React island, client:visible).
 *
 * Receives already-sorted (featured-first) project data as props from
 * Projects.astro and lets the user filter by category. Card markup + the
 * status pill live here so the island fully owns its DOM (no hydration
 * mismatch). Colours come from CSS tokens via inline vars — no hardcoded hex.
 */
import { useMemo, useState, type CSSProperties } from "react";

export type ProjectCategory = "Dev" | "Automation" | "DevOps" | "AI App";
export type ProjectStatus = "live" | "in-progress" | "prototype" | "private";

export interface ProjectItem {
  slug: string;
  title: string;
  category: ProjectCategory;
  summary: string;
  highlights: string[];
  stack: string[];
  status: ProjectStatus;
  featured: boolean;
  demoUrl?: string;
  sourceUrl?: string;
}

interface Props {
  projects: ProjectItem[];
}

/** Canonical category order (matches the brief). "All" is prepended. */
const CATEGORIES: ProjectCategory[] = ["Dev", "Automation", "DevOps", "AI App"];

const STATUS_LABELS: Record<ProjectStatus, string> = {
  live: "Live",
  "in-progress": "In progress",
  prototype: "Prototype",
  private: "Private",
};

const easeOut = "cubic-bezier(0.22,1,0.36,1)";

function StatusPill({ status }: { status: ProjectStatus }) {
  const color = `var(--status-${status})`;
  return (
    <span
      className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-1 font-mono text-[0.6875rem] leading-none tracking-wide"
      style={
        {
          color,
          background: `color-mix(in srgb, ${color} 12%, transparent)`,
          borderColor: `color-mix(in srgb, ${color} 30%, transparent)`,
        } as CSSProperties
      }
    >
      <span
        className="h-[0.45rem] w-[0.45rem] rounded-full"
        style={{ background: color }}
        aria-hidden="true"
      />
      {STATUS_LABELS[status]}
    </span>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17 17 7M7 7h10v10" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m16 18 6-6-6-6M8 6l-6 6 6 6" />
    </svg>
  );
}

function ProjectCard({ project, index }: { project: ProjectItem; index: number }) {
  return (
    <article
      className="card card-hover flex h-full flex-col p-6"
      style={{
        animation: `fade-rise var(--duration-base) ${easeOut} both`,
        animationDelay: `${index * 45}ms`,
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="font-mono text-xs text-accent">{project.category}</span>
        <StatusPill status={project.status} />
      </div>

      <h3 className="mt-3 font-display text-lg font-semibold text-heading">
        {project.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-text">{project.summary}</p>

      {project.highlights.length > 0 && (
        <ul className="mt-3 space-y-1.5" role="list">
          {project.highlights.slice(0, 3).map((h, i) => (
            <li
              key={`${h}-${i}`}
              className="relative pl-4 text-xs leading-relaxed text-text"
            >
              <span
                className="absolute left-0 top-[0.45rem] h-1 w-1 rounded-full bg-accent/70"
                aria-hidden="true"
              />
              {h}
            </li>
          ))}
        </ul>
      )}

      {/* Footer (stack + links) pinned to the bottom so rows align neatly */}
      <div className="mt-auto pt-4">
        {project.stack.length > 0 && (
          <ul className="flex flex-wrap gap-1.5" role="list">
            {project.stack.map((tech, i) => (
              <li
                key={`${tech}-${i}`}
                className="rounded border border-border bg-bg px-1.5 py-0.5 font-mono text-[0.7rem] text-text"
              >
                {tech}
              </li>
            ))}
          </ul>
        )}

        {(project.demoUrl || project.sourceUrl) && (
          <div className="mt-4 flex items-center gap-4 border-t border-border pt-4">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-text transition-colors hover:text-accent"
              >
                <ArrowIcon /> Demo
              </a>
            )}
            {project.sourceUrl && (
              <a
                href={project.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-text transition-colors hover:text-accent"
              >
                <CodeIcon /> Source
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export default function ProjectFilter({ projects }: Props) {
  const [active, setActive] = useState<"All" | ProjectCategory>("All");

  const counts = useMemo(() => {
    const map: Record<string, number> = { All: projects.length };
    for (const c of CATEGORIES) {
      map[c] = projects.filter((p) => p.category === c).length;
    }
    return map;
  }, [projects]);

  const filtered = useMemo(
    () =>
      active === "All"
        ? projects
        : projects.filter((p) => p.category === active),
    [projects, active],
  );

  const tabs: Array<"All" | ProjectCategory> = ["All", ...CATEGORIES];

  return (
    <div>
      {/* Filter controls */}
      <div
        className="mb-8 flex flex-wrap gap-2"
        role="tablist"
        aria-label="Filter projects by category"
      >
        {tabs.map((tab) => {
          const isActive = active === tab;
          return (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(tab)}
              className={
                "inline-flex items-center gap-2 rounded-md border px-3.5 py-1.5 font-mono text-xs transition-colors duration-200 " +
                (isActive
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-text hover:border-accent/50 hover:text-heading")
              }
            >
              {tab}
              <span className="opacity-60">{counts[tab] ?? 0}</span>
            </button>
          );
        })}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div
          key={active}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      ) : (
        <p className="rounded-card border border-dashed border-border bg-surface/50 px-6 py-12 text-center font-mono text-sm text-text">
          No projects in <span className="text-accent">{active}</span> yet.
        </p>
      )}
    </div>
  );
}
