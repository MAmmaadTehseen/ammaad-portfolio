"use client";

import { motion } from "motion/react";
import { CHANNELS, bio } from "@/content/site";
import { useChannel } from "@/lib/channel";
import { EASE } from "@/lib/motion";
import ChannelSwitch from "./ChannelSwitch";
import ScrambleText from "./ScrambleText";
import Reveal from "./Reveal";

export default function Intro() {
  const { channel } = useChannel();
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
            <p className="u-mono text-dim mt-4 text-[11px] leading-relaxed">{hint}</p>
            <div className="u-rule mt-8" />
            <p className="text-dim mt-4 max-w-xs text-sm leading-relaxed">
              Same work either way. This just changes how much of the machinery I show you.
            </p>
          </div>
        </Reveal>

        {/*
          All three bios are in the DOM, with the inactive ones hidden — the
          ordinary tab/accordion pattern. Rendering only the selected one kept
          two thirds of the writing out of the served HTML, so a crawler never
          saw the recruiter or engineer copy, which is the keyword-dense half.
          The switch is a real control, so nothing here is hidden from people
          and shown to search engines.
        */}
        <div>
          {CHANNELS.map((option) => {
            const active = option.id === channel;
            const copy = bio[option.id];

            return (
              <motion.div
                key={option.id}
                hidden={!active}
                data-motion
                initial={false}
                animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <h2 className="u-display text-ink text-[clamp(1.9rem,5.2vw,4rem)]">
                  <ScrambleText text={copy.lede} runKey={active ? option.id : null} />
                </h2>
                <p className="text-muted u-prose mt-8 text-lg leading-relaxed">{copy.body}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
