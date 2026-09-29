import Link from "next/link";
import { clsx } from "clsx";

/** Shared control styles — single source for inputs across forms (SPEC §8.5 radius md). */
export const fieldCls =
  "w-full rounded-md border border-border bg-bg-subtle px-3 py-2 text-sm text-text placeholder:text-text-subtle transition-colors hover:border-border-strong focus:border-brand-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg";

type ButtonProps = {
  href?: string;
  variant?: "primary" | "ghost" | "outline";
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
};

/** One CTA label per intent; short labels that never wrap at desktop. */
export function Button({ href, variant = "primary", children, className, type = "button", disabled, onClick }: ButtonProps): React.JSX.Element {
  const cls = clsx(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-all duration-150 ease-out",
    "active:translate-y-[1px] active:scale-[0.98] disabled:opacity-50",
    variant === "primary" && "bg-brand-600 text-white hover:bg-brand-700",
    variant === "ghost" && "text-text-muted hover:text-text",
    variant === "outline" && "border border-border hover:border-border-strong",
    className,
  );
  if (href) return <Link href={href} className={cls}>{children}</Link>;
  return <button type={type} disabled={disabled} onClick={onClick} className={cls}>{children}</button>;
}

export function Badge({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <span className="inline-flex items-center rounded-md border border-border bg-bg-muted px-2 py-0.5 font-mono text-[11px] uppercase tracking-widest text-text-muted">
      {children}
    </span>
  );
}

/** Skeleton loader matching layout shape — never spinners (SPEC §8.6). */
export function Skeleton({ className }: { className?: string }): React.JSX.Element {
  return <div aria-hidden className={clsx("animate-pulse rounded-md bg-bg-muted", className)} />;
}

export function CardSkeletonGrid({ count = 6 }: { count?: number }): React.JSX.Element {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Loading">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-md border border-border">
          <Skeleton className="aspect-[16/9] rounded-none" />
          <div className="space-y-2 p-4">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ title, hint, action }: { title: string; hint?: string; action?: React.ReactNode }): React.JSX.Element {
  return (
    <div className="flex flex-col items-center rounded-md border border-dashed border-border-strong px-6 py-16 text-center">
      <p className="text-lg font-medium">{title}</p>
      {hint && <p className="mt-1 max-w-md text-sm text-text-muted">{hint}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
