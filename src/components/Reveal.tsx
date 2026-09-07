"use client";

import { motion, useReducedMotion } from "motion/react";
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
 * A single entrance, used sparingly. Reduced-motion users get the content
 * with no transform at all, and a `scripting: none` rule in globals.css keeps
 * the page readable if JS never arrives.
 */
export default function Reveal({ children, delay = 0, y = 22, className, as = "div" }: Props) {
  const reduced = useReducedMotion();
  const Tag = motion[as];

  if (reduced) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }

  return (
    <Tag
      data-reveal
      className={className}
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Tag>
  );
}
