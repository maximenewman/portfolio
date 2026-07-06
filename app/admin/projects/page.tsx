import Link from "next/link"
import { ChevronLeft, ChevronUp, ChevronDown, Plus, Pencil } from "lucide-react"
import { listProjects } from "@/lib/queries"
import { visibilityMeta } from "@/lib/posts"
import { moveProjectAction } from "./actions"

export const metadata = {
  title: "Projects | Admin",
  robots: { index: false, follow: false },
}

export default async function AdminProjectsPage() {
  const projects = await listProjects()

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 md:py-16">
      <Link
        href="/admin"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
        Admin
      </Link>

      <div className="mb-8 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">Projects</h1>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          New project
        </Link>
      </div>

      {projects.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">No projects yet. Add your first one.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {projects.map((project, index) => {
            const vis = visibilityMeta(project.visibility)
            return (
              <div
                key={project.id}
                className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
              >
                {/* Reorder — forms so the row link stays a plain server page */}
                <div className="flex flex-col">
                  <form action={moveProjectAction.bind(null, project.id, "up")}>
                    <button
                      disabled={index === 0}
                      className="rounded p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30"
                      aria-label="Move up"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                  </form>
                  <form action={moveProjectAction.bind(null, project.id, "down")}>
                    <button
                      disabled={index === projects.length - 1}
                      className="rounded p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30"
                      aria-label="Move down"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </form>
                </div>

                <Link href={`/admin/projects/${project.id}/edit`} className="flex min-w-0 flex-1 items-center gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${vis.badge}`}>{vis.label}</span>
                      <span className="text-[11px] text-muted-foreground">
                        {project.media.length} media · {project.tech.length} tech
                      </span>
                    </div>
                    <h2 className="mt-1.5 truncate font-semibold text-card-foreground">{project.title}</h2>
                  </div>
                  <Pencil className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                </Link>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
