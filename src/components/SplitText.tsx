"use client";

import { Fragment } from "react";
import { motion } from "motion/react";

/**
 * Word-level mask reveal. Each word rides up out of its own clipped box, which
 * reads as type being machined into the panel rather than fading in.
 *
 * Two things here are deliberate:
 *
 * 1. The separating space is a text node *between* the clip boxes, not inside
 *    them. A trailing space inside an inline-block is collapsed away, which
 *    runs every word together; keeping it outside also lets the heading wrap
 *    normally, which a non-breaking space would prevent.
 * 2. There is no useReducedMotion branch. Rendering a different tree on the
 *    client than the server is a hydration mismatch, so the motion is pinned
 *    by a `[data-split]` rule in globals.css instead.
 */
export default function SplitText({
  text,
  className,
  delay = 0,
  stagger = 0.05,
  duration = 0.95,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
}) {
  const words = text.split(" ");

  return (
    <span className={className} data-split aria-label={text}>
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <span
            aria-hidden
            // the clip box needs slack for descenders, pulled back with -mb
            className="inline-block overflow-hidden pb-[0.14em] align-bottom -mb-[0.14em]"
          >
            <motion.span
              className="inline-block will-change-transform"
              initial={{ y: "112%" }}
              whileInView={{ y: "0%" }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{
                duration,
                delay: delay + index * stagger,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {word}
            </motion.span>
          </span>
          {index < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </span>
  );
}
