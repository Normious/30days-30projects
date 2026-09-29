"use client";
import { OrganiserSettings } from "./organiser-settings";
export function AddOrganiserDialog({ challengeId }: { challengeId: string }): React.JSX.Element {
  return <OrganiserSettings challengeId={challengeId} organisers={[]} isPrimary />;
}
