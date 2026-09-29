import type { DatabaseProject } from "./project-card";
import { ProjectCard } from "./project-card";

export function ProjectGrid({ projects }: { projects: DatabaseProject[] }): React.JSX.Element {
  if (projects.length === 0) return <p className="text-text-subtle">No projects found.</p>;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((p) => <ProjectCard key={p.slug} project={p} />)}
    </div>
  );
}
