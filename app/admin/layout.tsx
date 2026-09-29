import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }): Promise<React.JSX.Element> {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") redirect("/login");
  return <>{children}</>;
}
