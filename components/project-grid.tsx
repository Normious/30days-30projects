import type { DatabaseProject } from "./project-card";
import { ProjectCard } from "./project-card";
import { EmptyState } from "./ui";

export function ProjectGrid({ projects }: { projects: DatabaseProject[] }): React.JSX.Element {
  if (projects.length === 0) {
    return <EmptyState title="No projects here yet" hint="Submissions appear once an organiser approves them." />;
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((p) => <ProjectCard key={p.slug} project={p} />)}
    </div>
  );
}
