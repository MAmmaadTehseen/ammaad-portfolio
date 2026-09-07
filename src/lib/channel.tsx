"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Channel } from "@/content/site";

const STORAGE_KEY = "readout:channel";

type ChannelContextValue = {
  channel: Channel;
  setChannel: (next: Channel) => void;
  /** False until the stored preference has been read on the client. */
  ready: boolean;
};

const ChannelContext = createContext<ChannelContextValue | null>(null);

function isChannel(value: unknown): value is Channel {
  return value === "client" || value === "recruiter" || value === "engineer";
}

export function ChannelProvider({ children }: { children: React.ReactNode }) {
  const [channel, setChannelState] = useState<Channel>("client");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (isChannel(stored)) setChannelState(stored);
    } catch {
      /* private mode, blocked storage — the default channel is fine */
    }
    setReady(true);
  }, []);

  const setChannel = useCallback((next: Channel) => {
    setChannelState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* nothing to recover from; the choice just will not persist */
    }
  }, []);

  const value = useMemo(() => ({ channel, setChannel, ready }), [channel, setChannel, ready]);

  return <ChannelContext.Provider value={value}>{children}</ChannelContext.Provider>;
}

export function useChannel() {
  const ctx = useContext(ChannelContext);
  if (!ctx) throw new Error("useChannel must be used inside <ChannelProvider>");
  return ctx;
}
