import type { ReactNode } from "react";
import { profile } from "@/content/site";

type Variant = "voice" | "ghost" | "plain";

const LOOK: Record<Variant, string> = {
  // The big address in the closing room and on /contact: Ysabeau 300 at the
  // voice size. overflow-wrap:anywhere because a long address has no spaces
  // and would otherwise push a 320px viewport sideways.
  voice: "t-voice font-light text-ink u-link wrap-anywhere",
  // The "Email" pill beside the primary CTA in the hero.
  ghost: "btn btn-ghost",
  // Inherits its surroundings (the footer's "Say hello").
  plain: "u-link wrap-anywhere",
};

/**
 * A plain mailto link, rendered on the server. The old magnetic pull and its
 * permanent will-change are gone: the address is the target, and it holds
 * still. Copy-to-clipboard is a separate island (CopyEmail) set beside it.
 */
export default function EmailLink({
  variant = "voice",
  children,
  className,
}: {
  variant?: Variant;
  /** Defaults to the address itself, or "Email" for the ghost pill. */
  children?: ReactNode;
  className?: string;
}) {
  const label = children ?? (variant === "ghost" ? "Email" : profile.email);
  return (
    <a
      href={`mailto:${profile.email}`}
      className={className ? `${LOOK[variant]} ${className}` : LOOK[variant]}
    >
      {label}
    </a>
  );
}
