/**
 * smooth-scroll.ts — site-wide inertial scrolling (Lenis) + a one-shot
 * hero↔About glide on desktop wheel/trackpad.
 *
 * Loaded once from BaseLayout. Fully disabled under prefers-reduced-motion
 * (and via SCROLL flags in site.config.ts): no Lenis, no glide, no anchor
 * interception (native instant jumps instead).
 *
 * Lenis drives the real document scroll, so the CSS scroll-driven hero fade
 * (`animation-timeline: scroll(root)`) and the IntersectionObserver reveals
 * keep working with no changes. Touch stays native (syncTouch: false);
 * keyboard (Space/PageDown/arrows) stays native (Lenis binds no keydown).
 */
import Lenis from "lenis";
import { SCROLL } from "../site.config";

/** Matches `scroll-padding-top: 5rem` so headings clear the sticky nav. */
const NAV_OFFSET = -80;
const GLIDE_DURATION = 0.9; // seconds
const easeOutExpo = (t: number): number =>
  t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);

function init(): void {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !SCROLL.smooth) return;

  const lenis = new Lenis({
    duration: 1.1,
    smoothWheel: true,
    syncTouch: false, // native touch scrolling on mobile
  });
  (window as unknown as { lenis: Lenis }).lenis = lenis;

  const raf = (time: number): void => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);

  /* -------- In-page anchors glide via Lenis (nav links, scroll cue, …) ----- */
  document.addEventListener("click", (e) => {
    const anchor = (e.target as Element)?.closest?.('a[href^="#"]');
    if (!anchor) return;
    const href = anchor.getAttribute("href");
    if (!href || href === "#") return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target as HTMLElement, { offset: NAV_OFFSET, duration: 0.9 });
  });

  /* -------- Hero ↔ About glide (desktop wheel/trackpad only) --------------- */
  if (!SCROLL.heroGlide) return;

  const about = document.getElementById("about");
  const hero = document.getElementById("top");
  if (!about || !hero) return;

  let gliding = false;
  /** Momentum guard: ignore glide triggers (but allow normal scroll) until this time. */
  let glideCooldownUntil = 0;

  /**
   * Absolute document top of an element from LAYOUT only (offsetTop chain) —
   * never getBoundingClientRect, which includes the reveal-animation transform
   * and would make the glide land a few px short and re-trigger forever.
   */
  function absTop(el: HTMLElement): number {
    let y = 0;
    let node: HTMLElement | null = el;
    while (node) {
      y += node.offsetTop;
      node = node.offsetParent as HTMLElement | null;
    }
    return y;
  }

  function startGlide(targetY: number): void {
    gliding = true;

    let released = false;
    const release = (): void => {
      if (released) return;
      released = true;
      gliding = false;
      glideCooldownUntil = performance.now() + 400; // (4) momentum cooldown
      // In case Lenis was left stopped for any reason, resume it.
      if (lenis.isStopped) lenis.start();
    };

    // NOTE: no `lock` — my capture handler already blocks wheel while gliding,
    // so the glide can't be interrupted, and Lenis never gets stuck locked.
    // Target is a NUMBER (layout-based), so Lenis also avoids getBoundingClientRect.
    lenis.scrollTo(targetY, {
      duration: GLIDE_DURATION,
      easing: easeOutExpo,
      onComplete: release,
    });

    // Safety net: always release even if onComplete never fires.
    window.setTimeout(release, GLIDE_DURATION * 1000 + 250);
  }

  /** Start a glide only if it would actually move the page (>= 40px). */
  function tryGlide(e: WheelEvent, targetY: number): void {
    if (Math.abs(targetY - window.scrollY) < 40) return; // (2) no no-op glides
    startGlide(targetY); // sets gliding = true
    e.preventDefault();
    e.stopImmediatePropagation();
  }

  function onWheel(e: WheelEvent): void {
    // (1) pinch-zoom / Ctrl+wheel zoom — leave untouched.
    if (e.ctrlKey) return;

    // Block wheel ONLY while a glide is in progress (never otherwise).
    if (gliding) {
      e.preventDefault();
      e.stopImmediatePropagation();
      return;
    }

    // (4) During the post-glide cooldown, don't trigger a new glide, but let
    // the wheel flow to Lenis for normal scrolling.
    if (performance.now() < glideCooldownUntil) return;

    // If the hero is taller than the viewport, don't glide — let the user
    // scroll through the hero content normally.
    if (hero!.offsetHeight > window.innerHeight + 20) return;

    const y = window.scrollY;
    const aboutY = absTop(about!) + NAV_OFFSET; // layout-based landing position

    if (e.deltaY > 0 && y < aboutY - 40) {
      // (3) Scrolling down inside the hero → glide to About.
      tryGlide(e, aboutY);
    } else if (e.deltaY < 0 && y > 2 && y <= aboutY + 40) {
      // (3) Scrolling up at/near About's top → glide back to the hero top.
      tryGlide(e, 0);
    }
    // Otherwise: do nothing — Lenis handles normal scrolling.
  }

  // Capture phase so we run before Lenis's own wheel handler and can stop it.
  window.addEventListener("wheel", onWheel, { passive: false, capture: true });
}

init();
