"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\<>=+*#";

/**
 * Retunes text the way a readout settles on a value. Used only where the copy
 * genuinely changes (the channel switch), never as decoration on static text.
 *
 * The real string is always in the DOM for screen readers and for search; only
 * the visible layer scrambles.
 */
export default function ScrambleText({
  text,
  className,
  speed = 26,
}: {
  text: string;
  className?: string;
  speed?: number;
}) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(text);
  const first = useRef(true);

  useEffect(() => {
    if (reduced || first.current) {
      first.current = false;
      setDisplay(text);
      return;
    }

    let frame = 0;
    let tick = 0;
    const total = Math.max(8, Math.ceil(text.length * 0.6));

    const run = () => {
      tick += 1;
      const progress = tick / total;
      const settled = Math.floor(text.length * progress);
      setDisplay(
        text
          .split("")
          .map((char, index) => {
            if (index < settled || char === " ") return char;
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join(""),
      );
      if (tick < total) frame = window.setTimeout(run, speed);
      else setDisplay(text);
    };

    frame = window.setTimeout(run, speed);
    return () => window.clearTimeout(frame);
  }, [text, reduced, speed]);

  return (
    <span className={className}>
      <span aria-hidden>{display}</span>
      <span className="sr-only">{text}</span>
    </span>
  );
}
