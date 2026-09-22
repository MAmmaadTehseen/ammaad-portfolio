import { profile } from "@/content/site";

/**
 * The apricot availability dot. Renders nothing when profile.available is
 * off, so every placement can drop it in unconditionally.
 *
 * `breathe` marks it data-ambient: its halo then breathes under html.m, and
 * RevealRoot pauses it (data-off) while it is off-screen. The nav dot stays
 * static. Always aria-hidden: the availableNote beside it says the same thing
 * in words.
 */
export default function AvailDot({
  breathe = false,
  className,
}: {
  breathe?: boolean;
  className?: string;
}) {
  if (!profile.available) return null;
  return (
    <span
      aria-hidden="true"
      data-ambient={breathe ? "" : undefined}
      className={className ? `avail-dot ${className}` : "avail-dot"}
    />
  );
}
