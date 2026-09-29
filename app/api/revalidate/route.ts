import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  if (secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ ok: false }, { status: 401 });
  const path = searchParams.get("path") ?? "/discover";
  revalidatePath(path);
  return NextResponse.json({ ok: true, path });
}
