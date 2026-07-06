import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { ExperienceEditor, type ExperienceEditorInitial } from "../experience-editor"

export const metadata = {
  title: "New experience | Admin",
  robots: { index: false, follow: false },
}

export default function NewExperiencePage() {
  const initial: ExperienceEditorInitial = {
    slug: "",
    type: "tech",
    role: "",
    company: "",
    date: "",
    location: "",
    headline: "",
    overview: "",
    heroImage: "",
    projects: [],
    highlights: [],
    skills: [],
    visibility: "draft",
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 md:py-16">
      <Link
        href="/admin/experiences"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
        Experiences
      </Link>
      <h1 className="mb-8 text-2xl font-bold tracking-tight text-foreground">New experience</h1>
      <ExperienceEditor mode="create" initial={initial} />
    </div>
  )
}
