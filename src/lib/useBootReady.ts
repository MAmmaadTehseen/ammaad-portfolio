"use client";

import { useEffect, useState } from "react";

/**
 * True once the boot overlay is out of the way, so the hero choreography plays
 * to a visible screen instead of behind a panel. Falls open after 3s no matter
 * what — a missed event must never leave the hero half-animated.
 */
export function useBootReady() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (document.documentElement.classList.contains("boot-done")) {
      setReady(true);
      return;
    }
    const open = () => setReady(true);
    window.addEventListener("boot:done", open);
    const safety = window.setTimeout(open, 3000);
    return () => {
      window.removeEventListener("boot:done", open);
      window.clearTimeout(safety);
    };
  }, []);

  return ready;
}
