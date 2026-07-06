// Shared experience shapes — safe to import from both server and client.

import type { ExperienceRow } from "@/db/schema"
import type { Project } from "@/lib/projects"

export type ExperienceType = "tech" | "leadership" | "other"

export const EXPERIENCE_TYPES = [
  { value: "tech", label: "Engineering" },
  { value: "leadership", label: "Leadership" },
  { value: "other", label: "Community" },
] as const

/** The shape the timeline and detail page render. */
export interface Experience {
  slug: string
  type: ExperienceType
  role: string
  company: string
  date: string
  location: string
  /** One-line summary / signature achievement shown on the timeline. */
  headline: string
  /** Overview paragraph for the detail page (falls back to headline). */
  overview?: string
  /** Hero image for the detail page (e.g. company photo/logo). Falls back to a
   *  branded monogram when absent. Path under /public or a /media URL. */
  heroImage?: string
  projects?: Project[]
  highlights?: string[]
  skills?: string[]
}

/** DB row → render props (empty collections become absent, matching the old data file). */
export function toCardExperience(row: ExperienceRow): Experience {
  return {
    slug: row.slug,
    type: (["tech", "leadership", "other"].includes(row.type) ? row.type : "other") as ExperienceType,
    role: row.role,
    company: row.company,
    date: row.date,
    location: row.location,
    headline: row.headline,
    overview: row.overview ?? undefined,
    heroImage: row.heroImage ?? undefined,
    projects: row.projects.length ? row.projects : undefined,
    highlights: row.highlights.length ? row.highlights : undefined,
    skills: row.skills.length ? row.skills : undefined,
  }
}
