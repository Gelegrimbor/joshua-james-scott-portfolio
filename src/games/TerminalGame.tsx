/**
 * TerminalGame.tsx — a fake ">_" terminal (pure DOM, no animation loop).
 *
 * Commands: help, about, projects, contact, skills, experience, clear.
 * Nav commands scroll to that section. One hidden easter-egg command exists
 * (not listed in `help`). The whole handler is wrapped in try/catch so a bad
 * command can never break the page.
 */
import { useEffect, useRef, useState } from "react";
import { SITE } from "../site.config";

type LineTone = "prompt" | "output" | "accent" | "muted" | "error";
interface Line {
  id: number;
  tone: LineTone;
  text: string;
}

let lineId = 0;
const mk = (tone: LineTone, text: string): Line => ({
  id: lineId++,
  tone,
  text,
});

const WELCOME: Line[] = [
  mk("accent", `${SITE.name.toLowerCase().replace(/\s+/g, "-")} : ~$ session started`),
  mk("muted", "Type `help` and press Enter to see available commands."),
];

/** Sections a nav command can jump to. */
const SECTIONS: Record<string, string> = {
  about: "about",
  experience: "experience",
  projects: "projects",
  skills: "skills",
  contact: "contact",
};

const VISIBLE_COMMANDS = [
  ["help", "list commands"],
  ["about", "who is this"],
  ["projects", "jump to projects"],
  ["experience", "jump to experience"],
  ["skills", "jump to skills"],
  ["contact", "jump to contact"],
  ["clear", "clear the screen"],
];

export default function TerminalGame() {
  const [history, setHistory] = useState<Line[]>(WELCOME);
  const [value, setValue] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Keep the view pinned to the latest output.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [history]);

  function scrollToSection(id: string) {
    try {
      const lenis = (window as unknown as { lenis?: { scrollTo: (t: string, o?: object) => void } })
        .lenis;
      if (lenis) {
        lenis.scrollTo("#" + id, { offset: -80, duration: 0.9 });
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }
    } catch {
      /* no-op */
    }
  }

  function run(raw: string): Line[] {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return [];

    // Nav + info commands
    if (cmd === "help") {
      return [
        mk("output", "available commands:"),
        ...VISIBLE_COMMANDS.map(([c, d]) => mk("muted", `  ${c.padEnd(12)} ${d}`)),
      ];
    }
    if (cmd === "about") {
      scrollToSection("about");
      return [
        mk("output", `${SITE.name} — ${SITE.title}.`),
        mk("muted", "→ scrolling to About"),
      ];
    }
    if (cmd in SECTIONS) {
      scrollToSection(SECTIONS[cmd]);
      return [mk("muted", `→ scrolling to ${cmd}`)];
    }
    if (cmd === "whoami") {
      return [mk("output", SITE.name)];
    }
    if (cmd === "clear") {
      // handled by caller (returns sentinel)
      return [mk("output", "__CLEAR__")];
    }

    // Hidden easter-egg (intentionally not in `help`)
    if (cmd === "xyzzy") {
      return [
        mk("accent", "A hollow voice says: 'fool.'"),
        mk("muted", "( nothing happens — but you found the secret )"),
      ];
    }
    if (cmd === "sudo") {
      return [mk("error", "sudo: permission denied — nice try :)")];
    }

    return [
      mk("error", `command not found: ${cmd}`),
      mk("muted", "type `help` for options"),
    ];
  }

  function submit() {
    const entered = value;
    setValue("");
    try {
      const echo = mk("prompt", `> ${entered}`);
      const out = run(entered);
      if (out.some((l) => l.text === "__CLEAR__")) {
        setHistory([]);
        return;
      }
      setHistory((h) => [...h, echo, ...out]);
    } catch {
      setHistory((h) => [...h, mk("error", "internal error — command aborted")]);
    }
  }

  const toneClass: Record<LineTone, string> = {
    prompt: "text-heading",
    output: "text-heading",
    accent: "text-accent",
    muted: "text-text",
    error: "text-status-in-progress",
  };

  return (
    <div
      className="card overflow-hidden font-mono text-sm"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Title bar */}
      <div className="flex items-center gap-1.5 border-b border-border px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-status-private" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-status-in-progress" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-status-live" aria-hidden="true" />
        <span className="ml-2 text-xs text-text">terminal — bash</span>
      </div>

      {/* Output */}
      <div
        ref={scrollRef}
        className="h-72 overflow-y-auto px-4 py-3"
        aria-live="polite"
        aria-label="Terminal output"
        data-lenis-prevent
      >
        {history.map((line) => (
          <p key={line.id} className={`whitespace-pre-wrap ${toneClass[line.tone]}`}>
            {line.text}
          </p>
        ))}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="flex items-center gap-2 border-t border-border px-4 py-2.5"
      >
        <span className="select-none text-accent">&gt;</span>
        <label className="sr-only" htmlFor="terminal-input">
          Terminal command input
        </label>
        <input
          id="terminal-input"
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          placeholder="type a command…"
          className="w-full bg-transparent text-heading outline-none placeholder:text-text/60"
        />
      </form>
    </div>
  );
}
