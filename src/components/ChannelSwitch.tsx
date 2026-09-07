"use client";

import { useId, useRef } from "react";
import { motion } from "motion/react";
import { CHANNELS } from "@/content/site";
import type { Channel } from "@/content/site";
import { useChannel } from "@/lib/channel";

/**
 * The tuner. Everything downstream — the bio, every project line, which
 * details are worth showing — reads off this one control.
 *
 * Radiogroup semantics with arrow-key support, because it is genuinely a
 * single choice out of three and keyboard users should get the real thing.
 */
export default function ChannelSwitch({ compact = false }: { compact?: boolean }) {
  const { channel, setChannel } = useChannel();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  // the page mounts this control twice; a shared layoutId would make the two
  // indicators fight and leave one of them unpainted
  const indicatorId = useId();

  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    const keys = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    const forward = event.key === "ArrowRight" || event.key === "ArrowDown";
    const next = (index + (forward ? 1 : -1) + CHANNELS.length) % CHANNELS.length;
    setChannel(CHANNELS[next].id as Channel);
    refs.current[next]?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-label="Who is reading this"
      className="u-panel u-chamfer inline-flex flex-wrap gap-1 p-1"
    >
      {CHANNELS.map((option, index) => {
        const active = option.id === channel;
        return (
          <button
            key={option.id}
            ref={(node) => {
              refs.current[index] = node;
            }}
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            onClick={() => setChannel(option.id)}
            onKeyDown={(event) => onKeyDown(event, index)}
            data-cursor={option.hint}
            className={`u-mono relative px-3.5 py-2 text-[11px] tracking-[0.12em] uppercase transition-colors duration-200 ${
              active ? "text-bg" : "text-muted hover:text-ink"
            } ${compact ? "sm:px-4" : "sm:px-5 sm:py-2.5"}`}
          >
            {active && (
              <motion.span
                layoutId={`channel-indicator-${indicatorId}`}
                className="bg-signal absolute inset-0"
                transition={{ type: "spring", stiffness: 420, damping: 38 }}
              />
            )}
            <span className="relative">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
