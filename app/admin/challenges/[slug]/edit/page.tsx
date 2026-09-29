import { redirect } from "next/navigation";
export default function EditChallenge({ params }: { params: Promise<{ slug: string }> }): React.JSX.Element {
  void params;
  redirect("/admin/challenges");
}
