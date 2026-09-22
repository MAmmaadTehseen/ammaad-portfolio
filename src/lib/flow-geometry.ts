import type { FlowEdge, FlowNode, Project } from "@/content/site";

/**
 * The geometry behind every architecture diagram, kept pure so the server
 * component, the OG cards and scripts/check-flows.ts all read the same
 * numbers. Nothing here touches React or the DOM.
 *
 * Layout happens on an abstract grid: u runs along the flow (site.ts `col`,
 * 1-5) and v across it (`row`, 1-3). The two geometric modes only differ in
 * how u and v map to x and y:
 *   full      u -> x, v -> y   (wide, for containers of 700px and up)
 *   vertical  u -> y, v -> x   (the transposed layout, about 600 x 1150)
 * Nodes stay 156 x 64 and upright in both, so labels never rotate.
 *
 * Every coordinate that reaches the markup is an integer: constants are
 * even, and anything halved is halved from an even number.
 */

export type Flow = NonNullable<Project["flow"]>;
export type FlowKind = FlowNode["kind"];
export type FlowMode = "full" | "vertical";

export type Pt = { x: number; y: number };
export type Rect = { x: number; y: number; w: number; h: number };

export type LaidNode = FlowNode & {
  /** position in site.ts, for keys */
  index: number;
  /** assembly order: along the flow, then across it (drives --i) */
  order: number;
  /** the main shape, top-left */
  x: number;
  y: number;
  w: number;
  h: number;
  /** corner radius of the main shape: pills for the outside world */
  rx: number;
  /** stores: the second box, 5u behind */
  back?: Rect;
  /** workers: centre of the circular-arrow badge on the top edge */
  badge?: Pt;
  /** every box the node paints, for collision checks */
  boxes: Rect[];
  /** label and sub baselines (text is centred on cx) */
  cx: number;
  labelY: number;
  subY?: number;
};

export type Chip = Rect & { text: string; cx: number; cy: number; baseline: number };

export type LaidEdge = {
  /** position in site.ts, for keys */
  index: number;
  /** drawing order: by where the edge starts along the flow (drives --e) */
  order: number;
  from: string;
  to: string;
  label?: string;
  dashed: boolean;
  /** the routed polyline, corners unrounded */
  points: Pt[];
  /** the rounded path: 10u elbows */
  d: string;
  /** open chevron at the target end */
  head: string;
  headBox: Rect;
  chip?: Chip;
};

export type FlowLayout = {
  mode: FlowMode;
  width: number;
  height: number;
  viewBox: string;
  /** the same drawing cropped without chips, for the text-free poster */
  posterViewBox: string;
  nodes: LaidNode[];
  edges: LaidEdge[];
  chips: Chip[];
};

/* ------------------------------------------------------------------ */
/* Dimensions (u = user units of the viewBox)                          */
/* ------------------------------------------------------------------ */

export const NODE_W = 156;
export const NODE_H = 64;
/** text sizes in u: node label, node sub, edge chip */
export const TEXT = { label: 17, sub: 13.5, chip: 13 } as const;

const ELBOW = 10;
const ARROW = { back: 7, half: 5, gap: 2 } as const;
const CHIP = { h: 22, padX: 9 } as const;
const PAD = 12;
const STORE_OFFSET = 5;
const BADGE_R = 10;
/** clearance a chip keeps from nodes, other chips and arrowheads */
const CLEAR = 4;
/** the break two runs need before they may share a track in one gap */
const LANE_REUSE = 48;

type Side = "u+" | "u-" | "v+" | "v-";
type XYSide = "right" | "left" | "bottom" | "top";

type ModeSpec = {
  /** node extent along u and v */
  nodeU: number;
  nodeV: number;
  /** gap between columns (along u) and between rows (along v) */
  gapU: number;
  gapV: number;
  /** spacing between parallel runs sharing a gap */
  laneStep: number;
  xy: (u: number, v: number) => Pt;
  side: Record<Side, XYSide>;
};

const MODES: Record<FlowMode, ModeSpec> = {
  // the column gap is wide enough to hold the longest chip on a straight
  // run with its arrowhead still clear; rows only need room for elbows
  full: {
    nodeU: NODE_W,
    nodeV: NODE_H,
    gapU: 112,
    gapV: 64,
    laneStep: 16,
    xy: (u, v) => ({ x: u, y: v }),
    side: { "u+": "right", "u-": "left", "v+": "bottom", "v-": "top" },
  },
  // side by side the rows sit close, so a 600u-wide drawing still holds
  // three nodes; the flow gets the height instead
  vertical: {
    nodeU: NODE_H,
    nodeV: NODE_W,
    gapU: 192,
    gapV: 56,
    laneStep: 24,
    xy: (u, v) => ({ x: v, y: u }),
    side: { "u+": "bottom", "u-": "top", "v+": "right", "v-": "left" },
  },
};

/**
 * Per-edge nudges for a chip, applied after automatic placement. Keyed by
 * project id, then "from>to", then mode. Automatic placement already avoids
 * nodes, other chips and arrowheads, so this exists only for taste: moving a
 * label off a line it happens to cross. Content in site.ts never changes.
 */
export const LABEL_OFFSETS: Record<
  string,
  Record<string, Partial<Record<FlowMode, { dx?: number; dy?: number }>>>
> = {};

/* ------------------------------------------------------------------ */
/* Text measure                                                        */
/* ------------------------------------------------------------------ */

// Approximate advance widths for Afacad Flux, in em, rounded up. The build
// has no font to measure with, so this errs wide: a chip a few units too
// roomy is invisible, a chip that clips its label is not.
const NARROW = new Set([..."ijl.,:;'|!"]);
const SLIM = new Set([..."ftrI()[]-/"]);
const WIDE = new Set([..."mw"]);
const WIDEST = new Set([..."MW@—"]);

export function textWidth(text: string, size: number, weight = 400): number {
  let em = 0;
  for (const ch of text) {
    if (ch === " ") em += 0.24;
    else if (ch === "·") em += 0.26;
    else if (NARROW.has(ch)) em += 0.25;
    else if (SLIM.has(ch)) em += 0.34;
    else if (WIDE.has(ch)) em += 0.76;
    else if (WIDEST.has(ch)) em += 0.88;
    else if (/[0-9]/.test(ch)) em += 0.53;
    else if (/[A-Z]/.test(ch)) em += 0.62;
    else em += 0.51;
  }
  return em * size * (weight >= 500 ? 1.04 : 1);
}

/* ------------------------------------------------------------------ */
/* Small geometry helpers                                              */
/* ------------------------------------------------------------------ */

const inflate = (r: Rect, by: number): Rect => ({
  x: r.x - by,
  y: r.y - by,
  w: r.w + by * 2,
  h: r.h + by * 2,
});

export function rectsOverlap(a: Rect, b: Rect): boolean {
  return a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
}

/** Does the axis-aligned segment p-q pass through the rectangle? */
export function segmentHitsRect(p: Pt, q: Pt, r: Rect): boolean {
  // strict on both axes, so a run that only grazes an edge does not count
  return (
    Math.max(p.x, q.x) > r.x &&
    Math.min(p.x, q.x) < r.x + r.w &&
    Math.max(p.y, q.y) > r.y &&
    Math.min(p.y, q.y) < r.y + r.h
  );
}

const sign = (n: number) => (n > 0 ? 1 : n < 0 ? -1 : 0);

/** Drop repeated points and merge collinear runs. */
function simplify(points: Pt[]): Pt[] {
  const out: Pt[] = [];
  for (const p of points) {
    const last = out[out.length - 1];
    if (last && last.x === p.x && last.y === p.y) continue;
    out.push(p);
    while (out.length >= 3) {
      const [a, b, c] = out.slice(-3);
      const collinear = (a.x === b.x && b.x === c.x) || (a.y === b.y && b.y === c.y);
      if (!collinear) break;
      out.splice(out.length - 2, 1);
    }
  }
  return out;
}

/** A polyline with each corner rounded to at most ELBOW units. */
function roundedPath(points: Pt[]): string {
  const parts = [`M${points[0].x} ${points[0].y}`];
  for (let i = 1; i < points.length - 1; i++) {
    const [a, b, c] = [points[i - 1], points[i], points[i + 1]];
    const inLen = Math.abs(b.x - a.x) + Math.abs(b.y - a.y);
    const outLen = Math.abs(c.x - b.x) + Math.abs(c.y - b.y);
    // halved runs can meet a neighbouring corner halfway, never overlap it
    const r = Math.min(ELBOW, Math.floor(inLen / 2), Math.floor(outLen / 2));
    if (r < 1) {
      parts.push(`L${b.x} ${b.y}`);
      continue;
    }
    const din = { x: sign(b.x - a.x), y: sign(b.y - a.y) };
    const dout = { x: sign(c.x - b.x), y: sign(c.y - b.y) };
    const sweep = din.x * dout.y - din.y * dout.x > 0 ? 1 : 0;
    parts.push(`L${b.x - din.x * r} ${b.y - din.y * r}`);
    parts.push(`A${r} ${r} 0 0 ${sweep} ${b.x + dout.x * r} ${b.y + dout.y * r}`);
  }
  const end = points[points.length - 1];
  parts.push(`L${end.x} ${end.y}`);
  return parts.join("");
}

function arrowHead(points: Pt[]): { d: string; box: Rect } {
  const tip = points[points.length - 1];
  const prev = points[points.length - 2];
  const dir = { x: sign(tip.x - prev.x), y: sign(tip.y - prev.y) };
  const perp = { x: -dir.y, y: dir.x };
  const bx = tip.x - dir.x * ARROW.back;
  const by = tip.y - dir.y * ARROW.back;
  const a = { x: bx + perp.x * ARROW.half, y: by + perp.y * ARROW.half };
  const b = { x: bx - perp.x * ARROW.half, y: by - perp.y * ARROW.half };
  const xs = [a.x, b.x, tip.x];
  const ys = [a.y, b.y, tip.y];
  return {
    d: `M${a.x} ${a.y}L${tip.x} ${tip.y}L${b.x} ${b.y}`,
    box: {
      x: Math.min(...xs),
      y: Math.min(...ys),
      w: Math.max(...xs) - Math.min(...xs),
      h: Math.max(...ys) - Math.min(...ys),
    },
  };
}

/* ------------------------------------------------------------------ */
/* Routing                                                             */
/* ------------------------------------------------------------------ */

type Plan =
  /** along the flow: out of one node's side, one run across, into the other */
  | { kind: "elbow"; sA: Side; sB: Side; gap: number }
  /** same column, cells between empty: straight across the flow */
  | { kind: "across"; sA: Side; sB: Side }
  /** anything else goes round through a row channel */
  | { kind: "detour"; sA: Side; sB: Side; gapA: number; gapB: number; channel: number };

type Endpoint = { edge: number; node: FlowNode; other: FlowNode; side: Side; turn: number };

/**
 * Lay out one flow. Cached per flow object and mode, because a page can
 * render the same project three times (poster, full and vertical).
 */
const cache = new WeakMap<Flow, Map<string, FlowLayout>>();

export function layout(flow: Flow, mode: FlowMode = "full", key?: string): FlowLayout {
  const cacheKey = `${mode}:${key ?? ""}`;
  let byMode = cache.get(flow);
  const hit = byMode?.get(cacheKey);
  if (hit) return hit;
  const result = compute(flow, mode, key);
  if (!byMode) cache.set(flow, (byMode = new Map()));
  byMode.set(cacheKey, result);
  return result;
}

/** Convenience: a project's diagram, with its label overrides applied. */
export function layoutFor(project: Pick<Project, "id" | "flow">, mode: FlowMode = "full") {
  return project.flow ? layout(project.flow, mode, project.id) : undefined;
}

function compute(flow: Flow, mode: FlowMode, key?: string): FlowLayout {
  const spec = MODES[mode];
  const pitchU = spec.nodeU + spec.gapU;
  const pitchV = spec.nodeV + spec.gapV;
  const cols = flow.nodes.map((n) => n.col);
  const rows = flow.nodes.map((n) => n.row);
  const minCol = Math.min(...cols);
  const minRow = Math.min(...rows);
  const byId = new Map(flow.nodes.map((n) => [n.id, n]));
  const occupied = new Set(flow.nodes.map((n) => `${n.col},${n.row}`));
  const isFree = (col: number, row: number) => !occupied.has(`${col},${row}`);

  // abstract positions
  const u0 = (col: number) => (col - minCol) * pitchU;
  const v0 = (row: number) => (row - minRow) * pitchV;
  const gapU = (k: number) => u0(k) + spec.nodeU + spec.gapU / 2; // between col k and k+1
  const channelV = (j: number) => v0(j) + spec.nodeV + spec.gapV / 2; // between row j and j+1

  // a store's back box pushes two of its sides out by 5u
  const extension = (node: FlowNode, side: Side) =>
    node.kind === "store" && (spec.side[side] === "right" || spec.side[side] === "top")
      ? STORE_OFFSET
      : 0;

  /* ---- 1. plan each edge ---- */
  const plans: (Plan | null)[] = flow.edges.map((edge) => {
    const a = byId.get(edge.from);
    const b = byId.get(edge.to);
    if (!a || !b || a === b) return null;
    const dc = b.col - a.col;
    const dr = b.row - a.row;

    if (dc === 0) {
      const lo = Math.min(a.row, b.row);
      const hi = Math.max(a.row, b.row);
      let clear = true;
      for (let r = lo + 1; r < hi; r++) if (!isFree(a.col, r)) clear = false;
      if (clear) return { kind: "across", sA: dr > 0 ? "v+" : "v-", sB: dr > 0 ? "v-" : "v+" };
      // blocked in its own column: leave and return on the downstream side
      return { kind: "elbow", sA: "u+", sB: "u+", gap: a.col };
    }

    const s = sign(dc);
    const sA: Side = s > 0 ? "u+" : "u-";
    const sB: Side = s > 0 ? "u-" : "u+";
    // gap k sits between col k and k+1; try the ones nearest the target
    // first, so edges converging on a node share its approach
    const lo = Math.min(a.col, b.col);
    const hi = Math.max(a.col, b.col);
    const gaps: number[] = [];
    for (let k = lo; k < hi; k++) gaps.push(k);
    if (s > 0) gaps.reverse();
    for (const k of gaps) {
      // cells the source row crosses before the turn, then the target row after it
      const srcCells = s > 0 ? range(a.col + 1, k) : range(k + 1, a.col - 1);
      const dstCells = s > 0 ? range(k + 1, b.col - 1) : range(b.col + 1, k);
      if (srcCells.every((c) => isFree(c, a.row)) && dstCells.every((c) => isFree(c, b.row))) {
        return { kind: "elbow", sA, sB, gap: k };
      }
    }
    // no single turn works: step out beside the source, travel a row
    // channel, and step back in beside the target
    const gapA = s > 0 ? a.col : a.col - 1;
    const gapB = s > 0 ? b.col - 1 : b.col;
    const channel = dr > 0 ? a.row : dr < 0 ? a.row - 1 : a.row > minRow ? a.row - 1 : a.row;
    return { kind: "detour", sA, sB, gapA, gapB, channel };
  });

  /* ---- 2. ports: spread every side's endpoints so arrows never stack ---- */
  const endpoints: Endpoint[] = [];
  plans.forEach((plan, i) => {
    if (!plan) return;
    const a = byId.get(flow.edges[i].from)!;
    const b = byId.get(flow.edges[i].to)!;
    const turnA = plan.kind === "elbow" ? Math.abs(plan.gap + 0.5 - a.col) : plan.kind === "detour" ? 0.5 : 0;
    const turnB = plan.kind === "elbow" ? Math.abs(plan.gap + 0.5 - b.col) : plan.kind === "detour" ? 0.5 : 0;
    endpoints.push({ edge: i, node: a, other: b, side: plan.sA, turn: turnA });
    endpoints.push({ edge: i, node: b, other: a, side: plan.sB, turn: turnB });
  });

  const portOf = new Map<string, Pt>(); // `${edge}:${nodeId}` -> abstract point
  const groups = new Map<string, Endpoint[]>();
  for (const ep of endpoints) {
    const k = `${ep.node.id}|${ep.side}`;
    groups.set(k, [...(groups.get(k) ?? []), ep]);
  }
  for (const group of groups.values()) {
    const { node, side } = group[0];
    const alongV = side === "u+" || side === "u-";
    // runs that turn towards a neighbour sit on the near side of the port
    // row, and nearer turns sit outermost, so they never cross each other
    const sortKey = (ep: Endpoint) => {
      if (!alongV) return ep.other.col * 10;
      const dv = ep.other.row - node.row;
      return ep.other.row * 10 + (dv < 0 ? ep.turn : dv > 0 ? -ep.turn : 0);
    };
    group.sort((p, q) => sortKey(p) - sortKey(q) || p.edge - q.edge);
    const length = alongV ? spec.nodeV : spec.nodeU;
    let step = length >= 100 ? 24 : 16;
    while (step > 4 && (group.length - 1) * step > length - 20) step -= 2;
    group.forEach((ep, i) => {
      const offset = ((2 * i - (group.length - 1)) * step) / 2;
      const ext = extension(node, side);
      const uN = u0(node.col);
      const vN = v0(node.row);
      let p: Pt;
      if (side === "u+") p = { x: uN + spec.nodeU + ext, y: vN + spec.nodeV / 2 + offset };
      else if (side === "u-") p = { x: uN - ext, y: vN + spec.nodeV / 2 + offset };
      else if (side === "v+") p = { x: uN + spec.nodeU / 2 + offset, y: vN + spec.nodeV + ext };
      else p = { x: uN + spec.nodeU / 2 + offset, y: vN - ext };
      // abstract (u, v) stored in x/y; the target end stops short for the arrowhead
      const isTarget = flow.edges[ep.edge].to === node.id && ep.other.id === flow.edges[ep.edge].from;
      if (isTarget) {
        const out = side === "u+" || side === "v+" ? 1 : -1;
        if (alongV) p.x += out * ARROW.gap;
        else p.y += out * ARROW.gap;
      }
      portOf.set(`${ep.edge}:${node.id}`, p);
    });
  }

  // A same-row edge whose ports landed a few units apart would draw a tiny
  // jog that reads as a glitch. When either end has its side to itself, that
  // end slides to meet the other and the edge runs straight.
  plans.forEach((plan, i) => {
    if (!plan || plan.kind !== "elbow") return;
    const edge = flow.edges[i];
    const a = byId.get(edge.from)!;
    const b = byId.get(edge.to)!;
    if (a.row !== b.row) return;
    const pa = portOf.get(`${i}:${a.id}`)!;
    const pb = portOf.get(`${i}:${b.id}`)!;
    if (pa.y === pb.y) return;
    if (groups.get(`${b.id}|${plan.sB}`)!.length === 1) pb.y = pa.y;
    else if (groups.get(`${a.id}|${plan.sA}`)!.length === 1) pa.y = pb.y;
  });

  // detours sharing a row channel take distinct tracks in it too:
  // 0, +step, -step, +2 step ...
  const channelTrack = new Map<number, number>();
  const perChannel = new Map<number, number>();
  plans.forEach((plan, i) => {
    if (plan?.kind !== "detour") return;
    const k = perChannel.get(plan.channel) ?? 0;
    perChannel.set(plan.channel, k + 1);
    const offset = (k % 2 === 1 ? 1 : -1) * Math.ceil(k / 2) * spec.laneStep;
    channelTrack.set(i, channelV(plan.channel) + offset);
  });

  /* ---- 3. lanes: parallel runs in one gap take distinct tracks ---- */
  type Run = { edge: number; gap: number; lo: number; hi: number; slot: "a" | "b" };
  const runs: Run[] = [];
  plans.forEach((plan, i) => {
    if (!plan || plan.kind === "across") return;
    const pa = portOf.get(`${i}:${flow.edges[i].from}`)!;
    const pb = portOf.get(`${i}:${flow.edges[i].to}`)!;
    if (plan.kind === "elbow") {
      runs.push({ edge: i, gap: plan.gap, lo: Math.min(pa.y, pb.y), hi: Math.max(pa.y, pb.y), slot: "a" });
    } else {
      const c = channelTrack.get(i)!;
      runs.push({ edge: i, gap: plan.gapA, lo: Math.min(pa.y, c), hi: Math.max(pa.y, c), slot: "a" });
      runs.push({ edge: i, gap: plan.gapB, lo: Math.min(pb.y, c), hi: Math.max(pb.y, c), slot: "b" });
    }
  });
  const laneU = new Map<string, number>(); // `${edge}:${slot}` -> u
  const byGap = new Map<number, Run[]>();
  for (const run of runs) byGap.set(run.gap, [...(byGap.get(run.gap) ?? []), run]);
  for (const [gap, list] of byGap) {
    // a straight run (lo === hi) has no cross track and needs no lane
    const crossing = list.filter((r) => r.hi > r.lo).sort((p, q) => p.lo - q.lo || p.hi - q.hi);
    const lanes: number[] = [];
    const laneOf = new Map<Run, number>();
    for (const run of crossing) {
      // a lane is reused only after a clear break; two runs meeting end to
      // end on one track would read as a single line
      let lane = lanes.findIndex((end) => end + LANE_REUSE < run.lo);
      if (lane === -1) lane = lanes.push(run.hi) - 1;
      else lanes[lane] = run.hi;
      laneOf.set(run, lane);
    }
    for (const run of list) {
      const lane = laneOf.get(run) ?? 0;
      const n = Math.max(lanes.length, 1);
      laneU.set(`${run.edge}:${run.slot}`, gapU(gap) + ((2 * lane - (n - 1)) * spec.laneStep) / 2);
    }
  }

  /* ---- 4. polylines in abstract space, then mapped to x/y ---- */
  const toXY = (p: Pt) => spec.xy(p.x, p.y);
  const polylines: (Pt[] | null)[] = plans.map((plan, i) => {
    if (!plan) return null;
    const pa = portOf.get(`${i}:${flow.edges[i].from}`)!;
    const pb = portOf.get(`${i}:${flow.edges[i].to}`)!;
    let abstract: Pt[];
    if (plan.kind === "across") {
      // ports sit on the v sides here: x holds u, y holds v
      const mid = Math.round((pa.y + pb.y) / 2);
      abstract = [pa, { x: pa.x, y: mid }, { x: pb.x, y: mid }, pb];
    } else if (plan.kind === "elbow") {
      const lu = laneU.get(`${i}:a`)!;
      abstract = [pa, { x: lu, y: pa.y }, { x: lu, y: pb.y }, pb];
    } else {
      const la = laneU.get(`${i}:a`)!;
      const lb = laneU.get(`${i}:b`)!;
      const c = channelTrack.get(i)!;
      abstract = [pa, { x: la, y: pa.y }, { x: la, y: c }, { x: lb, y: c }, { x: lb, y: pb.y }, pb];
    }
    return simplify(abstract.map(toXY));
  });

  /* ---- 5. nodes in x/y ---- */
  const flowOrder = [...flow.nodes].sort((p, q) => p.col - q.col || p.row - q.row);
  const nodes: LaidNode[] = flow.nodes.map((node, index) => {
    const tl = spec.xy(u0(node.col), v0(node.row));
    const x = tl.x;
    const y = tl.y;
    const main: Rect = { x, y, w: NODE_W, h: NODE_H };
    const boxes: Rect[] = [main];
    let back: Rect | undefined;
    let badge: Pt | undefined;
    if (node.kind === "store") {
      back = { x: x + STORE_OFFSET, y: y - STORE_OFFSET, w: NODE_W, h: NODE_H };
      boxes.push(back);
    }
    if (node.kind === "worker") {
      badge = { x: x + NODE_W - 22, y };
      boxes.push({ x: badge.x - BADGE_R, y: badge.y - BADGE_R, w: BADGE_R * 2, h: BADGE_R * 2 });
    }
    return {
      ...node,
      index,
      order: flowOrder.indexOf(node),
      x,
      y,
      w: NODE_W,
      h: NODE_H,
      rx: node.kind === "edge" ? NODE_H / 2 : 10,
      back,
      badge,
      boxes,
      cx: x + NODE_W / 2,
      labelY: node.sub ? y + 29 : y + 38,
      subY: node.sub ? y + 48 : undefined,
    };
  });

  /* ---- 6. edges, arrowheads, then chips placed clear of everything ---- */
  const edgeOrder = flow.edges
    .map((edge, i) => ({ i, a: byId.get(edge.from), b: byId.get(edge.to) }))
    .sort(
      (p, q) =>
        (p.a?.col ?? 0) - (q.a?.col ?? 0) ||
        (p.b?.col ?? 0) - (q.b?.col ?? 0) ||
        (p.a?.row ?? 0) - (q.a?.row ?? 0) ||
        p.i - q.i,
    )
    .map((e) => e.i);

  const edges: LaidEdge[] = [];
  flow.edges.forEach((edge: FlowEdge, i) => {
    const points = polylines[i];
    if (!points || points.length < 2) return;
    const head = arrowHead(points);
    edges.push({
      index: i,
      order: edgeOrder.indexOf(i),
      from: edge.from,
      to: edge.to,
      label: edge.label,
      dashed: Boolean(edge.dashed),
      points,
      d: "",
      head: head.d,
      headBox: head.box,
    });
  });

  const nodeBoxes = nodes.flatMap((n) => n.boxes.map((b) => inflate(b, CLEAR)));
  const headBoxes = edges.map((e) => inflate(e.headBox, 2));
  const chips: Chip[] = [];
  const crossIsVertical = mode === "full";
  const overrides = key ? LABEL_OFFSETS[key] : undefined;

  for (const edge of edges) {
    if (!edge.label) continue;
    const w = Math.ceil((textWidth(edge.label, TEXT.chip) + CHIP.padX * 2) / 2) * 2;
    const h = CHIP.h;

    // the run across the flow reads as "this edge", so it is tried first;
    // then the longer runs; each at its middle, then fanning outwards
    const segments = edge.points.slice(1).map((q, s) => ({ p: edge.points[s], q }));
    const isCross = (seg: { p: Pt; q: Pt }) => (crossIsVertical ? seg.p.x === seg.q.x : seg.p.y === seg.q.y);
    const length = (seg: { p: Pt; q: Pt }) => Math.abs(seg.q.x - seg.p.x) + Math.abs(seg.q.y - seg.p.y);
    const ordered = [
      ...segments.filter(isCross).sort((s, t) => length(t) - length(s)),
      ...segments.filter((s) => !isCross(s)).sort((s, t) => length(t) - length(s)),
    ];

    let best: { rect: Rect; cost: number } | null = null;
    for (const seg of ordered) {
      for (const t of [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8]) {
        const cx = Math.round(seg.p.x + (seg.q.x - seg.p.x) * t);
        const cy = Math.round(seg.p.y + (seg.q.y - seg.p.y) * t);
        const rect: Rect = { x: cx - w / 2, y: cy - h / 2, w, h };
        const hard =
          nodeBoxes.some((b) => rectsOverlap(rect, b)) ||
          headBoxes.some((b) => rectsOverlap(rect, b)) ||
          chips.some((c) => rectsOverlap(rect, inflate(c, CLEAR)));
        if (hard) continue;
        // soft: lines of other edges running under the label
        const cost = edges
          .filter((other) => other !== edge)
          .reduce(
            (sum, other) =>
              sum +
              other.points
                .slice(1)
                .filter((q, s) => segmentHitsRect(other.points[s], q, inflate(rect, 1))).length,
            0,
          );
        if (!best || cost < best.cost) best = { rect, cost };
        if (cost === 0) break;
      }
      if (best?.cost === 0) break;
    }

    // nothing clear: park it on the middle of the first run and let
    // checkLayout report it, rather than silently dropping a label
    const seg = ordered[0];
    let rect =
      best?.rect ??
      (() => {
        const cx = Math.round((seg.p.x + seg.q.x) / 2);
        const cy = Math.round((seg.p.y + seg.q.y) / 2);
        return { x: cx - w / 2, y: cy - h / 2, w, h };
      })();
    const nudge = overrides?.[`${edge.from}>${edge.to}`]?.[mode];
    if (nudge) rect = { ...rect, x: rect.x + (nudge.dx ?? 0), y: rect.y + (nudge.dy ?? 0) };
    const chip: Chip = {
      ...rect,
      text: edge.label,
      cx: rect.x + w / 2,
      cy: rect.y + h / 2,
      baseline: rect.y + h / 2 + 5,
    };
    edge.chip = chip;
    chips.push(chip);
  }

  /* ---- 7. fit the viewBox to what was drawn, then shift to integers ---- */
  const bounds = (withChips: boolean, stroke: number) => {
    const xs: number[] = [];
    const ys: number[] = [];
    const add = (r: Rect) => {
      xs.push(r.x, r.x + r.w);
      ys.push(r.y, r.y + r.h);
    };
    nodes.forEach((n) => n.boxes.forEach(add));
    edges.forEach((e) => e.points.forEach((p) => add(inflate({ x: p.x, y: p.y, w: 0, h: 0 }, stroke))));
    if (withChips) chips.forEach(add);
    return { minX: Math.min(...xs), minY: Math.min(...ys), maxX: Math.max(...xs), maxY: Math.max(...ys) };
  };
  const full = bounds(true, 6);
  const bare = bounds(false, 3);
  const dx = PAD - full.minX;
  const dy = PAD - full.minY;
  const shiftPt = (p: Pt) => ({ x: p.x + dx, y: p.y + dy });
  const shiftRect = <R extends Rect>(r: R): R => ({ ...r, x: r.x + dx, y: r.y + dy });

  for (const node of nodes) {
    node.x += dx;
    node.y += dy;
    node.cx += dx;
    node.labelY += dy;
    if (node.subY !== undefined) node.subY += dy;
    if (node.back) node.back = shiftRect(node.back);
    if (node.badge) node.badge = shiftPt(node.badge);
    node.boxes = node.boxes.map(shiftRect);
  }
  for (const edge of edges) {
    edge.points = edge.points.map(shiftPt);
    edge.d = roundedPath(edge.points);
    const head = arrowHead(edge.points);
    edge.head = head.d;
    edge.headBox = head.box;
    if (edge.chip) {
      const c = edge.chip;
      edge.chip = { ...c, x: c.x + dx, y: c.y + dy, cx: c.cx + dx, cy: c.cy + dy, baseline: c.baseline + dy };
    }
  }
  const shiftedChips = edges.flatMap((e) => (e.chip ? [e.chip] : []));

  const width = full.maxX - full.minX + PAD * 2;
  const height = full.maxY - full.minY + PAD * 2;
  const px = bare.minX + dx - PAD;
  const py = bare.minY + dy - PAD;
  const pw = bare.maxX - bare.minX + PAD * 2;
  const ph = bare.maxY - bare.minY + PAD * 2;

  return {
    mode,
    width,
    height,
    viewBox: `0 0 ${width} ${height}`,
    posterViewBox: `${px} ${py} ${pw} ${ph}`,
    nodes,
    edges: edges.sort((p, q) => p.index - q.index),
    chips: shiftedChips,
  };
}

function range(from: number, to: number): number[] {
  const out: number[] = [];
  for (let i = from; i <= to; i++) out.push(i);
  return out;
}

/* ------------------------------------------------------------------ */
/* Assertions (scripts/check-flows.ts runs these before every build)   */
/* ------------------------------------------------------------------ */

/**
 * Problems that make a diagram wrong. An empty array means it is sound:
 * cells are unique, every edge resolves, no chip covers a node or another
 * chip, and no edge runs through a node it does not belong to.
 */
export function checkFlow(flow: Flow): string[] {
  const errors: string[] = [];
  const cells = new Map<string, string>();
  const ids = new Set<string>();
  for (const node of flow.nodes) {
    if (ids.has(node.id)) errors.push(`node id "${node.id}" is used twice`);
    ids.add(node.id);
    if (node.col < 1 || node.col > 5 || node.row < 1 || node.row > 3) {
      errors.push(`node "${node.id}" sits outside the 5x3 grid (col ${node.col}, row ${node.row})`);
    }
    const cell = `${node.col},${node.row}`;
    const taken = cells.get(cell);
    if (taken) errors.push(`nodes "${taken}" and "${node.id}" share cell ${cell}`);
    else cells.set(cell, node.id);
  }
  for (const edge of flow.edges) {
    if (!ids.has(edge.from)) errors.push(`edge ${edge.from}>${edge.to}: unknown node "${edge.from}"`);
    if (!ids.has(edge.to)) errors.push(`edge ${edge.from}>${edge.to}: unknown node "${edge.to}"`);
    if (edge.from === edge.to) errors.push(`edge ${edge.from}>${edge.to} loops onto itself`);
  }
  return errors;
}

export function checkLayout(laid: FlowLayout): string[] {
  const errors: string[] = [];
  const where = (edge: LaidEdge) => `edge ${edge.from}>${edge.to}`;

  for (const edge of laid.edges) {
    const chip = edge.chip;
    if (chip) {
      for (const node of laid.nodes) {
        if (node.boxes.some((b) => rectsOverlap(chip, b))) {
          errors.push(`${where(edge)}: chip "${chip.text}" overlaps node "${node.id}"`);
        }
      }
    }
    for (const node of laid.nodes) {
      if (node.id === edge.from || node.id === edge.to) continue;
      const box: Rect = { x: node.x, y: node.y, w: node.w, h: node.h };
      const hit = edge.points.slice(1).some((q, s) => segmentHitsRect(edge.points[s], q, box));
      if (hit) errors.push(`${where(edge)}: runs through node "${node.id}"`);
    }
  }
  const chipped = laid.edges.filter((e) => e.chip);
  for (let i = 0; i < chipped.length; i++) {
    for (let j = i + 1; j < chipped.length; j++) {
      if (rectsOverlap(chipped[i].chip!, chipped[j].chip!)) {
        errors.push(`chips "${chipped[i].chip!.text}" and "${chipped[j].chip!.text}" overlap`);
      }
    }
  }
  return errors;
}

/**
 * Things worth a look that do not break a diagram: a label estimated to
 * outgrow its node, or a chip sitting on another edge's line.
 */
export function layoutWarnings(laid: FlowLayout): string[] {
  const warnings: string[] = [];
  const inner = NODE_W - 16;
  for (const node of laid.nodes) {
    const lw = textWidth(node.label, TEXT.label, 500);
    if (lw > inner) warnings.push(`node "${node.id}": label may overflow (~${Math.round(lw)}u of ${inner}u)`);
    if (node.sub) {
      const sw = textWidth(node.sub, TEXT.sub);
      if (sw > inner) warnings.push(`node "${node.id}": sub may overflow (~${Math.round(sw)}u of ${inner}u)`);
    }
  }
  for (const edge of laid.edges) {
    const chip = edge.chip;
    if (!chip) continue;
    for (const other of laid.edges) {
      if (other === edge) continue;
      const crosses = other.points.slice(1).some((q, s) => segmentHitsRect(other.points[s], q, chip));
      if (crosses) warnings.push(`chip "${chip.text}" (${edge.from}>${edge.to}) sits on edge ${other.from}>${other.to}`);
    }
  }
  return warnings;
}

/* ------------------------------------------------------------------ */
/* Poster: the text-free silhouette, as data                           */
/* ------------------------------------------------------------------ */

export type PosterColours = Record<FlowKind, string> & { line: string };

/**
 * The poster as a standalone SVG string with colours baked in, for places
 * that cannot resolve CSS variables (next/og share cards). Mirrors the
 * `poster` mode of FlowDiagram: 5u edges at 45% and nodes filled by kind.
 */
export function posterSvg(flow: Flow, colours: PosterColours, key?: string): string {
  const laid = layout(flow, "full", key);
  const [, , w, h] = laid.posterViewBox.split(" ");
  const edges = laid.edges.map((e) => `<path d="${e.d}"/>`).join("");
  const nodes = laid.nodes
    .map((n) => {
      const fill = colours[n.kind];
      const back = n.back
        ? `<rect x="${n.back.x}" y="${n.back.y}" width="${n.back.w}" height="${n.back.h}" rx="10" fill="${fill}" fill-opacity=".55"/>`
        : "";
      return `${back}<rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="${n.rx}" fill="${fill}"/>`;
    })
    .join("");
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${laid.posterViewBox}" width="${w}" height="${h}">` +
    `<g fill="none" stroke="${colours.line}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity=".45">${edges}</g>` +
    `${nodes}</svg>`
  );
}
