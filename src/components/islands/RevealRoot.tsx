"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    /** Set on mount. The pre-paint gate strips html.js/html.m after 3s without it. */
    __ag?: number;
  }
}

/** A flow counts as seen at 60% visible, or at 60% of the viewport when it is taller than that. */
const SEEN = 0.6;

/**
 * The one observer pair behind every scroll-entered effect on the site.
 *
 * Reveals: [data-reveal] gets data-in once and is then forgotten. The start
 * states live in CSS under html.m, so this only ever *finishes* an entrance;
 * nothing is hidden waiting for it.
 *
 * Ambient: [data-ambient] gets data-off while off-screen, which pauses the two
 * site loops (horizon band, breathing dot) and the lamp. The same observer
 * starts diagrams: data-play (assembly) and, after the edges have drawn,
 * data-sent (one packet pass).
 *
 * Both observers are rebuilt on every client navigation, because the new page
 * brings new elements and the old ones are gone.
 */
export default function RevealRoot() {
  const pathname = usePathname();

  // Once per page load: tell the gate we are alive, and make print complete.
  useEffect(() => {
    window.__ag = 1;

    const printAll = () => {
      document.querySelectorAll("[data-reveal]").forEach((el) => el.setAttribute("data-in", ""));
    };
    window.addEventListener("beforeprint", printAll);

    // Hover or focus replays one packet pass on a diagram that has already
    // sent one. The featured stage handles its own (FeaturedTabs), so it is
    // left alone here.
    const lastSent = new WeakMap<Element, number>();
    const replay = (event: Event) => {
      const target = event.target as Element | null;
      const flow = target?.closest?.(".flow");
      if (!flow || !flow.hasAttribute("data-sent") || flow.closest(".stage-panels")) return;
      // pointerover propagates up from every child; only count entering the flow
      const from = (event as PointerEvent).relatedTarget as Node | null;
      if (event.type === "pointerover" && from && flow.contains(from)) return;
      const now = performance.now();
      if (now - (lastSent.get(flow) ?? 0) < passLength(flow)) return;
      lastSent.set(flow, now);
      flow.setAttribute("data-sent", flow.getAttribute("data-sent") === "b" ? "a" : "b");
    };
    document.addEventListener("pointerover", replay, { passive: true });
    document.addEventListener("focusin", replay);

    return () => {
      window.removeEventListener("beforeprint", printAll);
      document.removeEventListener("pointerover", replay);
      document.removeEventListener("focusin", replay);
    };
  }, []);

  // Per route: observe what this page rendered.
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      // No observer means no way to finish an entrance: finish them all now.
      document.querySelectorAll("[data-reveal]").forEach((el) => el.setAttribute("data-in", ""));
      return;
    }

    const reveal = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-in", "");
          reveal.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );

    const timers = new Set<number>();
    const ambient = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target;
          if (el.hasAttribute("data-ambient")) {
            el.toggleAttribute("data-off", !entry.isIntersecting);
          }
          if (el.classList.contains("flow") && seen(entry)) {
            // A panel that is not showing waits for FeaturedTabs to play it.
            if (el.closest(".panel:not([data-active])")) continue;
            play(el, timers);
            if (!el.hasAttribute("data-ambient")) ambient.unobserve(el);
          }
        }
      },
      { threshold: [0, 0.2, 0.4, SEEN, 0.8, 1] },
    );

    const scan = () => {
      document.querySelectorAll("[data-reveal]:not([data-in])").forEach((el) => reveal.observe(el));
      document.querySelectorAll("[data-ambient]").forEach((el) => ambient.observe(el));
      document.querySelectorAll(".flow:not([data-sent])").forEach((el) => ambient.observe(el));
    };
    scan();
    // Streamed or late-committed segments land a frame after the pathname
    // changes; a second pass catches them. observe() on a watched node is a no-op.
    const late = requestAnimationFrame(scan);

    return () => {
      cancelAnimationFrame(late);
      timers.forEach((t) => window.clearTimeout(t));
      reveal.disconnect();
      ambient.disconnect();
    };
  }, [pathname]);

  return null;
}

function seen(entry: IntersectionObserverEntry) {
  if (!entry.isIntersecting) return false;
  if (entry.intersectionRatio >= SEEN) return true;
  const viewport = entry.rootBounds?.height ?? window.innerHeight;
  return entry.intersectionRect.height >= viewport * SEEN;
}

/** Assemble once, then send one packet pass after the last edge has drawn. */
function play(flow: Element, timers: Set<number>) {
  if (flow.hasAttribute("data-play") && flow.hasAttribute("data-sent")) return;
  // Only diagrams built to assemble get data-play; replaying the draw on a
  // diagram that already rendered complete would blink it dark first.
  if (flow.hasAttribute("data-assemble")) flow.setAttribute("data-play", "");
  if (flow.hasAttribute("data-sent")) return;
  const t = window.setTimeout(() => {
    timers.delete(t);
    if (!flow.hasAttribute("data-sent")) flow.setAttribute("data-sent", "a");
  }, edgeCount(flow) * 60 + 900);
  timers.add(t);
}

/** Edges in the layout actually on screen (full and vertical both sit in the DOM). */
function edgeCount(flow: Element) {
  const svgs = Array.from(flow.querySelectorAll("svg"));
  const shown = svgs.find((svg) => svg.getClientRects().length > 0) ?? svgs[0] ?? flow;
  return shown.querySelectorAll(".edge, .edge-dash").length;
}

/** Last packet starts at edges*140ms and runs 1.6s; don't restart it mid-pass. */
function passLength(flow: Element) {
  return edgeCount(flow) * 140 + 1600;
}
