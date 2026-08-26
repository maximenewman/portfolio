import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { isCurrentUserAdmin } from "@/lib/admin"
import { getExperienceBySlug } from "@/lib/queries"
import { toCardExperience } from "@/lib/experiences"
import { Container } from "@/app/components/page-shell"
import { ExperienceDetail } from "../components/experience_detail"

// Depends on who's viewing (the owner sees private experiences) and on live data.
export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const experience = await getExperienceBySlug(slug)
  if (!experience) return { title: "Experience | Maxime Newman" }
  return {
    title: `${experience.role} · ${experience.company} | Maxime Newman`,
    description: experience.headline,
  }
}

export default async function ExperienceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const experience = await getExperienceBySlug(slug)
  if (!experience) notFound()
  if (experience.visibility !== "public" && !(await isCurrentUserAdmin())) notFound()

  return (
    <Container as="section" className="py-[clamp(2.5rem,6vw,4.5rem)]">
      <div className="mx-auto max-w-[74rem]">
        <Link
          href="/#journey"
          className="link-underline inline-flex items-center gap-1.5 font-mono text-eyebrow uppercase text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="h-3.5 w-3.5" aria-hidden />
          Back to timeline
        </Link>

        <ExperienceDetail experience={toCardExperience(experience)} />
      </div>
    </Container>
  )
}
