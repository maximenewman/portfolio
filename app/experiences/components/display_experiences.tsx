import { Experience, ExperienceType, experiences } from "@/app/experiences/data/experience"
import { ProjectCard } from "@/app/projects/components/project_display"
import { Briefcase, MapPin, Calendar } from "lucide-react"

interface ExperienceCardProps {
  experience: Experience
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card shadow-sm">
      <div className="border-b border-border p-4 md:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-xl font-semibold text-card-foreground md:text-2xl">
              {experience.role}
            </h3>
            <p className="mt-1 flex items-center gap-2 text-base text-muted-foreground">
              <Briefcase className="h-4 w-4" />
              {experience.company}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs font-medium">
              <Calendar className="h-3 w-3" />
              {experience.date}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs font-medium">
              <MapPin className="h-3 w-3" />
              {experience.location}
            </span>
          </div>
        </div>
      </div>
      <div className="p-4 md:p-6">
        {experience.projects && experience.projects.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-muted-foreground">Projects</h4>
            <div className="grid gap-4 md:grid-cols-2">
              {experience.projects.map((project, index) => (
                <ProjectCard key={index} project={project} />
              ))}
            </div>
          </div>
        )}
        {experience.highlights && experience.highlights.length > 0 && (
          <ul className="list-inside list-disc space-y-1 text-sm">
            {experience.highlights.map((point, index) => (
              <li key={index} className="leading-relaxed text-card-foreground">
                {point}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

const sectionConfig: { type: ExperienceType; label: string }[] = [
  { type: "tech", label: "Tech" },
  { type: "leadership", label: "Leadership" },
  { type: "other", label: "Other" },
]

export function ExperiencesList() {
  return (
    <div className="space-y-12">
      {sectionConfig.map(({ type, label }) => {
        const group = experiences.filter((e) => e.type === type)
        if (group.length === 0) return null
        return (
          <section key={type}>
            <h2 className="mb-4 text-lg font-semibold tracking-tight">{label}</h2>
            <div className="space-y-6">
              {group.map((experience, index) => (
                <ExperienceCard key={index} experience={experience} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
