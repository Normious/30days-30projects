import { CardSkeletonGrid } from "@/components/ui";

export default function Loading(): React.JSX.Element {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <div className="h-9 w-48 animate-pulse rounded-md bg-bg-muted" />
      <div className="mt-6 flex flex-col gap-3 md:flex-row">
        <div className="h-10 flex-1 animate-pulse rounded-md bg-bg-muted" />
        <div className="h-10 w-48 animate-pulse rounded-md bg-bg-muted" />
      </div>
      <div className="mt-8"><CardSkeletonGrid /></div>
    </div>
  );
}
