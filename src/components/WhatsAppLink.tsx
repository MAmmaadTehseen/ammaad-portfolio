import { profile } from "@/content/site";

/** Opens with a line already typed, so the first message is never a blank box. */
const OPENER = "Hi Ammaad, I found you through your portfolio. ";

export default function WhatsAppLink({ className }: { className?: string }) {
  return (
    <a
      href={`https://wa.me/${profile.whatsapp.number}?text=${encodeURIComponent(OPENER)}`}
      target="_blank"
      rel="noreferrer noopener"
      data-cursor="WhatsApp"
      className={`group u-mono inline-flex items-center gap-2.5 text-[12px] tracking-[0.12em] uppercase transition-colors ${className ?? ""}`}
    >
      <span className="bg-primary h-1.5 w-1.5 rounded-full" aria-hidden />
      WhatsApp · {profile.whatsapp.display}
      <span
        className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        aria-hidden
      >
        ↗
      </span>
    </a>
  );
}
