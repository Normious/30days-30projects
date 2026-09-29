"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton(): React.JSX.Element {
  const router = useRouter();
  return (
    <button
      className="rounded-md border border-border px-3 py-1.5 hover:border-border-strong"
      onClick={async () => {
        await createClient().auth.signOut();
        router.push("/");
        router.refresh();
      }}
    >
      Sign out
    </button>
  );
}
