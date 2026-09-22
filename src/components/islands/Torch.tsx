"use client";

import { useEffect, useRef } from "react";

/**
 * The torch on the short-version card (DESIGN.md effect #18).
 *
 * An aria-hidden, inert copy of the showing bio sits exactly over it, drawn in
 * a warmer ink and masked to a soft 220px circle around the pointer, so the
 * muted body text brightens where the hand is. Rendered empty on the server;
 * it is filled only for a fine pointer with motion allowed (html.m) and the
 * :has() swap in effect, because in the stacked fallback there is no single
 * bio for it to sit over. globals.css shows it on hover, and hides it for
 * print and no-script.
 *
 * Place it inside `.bios` (which is position: relative) in the `.torch-host`
 * card. It reads the checked radio in the enclosing `.short`, recopies on
 * every change, and writes --mx/--my once per frame, only while the pointer
 * is over the card: no work at all when idle.
 */
export default function Torch() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const torch = ref.current;
    const host = torch?.closest<HTMLElement>(".torch-host");
    const short = torch?.closest<HTMLElement>(".short");
    if (!torch || !host || !short) return;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const motion = document.documentElement.classList.contains("m");
    const swaps = typeof CSS !== "undefined" && CSS.supports("selector(:has(*))");
    if (!fine || !motion || !swaps) return;

    const copy = () => {
      const checked = short.querySelector<HTMLInputElement>('input[type="radio"]:checked');
      const bio = checked && short.querySelector(`.bio-${checked.value}`);
      if (!bio) {
        torch.replaceChildren();
        return;
      }
      const clone = bio.cloneNode(true) as HTMLElement;
      clone.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
      // the copy takes the torch's warm ink, whatever colour the original set
      clone.querySelectorAll<HTMLElement>("*").forEach((el) => {
        el.style.color = "inherit";
      });
      torch.replaceChildren(...Array.from(clone.childNodes));
    };
    copy();

    let frame = 0;
    let x = 0;
    let y = 0;
    const paint = () => {
      frame = 0;
      const box = torch.getBoundingClientRect();
      torch.style.setProperty("--mx", `${Math.round(x - box.left)}px`);
      torch.style.setProperty("--my", `${Math.round(y - box.top)}px`);
    };
    const onMove = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const onEnter = (event: PointerEvent) => {
      onMove(event);
      host.addEventListener("pointermove", onMove, { passive: true });
    };
    const onLeave = () => {
      host.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
      frame = 0;
    };

    short.addEventListener("change", copy);
    host.addEventListener("pointerenter", onEnter);
    host.addEventListener("pointerleave", onLeave);

    return () => {
      onLeave();
      short.removeEventListener("change", copy);
      host.removeEventListener("pointerenter", onEnter);
      host.removeEventListener("pointerleave", onLeave);
      torch.replaceChildren();
    };
  }, []);

  return <div ref={ref} className="torch" aria-hidden="true" inert />;
}
