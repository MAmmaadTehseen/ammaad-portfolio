"use client";

import { useEffect } from "react";
import type Lenis from "lenis";

declare global {
  interface Window {
    /** The live Lenis instance, when there is one. MenuDialog stops it; Arrival resets it. */
    __lenis?: Lenis;
  }
}

/**
 * Lenis wheel smoothing, for fine pointers with motion allowed. Nobody else
 * downloads it: touch already has a native scroller that beats anything we
 * would add, and a reduced-motion visitor gets the browser's own scroll.
 *
 * `lerp` rather than `duration`: a duration restarts a timed tween on every
 * wheel tick, which stutters under a fast wheel; continuous smoothing keeps
 * one glide that absorbs new input.
 *
 * The rAF loop only runs while there is something to animate. It starts on a
 * wheel event or any scrollTo (Lenis's own anchor handling included) and stops
 * two frames after Lenis goes idle, so a page at rest costs zero frames.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches || !window.matchMedia("(pointer: fine)").matches) return;

    let lenis: Lenis | null = null;
    let cancelled = false;
    let frame = 0;
    let running = false;
    let idle = 0;
    let last = 0;
    // Lenis advances by the gap since its previous frame. After a pause that
    // gap would be seconds and the first frame would jump, so it is fed a
    // clock that only moves while the loop runs, one clamped step at a time.
    let clock = 1;

    const tick = (time: number) => {
      if (!lenis) return;
      clock += last ? Math.min(time - last, 50) : 0;
      last = time;
      lenis.raf(clock);
      if (lenis.isScrolling) idle = 0;
      else if (++idle >= 2) {
        running = false;
        frame = 0;
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    const kick = () => {
      idle = 0;
      if (running || !lenis) return;
      running = true;
      last = 0;
      frame = requestAnimationFrame(tick);
    };

    const destroy = () => {
      window.removeEventListener("wheel", kick);
      reduced.removeEventListener("change", onPreferenceChange);
      cancelAnimationFrame(frame);
      running = false;
      if (lenis) {
        lenis.destroy();
        if (window.__lenis === lenis) delete window.__lenis;
        lenis = null;
      }
    };

    // A reduced-motion preference set mid-session takes effect at once.
    const onPreferenceChange = () => {
      if (reduced.matches) destroy();
    };

    import("lenis").then(({ default: LenisCtor }) => {
      if (cancelled || reduced.matches) return;
      const instance = new LenisCtor({
        lerp: 0.1,
        smoothWheel: true,
        syncTouch: false,
        anchors: { offset: -96 },
        autoRaf: false,
      });
      // Wrap scrollTo on the instance: Lenis calls this.scrollTo for wheel
      // input and anchor clicks, and callers (Arrival) use it directly, so
      // every glide wakes the loop without anyone knowing the loop exists.
      const scrollTo = instance.scrollTo.bind(instance);
      instance.scrollTo = (...args: Parameters<Lenis["scrollTo"]>) => {
        scrollTo(...args);
        kick();
      };
      lenis = instance;
      window.__lenis = instance;
      window.addEventListener("wheel", kick, { passive: true });
      reduced.addEventListener("change", onPreferenceChange);
    });

    return () => {
      cancelled = true;
      destroy();
    };
  }, []);

  return null;
}
