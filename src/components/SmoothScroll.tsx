"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Lenis wheel smoothing.
 *
 * Uses `lerp` rather than `duration`: duration restarts a timed tween on every
 * wheel tick, which stutters under a fast scroll wheel. Continuous exponential
 * smoothing keeps a single glide that absorbs new input instead of fighting it.
 *
 * Disabled outright for reduced-motion users, and left off for touch, where the
 * native scroller already beats anything we would add.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    const lenis = new Lenis({
      lerp: 0.085,
      wheelMultiplier: 1,
      smoothWheel: true,
      syncTouch: false,
      overscroll: false,
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    // in-page anchors go through Lenis so the easing matches everything else
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey) return;
      const anchor = (event.target as HTMLElement | null)?.closest?.('a[href^="#"]');
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target as HTMLElement, {
        offset: -72,
        duration: 1.35,
        easing: (t: number) => 1 - Math.pow(1 - t, 5),
      });
    };
    document.addEventListener("click", onClick);

    // a reduced-motion preference set mid-session should take effect at once
    const onPreferenceChange = () => {
      if (reduced.matches) lenis.destroy();
    };
    reduced.addEventListener("change", onPreferenceChange);

    return () => {
      document.removeEventListener("click", onClick);
      reduced.removeEventListener("change", onPreferenceChange);
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}
