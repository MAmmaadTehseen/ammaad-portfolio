import { Fragment } from "react";
import { TIERS, showcase } from "@/content/site";
import type { Tier } from "@/content/site";

/**
 * What each tier is called in front of a client. site.ts keeps the short
 * internal labels ("Closed", "Open"); the reader should see what the tier
 * means for them. "Private source" is the first clause of the closed note, so
 * it changes if the note does, and "Open source" reads the open label the same
 * way.
 */
export const TIER_NAME: Record<Tier, string> = {
  live: TIERS.live.label,
  closed: TIERS.closed.note.split(" — ")[0].trim(),
  open: `${TIERS.open.label} source`,
};

const ORDER: Tier[] = ["live", "closed", "open"];

/**
 * The /work tier filter (DESIGN.md effect #20), with zero JavaScript.
 *
 * Four native radios. globals.css hides every [data-tier] row inside the
 * shared .tier-scope that does not match the checked one, through :has(). The
 * ids tier-all/live/closed/open are the contract with that rule. A browser
 * without :has() could never act on the choice, so the whole control only
 * appears where the selector is supported, and it never prints, because
 * print shows every row.
 *
 * Counts come from `showcase`, the rows the filter actually acts on. A tier
 * with no showcase project is left out rather than offered as an empty choice.
 */
export default function TierFilter({ className }: { className?: string }) {
  const count = (tier: Tier) =>
    showcase.filter((project) => project.tier === tier).length;
  const options = [
    { id: "all", label: "All", n: showcase.length },
    ...ORDER.map((tier) => ({
      id: tier,
      label: TIER_NAME[tier],
      n: count(tier),
    })).filter((option) => option.n > 0),
  ];

  return (
    <fieldset
      className={`hidden supports-[selector(:has(*))]:block print:hidden ${className ?? ""}`}
    >
      <legend className="sr-only">Show</legend>
      <div className="t-ui flex flex-wrap items-center gap-x-3 gap-y-1">
        {options.map((option, i) => (
          <Fragment key={option.id}>
            {i > 0 && (
              <span aria-hidden="true" className="text-faint">
                ·
              </span>
            )}
            <label className="choice inline-flex min-h-11 items-center gap-1.5 px-1">
              <input
                type="radio"
                name="tier"
                id={`tier-${option.id}`}
                value={option.id}
                defaultChecked={option.id === "all"}
              />
              {option.label}
              <span className="tabular-nums">{option.n}</span>
            </label>
          </Fragment>
        ))}
      </div>
    </fieldset>
  );
}
