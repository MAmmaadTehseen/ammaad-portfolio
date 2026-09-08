"use client";

import { Fragment } from "react";
import { motion } from "motion/react";

/**
 * Word-level mask reveal. Each word rides up out of its own clipped box, which
 * reads as type being machined into the panel rather than fading in.
 *
 * The trigger lives on the outer wrapper, not on the words.
 *
 * That is not a style choice. Each word starts translated 112% down, which puts
 * it entirely outside its own `overflow: hidden` clip box — and an
 * IntersectionObserver measures an element against its ancestors' clip rects, so
 * a clipped word reports a 0% intersection ratio forever and `whileInView` never
 * fires. Observing the wrapper, which is in normal flow and unclipped, and
 * driving the words through variants, is what makes the reveal actually run.
 *
 * Reduced motion is pinned by a `[data-split]` rule in globals.css rather than
 * branched here, which would render a different tree on the client than the
 * server.
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
    <motion.span
      className={className}
      data-split
      aria-label={text}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <span
            aria-hidden
            // the clip box needs slack for descenders, pulled back with -mb
            className="inline-block overflow-hidden pb-[0.14em] align-bottom -mb-[0.14em]"
          >
            <motion.span
              className="inline-block will-change-transform"
              variants={{
                hidden: { y: "112%" },
                show: { y: "0%", transition: { duration, ease: [0.16, 1, 0.3, 1] } },
              }}
            >
              {word}
            </motion.span>
          </span>
          {/* the separating space sits outside the clip box: inside, it is
              collapsed away and every word runs together */}
          {index < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </motion.span>
  );
}
