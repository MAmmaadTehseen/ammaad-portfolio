"use client";

import { motion } from "motion/react";
import { CHANNELS, bio } from "@/content/site";
import { useChannel } from "@/lib/channel";
import { EASE } from "@/lib/motion";
import ChannelSwitch from "./ChannelSwitch";
import Portrait from "./Portrait";
import ScrambleText from "./ScrambleText";
import Reveal from "./Reveal";

export default function Intro() {
  const { channel } = useChannel();
  const hint = CHANNELS.find((option) => option.id === channel)?.hint;

  return (
    <section id="index" className="mx-auto max-w-[1400px] scroll-mt-24 px-5 py-24 sm:px-8 sm:py-32">
      {/* The photograph was 300px against a 1.4fr column of text, which left the
          left column mostly empty and made the only picture on the site an
          afterthought. It now takes the column it is in. */}
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <Reveal>
          <div className="lg:sticky lg:top-28">
            <Portrait
              href="/about"
              sizes="(min-width:1024px) 420px, (min-width:640px) 60vw, 92vw"
              // the corner brackets hang 8px outside the frame, so on a phone
              // the plate leaves room for them rather than pushing the page wide
              className="mx-2 mb-10 w-[min(420px,calc(100%-1rem))] lg:mx-0"
            />
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
