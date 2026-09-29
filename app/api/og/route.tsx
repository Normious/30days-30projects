import { ImageResponse } from "next/og";
import { APP_CONFIG } from "@/lib/constants";

export const runtime = "edge";

export async function GET(request: Request): Promise<ImageResponse> {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") ?? APP_CONFIG.displayName;
  return new ImageResponse(
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: 64, width: "100%", height: "100%", background: "#0A0A0A", color: "#FAFAFA" }}>
      <div style={{ fontSize: 56, fontWeight: 600 }}>{title}</div>
      <div style={{ fontSize: 24, color: "#A1A1AA" }}>{APP_CONFIG.tagline}</div>
    </div>,
    { width: 1200, height: 630 },
  );
}
