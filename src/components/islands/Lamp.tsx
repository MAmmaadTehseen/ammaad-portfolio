"use client";

import { useEffect, useRef } from "react";

/** A mouse or trackpad. Touch has no hover to follow, so the lamp stays centred. */
const FINE = "(hover: hover) and (pointer: fine)";
const MOTION = "(prefers-reduced-motion: no-preference)";

/**
 * The warm lamp behind the closing room (effect #24).
 *
 * A 56rem closest-side radial at 11% glow, drawn entirely by the .lamp rule.
 * This island only writes --lx/--ly, the pointer's offset from the lamp's
 * resting centre, and the .9s translate transition turns that into a slow
 * follow. The pointer listener exists only while the room is on screen, only
 * for fine pointers and only with motion allowed; everyone else gets the lamp
 * static and centred, which is the same element with no variables set.
 *
 * It measures its own parent, so it must be a direct child of the room.
 */
export default function Lamp() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lamp = ref.current;
    const room = lamp?.parentElement;
    if (!lamp || !room || typeof IntersectionObserver === "undefined") return;

    const fine = window.matchMedia(FINE);
    const motion = window.matchMedia(MOTION);

    let frame = 0;
    let x = 0;
    let y = 0;
    let listening = false;

    const write = () => {
      frame = 0;
      const box = room.getBoundingClientRect();
      // the lamp rests at 50% / 45% of the room (see .lamp in globals.css)
      lamp.style.setProperty(
        "--lx",
        `${Math.round(x - box.left - box.width * 0.5)}px`,
      );
      lamp.style.setProperty(
        "--ly",
        `${Math.round(y - box.top - box.height * 0.45)}px`,
      );
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      x = event.clientX;
      y = event.clientY;
      if (!frame) frame = requestAnimationFrame(write);
    };

    // back to the centre, on the same slow transition
    const onLeave = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      lamp.style.removeProperty("--lx");
      lamp.style.removeProperty("--ly");
    };

    const attach = () => {
      if (listening) return;
      listening = true;
      room.addEventListener("pointermove", onMove, { passive: true });
      room.addEventListener("pointerleave", onLeave);
    };

    const detach = () => {
      if (!listening) return;
      listening = false;
      room.removeEventListener("pointermove", onMove);
      room.removeEventListener("pointerleave", onLeave);
      onLeave();
    };

    let visible = false;
    const sync = () => {
      if (visible && fine.matches && motion.matches) attach();
      else detach();
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(room);
    // a mouse plugged in, or reduced motion switched on, mid-visit
    fine.addEventListener("change", sync);
    motion.addEventListener("change", sync);

    return () => {
      observer.disconnect();
      fine.removeEventListener("change", sync);
      motion.removeEventListener("change", sync);
      detach();
    };
  }, []);

  return <div ref={ref} className="lamp" aria-hidden="true" />;
}
