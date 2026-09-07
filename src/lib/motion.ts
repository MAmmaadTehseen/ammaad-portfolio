"use client";

import { useRef } from "react";
import {
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";

/** One easing curve for the whole site. Exponential ease-out, no overshoot. */
export const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Pulls an element gently toward the cursor. Used sparingly — on the few
 * targets worth reaching for, never on every link.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.28, max = 14) {
  const ref = useRef<T>(null);
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const spring = { stiffness: 250, damping: 20, mass: 0.5 };
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);

  const onMouseMove = (event: React.MouseEvent) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const dx = (event.clientX - (rect.left + rect.width / 2)) * strength;
    const dy = (event.clientY - (rect.top + rect.height / 2)) * strength;
    x.set(Math.max(-max, Math.min(max, dx)));
    y.set(Math.max(-max, Math.min(max, dy)));
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return { ref, style: { x: sx, y: sy }, onMouseMove, onMouseLeave: reset, onBlur: reset };
}

/**
 * Scroll velocity as a small skew, spring-damped so it leans into a flick and
 * settles rather than snapping. Capped low — past about 2deg it stops reading
 * as momentum and starts reading as a rendering bug.
 */
export function useScrollSkew(max = 1.4) {
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const raw = useTransform(velocity, [-2600, 0, 2600], [max, 0, -max], { clamp: true });
  // always a MotionValue so the server and client render the same style prop;
  // globals.css pins the transform under prefers-reduced-motion
  return useSpring(raw, { stiffness: 190, damping: 32, mass: 0.5 });
}
