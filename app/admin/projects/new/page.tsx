import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { ProjectEditor, type ProjectEditorInitial } from "../project-editor"

export const metadata = {
  title: "New project | Admin",
  robots: { index: false, follow: false },
}

export default function NewProjectPage() {
  const initial: ProjectEditorInitial = {
    title: "",
    description: [],
    tech: [],
    link: "",
    playUrl: "",
    linkedinPostUrl: "",
    media: [],
    visibility: "draft",
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
      <h1 className="mb-8 text-2xl font-bold tracking-tight text-foreground">New project</h1>
      <ProjectEditor mode="create" initial={initial} />
    </div>
  )
}
