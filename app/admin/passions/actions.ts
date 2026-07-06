"use server"

import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/admin"
import { VISIBILITIES, slugify } from "@/lib/posts"
import type { PassionMediaLink, PassionTimelineEntry } from "@/db/schema"
import {
  createPassion,
  updatePassion,
  deletePassion,
  getPassionById,
  movePassion,
  passionSlugExists,
  syncPassionAssets,
} from "@/lib/queries"

/** One image row in the editor — stored as parallel arrays on the row. */
export type PassionImageInput = { src: string; alt: string }

export type PassionInput = {
  title: string
  slug: string
  description: string
  icon: string
  details: string[] // modal paragraphs
  mediaLinks: PassionMediaLink[]
  images: PassionImageInput[]
  videoEmbed: string
  timeline: PassionTimelineEntry[]
  imagePosition: string // center | top
  visibility: string // draft | private | public
}

export type ActionResult = { ok: true; id: string } | { ok: false; error: string }

const VALID_VISIBILITIES = new Set<string>(VISIBILITIES.map((v) => v.value))

async function ensureUniqueSlug(base: string, exceptId?: string): Promise<string> {
  const root = base || "passion"
  let slug = root
  let n = 2
  while (await passionSlugExists(slug, exceptId)) slug = `${root}-${n++}`
  return slug
}

function normalize(input: PassionInput) {
  const title = input.title?.trim()
  if (!title) throw new Error("Title is required")
  const images = (input.images ?? [])
    .map((i) => ({ src: i.src?.trim() ?? "", alt: i.alt?.trim() ?? "" }))
    .filter((i) => i.src)
  return {
    title,
    description: input.description?.trim() ?? "",
    icon: input.icon?.trim() || "code",
    details: (input.details ?? []).map((d) => d.trim()).filter(Boolean),
    mediaLinks: (input.mediaLinks ?? [])
      .map((m) => ({ label: m.label?.trim() ?? "", url: m.url?.trim() ?? "" }))
      .filter((m) => m.label && m.url),
    images: images.map((i) => i.src),
    imageAlts: images.map((i) => i.alt),
    videoEmbed: input.videoEmbed?.trim() || null,
    timeline: (input.timeline ?? [])
      .map((t) => ({ date: t.date?.trim() ?? "", items: (t.items ?? []).map((x) => x.trim()).filter(Boolean) }))
      .filter((t) => t.date && t.items.length),
    imagePosition: input.imagePosition === "top" ? "top" : "center",
    visibility: VALID_VISIBILITIES.has(input.visibility) ? input.visibility : "draft",
  }
}

function revalidate() {
  revalidatePath("/admin/passions")
  revalidatePath("/passions")
}

export async function createPassionAction(input: PassionInput): Promise<ActionResult> {
  try {
    await requireAdmin()
    const data = normalize(input)
    const slug = await ensureUniqueSlug(slugify(input.slug || input.title))
    const passion = await createPassion({ ...data, slug })
    await syncPassionAssets(passion.id, data.images)
    revalidate()
    return { ok: true, id: passion.id }
  } catch (err) {
    return { ok: false, error: (err as Error).message }
  }
}

export async function updatePassionAction(id: string, input: PassionInput): Promise<ActionResult> {
  try {
    await requireAdmin()
    const existing = await getPassionById(id)
    if (!existing) return { ok: false, error: "Passion not found" }
    const data = normalize(input)
    const slug = await ensureUniqueSlug(slugify(input.slug || input.title), id)
    await updatePassion(id, { ...data, slug })
    await syncPassionAssets(id, data.images)
    revalidate()
    return { ok: true, id }
  } catch (err) {
    return { ok: false, error: (err as Error).message }
  }
}

export async function deletePassionAction(id: string): Promise<{ ok: boolean; error?: string }> {
  try {
    await requireAdmin()
    await deletePassion(id)
    revalidate()
    return { ok: true }
  } catch (err) {
    return { ok: false, error: (err as Error).message }
  }
}

/** Bound into the list page's reorder forms. */
export async function movePassionAction(id: string, direction: "up" | "down"): Promise<void> {
  await requireAdmin()
  await movePassion(id, direction)
  revalidate()
}
