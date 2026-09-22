"use client";

import dynamic from "next/dynamic";
import { useRef, useState, type PointerEvent, type ReactNode } from "react";

/*
 * The motion library is the one piece of /work that most visitors never need
 * (touch, narrow screens and reduced motion all go without the card), so its
 * chunk is only requested once a mouse actually enters the list.
 */
const WorkPreview = dynamic(() => import("@/components/islands/WorkPreview"), {
  ssr: false,
});

/** Must match the preview card's media gate in globals.css. */
const CAN_PREVIEW = "(hover: hover) and (pointer: fine) and (min-width: 64rem)";

/**
 * Wraps the showcase list and its server-rendered preview card. It renders
 * nothing of its own beyond a plain div; on the first qualifying
 * pointerenter it mounts WorkPreview, which drives the card already in the
 * DOM. The children stay server components, so no project data reaches the
 * client.
 */
export default function PreviewGate({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [start, setStart] = useState<{ x: number; y: number } | null>(null);

  const arm = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    // html.m is the gate script's "motion allowed"; without it the card stays display:none
    if (!document.documentElement.classList.contains("m")) return;
    if (!window.matchMedia(CAN_PREVIEW).matches) return;
    setStart({ x: event.clientX, y: event.clientY });
  };

  return (
    <div ref={rootRef} onPointerEnter={start ? undefined : arm}>
      {children}
      {start && <WorkPreview rootRef={rootRef} start={start} />}
    </div>
  );
}
