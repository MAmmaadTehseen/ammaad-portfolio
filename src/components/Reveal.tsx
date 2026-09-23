"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Seconds. Use small values; long delays read as jank, not choreography. */
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "section" | "span";
};

/**
 * A single entrance, used sparingly.
 *
 * Reduced motion is handled by a `[data-reveal]` rule in globals.css rather
 * than by branching here — swapping the element type on useReducedMotion()
 * renders a different tree on the server than on the client and trips a
 * hydration mismatch. The same rule covers the no-JS case.
 */
export default function Reveal({ children, delay = 0, y = 22, className, as = "div" }: Props) {
  const Tag = motion[as];

  return (
    <Tag
      data-reveal
      className={className}
      // transform and opacity only — an animated blur filter forces a fresh
      // raster of the whole subtree on every frame, which is the most expensive
      // thing a reveal can possibly do for the least visible gain
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Tag>
  );
}
