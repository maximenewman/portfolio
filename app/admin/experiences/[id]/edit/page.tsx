import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { getExperienceById } from "@/lib/queries"
import { ExperienceEditor, type ExperienceEditorInitial } from "../../experience-editor"

export const metadata = {
  title: "Edit experience | Admin",
  robots: { index: false, follow: false },
}

export default async function EditExperiencePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const experience = await getExperienceById(id)
  if (!experience) notFound()

  const initial: ExperienceEditorInitial = {
    slug: experience.slug,
    type: experience.type,
    role: experience.role,
    company: experience.company,
    date: experience.date,
    location: experience.location,
    headline: experience.headline,
    overview: experience.overview ?? "",
    heroImage: experience.heroImage ?? "",
    projects: experience.projects.map((p) => ({
      title: p.title,
      description: p.description.join("\n"),
      tech: p.tech.join(", "),
      link: p.link ?? "",
      media: p.media,
      playUrl: p.playUrl,
      linkedinPostUrl: p.linkedinPostUrl,
    })),
    highlights: experience.highlights,
    skills: experience.skills,
    visibility: experience.visibility,
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
      <h1 className="mb-8 text-2xl font-bold tracking-tight text-foreground">Edit experience</h1>
      <ExperienceEditor mode="edit" experienceId={experience.id} initial={initial} />
    </div>
  )
}
