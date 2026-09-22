import { Fragment, type CSSProperties } from "react";

/**
 * The light-up stagger runs out of patience after this many words: later
 * words share the last delay instead of trailing on for another second.
 */
const MAX_STEPS = 12;

type Tag = "span" | "h1" | "h2" | "p" | "div";

/**
 * Display text that switches on word by word (DESIGN.md effect #1).
 *
 * Pure markup: the animation is CSS in globals.css and only plays under
 * html.m:not(.lit-seen), so it runs before hydration, never replays within a
 * session, and a reduced-motion or no-JS visitor gets the final colours
 * straight away. The words are real text joined by real spaces, so screen
 * readers, copy-paste and search all see an ordinary sentence; that is why
 * there is no aria-label and no visually hidden duplicate.
 */
export default function LightUp({
  text,
  accentFrom,
  as: Tag = "span",
  step,
  className,
}: {
  text: string;
  /**
   * Index of the first word drawn in --glow; every word after it glows too.
   * Negative counts from the end, so -3 lights the last three words.
   */
  accentFrom?: number;
  as?: Tag;
  /** Milliseconds between words. Page h1s use 50; the default is 70. */
  step?: number;
  className?: string;
}) {
  const words = text.trim().split(/\s+/);
  const accent =
    accentFrom === undefined
      ? words.length
      : accentFrom < 0
        ? Math.max(0, words.length + accentFrom)
        : accentFrom;
  const style =
    step === undefined ? undefined : ({ "--lu-step": `${step}ms` } as CSSProperties);

  return (
    <Tag className={className ? `lu ${className}` : "lu"} style={style}>
      {words.map((word, i) => (
        <Fragment key={i}>
          {i > 0 && " "}
          <span
            className={i >= accent ? "w acc" : "w"}
            style={{ "--i": Math.min(i, MAX_STEPS - 1) } as CSSProperties}
          >
            {word}
          </span>
        </Fragment>
      ))}
    </Tag>
  );
}
