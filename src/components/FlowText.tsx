import type { Project } from "@/content/site";

/**
 * The diagram as plain connections, for anyone who would rather read than
 * look, and for screen readers, whose drawing only announces its size.
 * Visible and native: a <details> needs no script to open.
 */
export default function FlowText({
  project,
  className,
}: {
  project: Pick<Project, "flow">;
  className?: string;
}) {
  const flow = project.flow;
  if (!flow) return null;
  const labelOf = new Map(flow.nodes.map((node) => [node.id, node.label]));

  return (
    <details className={["group", className].filter(Boolean).join(" ")}>
      <summary className="t-ui w-fit cursor-pointer py-2 text-muted transition-colors duration-(--dur-xs) hover:text-ink group-open:text-ink">
        Read it as text
      </summary>
      <ul className="t-body mt-2 space-y-1.5 text-ink-2">
        {flow.edges.map((edge, i) => (
          <li key={`${i}-${edge.from}-${edge.to}`}>
            {labelOf.get(edge.from) ?? edge.from}
            {/* read as "to", seen as an arrow */}
            <span aria-hidden="true"> → </span>
            <span className="sr-only"> to </span>
            {labelOf.get(edge.to) ?? edge.to}
            {edge.label && <span className="text-muted"> ({edge.label})</span>}
            {edge.dashed && <span className="text-muted"> (scheduled)</span>}
          </li>
        ))}
      </ul>
    </details>
  );
}
