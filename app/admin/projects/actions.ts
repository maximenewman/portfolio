"use server"

import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/admin"
import { VISIBILITIES } from "@/lib/posts"
import type { ProjectMediaItem } from "@/db/schema"
import {
  createProject,
  updateProject,
  deleteProject,
  getProjectById,
  moveProject,
  syncProjectAssets,
} from "@/lib/queries"

export type ProjectInput = {
  title: string
  description: string[] // bullet points
  tech: string[]
  link: string
  playUrl: string
  linkedinPostUrl: string
  media: ProjectMediaItem[]
  visibility: string // draft | private | public
}

export type ActionResult = { ok: true; id: string } | { ok: false; error: string }

const VALID_VISIBILITIES = new Set<string>(VISIBILITIES.map((v) => v.value))

function normalize(input: ProjectInput) {
  const title = input.title?.trim()
  if (!title) throw new Error("Title is required")
  const description = (input.description ?? []).map((d) => d.trim()).filter(Boolean)
  const tech = (input.tech ?? []).map((t) => t.trim()).filter(Boolean).slice(0, 16)
  const media: ProjectMediaItem[] = (input.media ?? [])
    .map((m) => ({
      type: m.type === "video" ? ("video" as const) : ("image" as const),
      src: m.src?.trim() ?? "",
      alt: m.alt?.trim() || undefined,
      thumbnailSrc: m.thumbnailSrc?.trim() || undefined,
    }))
    .filter((m) => m.src)
  return {
    title,
    description,
    tech,
    link: input.link?.trim() || null,
    playUrl: input.playUrl?.trim() || null,
    linkedinPostUrl: input.linkedinPostUrl?.trim() || null,
    media,
    visibility: VALID_VISIBILITIES.has(input.visibility) ? input.visibility : "draft",
  }
}

function revalidate() {
  revalidatePath("/admin/projects")
  revalidatePath("/projects")
}

export async function createProjectAction(input: ProjectInput): Promise<ActionResult> {
  try {
    await requireAdmin()
    const data = normalize(input)
    const project = await createProject(data)
    await syncProjectAssets(project.id, data.media)
    revalidate()
    return { ok: true, id: project.id }
  } catch (err) {
    return { ok: false, error: (err as Error).message }
  }
}

export async function updateProjectAction(id: string, input: ProjectInput): Promise<ActionResult> {
  try {
    await requireAdmin()
    const existing = await getProjectById(id)
    if (!existing) return { ok: false, error: "Project not found" }
    const data = normalize(input)
    await updateProject(id, data)
    await syncProjectAssets(id, data.media)
    revalidate()
    return { ok: true, id }
  } catch (err) {
    return { ok: false, error: (err as Error).message }
  }
}

export async function deleteProjectAction(id: string): Promise<{ ok: boolean; error?: string }> {
  try {
    await requireAdmin()
    await deleteProject(id)
    revalidate()
    return { ok: true }
  } catch (err) {
    return { ok: false, error: (err as Error).message }
  }
}

/** Bound into the list page's reorder forms. */
export async function moveProjectAction(id: string, direction: "up" | "down"): Promise<void> {
  await requireAdmin()
  await moveProject(id, direction)
  revalidate()
}
