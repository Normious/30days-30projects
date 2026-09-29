import Link from "next/link";

export type PublicProfile = { display_name: string; linkedin_url: string | null; github_url: string | null; website_url: string | null; location: string | null };

export function ProfileCard({ profile }: { profile: PublicProfile }): React.JSX.Element {
  return (
    <div className="mt-3 flex flex-wrap gap-3 text-sm text-text-muted">
      {profile.location && <span>{profile.location}</span>}
      {profile.linkedin_url && <a className="underline" href={profile.linkedin_url} target="_blank" rel="noreferrer">LinkedIn</a>}
      {profile.github_url && <a className="underline" href={profile.github_url} target="_blank" rel="noreferrer">GitHub</a>}
      {profile.website_url && <a className="underline" href={profile.website_url} target="_blank" rel="noreferrer">Website</a>}
      <Link className="underline" href="/discover">All projects</Link>
    </div>
  );
}
