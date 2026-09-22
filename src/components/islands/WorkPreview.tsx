"use client";

import { useEffect, type RefObject } from "react";
import { useMotionValue, useSpring } from "motion/react";

/** DESIGN.md effect #19: about half a second to catch up, with a soft landing. */
const SPRING = { stiffness: 150, damping: 22, mass: 0.6 };
/** Distance from the pointer to the card's near edge. */
const GAP = 28;
/** The card never sits closer than this to the viewport edge. */
const EDGE = 16;

/**
 * The lagging preview card on /work (fine pointers, 1024px and up, motion
 * allowed). Loaded by PreviewGate through next/dynamic on the first
 * pointerenter of the list, so nobody else downloads the motion library.
 *
 * It renders nothing. The card, every silhouette and every lede are already
 * in the server HTML (aria-hidden, inert, display:none until globals.css
 * lets it show). This island only reads DOM attributes: the row under the
 * pointer names its project in data-preview, and the matching .pv[data-pv]
 * gets data-on while the card gets data-show. CSS does the crossfade and the
 * fade/scale in. That keeps project data out of client code.
 *
 * Motion supplies only the spring. It writes the CSS `translate` property
 * straight onto the server card, so no motion component is needed, and
 * therefore no LazyMotion feature bundle. `translate` rather than
 * `transform`, so the offset is not multiplied by the card's entry scale.
 * Springs stop when they settle, so an idle page does no frame work.
 */
export default function WorkPreview({
  rootRef,
  start,
}: {
  /** The element wrapping the showcase list and the card. */
  rootRef: RefObject<HTMLElement | null>;
  /** Where the pointer entered, so the first row shows before any movement. */
  start: { x: number; y: number };
}) {
  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);
  const x = useSpring(targetX, SPRING);
  const y = useSpring(targetY, SPRING);

  useEffect(() => {
    const root = rootRef.current;
    const card = root?.querySelector<HTMLElement>(".preview-card");
    if (!root || !card) return;

    const panes = new Map<string, HTMLElement>();
    card.querySelectorAll<HTMLElement>(".pv[data-pv]").forEach((pane) => {
      if (pane.dataset.pv) panes.set(pane.dataset.pv, pane);
    });

    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    let pointerX = start.x;
    let pointerY = start.y;
    let inside = true;
    let shown = false;
    let lit: HTMLElement | null = null;
    let frame = 0;

    const paint = () => {
      card.style.translate = `${x.get()}px ${y.get()}px`;
    };
    const stopX = x.on("change", paint);
    const stopY = y.on("change", paint);

    /**
     * Beside the pointer, flipped to its left near the right edge and held
     * inside the viewport vertically. Returns false when the card cannot be
     * measured, which means CSS has it display:none (narrow window, reduced
     * motion): then there is nothing to show.
     */
    const place = (jump: boolean) => {
      const width = card.offsetWidth;
      const height = card.offsetHeight;
      if (!width) return false;
      const viewW = document.documentElement.clientWidth;
      const viewH = window.innerHeight;
      let left = pointerX + GAP;
      if (left + width > viewW - EDGE) left = pointerX - GAP - width;
      const top = Math.max(
        EDGE,
        Math.min(pointerY - height / 2, viewH - height - EDGE),
      );
      targetX.set(left);
      targetY.set(top);
      // the first appearance lands where it belongs instead of flying in from the corner
      if (jump || still.matches) {
        x.jump(left);
        y.jump(top);
        paint();
      }
      return true;
    };

    const hide = () => {
      if (!shown) return;
      card.removeAttribute("data-show");
      shown = false;
    };

    const show = (id: string) => {
      const pane = panes.get(id);
      if (!pane) return hide();
      if (pane !== lit) {
        lit?.removeAttribute("data-on");
        pane.setAttribute("data-on", "");
        lit = pane;
      }
      if (!shown) {
        if (!place(true)) return;
        card.setAttribute("data-show", "");
        shown = true;
      }
    };

    /** Show the card for the row under this element, or hide it between and outside rows. */
    const pick = (target: Element | null) => {
      const row = target?.closest<HTMLElement>("[data-preview]");
      const id = row && root.contains(row) ? row.dataset.preview : undefined;
      if (id) show(id);
      else hide();
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      inside = true;
      pointerX = event.clientX;
      pointerY = event.clientY;
      pick(event.target as Element);
      if (shown) place(false);
    };

    const onLeave = () => {
      inside = false;
      hide();
    };

    // Scrolling moves rows under a still pointer without any pointer event,
    // so the row under it is looked up again, once per frame at most.
    const onScroll = () => {
      if (!inside || frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const under = document.elementFromPoint(pointerX, pointerY);
        if (under && root.contains(under)) pick(under);
        else onLeave();
      });
    };

    root.addEventListener("pointermove", onMove, { passive: true });
    root.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });

    // the pointer is already over the list when this loads
    pick(document.elementFromPoint(pointerX, pointerY));

    return () => {
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
      stopX();
      stopY();
      hide();
      lit?.removeAttribute("data-on");
      card.style.removeProperty("translate");
    };
  }, [rootRef, start, targetX, targetY, x, y]);

  return null;
}
