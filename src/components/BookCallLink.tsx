import { profile } from "@/content/site";

/** The 30-minute intro call. `primary` is the filled button; otherwise a quiet link. */
export default function BookCallLink({
  primary = false,
  className,
}: {
  primary?: boolean;
  className?: string;
}) {
  return (
    <a
      href={profile.booking}
      target="_blank"
      rel="noreferrer noopener"
      className={
        primary
          ? `bg-signal text-bg u-mono inline-flex items-center gap-2 px-5 py-3 text-[11px] tracking-[0.14em] uppercase transition-opacity hover:opacity-90 ${className ?? ""}`
          : `group u-mono inline-flex items-center gap-2.5 text-[12px] tracking-[0.12em] uppercase transition-colors ${className ?? ""}`
      }
    >
      {!primary && <span className="bg-signal h-1.5 w-1.5 rounded-full" aria-hidden />}
      Book a 30-min call
      <span
        className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        aria-hidden
      >
        ↗
      </span>
    </a>
  );
}
