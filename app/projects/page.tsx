import { isCurrentUserAdmin } from "@/lib/admin"
import { listProjects } from "@/lib/queries"
import { toCardProject } from "@/lib/projects"
import { Container, PageHeader } from "@/app/components/page-shell"
import { ProjectCard } from "./components/project_display"

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

      {/* The root layout already owns <main>, so this is a plain section. */}
      <Container as="section" className="py-[clamp(3rem,8vw,5.5rem)]">
        {projects.length === 0 ? (
          <p className="font-mono text-eyebrow uppercase text-muted-foreground">
            Nothing published here yet.
          </p>
        ) : (
          <ol className="flex flex-col gap-[clamp(2rem,5vw,4rem)]">
            {projects.map((project, index) => (
              <li key={`${project.title}-${index}`} className="reveal">
                <ProjectCard project={project} index={index} priority={index === 0} />
              </li>
            ))}
          </ol>
        )}
      </Container>
    </div>
  )
}
