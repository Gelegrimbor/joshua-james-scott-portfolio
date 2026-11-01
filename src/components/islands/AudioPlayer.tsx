/**
 * AudioPlayer.tsx — floating background-audio pill (React island, client:idle).
 *
 * Hard rules honoured:
 *  - Starts PAUSED. Audio only plays after the user clicks play. Never autoplays.
 *  - Volume + last play-intent persisted in localStorage (try/catch; safe if
 *    storage is blocked). We restore VOLUME on load but never auto-start sound.
 *  - Pauses when the tab is hidden (visibilitychange).
 *  - Track path/label come from site.config (AUDIO). No file ships in the
 *    skeleton — until a real .mp3 is dropped into /public/audio/, the player
 *    renders and shows a "no track" note instead of erroring.
 */
import { useEffect, useRef, useState } from "react";
import { AUDIO } from "../../site.config";

const LS_VOLUME = "audio:volume";
const LS_PLAYING = "audio:playing"; // persisted intent (not auto-resumed)

/** Album art path from config (optional — "" / missing falls back to a plain button). */
const COVER = (AUDIO as unknown as { cover?: string }).cover ?? "";
const HAS_COVER = COVER.length > 0;

function readVolume(): number {
  try {
    const v = localStorage.getItem(LS_VOLUME);
    if (v !== null) {
      const n = Number(v);
      if (Number.isFinite(n) && n >= 0 && n <= 1) return n;
    }
  } catch {
    /* storage blocked */
  }
  return AUDIO.defaultVolume;
}

function persist(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage blocked — non-fatal */
  }
}

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [playing, setPlaying] = useState(false); // always start paused
  const [volume, setVolume] = useState<number>(AUDIO.defaultVolume);
  const [unavailable, setUnavailable] = useState(false);
  const [expanded, setExpanded] = useState(false); // compact by default
  const [coverError, setCoverError] = useState(false); // cover 404 → plain button
  const showCover = HAS_COVER && !coverError;

  // Collapse when tapping/clicking outside (mobile: closes the expanded panel).
  useEffect(() => {
    if (!expanded) return;
    function onDown(e: PointerEvent) {
      const el = containerRef.current;
      if (el && !el.contains(e.target as Node)) setExpanded(false);
    }
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [expanded]);

  // Restore volume (not playback) once mounted.
  useEffect(() => {
    const v = readVolume();
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  }, []);

  // Pause when the tab is hidden.
  useEffect(() => {
    function onVisibility() {
      if (document.hidden && audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        setPlaying(false);
        persist(LS_PLAYING, "false");
      }
    }
    document.addEventListener("visibilitychange", onVisibility);
    return () =>
      document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  async function toggle() {
    const el = audioRef.current;
    if (!el || unavailable) return;
    if (playing) {
      el.pause();
      setPlaying(false);
      persist(LS_PLAYING, "false");
    } else {
      try {
        await el.play();
        setPlaying(true);
        persist(LS_PLAYING, "true");
      } catch {
        // Blocked or missing source — surface as unavailable, stay paused.
        setUnavailable(true);
        setPlaying(false);
      }
    }
  }

  function onVolume(e: React.ChangeEvent<HTMLInputElement>) {
    const v = Number(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
    persist(LS_VOLUME, String(v));
  }

  return (
    <div
      ref={containerRef}
      className="fixed bottom-4 right-4 z-40"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      onFocusCapture={() => setExpanded(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setExpanded(false);
        }
      }}
    >
      <audio
        ref={audioRef}
        src={AUDIO.track}
        loop
        preload="none"
        onError={() => setUnavailable(true)}
      />
      <div className="flex items-center rounded-full border border-border bg-surface/95 p-1.5 shadow-lg backdrop-blur">
        {/* Expandable panel — label + volume, revealed to the LEFT of the button */}
        <div
          className={
            "flex items-center gap-2 overflow-hidden whitespace-nowrap transition-all duration-300 ease-out " +
            (expanded
              ? "mr-2 max-w-[260px] pl-1 opacity-100"
              : "max-w-0 opacity-0 pointer-events-none")
          }
        >
          {showCover && (
            <img
              src={COVER}
              alt=""
              width={32}
              height={32}
              loading="lazy"
              onError={() => setCoverError(true)}
              className="h-8 w-8 shrink-0 rounded object-cover"
            />
          )}
          <div className="flex flex-col">
            <span className="font-mono text-[0.7rem] leading-tight text-heading">
              {unavailable ? "no track" : AUDIO.label}
            </span>
            <span className="font-mono text-[0.6rem] leading-tight text-text">
              {unavailable ? "track unavailable" : "background audio"}
            </span>
          </div>

          <label className="flex items-center">
            <span className="sr-only">Volume</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={onVolume}
              disabled={unavailable}
              tabIndex={expanded ? 0 : -1}
              className="audio-range h-1 w-16 cursor-pointer appearance-none rounded-full disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                background: `linear-gradient(to right, var(--accent) ${volume * 100}%, var(--border) ${volume * 100}%)`,
              }}
              aria-label="Background audio volume"
            />
          </label>
        </div>

        <div
          className={
            "relative shrink-0 " + (playing && showCover ? "is-playing" : "")
          }
        >
          {/* Pulsing teal glow ring (behind the button; only while playing) */}
          {showCover && (
            <span className="vinyl-glow" aria-hidden="true" />
          )}
          <button
            type="button"
            onClick={() => {
              setExpanded(true);
              void toggle();
            }}
            disabled={unavailable}
            aria-label={
              playing ? "Pause background audio" : "Play background audio"
            }
            aria-pressed={playing}
            className={
              "relative z-10 flex h-11 w-11 items-center justify-center overflow-hidden rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:h-14 sm:w-14 " +
              (showCover
                ? "bg-surface"
                : "bg-accent text-accent-contrast hover:bg-accent-hover")
            }
          >
            {showCover && (
              <img
                src={COVER}
                alt={`${AUDIO.label} cover art`}
                width={56}
                height={56}
                loading="lazy"
                onError={() => setCoverError(true)}
                className="vinyl absolute inset-0 h-full w-full object-cover"
              />
            )}
            {/* Play/pause icon — dark scrim over the cover keeps it readable */}
            <span
              className={
                "relative flex h-full w-full items-center justify-center " +
                (showCover ? "bg-black/35 text-white" : "")
              }
            >
              {playing ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <rect x="6" y="5" width="4" height="14" rx="1" />
                  <rect x="14" y="5" width="4" height="14" rx="1" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14Z" />
                </svg>
              )}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
