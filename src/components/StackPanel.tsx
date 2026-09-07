import { stackGroups } from "@/content/site";
import Reveal from "./Reveal";

/**
 * Grouped by how often the tool is actually in hand, not by a made-up
 * percentage. A bar chart of "React 92%" is a lie with a nice gradient on it.
 */
export default function StackPanel() {
  return (
    <section id="stack" className="mx-auto max-w-[1400px] scroll-mt-24 px-5 py-24 sm:px-8 sm:py-32">
      <div className="border-line-soft mb-12 flex flex-wrap items-end justify-between gap-6 border-b pb-6">
        <h2 className="u-display text-ink text-[clamp(2.25rem,6vw,4.5rem)]">Stack</h2>
        <p className="u-mono text-dim max-w-xs text-[11px] leading-relaxed">
          Grouped by how often it is in my hands — not by a number I made up.
        </p>
      </div>

      <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-3">
        {stackGroups.map((group, groupIndex) => (
          <Reveal key={group.label} delay={groupIndex * 0.08}>
            <div className="u-panel u-chamfer h-full p-6 sm:p-8">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="u-mono text-ink text-sm tracking-[0.14em] uppercase">
                  {group.label}
                </h3>
                <span className="u-mono text-signal text-[11px]">
                  {String(group.items.length).padStart(2, "0")}
                </span>
              </div>
              <p className="text-dim mt-2 text-sm">{group.note}</p>

              <ul className="border-line-soft mt-7 border-t">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="border-line-soft text-muted hover:text-ink flex items-center gap-3 border-b py-2.5 text-sm transition-colors"
                  >
                    <span className="bg-primary/60 h-1 w-1 shrink-0 rotate-45" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
