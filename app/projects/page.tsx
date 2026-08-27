import { isCurrentUserAdmin } from "@/lib/admin"
import { listProjects } from "@/lib/queries"
import { toCardProject } from "@/lib/projects"
import { Container, PageHeader } from "@/app/components/page-shell"
import { ProjectRow } from "./components/project_display"

// Depends on who's viewing (the owner sees private projects) and on live data.
export const dynamic = "force-dynamic"

export default async function ProjectsPage() {
  const admin = await isCurrentUserAdmin()
  const rows = await listProjects({ visibilities: admin ? ["public", "private"] : ["public"] })
  const projects = rows.map(toCardProject)

  return (
    <div>
      <PageHeader
        eyebrow="Selected work"
        title="Projects & Creations"
        deck="Things I built end to end — web apps, machine learning, and the embedded systems in between."
      />

      {/* The root layout already owns <main>, so this is a plain section. It is
          deliberately not wrapped in <Container>: the rows run to the edge of
          the page so their media can bleed. The list itself carries the page's
          max width, and each row re-establishes the gutter around its text. */}
      <section>
        {projects.length === 0 ? (
          <Container className="py-[clamp(3rem,8vw,5.5rem)]">
            <p className="font-mono text-eyebrow uppercase text-muted-foreground">
              Nothing published here yet.
            </p>
          </Container>
        ) : (
          // `role="list"` is not redundant: Safari + VoiceOver drop list
          // semantics from any list whose list-style Tailwind's preflight has
          // reset. The nth-child rule is the whole alternation — every other
          // row flips its two columns, so the media zig-zags down the page
          // without a second copy of the markup and without touching DOM order.
          <ol
            role="list"
            className="mx-auto w-full max-w-page lg:[&>li:nth-child(even)>article]:flex-row-reverse"
          >
            {projects.map((project, index) => (
              <li
                key={`${project.title}-${index}`}
                className="reveal border-b border-border/60 last:border-b-0"
              >
                <ProjectRow project={project} index={index} priority={index === 0} />
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  )
}
