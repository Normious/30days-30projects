import { Skeleton } from "@/components/ui";

export default function Loading(): React.JSX.Element {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-start gap-4">
        <Skeleton className="h-20 w-20 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-full max-w-md" />
        </div>
      </div>
      <Skeleton className="mt-10 h-7 w-40" />
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="aspect-[16/9]" />
        <Skeleton className="aspect-[16/9]" />
        <Skeleton className="aspect-[16/9]" />
      </div>
    </div>
  );
}
