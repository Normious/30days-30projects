import { NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: Request): Promise<NextResponse> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    { cookies: { getAll: () => cookieStore.getAll(), setAll: (c: { name: string; value: string; options?: CookieOptions }[]) => { try { c.forEach(({ name, value, options }: { name: string; value: string; options?: CookieOptions }) => cookieStore.set(name, value, options)); } catch { /* noop */ } } } },
  );
  if (code) {
    const { data } = await supabase.auth.exchangeCodeForSession(code);
    // New users → complete profile; returning → dashboard (SPEC §26.6)
    const user = data.user;
    if (user) {
      const { data: profile } = await supabase.from("profiles").select("bio").eq("id", user.id).single();
      const isNew = !(profile as { bio: string | null } | null)?.bio;
      return NextResponse.redirect(new URL(isNew ? "/settings/profile" : "/dashboard", url.origin));
    }
  }
  return NextResponse.redirect(new URL("/", url.origin));
}
