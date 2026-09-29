export default function robots(): { rules: { userAgent: string; allow: string; disallow: string[] }; sitemap: string } {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return { rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/organiser", "/dashboard", "/settings"] }, sitemap: `${base}/sitemap.xml` };
}
