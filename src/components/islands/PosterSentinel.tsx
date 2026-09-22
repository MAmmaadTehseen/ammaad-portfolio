"use client";

import { useEffect, useRef } from "react";

/**
 * Stops painting the case poster once the sheet has covered it (effect #21).
 *
 * The poster is fixed from 1024px up, so without this it would keep being
 * composited, and its scroll-linked sink kept ticking, behind an opaque sheet
 * for the rest of a long page. This renders a 1px marker at the sheet's top
 * edge: once that edge has passed the top of the viewport the sheet fills the
 * whole screen, so the poster gets data-covered (visibility: hidden in CSS).
 * Scrolling back up clears it again.
 *
 * It must sit inside the positioned .case-sheet, and the poster must share an
 * <article> with it. Without JS or IntersectionObserver nothing is hidden;
 * the sheet still covers the poster and the wrapper's clip keeps it off
 * everything after the article.
 */
export default function PosterSentinel() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const marker = ref.current;
    const poster = marker
      ?.closest("article")
      ?.querySelector<HTMLElement>(".case-poster");
    if (!marker || !poster || typeof IntersectionObserver === "undefined")
      return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry) return;
      // above the viewport rather than below it: below means the reader is
      // still in the header, where the poster is the point
      const covered = !entry.isIntersecting && entry.boundingClientRect.top < 0;
      poster.toggleAttribute("data-covered", covered);
    });
    observer.observe(marker);

    return () => {
      observer.disconnect();
      poster.removeAttribute("data-covered");
    };
  }, []);

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 h-px"
    />
  );
}
