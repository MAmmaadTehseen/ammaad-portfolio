import type { Project } from "@/content/site";

/** A comfortable reading pace for prose that is read rather than skimmed. */
const WORDS_PER_MINUTE = 200;

const count = (text: string) => text.split(/\s+/).filter(Boolean).length;

/**
 * Minutes to read a case page, counted at build time from the words that
 * actually carry it: the three ledes, the outcomes and the internals. Link
 * labels, the stack and the diagram are left out: nobody reads a stack list
 * at prose speed. Never less than one, so the page never claims "0 min".
 */
export function readingMinutes(
  project: Pick<Project, "lede" | "outcomes" | "internals">,
): number {
  const words = [
    ...Object.values(project.lede),
    ...(project.outcomes ?? []),
    ...(project.internals ?? []),
  ].reduce((total, text) => total + count(text), 0);
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}
