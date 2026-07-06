"use server"

import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/admin"
import { VISIBILITIES, slugify } from "@/lib/posts"
import type { ExperienceProjectItem } from "@/db/schema"
import {
  createExperience,
  updateExperience,
  deleteExperience,
  getExperienceById,
  moveExperience,
  experienceSlugExists,
  syncExperienceAssets,
} from "@/lib/queries"

export type ExperienceInput = {
  slug: string
  type: string // tech | leadership | other
  role: string
  company: string
  date: string
  location: string
  headline: string
  overview: string
  heroImage: string
  projects: ExperienceProjectItem[]
  highlights: string[]
  skills: string[]
  visibility: string // draft | private | public
}

export type ActionResult = { ok: true; id: string } | { ok: false; error: string }

const VALID_VISIBILITIES = new Set<string>(VISIBILITIES.map((v) => v.value))
const VALID_TYPES = new Set(["tech", "leadership", "other"])

async function ensureUniqueSlug(base: string, exceptId?: string): Promise<string> {
  const root = base || "experience"
  let slug = root
  let n = 2
  while (await experienceSlugExists(slug, exceptId)) slug = `${root}-${n++}`
  return slug
}

function normalize(input: ExperienceInput) {
  const role = input.role?.trim()
  if (!role) throw new Error("Role is required")
  const company = input.company?.trim()
  if (!company) throw new Error("Company is required")
  return {
    type: VALID_TYPES.has(input.type) ? input.type : "other",
    role,
    company,
    date: input.date?.trim() ?? "",
    location: input.location?.trim() ?? "",
    headline: input.headline?.trim() ?? "",
    overview: input.overview?.trim() || null,
    heroImage: input.heroImage?.trim() || null,
    projects: (input.projects ?? [])
      .map((p) => ({
        title: p.title?.trim() ?? "",
        description: (p.description ?? []).map((d) => d.trim()).filter(Boolean),
        tech: (p.tech ?? []).map((t) => t.trim()).filter(Boolean),
        link: p.link?.trim() || undefined,
        playUrl: p.playUrl?.trim() || undefined,
        linkedinPostUrl: p.linkedinPostUrl?.trim() || undefined,
        media: p.media?.length ? p.media : undefined,
      }))
      .filter((p) => p.title),
    highlights: (input.highlights ?? []).map((h) => h.trim()).filter(Boolean),
    skills: (input.skills ?? []).map((s) => s.trim()).filter(Boolean).slice(0, 20),
    visibility: VALID_VISIBILITIES.has(input.visibility) ? input.visibility : "draft",
  }
}

function revalidate(slug?: string) {
  revalidatePath("/admin/experiences")
  revalidatePath("/") // home timeline
  if (slug) revalidatePath(`/experiences/${slug}`)
}

export async function createExperienceAction(input: ExperienceInput): Promise<ActionResult> {
  try {
    await requireAdmin()
    const data = normalize(input)
    const slug = await ensureUniqueSlug(slugify(input.slug || `${data.role}-${data.company}`))
    const experience = await createExperience({ ...data, slug })
    await syncExperienceAssets(experience.id, data.heroImage, data.projects)
    revalidate(slug)
    return { ok: true, id: experience.id }
  } catch (err) {
    return { ok: false, error: (err as Error).message }
  }
}

export async function updateExperienceAction(id: string, input: ExperienceInput): Promise<ActionResult> {
  try {
    await requireAdmin()
    const existing = await getExperienceById(id)
    if (!existing) return { ok: false, error: "Experience not found" }
    const data = normalize(input)
    const slug = await ensureUniqueSlug(slugify(input.slug || `${data.role}-${data.company}`), id)
    await updateExperience(id, { ...data, slug })
    await syncExperienceAssets(id, data.heroImage, data.projects)
    revalidate(slug)
    revalidate(existing.slug)
    return { ok: true, id }
  } catch (err) {
    return { ok: false, error: (err as Error).message }
  }
}

export async function deleteExperienceAction(id: string): Promise<{ ok: boolean; error?: string }> {
  try {
    await requireAdmin()
    const existing = await getExperienceById(id)
    await deleteExperience(id)
    revalidate(existing?.slug)
    return { ok: true }
  } catch (err) {
    return { ok: false, error: (err as Error).message }
  }
}

/** Bound into the list page's reorder forms. */
export async function moveExperienceAction(id: string, direction: "up" | "down"): Promise<void> {
  await requireAdmin()
  await moveExperience(id, direction)
  revalidate()
}
