/**
 * Asserts the colour tokens in globals.css still meet the contrast floors
 * DESIGN.md §2 promises. The tokens are read from the stylesheet itself, so
 * a retune that breaks a floor fails here instead of passing by memory.
 *
 *   node scripts/contrast.mjs          (prints the table, exits 1 on a miss)
 *
 * WCAG 2.x ratios. Grounds that browsers compose with alpha (glow wash, lamp,
 * the 94% nav pill) are blended in gamma-encoded sRGB, which is what a
 * browser does for rgba over rgba. --lit and --flare are color-mix() in oklch,
 * so they are mixed in oklch before conversion.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const cssPath = fileURLToPath(new URL("../src/app/globals.css", import.meta.url));
const css = readFileSync(cssPath, "utf8");

// only the first (dark) definition of each token: the print block redefines
// them as hex further down, and print is not what this script guards
const tokens = {};
for (const m of css.matchAll(/--color-([a-z0-9-]+):\s*oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\)/g)) {
  if (!(m[1] in tokens)) tokens[m[1]] = [+m[2], +m[3], +m[4]];
}
for (const need of ["bg", "bg-deep", "surface", "surface-2", "line-strong", "ink", "ink-2", "muted", "dim", "faint", "glow", "glow-hover", "on-glow"]) {
  if (!tokens[need]) {
    console.error(`missing token --color-${need} in globals.css`);
    process.exit(1);
  }
}

function oklchToLinear([L, C, h]) {
  const a = C * Math.cos((h * Math.PI) / 180);
  const b = C * Math.sin((h * Math.PI) / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map((v) => Math.min(1, Math.max(0, v)));
}
const enc = (v) => (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055);
const dec = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const srgb = (c) => oklchToLinear(c).map(enc);
const alpha = (fg, bg, t) => fg.map((v, i) => v * t + bg[i] * (1 - t));
// color-mix(in oklch, a t%, b): shorter-hue interpolation
function mixOklch(a, b, t) {
  let dh = a[2] - b[2];
  if (dh > 180) dh -= 360;
  if (dh < -180) dh += 360;
  return [a[0] * t + b[0] * (1 - t), a[1] * t + b[1] * (1 - t), b[2] + dh * t];
}
const Y = (s) => {
  const [r, g, b] = s.map(dec);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const x = Y(a), y = Y(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};

const S = Object.fromEntries(Object.entries(tokens).map(([k, v]) => [k, srgb(v)]));
const G = {
  bg: S.bg,
  "bg-deep": S["bg-deep"],
  surface: S.surface,
  "surface-2": S["surface-2"],
  lit: srgb(mixOklch(tokens.glow, tokens["surface-2"], 0.08)),
  "flare 14%": srgb(mixOklch(tokens.glow, tokens["surface-2"], 0.14)),
  "glow wash 20%": alpha(S.glow, S.bg, 0.2),
  "lamp 11%": alpha(S.glow, S["bg-deep"], 0.11),
  "nav 94%": alpha(S.surface, S.bg, 0.94),
};

const rows = ["ink", "ink-2", "muted", "dim", "faint", "line-strong", "glow"];
const cols = Object.keys(G);
console.log("fg".padEnd(12) + cols.map((c) => c.padStart(14)).join(""));
for (const fg of rows) {
  console.log(fg.padEnd(12) + cols.map((g) => ratio(S[fg], G[g]).toFixed(2).padStart(14)).join(""));
}

// [label, fg, grounds, floor]: the floors from DESIGN.md §2 and the
// acceptance checks. Ratios are compared at two decimals, as they are quoted.
const main3 = ["bg", "surface", "surface-2"];
const floors = [
  ["ink (body)", "ink", main3, 14.28],
  ["ink-2 (body)", "ink-2", main3, 10.98],
  ["muted (meta)", "muted", main3, 6.9],
  ["muted at the flare peak", "muted", ["flare 14%"], 4.94],
  ["muted on a 20% glow wash", "muted", ["glow wash 20%"], 5.24],
  ["footer small print (muted on bg-deep/bg)", "muted", ["bg", "bg-deep"], 8.17],
  ["dim (focus-dimmed siblings)", "dim", ["bg", "bg-deep", "surface", "surface-2", "lamp 11%", "nav 94%"], 5.2],
  ["faint (transient, display >= 2rem)", "faint", ["bg", "bg-deep", "surface", "surface-2", "lamp 11%", "nav 94%"], 3.35],
  ["line-strong (UI boundaries)", "line-strong", ["bg", "bg-deep", "surface", "nav 94%"], 3.24],
  ["focus ring (glow)", "glow", ["bg"], 12.25],
];
const pairs = [
  ["CTA label (on-glow on glow)", ratio(S["on-glow"], S.glow), 12.25],
  ["CTA hover (on-glow on glow-hover)", ratio(S["on-glow"], S["glow-hover"]), 12.25],
];

let misses = 0;
console.log("");
const report = (label, value, floor) => {
  const ok = +value.toFixed(2) >= floor;
  if (!ok) misses++;
  console.log(`${ok ? "pass" : "FAIL"}  ${label.padEnd(56)} ${value.toFixed(2).padStart(6)}  (floor ${floor.toFixed(2)})`);
};
for (const [label, fg, grounds, floor] of floors) {
  const worst = grounds.reduce((w, g) => (ratio(S[fg], G[g]) < w.v ? { v: ratio(S[fg], G[g]), g } : w), { v: Infinity, g: "" });
  report(`${label} [worst: ${worst.g}]`, worst.v, floor);
}
for (const [label, v, floor] of pairs) report(label, v, floor);

console.log(`\n${misses === 0 ? "all floors met" : `${misses} floor${misses === 1 ? "" : "s"} missed`}`);
if (misses > 0) process.exit(1);
