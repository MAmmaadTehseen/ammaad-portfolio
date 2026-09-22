/**
 * Asserts every showcase diagram is sound before a build: node cells are
 * unique and every edge resolves (checkFlow), and in both drawn layouts no
 * edge chip covers a node or another chip and no edge runs through a node
 * it does not belong to (checkLayout). Warnings are printed but do not fail.
 *
 *   npx jiti scripts/check-flows.ts            (exits 1 on any error)
 *   npx jiti scripts/check-flows.ts --quiet    (errors only)
 *
 * Relative imports on purpose: this runs outside Next, where "@/" means
 * nothing. flow-geometry only imports types from site.ts, which erase.
 */
import { showcase } from "../src/content/site";
import { checkFlow, checkLayout, layoutFor, layoutWarnings, type FlowMode } from "../src/lib/flow-geometry";

const MODES: FlowMode[] = ["full", "vertical"];
const quiet = process.argv.includes("--quiet");

let errors = 0;
let warnings = 0;
let checked = 0;

for (const project of showcase) {
  if (!project.flow) continue;
  checked++;
  const problems = checkFlow(project.flow).map((p) => `error  ${p}`);
  const notes: string[] = [];

  // layout assumes a sound flow; skip it when the data itself is broken
  if (problems.length === 0) {
    for (const mode of MODES) {
      const laid = layoutFor(project, mode)!;
      problems.push(...checkLayout(laid).map((p) => `error  [${mode}] ${p}`));
      if (!quiet) notes.push(...layoutWarnings(laid).map((w) => `warn   [${mode}] ${w}`));
      if (!quiet && mode === "full") notes.push(`info   [full] viewBox ${laid.viewBox}`);
      if (!quiet && mode === "vertical") notes.push(`info   [vertical] viewBox ${laid.viewBox}`);
    }
  }

  errors += problems.length;
  warnings += notes.filter((n) => n.startsWith("warn")).length;
  if (problems.length || (!quiet && notes.length)) {
    console.log(`\n${project.id}`);
    for (const line of [...problems, ...notes]) console.log(`  ${line}`);
  }
}

// derived from the data, so a showcase without a flow is simply not counted
console.log(
  `\n${checked} diagram${checked === 1 ? "" : "s"} checked: ` +
    `${errors} error${errors === 1 ? "" : "s"}, ${warnings} warning${warnings === 1 ? "" : "s"}`,
);
if (errors > 0) process.exit(1);
