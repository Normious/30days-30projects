export function TechStackPill({ tech }: { tech: string }): React.JSX.Element {
  return <span className="rounded-full border border-border px-2 py-0.5 font-mono text-xs text-text-muted">{tech}</span>;
}
