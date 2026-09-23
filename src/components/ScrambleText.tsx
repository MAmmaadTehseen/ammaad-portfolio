"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\<>=+*#";

/**
 * Retunes text the way a readout settles on a value. Used only where the copy
 * genuinely changes (the channel switch), never as decoration on static text.
 *
 * The frames are written straight to a text node rather than through state.
 * Scrambling a heading through React would re-render the subtree forty times
 * for one word change; the DOM write is the whole job, so it does only that.
 *
 * The real string is rendered by React and is what the server sends, so search
 * and screen readers always see the finished text.
 */
export default function ScrambleText({
  text,
  className,
  speed = 26,
  runKey = null,
}: {
  text: string;
  className?: string;
  speed?: number;
  /**
   * Re-runs the scramble when this changes. Needed because all three bios are
   * in the DOM for crawlers, so each one's `text` is constant — the trigger is
   * the panel becoming the visible one. Pass null while hidden so offscreen
   * copies never animate.
   */
  runKey?: string | number | null;
}) {
  const reduced = useReducedMotion();
  const node = useRef<HTMLSpanElement>(null);
  const first = useRef(true);

  useEffect(() => {
    const el = node.current;
    if (!el) return;

    // never scramble on arrival — only on a genuine change of value
    if (reduced || first.current || runKey === null) {
      first.current = false;
      el.textContent = text;
      return;
    }

    const chars = text.split("");
    const steps = Math.max(8, Math.ceil(chars.length * 0.6));
    let frame = 0;
    let startedAt = 0;

    const run = (now: number) => {
      if (!startedAt) startedAt = now;
      const step = Math.floor((now - startedAt) / speed);

      if (step >= steps) {
        el.textContent = text;
        return;
      }

      const settled = Math.floor(chars.length * (step / steps));
      let out = "";
      for (let i = 0; i < chars.length; i += 1) {
        out +=
          i < settled || chars[i] === " "
            ? chars[i]
            : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      el.textContent = out;
      frame = requestAnimationFrame(run);
    };

    frame = requestAnimationFrame(run);
    return () => cancelAnimationFrame(frame);
  }, [text, reduced, speed, runKey]);

  return (
    <span className={className}>
      <span ref={node} aria-hidden>
        {text}
      </span>
      <span className="sr-only">{text}</span>
    </span>
  );
}
