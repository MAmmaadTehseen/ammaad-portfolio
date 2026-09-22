/**
 * Project names in site.ts read "Brand — what it is". Most places want only
 * one half (a proof link wants the brand, a row's second line wants the
 * descriptor), so the split lives here once instead of in every component.
 */
const SEPARATOR = " — ";

/** The part before " — ", or the whole name when there is no descriptor. */
export function brand(name: string): string {
  const at = name.indexOf(SEPARATOR);
  return at === -1 ? name : name.slice(0, at);
}

/**
 * The part after " — ". Undefined when the name has none, so callers can
 * fall back to something meaningful (the tier label) rather than print blank.
 */
export function descriptor(name: string): string | undefined {
  const at = name.indexOf(SEPARATOR);
  if (at === -1) return undefined;
  const rest = name.slice(at + SEPARATOR.length).trim();
  return rest || undefined;
}
