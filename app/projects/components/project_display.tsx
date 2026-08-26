import Link from "next/link"
import { Project } from "@/lib/projects"
import { ExternalLink, Gamepad2, Linkedin } from "lucide-react"
import { Panel } from "@/app/components/page-shell"
import { ProjectMediaGallery } from "./project_media_gallery"

interface ProjectCardProps {
  project: Project
  /** Zero-based position in the list; rendered as the printed-index numeral. */
  index?: number
  priority?: boolean
}

export function ProjectCard({ project, index, priority = false }: ProjectCardProps) {
  const media = project.media ?? []
  const hasMedia = media.length > 0
  const hasLinks = Boolean(project.link || project.playUrl || project.linkedinPostUrl)

  return (
    // `@container` rather than a viewport breakpoint: the card splits into two
    // columns when *the card itself* is wide enough, so it reflows correctly
    // wherever it is placed. One tree, one set of children.
    <Panel className="card-hover @container overflow-hidden">
      <article
        className={`grid ${hasMedia ? "@3xl:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]" : ""}`}
      >
        {hasMedia && (
          <div className="border-b border-border/70 bg-muted/25 p-[clamp(0.875rem,3cqi,1.5rem)] @3xl:border-b-0 @3xl:border-r">
            <ProjectMediaGallery media={media} title={project.title} priority={priority} />
          </div>
        )}

        <div className="flex flex-col gap-6 p-[clamp(1.5rem,4cqi,2.75rem)]">
          <div>
            {index !== undefined && (
              <p className="font-mono text-eyebrow text-muted-foreground tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </p>
            )}
            <h2 className="mt-3 font-display text-h3 text-balance text-card-foreground">
              {project.title}
            </h2>
          </div>

          {project.description && project.description.length > 0 && (
            <ul className="space-y-3 border-t border-border/60 pt-6">
              {project.description.map((desc, i) => (
                <li key={i} className="flex gap-3">
                  <span
                    aria-hidden
                    className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-sm bg-primary"
                  />
                  <span className="text-pretty text-[0.95rem] leading-relaxed text-card-foreground">
                    {desc}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {project.tech && project.tech.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {project.tech.map((tech, i) => (
                <li
                  key={i}
                  className="rounded-full border border-border bg-secondary/60 px-3 py-1.5 font-mono text-eyebrow uppercase text-secondary-foreground"
                >
                  {tech}
                </li>
              ))}
            </ul>
          )}

          {hasLinks && (
            // min-h-11 = 44px, applied unconditionally: a comfortable target on
            // a phone is not an uncomfortable one with a mouse.
            <div className="mt-auto flex flex-wrap gap-2 pt-2">
              {project.playUrl && (
                <Link
                  href={project.playUrl}
                  className="btn-hover inline-flex min-h-11 items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors fine:hover:bg-primary/20"
                >
                  <Gamepad2 className="h-4 w-4" aria-hidden />
                  Play Game
                </Link>
              )}
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-hover inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-card-foreground transition-colors fine:hover:bg-muted"
                >
                  <ExternalLink className="h-4 w-4" aria-hidden />
                  View Project
                </a>
              )}
              {project.linkedinPostUrl && (
                <a
                  href={project.linkedinPostUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-hover inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-card-foreground transition-colors fine:hover:bg-muted"
                >
                  <Linkedin className="h-4 w-4" aria-hidden />
                  View LinkedIn Post
                </a>
              )}
            </div>
          )}
        </div>
      </article>
    </Panel>
  )
}
