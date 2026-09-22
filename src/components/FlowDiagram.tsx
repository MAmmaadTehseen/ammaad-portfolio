import type { CSSProperties } from "react";
import type { Project } from "@/content/site";
import {
  checkLayout,
  layoutFor,
  type Flow,
  type FlowKind,
  type FlowLayout,
  type LaidNode,
} from "@/lib/flow-geometry";
import { brand } from "@/lib/names";

/**
 * The architecture, drawn rather than screenshotted: how a request actually
 * moves through a system whose source is private.
 *
 * A server component. Everything that moves is CSS keyed off attributes an
 * island sets on the `.flow` wrapper (data-play, data-sent), so the markup
 * ships complete and lit: nothing here is hidden until JavaScript runs, and
 * there is no opacity="0" anywhere. Timing comes from --e on each edge and
 * --i on each node, both in flow order.
 *
 * Modes
 *   full      the detailed drawing, plus (by default) the transposed one for
 *             viewports of 700px and below, swapped by CSS, and the legend
 *   vertical  only the transposed drawing, always shown, plus the legend
 *   poster    the text-free silhouette, aria-hidden, for previews,
 *             backdrops and glyphs
 */

type Mode = "full" | "poster" | "vertical";

type Props = {
  project: Pick<Project, "id" | "name" | "flow">;
  mode: Mode;
  /**
   * full / vertical: wait dark until an island sets data-play (featured
   * stage panels, the case figure). Without it the drawing is simply there.
   */
  assemble?: boolean;
  /** full: also render the transposed SVG for narrow viewports. Default true. */
  vertical?: boolean;
  /** full / vertical: render the legend under the drawing. Default true. */
  legend?: boolean;
  /** On the `.flow` wrapper, or on the poster's <svg>. */
  className?: string;
  /** full: replaces the wide SVG's default sizing classes. */
  svgClassName?: string;
};

const KIND_LABEL: Record<FlowKind, string> = {
  edge: "Entry point",
  service: "Service",
  store: "Data store",
  worker: "Background job",
};

// poster silhouettes tell the kinds apart by fill alone
const POSTER_FILL: Record<FlowKind, string> = {
  edge: "var(--muted)",
  service: "var(--glow)",
  store: "var(--ink-2)",
  worker: "var(--dim)",
};

const cx = (...parts: (string | false | undefined)[]) => parts.filter(Boolean).join(" ");
const plural = (n: number, one: string) => `${n} ${one}${n === 1 ? "" : "s"}`;

export function flowLabel(project: Pick<Project, "name" | "flow">): string {
  const flow = project.flow;
  if (!flow) return "";
  return `How ${brand(project.name)} fits together: ${plural(flow.nodes.length, "part")}, ${plural(flow.edges.length, "connection")}`;
}

export default function FlowDiagram({
  project,
  mode,
  assemble = false,
  vertical = true,
  legend = true,
  className,
  svgClassName,
}: Props) {
  const flow = project.flow;
  if (!flow) return null;

  if (mode === "poster") {
    const laid = layoutFor(project, "full")!;
    return <Poster laid={laid} className={className} />;
  }

  const label = flowLabel(project);
  const wide = mode === "full" ? layoutFor(project, "full")! : undefined;
  const tall = mode === "vertical" || vertical ? layoutFor(project, "vertical")! : undefined;
  if (process.env.NODE_ENV === "development") {
    if (wide) warnOnce(project.id, wide);
    if (tall) warnOnce(project.id, tall);
  }

  return (
    <div
      className={cx("flow min-w-0", className)}
      data-assemble={assemble ? "" : undefined}
      // lets an island time the packet pass (edges x 60 + 900ms) without
      // shipping project data to the client
      data-edges={flow.edges.length}
    >
      {/* a safety net: if a container is ever narrower than the drawing's
          floor, it scrolls rather than shrinking labels past legibility */}
      <div className="min-w-0 overflow-x-auto overscroll-x-contain">
        {wide && (
          <Drawing
            laid={wide}
            label={label}
            className={cx(tall && "flow-full", svgClassName ?? "block h-auto w-full min-w-[640px]")}
          />
        )}
        {tall && (
          <Drawing
            laid={tall}
            label={label}
            // capped at 1:1 so a two-row system is not blown up to fill a phone
            className={cx(mode === "full" && "flow-vertical", "mx-auto block h-auto w-full")}
            style={{ maxWidth: tall.width }}
          />
        )}
      </div>
      {legend && <FlowLegend flow={flow} />}
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Drawing({
  laid,
  label,
  className,
  style,
}: {
  laid: FlowLayout;
  label: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg viewBox={laid.viewBox} role="img" aria-label={label} className={className} style={style}>
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {laid.edges.map((edge) => (
          <g key={`${edge.index}-${edge.from}-${edge.to}`} style={{ "--e": edge.order } as CSSProperties}>
            {edge.dashed ? (
              // scheduled or async; keeps its 6 6 dash, so it fades in instead of drawing
              <path className="edge-dash" d={edge.d} stroke="var(--line-strong)" strokeWidth={1.4} strokeDasharray="6 6" />
            ) : (
              <path className="edge" d={edge.d} pathLength={1} stroke="var(--line-strong)" strokeWidth={1.4} />
            )}
            {/* a path of its own rather than a <marker>, so it can arrive after
                its edge has drawn, and ids never collide between SVGs */}
            <path className="edge-head" d={edge.head} stroke="var(--muted)" strokeWidth={1.4} />
            <path className="pk" d={edge.d} pathLength={1} stroke="var(--glow)" strokeWidth={3} />
          </g>
        ))}
      </g>

      {laid.chips.length > 0 && (
        <g>
          {laid.chips.map((chip, i) => (
            <g key={`${i}-${chip.text}`}>
              <rect
                x={chip.x}
                y={chip.y}
                width={chip.w}
                height={chip.h}
                rx={chip.h / 2}
                fill="var(--bg-deep)"
                stroke="var(--line)"
              />
              <text x={chip.cx} y={chip.baseline} textAnchor="middle" fontSize={13} fill="var(--muted)">
                {chip.text}
              </text>
            </g>
          ))}
        </g>
      )}

      {laid.nodes.map((node) => (
        <Node key={node.id} node={node} />
      ))}
    </svg>
  );
}

function Node({ node }: { node: LaidNode }) {
  return (
    <g style={{ "--i": node.order } as CSSProperties}>
      {node.back && (
        <rect
          className="node-box"
          x={node.back.x}
          y={node.back.y}
          width={node.back.w}
          height={node.back.h}
          rx={10}
          fill="var(--lit)"
          stroke="var(--line)"
        />
      )}
      <rect
        className="node-box"
        x={node.x}
        y={node.y}
        width={node.w}
        height={node.h}
        rx={node.rx}
        fill="var(--lit)"
        stroke="var(--line)"
      />
      {node.badge && (
        // a circular arrow on the top edge: this part runs on its own
        <g transform={`translate(${node.badge.x} ${node.badge.y})`}>
          <circle r={10} fill="var(--bg-deep)" stroke="var(--line)" />
          <path
            d="M-5 0A5 5 0 1 0 0-5M3-8L0-5L3-2"
            fill="none"
            stroke="var(--muted)"
            strokeWidth={1.4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      )}
      <text x={node.cx} y={node.labelY} textAnchor="middle" fontSize={17} fontWeight={500} fill="var(--ink)">
        {node.label}
      </text>
      {node.sub && node.subY !== undefined && (
        <text x={node.cx} y={node.subY} textAnchor="middle" fontSize={13.5} fill="var(--muted)">
          {node.sub}
        </text>
      )}
    </g>
  );
}

function Poster({ laid, className }: { laid: FlowLayout; className?: string }) {
  return (
    <svg viewBox={laid.posterViewBox} aria-hidden="true" focusable="false" className={className}>
      {/* one group at 45%, so crossings do not darken where lines overlap */}
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth={5}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.45}
      >
        {laid.edges.map((edge) => (
          <path key={edge.index} d={edge.d} />
        ))}
      </g>
      {laid.nodes.map((node) => (
        <g key={node.id} fill={POSTER_FILL[node.kind]}>
          {node.back && (
            <rect x={node.back.x} y={node.back.y} width={node.back.w} height={node.back.h} rx={10} fillOpacity={0.55} />
          )}
          <rect x={node.x} y={node.y} width={node.w} height={node.h} rx={node.rx} />
        </g>
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */

/**
 * What the shapes mean. Only the kinds this diagram uses are listed, plus
 * the dashed line when there is one.
 */
export function FlowLegend({ flow, className }: { flow: Flow; className?: string }) {
  const kinds = (Object.keys(KIND_LABEL) as FlowKind[]).filter((kind) =>
    flow.nodes.some((node) => node.kind === kind),
  );
  const dashed = flow.edges.some((edge) => edge.dashed);

  return (
    <ul className={cx("t-legend mt-4 flex flex-wrap gap-x-5 gap-y-2", className)}>
      {kinds.map((kind) => (
        <li key={kind} className="inline-flex items-center gap-2">
          <Swatch kind={kind} />
          {KIND_LABEL[kind]}
        </li>
      ))}
      {dashed && (
        <li className="inline-flex items-center gap-2">
          <svg viewBox="0 0 28 16" aria-hidden="true" className="h-4 w-7 shrink-0">
            <path d="M1 8H27" stroke="var(--line-strong)" strokeWidth={1.4} strokeDasharray="4 3" />
          </svg>
          Scheduled
        </li>
      )}
    </ul>
  );
}

function Swatch({ kind }: { kind: FlowKind }) {
  const box = { fill: "var(--lit)", stroke: "var(--line-strong)" };
  return (
    <svg viewBox="0 0 28 16" aria-hidden="true" className="h-4 w-7 shrink-0">
      {kind === "edge" && <rect x={1} y={2} width={26} height={12} rx={6} {...box} />}
      {kind === "service" && <rect x={1} y={2} width={26} height={12} rx={3} {...box} />}
      {kind === "store" && (
        <>
          <rect x={4} y={1} width={23} height={11} rx={3} {...box} />
          <rect x={1} y={4} width={23} height={11} rx={3} {...box} />
        </>
      )}
      {kind === "worker" && (
        <>
          <rect x={1} y={4} width={26} height={11} rx={3} {...box} />
          <circle cx={20} cy={4} r={3.5} fill="var(--bg-deep)" stroke="var(--line-strong)" />
        </>
      )}
    </svg>
  );
}

/* ------------------------------------------------------------------ */

// scripts/check-flows.ts is the gate; this only makes a broken diagram
// loud while editing site.ts, once per diagram rather than per render
const warned = new Set<string>();
function warnOnce(id: string, laid: FlowLayout) {
  const key = `${id}:${laid.mode}`;
  if (warned.has(key)) return;
  warned.add(key);
  const errors = checkLayout(laid);
  if (errors.length) console.warn(`[flow] ${id} (${laid.mode}):\n  ${errors.join("\n  ")}`);
}
