import Link from "next/link"
import { Project } from "@/lib/projects"
import { ExternalLink, Gamepad2, Linkedin } from "lucide-react"
import { ProjectMediaGallery } from "./project_media_gallery"

interface ProjectCardProps {
  project: Project
  priority?: boolean
}

export function ProjectCard({ project, priority = false }: ProjectCardProps) {
  return (
    <div className="card-hover overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="grid md:grid-cols-[1.15fr_1fr]">
        {/* Media side */}
        {project.media && project.media.length > 0 && (
          <div className="bg-muted/30 p-4 md:border-r md:border-border">
            <ProjectMediaGallery media={project.media} title={project.title} priority={priority} />
          </div>
        )}

        {/* Content side */}
        <div className="flex flex-col gap-4 p-6">
          <h3 className="text-xl font-bold text-card-foreground md:text-2xl">
            {project.title}
          </h3>

          {/* Description */}
          <ul className="space-y-2">
            {project.description?.map((desc, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-sm bg-primary" />
                <span className="text-pretty text-sm leading-relaxed text-card-foreground">
                  {desc}
                </span>
              </li>
            ))}
          </ul>

          {/* Technologies */}
          <div className="flex flex-wrap gap-2">
            {project.tech?.map((tech, i) => (
              <span
                key={i}
                className="rounded-full border border-border bg-secondary/60 px-3 py-1 font-mono text-xs text-accent-foreground"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Links */}
          {(project.link || project.playUrl || project.linkedinPostUrl) && (
            <div className="mt-auto flex flex-wrap gap-2 pt-2">
              {project.playUrl && (
                <Link
                  href={project.playUrl}
                  className="btn-hover inline-flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
                >
                  <Gamepad2 className="h-4 w-4" />
                  Play Game
                </Link>
              )}
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-hover inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium text-card-foreground transition-colors hover:bg-muted"
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
                  className="btn-hover inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium text-card-foreground transition-colors hover:bg-muted"
                >
                  <Linkedin className="h-4 w-4" />
                  View LinkedIn Post
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// For backward compatibility with experiences
export function display_project(proj: Project) {
  return <ProjectCard project={proj} />
}
