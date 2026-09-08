"use client";

import { motion, useReducedMotion } from "motion/react";
import type { FlowEdge, FlowNode } from "@/content/site";
import { useInView } from "@/lib/useInView";

/**
 * The architecture, drawn rather than screenshotted. This is what stands in
 * for a product shot on work whose source is private: you cannot see the UI,
 * but you can see exactly how a request moves through it.
 *
 * Paths use pathLength="1" so the travelling pulse is length-independent —
 * one keyframe animates every edge correctly regardless of its geometry.
 */

const NODE_W = 152;
const NODE_H = 62;
const COL = 200;
const ROW = 145;
const VIEW_W = 1000;
const VIEW_H = 420;

const x = (col: number) => 16 + (col - 1) * COL;
const y = (row: number) => 24 + (row - 1) * ROW;

const KIND_STROKE: Record<FlowNode["kind"], string> = {
  edge: "var(--color-line)",
  service: "color-mix(in oklch, var(--color-primary) 55%, transparent)",
  store: "color-mix(in oklch, var(--color-muted) 45%, transparent)",
  worker: "color-mix(in oklch, var(--color-signal) 55%, transparent)",
};

/**
 * Geometry for one edge. Parallel edges between the same two columns would
 * otherwise share a corridor and stack their labels on top of each other, so
 * each edge takes its vertical run at a slightly different fraction of the gap.
 */
function geometry(from: FlowNode, to: FlowNode, index: number) {
  const forward = to.col >= from.col;
  const sx = forward ? x(from.col) + NODE_W : x(from.col);
  const tx = forward ? x(to.col) : x(to.col) + NODE_W;
  const sy = y(from.row) + NODE_H / 2;
  const ty = y(to.row) + NODE_H / 2;
  const sameRow = from.row === to.row;

  const frac = 0.4 + (index % 3) * 0.1;
  const midX = sx + (tx - sx) * frac;

  return {
    d: sameRow ? `M ${sx} ${sy} H ${tx}` : `M ${sx} ${sy} H ${midX} V ${ty} H ${tx}`,
    // same-row labels sit above the line; elbow labels sit beside the vertical
    // run, which is unique to that edge
    label: sameRow
      ? { lx: sx + (tx - sx) / 2, ly: sy - 9, anchor: "middle" as const }
      : { lx: midX + 7, ly: (sy + ty) / 2 + 3, anchor: "start" as const },
  };
}

export default function FlowDiagram({
  nodes,
  edges,
  className,
}: {
  nodes: FlowNode[];
  edges: FlowEdge[];
  className?: string;
}) {
  const reduced = useReducedMotion();
  // packets are a compositor animation per edge; three screens away they are
  // pure battery drain
  const [wrapRef, inView] = useInView<HTMLDivElement>("150px");
  const byId = new Map(nodes.map((node) => [node.id, node]));

  return (
    <div ref={wrapRef} className={`-mx-1 overflow-x-auto pb-2 ${className ?? ""}`}>
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="h-auto w-full min-w-[680px]"
        role="img"
        aria-label={`Architecture: ${nodes.map((n) => n.label).join(", ")}`}
      >
        <defs>
          <marker
            id="flow-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-line)" />
          </marker>
        </defs>

        {edges.map((edge, index) => {
          const from = byId.get(edge.from);
          const to = byId.get(edge.to);
          if (!from || !to) return null;
          const { d, label } = geometry(from, to, index);

          return (
            <g key={`${edge.from}-${edge.to}`}>
              <motion.path
                d={d}
                fill="none"
                stroke="var(--color-line)"
                strokeWidth={1}
                strokeDasharray={edge.dashed ? "4 4" : undefined}
                markerEnd="url(#flow-arrow)"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                // only the timing varies for reduced motion; branching the
                // markup itself would be a hydration mismatch
                transition={{
                  duration: reduced ? 0 : 0.8,
                  delay: reduced ? 0 : index * 0.07,
                  ease: [0.16, 1, 0.3, 1],
                }}
              />

              {/* the packet — always rendered, hidden in CSS for reduced motion */}
              <path
                data-pulse
                d={d}
                fill="none"
                stroke="var(--color-signal)"
                strokeWidth={2}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray="0.045 0.955"
                style={{
                  animation: `flow-pulse 3.4s linear infinite`,
                  animationDelay: `${index * 0.42}s`,
                  animationPlayState: inView ? "running" : "paused",
                }}
              />

              {edge.label && (
                <text
                  x={label.lx}
                  y={label.ly}
                  textAnchor={label.anchor}
                  className="u-mono"
                  fontSize="10"
                  letterSpacing="0.08em"
                  fill="var(--color-dim)"
                >
                  {edge.label}
                </text>
              )}
            </g>
          );
        })}

        {nodes.map((node, index) => (
          <motion.g
            key={node.id}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: reduced ? 0 : 0.5,
              delay: reduced ? 0 : 0.1 + index * 0.05,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <rect
              x={x(node.col)}
              y={y(node.row)}
              width={NODE_W}
              height={NODE_H}
              fill="var(--color-surface)"
              stroke={KIND_STROKE[node.kind]}
              strokeWidth={1}
            />
            {/* machined corner tick */}
            <path
              d={`M ${x(node.col)} ${y(node.row) + 10} V ${y(node.row)} H ${x(node.col) + 10}`}
              fill="none"
              stroke={node.kind === "worker" ? "var(--color-signal)" : "var(--color-primary)"}
              strokeWidth={1.5}
            />
            <text
              x={x(node.col) + 14}
              y={y(node.row) + 27}
              fill="var(--color-ink)"
              fontSize="14"
              fontWeight="600"
            >
              {node.label}
            </text>
            {node.sub && (
              <text
                x={x(node.col) + 14}
                y={y(node.row) + 45}
                className="u-mono"
                fontSize="10"
                letterSpacing="0.06em"
                fill="var(--color-dim)"
              >
                {node.sub}
              </text>
            )}
          </motion.g>
        ))}
      </svg>
    </div>
  );
}
