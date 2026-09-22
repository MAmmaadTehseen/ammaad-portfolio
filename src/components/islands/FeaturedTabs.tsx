"use client";

import { useEffect } from "react";

/** Hover has to rest this long on a tab before it switches: a pass-through is not a choice. */
const INTENT_MS = 120;

/**
 * The featured stage's behaviour (DESIGN.md effects #14, #15). No props: the
 * tablist, panels and diagrams are all server HTML, so no project data is
 * bundled here, and this island only moves attributes. Nothing remounts.
 *
 * - Roving tabindex with Arrow keys, Home and End (automatic activation, as
 *   the panels are already rendered and switching costs nothing).
 * - Click, and on fine pointers a hover that rests for 120ms.
 * - The new panel's diagram gets data-play (it switches on node by node) and,
 *   once its edges have drawn, data-sent (one packet pass). Timing reads the
 *   edge count from the .flow's data-edges.
 * - Pointer or keyboard entering the stage re-sends one pass on the showing
 *   diagram, never more than one at a time. RevealRoot leaves the stage's
 *   replays to this island.
 *
 * The first panel's first play is RevealRoot's: it starts it once the stage
 * is 60% in view, the same as every other diagram.
 */
export default function FeaturedTabs() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-featured]");
    const list = root?.querySelector<HTMLElement>('[role="tablist"]');
    const stage = root?.querySelector<HTMLElement>("[data-stage]");
    if (!root || !list || !stage) return;

    const tabs = Array.from(list.querySelectorAll<HTMLElement>('[role="tab"]'));
    const panelOf = (tab: HTMLElement) => {
      const id = tab.getAttribute("aria-controls");
      return id ? document.getElementById(id) : null;
    };
    const flowOf = (panel: Element | null) => panel?.querySelector<HTMLElement>(".flow") ?? null;
    const edgesOf = (flow: HTMLElement) => Number(flow.dataset.edges) || 0;

    let current = Math.max(
      0,
      tabs.findIndex((tab) => tab.getAttribute("aria-selected") === "true"),
    );
    let sendTimer = 0;
    let intentTimer = 0;
    let lastPass = 0;

    const play = (flow: HTMLElement) => {
      window.clearTimeout(sendTimer);
      // Drop the old state and force a style flush, so the draw restarts from
      // dark even when this panel has played before.
      flow.removeAttribute("data-play");
      flow.removeAttribute("data-sent");
      void flow.offsetWidth;
      flow.setAttribute("data-play", "");
      sendTimer = window.setTimeout(
        () => flow.setAttribute("data-sent", "a"),
        edgesOf(flow) * 60 + 900,
      );
    };

    const activate = (index: number, focus: boolean) => {
      window.clearTimeout(intentTimer);
      const next = (index + tabs.length) % tabs.length;
      if (focus) tabs[next].focus();
      if (next === current) return;
      current = next;

      tabs.forEach((tab, i) => {
        const on = i === next;
        tab.setAttribute("aria-selected", on ? "true" : "false");
        tab.tabIndex = on ? 0 : -1;
        tab.toggleAttribute("data-active", on);
        panelOf(tab)?.toggleAttribute("data-active", on);
      });

      const flow = flowOf(panelOf(tabs[next]));
      if (flow) play(flow);
    };

    const onClick = (event: MouseEvent) => {
      const tab = (event.target as Element).closest<HTMLElement>('[role="tab"]');
      if (tab) activate(tabs.indexOf(tab), false);
    };

    const onKey = (event: KeyboardEvent) => {
      const at = tabs.indexOf(event.target as HTMLElement);
      if (at === -1) return;
      const to =
        event.key === "ArrowDown" || event.key === "ArrowRight"
          ? at + 1
          : event.key === "ArrowUp" || event.key === "ArrowLeft"
            ? at - 1
            : event.key === "Home"
              ? 0
              : event.key === "End"
                ? tabs.length - 1
                : null;
      if (to === null) return;
      event.preventDefault();
      activate(to, true);
    };

    // Hover intent only where there is a real hover: on touch, pointerenter
    // fires on tap and would race the click.
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const onEnter = (event: PointerEvent) => {
      if (!fine.matches || event.pointerType !== "mouse") return;
      const index = tabs.indexOf(event.currentTarget as HTMLElement);
      window.clearTimeout(intentTimer);
      intentTimer = window.setTimeout(() => activate(index, false), INTENT_MS);
    };
    const onLeave = () => window.clearTimeout(intentTimer);

    // One packet pass when the reader arrives at the stage, only once the
    // showing diagram has sent its first, and never over a pass still running.
    const resend = (event: PointerEvent | FocusEvent) => {
      const from = event.relatedTarget as Node | null;
      if (from && stage.contains(from)) return;
      const flow = flowOf(panelOf(tabs[current]));
      if (!flow || !flow.hasAttribute("data-sent")) return;
      const now = performance.now();
      if (now - lastPass < edgesOf(flow) * 140 + 1600) return;
      flow.setAttribute("data-sent", flow.getAttribute("data-sent") === "b" ? "a" : "b");
    };

    // Every pass starts with a change to data-sent, whoever made it (this
    // island, or RevealRoot for the first one), so that is where it is timed.
    const passes = new MutationObserver(() => {
      lastPass = performance.now();
    });
    passes.observe(stage, { subtree: true, attributeFilter: ["data-sent"] });

    list.addEventListener("click", onClick);
    list.addEventListener("keydown", onKey);
    tabs.forEach((tab) => {
      tab.addEventListener("pointerenter", onEnter);
      tab.addEventListener("pointerleave", onLeave);
    });
    stage.addEventListener("pointerenter", resend);
    stage.addEventListener("focusin", resend);

    return () => {
      passes.disconnect();
      window.clearTimeout(sendTimer);
      window.clearTimeout(intentTimer);
      list.removeEventListener("click", onClick);
      list.removeEventListener("keydown", onKey);
      tabs.forEach((tab) => {
        tab.removeEventListener("pointerenter", onEnter);
        tab.removeEventListener("pointerleave", onLeave);
      });
      stage.removeEventListener("pointerenter", resend);
      stage.removeEventListener("focusin", resend);
    };
  }, []);

  return null;
}
