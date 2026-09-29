import { Skeleton } from "@/components/ui";

export default function Loading(): React.JSX.Element {
  return (
    <article className="mx-auto max-w-4xl px-4 py-10">
      <Skeleton className="h-9 w-2/3" />
      <Skeleton className="mt-2 h-5 w-1/2" />
      <Skeleton className="mt-6 aspect-[16/9]" />
      <div className="mt-4 flex gap-2">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </article>
  );
}
