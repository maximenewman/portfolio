import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { getProjectById } from "@/lib/queries"
import { ProjectEditor, type ProjectEditorInitial } from "../../project-editor"

export const metadata = {
  title: "Edit project | Admin",
  robots: { index: false, follow: false },
}

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = await getProjectById(id)
  if (!project) notFound()

  const initial: ProjectEditorInitial = {
    title: project.title,
    description: project.description,
    tech: project.tech,
    link: project.link ?? "",
    playUrl: project.playUrl ?? "",
    linkedinPostUrl: project.linkedinPostUrl ?? "",
    media: project.media,
    visibility: project.visibility,
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 md:py-16">
      <Link
        href="/admin/projects"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
        Projects
      </Link>
      <h1 className="mb-8 text-2xl font-bold tracking-tight text-foreground">Edit project</h1>
      <ProjectEditor mode="edit" projectId={project.id} initial={initial} />
    </div>
  )
}
