"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CHANNELS, bio } from "@/content/site";
import { useChannel } from "@/lib/channel";
import ChannelSwitch from "./ChannelSwitch";
import ScrambleText from "./ScrambleText";
import Reveal from "./Reveal";

export default function Intro() {
  const { channel } = useChannel();
  const reduced = useReducedMotion();
  const current = bio[channel];
  const hint = CHANNELS.find((option) => option.id === channel)?.hint;

  return (
    <section id="index" className="mx-auto max-w-[1400px] scroll-mt-24 px-5 py-24 sm:px-8 sm:py-32">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.6fr)_minmax(0,1.4fr)] lg:gap-16">
        <Reveal>
          <div className="lg:sticky lg:top-28">
            <span className="u-engrave">Reading as</span>
            <div className="mt-4">
              <ChannelSwitch />
            </div>
            <p className="u-mono text-dim mt-4 text-[11px] leading-relaxed">
              {hint}
            </p>
            <div className="u-rule mt-8" />
            <p className="text-dim mt-4 max-w-xs text-sm leading-relaxed">
              Same work either way. This just changes how much of the machinery I show you.
            </p>
          </div>
        </Reveal>

        <div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={channel}
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="u-display text-ink text-[clamp(1.9rem,5.2vw,4rem)]">
                <ScrambleText text={current.lede} />
              </h2>
              <p className="text-muted u-prose mt-8 text-lg leading-relaxed">{current.body}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
