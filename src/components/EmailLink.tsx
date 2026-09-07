"use client";

import { motion } from "motion/react";
import { useMagnetic } from "@/lib/motion";
import { profile } from "@/content/site";

/** The one target on the page worth reaching for, so the one that pulls back. */
export default function EmailLink() {
  const magnet = useMagnetic<HTMLAnchorElement>(0.22, 12);

  return (
    <motion.a
      ref={magnet.ref}
      style={magnet.style}
      onMouseMove={magnet.onMouseMove}
      onMouseLeave={magnet.onMouseLeave}
      onBlur={magnet.onBlur}
      href={`mailto:${profile.email}`}
      data-cursor="Write to me"
      className="group text-signal mt-10 inline-flex flex-wrap items-center gap-3 text-[clamp(1.1rem,3.4vw,2rem)] break-all will-change-transform"
    >
      <span className="decoration-signal/40 underline-offset-8 group-hover:underline">
        {profile.email}
      </span>
      <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
        →
      </span>
    </motion.a>
  );
}
