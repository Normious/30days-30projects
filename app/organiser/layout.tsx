import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";

export default async function OrganiserLayout({ children }: { children: React.ReactNode }): Promise<React.JSX.Element> {
  const user = await getSessionUser();
  if (!user || (user.role !== "organiser" && user.role !== "admin")) redirect("/login");
  return <>{children}</>;
}
