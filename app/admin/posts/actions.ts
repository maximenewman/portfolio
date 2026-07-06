"use server"

import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/admin"
import { slugify, POST_KINDS, VISIBILITIES } from "@/lib/posts"
import {
  createPost,
  updatePost,
  deletePost,
  slugExists,
  getPostById,
  syncPostAssets,
} from "@/lib/queries"

export type PostInput = {
  title: string
  slug: string
  summary: string
  body: string
  kind: string
  tags: string[]
  coverAssetId: string | null
  coverPosition: string // CSS object-position "x% y%"
  visibility: string // draft | private | public
  publishedAt: string // yyyy-mm-dd
}

export type ActionResult = { ok: true; id: string; slug: string } | { ok: false; error: string }

const VALID_KINDS = new Set<string>(POST_KINDS.map((k) => k.value))
const VALID_VISIBILITIES = new Set<string>(VISIBILITIES.map((v) => v.value))

async function ensureUniqueSlug(base: string, exceptId?: string): Promise<string> {
  const root = base || "post"
  let slug = root
  let n = 2
  while (await slugExists(slug, exceptId)) slug = `${root}-${n++}`
  return slug
}

function normalize(input: PostInput) {
  const title = input.title?.trim()
  if (!title) throw new Error("Title is required")
  const kind = VALID_KINDS.has(input.kind) ? input.kind : "note"
  const visibility = VALID_VISIBILITIES.has(input.visibility) ? input.visibility : "draft"
  const tags = (input.tags ?? []).map((t) => t.trim()).filter(Boolean).slice(0, 12)
  const publishedAt = input.publishedAt ? new Date(input.publishedAt) : new Date()
  if (isNaN(publishedAt.getTime())) throw new Error("Invalid date")
  // Only accept a well-formed "x% y%" — it's interpolated into an inline style.
  const coverPosition = /^\d{1,3}% \d{1,3}%$/.test(input.coverPosition ?? "")
    ? input.coverPosition
    : "50% 50%"
  return {
    title,
    summary: input.summary?.trim() || null,
    body: input.body ?? "",
    kind,
    tags,
    coverAssetId: input.coverAssetId || null,
    coverPosition,
    visibility,
    publishedAt,
  }
}

function revalidate(slug?: string) {
  revalidatePath("/admin/posts")
  revalidatePath("/blog")
  if (slug) revalidatePath(`/blog/${slug}`)
}

export async function createPostAction(input: PostInput): Promise<ActionResult> {
  try {
    await requireAdmin()
    const data = normalize(input)
    const slug = await ensureUniqueSlug(slugify(input.slug || input.title))
    const post = await createPost({ ...data, slug })
    await syncPostAssets(post.id, data.body, data.coverAssetId)
    revalidate(slug)
    return { ok: true, id: post.id, slug }
  } catch (err) {
    return { ok: false, error: (err as Error).message }
  }
}

export async function updatePostAction(id: string, input: PostInput): Promise<ActionResult> {
  try {
    await requireAdmin()
    const existing = await getPostById(id)
    if (!existing) return { ok: false, error: "Post not found" }
    const data = normalize(input)
    const slug = await ensureUniqueSlug(slugify(input.slug || input.title), id)
    await updatePost(id, { ...data, slug })
    await syncPostAssets(id, data.body, data.coverAssetId)
    revalidate(slug)
    revalidate(existing.slug)
    return { ok: true, id, slug }
  } catch (err) {
    return { ok: false, error: (err as Error).message }
  }
}

export async function deletePostAction(id: string): Promise<{ ok: boolean; error?: string }> {
  try {
    await requireAdmin()
    const existing = await getPostById(id)
    await deletePost(id)
    revalidate(existing?.slug)
    return { ok: true }
  } catch (err) {
    return { ok: false, error: (err as Error).message }
  }
}

export async function setVisibilityAction(id: string, visibility: string): Promise<{ ok: boolean; error?: string }> {
  try {
    await requireAdmin()
    if (!VALID_VISIBILITIES.has(visibility)) return { ok: false, error: "Invalid visibility" }
    const post = await updatePost(id, { visibility })
    revalidate(post?.slug)
    return { ok: true }
  } catch (err) {
    return { ok: false, error: (err as Error).message }
  }
}
