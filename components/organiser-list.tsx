import Link from "next/link";

export type OrganiserEntry = { user_id: string; is_primary: boolean; profiles: { username: string; display_name: string } };

export function OrganiserList({ organisers }: { organisers: OrganiserEntry[] }): React.JSX.Element {
  if (organisers.length === 0) return <p className="mt-4 text-sm text-text-subtle">No organisers listed.</p>;
  return (
    <ul className="mt-4 flex flex-wrap gap-2 text-sm" aria-label="Organisers">
      {organisers.map((o) => (
        <li key={o.user_id} className="rounded-full border border-border px-3 py-1">
          <Link href={`/u/${o.profiles.username}`} className="hover:underline">{o.profiles.display_name}</Link>
          {o.is_primary && <span className="ml-1 font-mono text-xs text-brand-500">primary</span>}
        </li>
      ))}
    </ul>
  );
}
