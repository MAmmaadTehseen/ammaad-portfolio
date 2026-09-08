"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

const TARGETS = "[data-cursor], a, button, [role='button']";

/**
 * A crosshair reticle instead of a pointer. Only mounts where there is a real
 * pointer and motion is welcome; everywhere else the OS cursor is left alone.
 *
 * Any element can retarget it:   <a data-cursor="Open source">
 *
 * Position rides motion values, so pointer movement never renders React. State
 * is touched only when something actually changes — a new hover target, the
 * pointer entering or leaving the window — which is a few times a minute rather
 * than a few hundred times a second.
 */
export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [locked, setLocked] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ring = {
    x: useSpring(x, { stiffness: 480, damping: 42, mass: 0.7 }),
    y: useSpring(y, { stiffness: 480, damping: 42, mass: 0.7 }),
  };

  // mirrors of the state above, so the hot path can compare without re-rendering
  const lastEl = useRef<EventTarget | null>(null);
  const lockedRef = useRef(false);
  const labelRef = useRef<string | null>(null);
  const visibleRef = useRef(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduced.matches) return;

    setEnabled(true);
    document.documentElement.classList.add("has-cursor");

    const onMove = (event: PointerEvent) => {
      // motion values are already batched to the next frame internally
      x.set(event.clientX);
      y.set(event.clientY);

      if (!visibleRef.current) {
        visibleRef.current = true;
        setVisible(true);
      }

      // most moves stay over the same element; only walk the tree when it changes
      if (event.target === lastEl.current) return;
      lastEl.current = event.target;

      const hit = (event.target as HTMLElement | null)?.closest?.(TARGETS) as HTMLElement | null;
      const nextLocked = Boolean(hit);
      const nextLabel = hit?.dataset.cursor ?? null;

      if (nextLocked !== lockedRef.current) {
        lockedRef.current = nextLocked;
        setLocked(nextLocked);
      }
      if (nextLabel !== labelRef.current) {
        labelRef.current = nextLabel;
        setLabel(nextLabel);
      }
    };

    const setSeen = (seen: boolean) => () => {
      if (visibleRef.current === seen) return;
      visibleRef.current = seen;
      setVisible(seen);
    };
    const onLeave = setSeen(false);
    const onEnter = setSeen(true);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
      document.documentElement.classList.remove("has-cursor");
    };
    // motion values are stable refs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!enabled) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: "var(--z-cursor)" }}
    >
      {/* reticle */}
      <motion.div
        className="absolute top-0 left-0"
        style={{ x: ring.x, y: ring.y }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.18 }}
      >
        <motion.div
          className="relative -translate-x-1/2 -translate-y-1/2"
          animate={{ width: locked ? 46 : 26, height: locked ? 46 : 26, rotate: locked ? 45 : 0 }}
          transition={{ type: "spring", stiffness: 420, damping: 34 }}
        >
          <span className="absolute inset-0 border border-signal/70" />
          {/* corner ticks — the reticle reads as machined, not as a circle */}
          <span className="absolute -top-px -left-px h-1.5 w-1.5 border-t border-l border-signal" />
          <span className="absolute -top-px -right-px h-1.5 w-1.5 border-t border-r border-signal" />
          <span className="absolute -bottom-px -left-px h-1.5 w-1.5 border-b border-l border-signal" />
          <span className="absolute -right-px -bottom-px h-1.5 w-1.5 border-r border-b border-signal" />
        </motion.div>
      </motion.div>

      {/* centre dot tracks the raw pointer with no lag at all */}
      <motion.div
        className="absolute top-0 left-0"
        style={{ x, y }}
        animate={{ opacity: visible && !locked ? 1 : 0 }}
        transition={{ duration: 0.12 }}
      >
        <span className="bg-signal absolute h-[3px] w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full" />
      </motion.div>

      {/* readout label */}
      <motion.div
        className="absolute top-0 left-0"
        style={{ x: ring.x, y: ring.y }}
        animate={{ opacity: label && visible ? 1 : 0 }}
        transition={{ duration: 0.18 }}
      >
        <span className="u-mono bg-signal text-bg absolute translate-x-6 translate-y-4 px-1.5 py-0.5 text-[10px] whitespace-nowrap">
          {label}
        </span>
      </motion.div>
    </div>
  );
}
