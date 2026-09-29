import Link from "next/link";
import Image from "next/image";
import { TechStackPill } from "./tech-stack-pill";

export type DatabaseProject = {
  slug: string; title: string; description: string;
  screenshot_url: string; tech_stack?: string[] | null; view_count?: number | null;
};

export function ProjectCard({ project }: { project: DatabaseProject }): React.JSX.Element {
  return (
    <Link href={`/p/${project.slug}`} className="group overflow-hidden rounded-md border border-border bg-bg-subtle transition-colors hover:border-border-strong">
      <div className="relative aspect-[16/9] bg-bg-muted">
        {project.screenshot_url ? (
          <Image src={project.screenshot_url} alt={`${project.title} screenshot`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
        ) : null}
      </div>
      <div className="p-4">
        <h3 className="text-xl font-medium group-hover:underline">{project.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-text-muted">{project.description}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {(project.tech_stack ?? []).slice(0, 4).map((t) => <TechStackPill key={t} tech={t} />)}
        </div>
        {typeof project.view_count === "number" && <p className="mt-2 font-mono text-xs text-text-subtle">{project.view_count} views</p>}
      </div>
    </Link>
  );
}
