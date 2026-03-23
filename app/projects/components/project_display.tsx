import { Project } from "@/app/projects/data/projects"
import { ExternalLink, Linkedin } from "lucide-react"
import { ProjectMediaGallery } from "./project_media_gallery"

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="card-hover flex flex-col rounded-lg border border-border bg-card shadow-sm">
      <div className="border-b border-border p-4">
        <h3 className="text-lg font-semibold text-card-foreground md:text-xl">
          {project.title}
        </h3>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-4">
        {/* Media Gallery */}
        {project.media && project.media.length > 0 && (
          <ProjectMediaGallery media={project.media} title={project.title} />
        )}

        {/* Description */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-muted-foreground">
            Description
          </h4>
          <ul className="list-inside list-disc space-y-1 text-sm">
            {project.description?.map((desc, i) => (
              <li key={i} className="leading-relaxed text-card-foreground">
                {desc}
              </li>
            ))}
          </ul>
        </div>

        {/* Technologies */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-muted-foreground">
            Technologies
          </h4>
          <div className="flex flex-wrap gap-2">
            {project.tech?.map((tech, i) => (
              <span
                key={i}
                className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Links */}
        {(project.link || project.linkedinPostUrl) && (
          <div className="mt-auto flex flex-wrap gap-2 pt-2">
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-hover inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
              >
                <ExternalLink className="h-4 w-4" />
                View Project
              </a>
            )}
            {project.linkedinPostUrl && (
              <a
                href={project.linkedinPostUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-hover inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
              >
                <Linkedin className="h-4 w-4" />
                View LinkedIn Post
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// For backward compatibility with experiences
export function display_project(proj: Project) {
  return <ProjectCard project={proj} />
}
