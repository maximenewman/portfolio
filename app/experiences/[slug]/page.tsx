import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { experiences, experienceSlug, getExperienceBySlug } from "../data/experience"
import { ExperienceDetail } from "../components/experience_detail"

export function generateStaticParams() {
  return experiences.map((e) => ({ slug: experienceSlug(e) }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const experience = getExperienceBySlug(slug)
  if (!experience) return { title: "Experience | Maxime Newman" }
  return {
    title: `${experience.role} · ${experience.company} | Maxime Newman`,
    description: experience.headline,
  }
}

export default async function ExperienceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const experience = getExperienceBySlug(slug)
  if (!experience) notFound()

  return (
    <div className="min-h-screen">
      <div className="container mx-auto max-w-4xl px-4 py-10 md:py-14">
        <Link
          href="/#journey"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to timeline
        </Link>

        <ExperienceDetail experience={experience} />
      </div>
    </div>
  )
}
