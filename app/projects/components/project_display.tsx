import Link from "next/link"
import { Project } from "@/lib/projects"
import { ExternalLink, Gamepad2, Linkedin } from "lucide-react"
import { ProjectMediaGallery } from "./project_media_gallery"

interface ProjectRowProps {
  project: Project
  /** Zero-based position in the list; rendered as the oversized index numeral. */
  index?: number
  priority?: boolean
}

/**
 * One project, as a full-bleed editorial row rather than a card.
 *
 * The old version was a bordered, blurred, hover-lifting panel with the media
 * boxed inside its own padded well — the same object four times down the page.
 * Here the media bleeds to the edge of the page container and swaps sides row
 * by row (the parent list owns the alternation, see `page.tsx`), so the page
 * has rhythm instead of repetition, and the imagery is the largest thing on
 * screen because on this page the imagery *is* the argument.
 *
 * No stretched `.row-link`: a project can carry up to three destinations, and
 * overlapping tap targets are worse than an unstretched row.
 */
export function ProjectRow({ project, index, priority = false }: ProjectRowProps) {
  const media = project.media ?? []
  const hasMedia = media.length > 0
  const hasLinks = Boolean(project.link || project.playUrl || project.linkedinPostUrl)

  return (
    <article className="flex flex-col gap-[clamp(1.5rem,4vw,2.5rem)] py-[clamp(2.5rem,7vw,5rem)] lg:flex-row lg:items-center lg:gap-0">
      {hasMedia && (
        // No horizontal padding and no frame: the media runs out to the edge of
        // the page. Vertical padding lives on the row, so the bleed is
        // horizontal only and the hairlines between rows still breathe.
        <div className="w-full lg:w-[55%] lg:shrink-0">
          <ProjectMediaGallery media={media} title={project.title} priority={priority} />
        </div>
      )}

      <div
        className={`flex w-full flex-col gap-[clamp(1.25rem,2.5vw,1.75rem)] px-[clamp(1.25rem,4vw,4rem)] ${
          // The column's own gutter doubles as the gap between media and text,
          // so there is no separate spacer to keep in sync with the container.
          hasMedia ? "lg:w-[45%]" : "max-w-[68ch]"
        }`}
      >
        <div>
          {index !== undefined && (
            // Oversized, ink-light, tabular: a printed index numeral, not a badge.
            <span
              aria-hidden="true"
              // A rem term stays in the middle of the clamp so the numeral
              // still answers to the user's font-size setting (WCAG 1.4.4),
              // like every other clamp in the type scale.
              className="block font-display text-[clamp(2.75rem,1.75rem+3.5vw,4.5rem)] font-bold leading-[0.85] tracking-[-0.04em] tabular-nums text-muted-foreground/35"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
          )}
          <h2 className="mt-3 font-display text-h2 text-balance text-foreground">
            {project.title}
          </h2>
          {project.tech && project.tech.length > 0 && (
            // A single typeset line beats a row of pills: same information,
            // none of the chrome, and it reads as a colophon.
            <p className="mt-4 font-mono text-eyebrow uppercase text-muted-foreground">
              {project.tech.join(" · ")}
            </p>
          )}
        </div>

        {project.description && project.description.length > 0 && (
          <ul className="space-y-3 border-t border-border/60 pt-[clamp(1.25rem,2.5vw,1.75rem)]">
            {project.description.map((desc, i) => (
              <li key={i} className="flex gap-3">
                <span aria-hidden="true" className="mt-[0.75em] h-px w-3 shrink-0 bg-primary" />
                <span className="text-pretty text-lede text-foreground">{desc}</span>
              </li>
            ))}
          </ul>
        )}

        {hasLinks && (
          // Text links, not buttons. min-h-11 = 44px on a coarse pointer, eased
          // back to 36px where the pointer is fine — the only thing that
          // diverges between form factors here is the size of the hit area.
          <div className="flex flex-wrap items-center gap-x-[clamp(1.25rem,3vw,2rem)] gap-y-1">
            {project.playUrl && (
              <Link href={project.playUrl} className={actionLink}>
                <Gamepad2 className="h-4 w-4" aria-hidden />
                Play Game
              </Link>
            )}
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className={actionLink}
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
                className={actionLink}
              >
                <Linkedin className="h-4 w-4" aria-hidden />
                View LinkedIn Post
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  )
}

/**
 * The row's destinations. Colour carries the link affordance at rest (so they
 * are still recognisably links without a pointer) and the underline grows on
 * hover; nothing moves in Z.
 */
const actionLink =
  "link-underline inline-flex min-h-11 items-center gap-2 font-mono text-eyebrow uppercase text-primary fine:min-h-9"
