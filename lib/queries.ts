import { getDb } from "./db"
import {
  assets,
  posts,
  postAssets,
  projects,
  projectAssets,
  passions,
  passionAssets,
  type Asset,
  type NewAsset,
  type Post,
  type NewPost,
  type ProjectRow,
  type NewProject,
  type ProjectMediaItem,
  type PassionRow,
  type NewPassion,
} from "@/db/schema"
import { eq, ne, and, asc, desc, inArray, sql } from "drizzle-orm"

/** Look up an asset by its content hash — the dedup check. */
export async function findAssetBySha(sha256: string): Promise<Asset | undefined> {
  const rows = await getDb().select().from(assets).where(eq(assets.sha256, sha256)).limit(1)
  return rows[0]
}

export async function getAsset(id: string): Promise<Asset | undefined> {
  const rows = await getDb().select().from(assets).where(eq(assets.id, id)).limit(1)
  return rows[0]
}

/** Resolve many assets at once, returned as an id→asset map (for post covers). */
export async function getAssetsByIds(ids: string[]): Promise<Map<string, Asset>> {
  const unique = [...new Set(ids)].filter(Boolean)
  if (!unique.length) return new Map()
  const rows = await getDb().select().from(assets).where(inArray(assets.id, unique))
  return new Map(rows.map((a) => [a.id, a]))
}

/**
 * Insert an asset, or return the existing row if the hash is already stored.
 * Concurrent uploads of identical bytes collapse to one row.
 */
export async function insertAsset(a: NewAsset): Promise<Asset> {
  const rows = await getDb().insert(assets).values(a).onConflictDoNothing({ target: assets.sha256 }).returning()
  if (rows[0]) return rows[0]
  const existing = await findAssetBySha(a.sha256)
  if (!existing) throw new Error("insertAsset: conflict but no existing row")
  return existing
}

export async function listAssets(kind?: string): Promise<Asset[]> {
  const db = getDb()
  if (kind) {
    return db.select().from(assets).where(eq(assets.kind, kind)).orderBy(desc(assets.createdAt))
  }
  return db.select().from(assets).orderBy(desc(assets.createdAt))
}

/** How many posts/projects/passions reference this asset — guards deletion of in-use media. */
export async function assetRefCount(id: string): Promise<number> {
  const db = getDb()
  const postRefs = await db.select({ id: postAssets.id }).from(postAssets).where(eq(postAssets.assetId, id))
  const projectRefs = await db.select({ id: projectAssets.id }).from(projectAssets).where(eq(projectAssets.assetId, id))
  const passionRefs = await db.select({ id: passionAssets.id }).from(passionAssets).where(eq(passionAssets.assetId, id))
  return postRefs.length + projectRefs.length + passionRefs.length
}

export async function deleteAssetRow(id: string): Promise<void> {
  await getDb().delete(assets).where(eq(assets.id, id))
}

// ---- Posts ----

/**
 * List posts, optionally restricted to a set of visibilities. The public blog
 * passes ["public"] for anonymous visitors and ["public","private"] for the
 * signed-in owner; the admin list passes nothing (all posts, including drafts).
 */
export async function listPosts(opts: { visibilities?: string[] } = {}): Promise<Post[]> {
  const db = getDb()
  if (opts.visibilities && opts.visibilities.length) {
    return db.select().from(posts).where(inArray(posts.visibility, opts.visibilities)).orderBy(desc(posts.publishedAt))
  }
  return db.select().from(posts).orderBy(desc(posts.publishedAt))
}

export async function getPostById(id: string): Promise<Post | undefined> {
  const rows = await getDb().select().from(posts).where(eq(posts.id, id)).limit(1)
  return rows[0]
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const rows = await getDb().select().from(posts).where(eq(posts.slug, slug)).limit(1)
  return rows[0]
}

/** True if a post already owns this slug (optionally ignoring one post's id). */
export async function slugExists(slug: string, exceptId?: string): Promise<boolean> {
  const db = getDb()
  const where = exceptId ? and(eq(posts.slug, slug), ne(posts.id, exceptId)) : eq(posts.slug, slug)
  const rows = await db.select({ id: posts.id }).from(posts).where(where).limit(1)
  return rows.length > 0
}

export async function createPost(data: NewPost): Promise<Post> {
  const rows = await getDb().insert(posts).values(data).returning()
  return rows[0]
}

export async function updatePost(id: string, data: Partial<NewPost>): Promise<Post | undefined> {
  const rows = await getDb()
    .update(posts)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(posts.id, id))
    .returning()
  return rows[0]
}

export async function deletePost(id: string): Promise<void> {
  await getDb().delete(posts).where(eq(posts.id, id))
}

/** Resolve a post's cover + inline assets (for ref-counting and display). */
export async function getPostAssets(postId: string): Promise<Asset[]> {
  const db = getDb()
  const links = await db.select().from(postAssets).where(eq(postAssets.postId, postId))
  if (!links.length) return []
  const ids = links.map((l) => l.assetId)
  return db.select().from(assets).where(inArray(assets.id, ids))
}

// ---- Projects ----

/**
 * List projects in display order. Same visibility contract as `listPosts`:
 * the public page passes ["public"] (or ["public","private"] for the owner),
 * the admin list passes nothing.
 */
export async function listProjects(opts: { visibilities?: string[] } = {}): Promise<ProjectRow[]> {
  const db = getDb()
  if (opts.visibilities && opts.visibilities.length) {
    return db
      .select()
      .from(projects)
      .where(inArray(projects.visibility, opts.visibilities))
      .orderBy(asc(projects.position), desc(projects.createdAt))
  }
  return db.select().from(projects).orderBy(asc(projects.position), desc(projects.createdAt))
}

export async function getProjectById(id: string): Promise<ProjectRow | undefined> {
  const rows = await getDb().select().from(projects).where(eq(projects.id, id)).limit(1)
  return rows[0]
}

/** Insert at the end of the display order. */
export async function createProject(data: Omit<NewProject, "position">): Promise<ProjectRow> {
  const db = getDb()
  const [{ max }] = await db.select({ max: sql<number | null>`max(${projects.position})` }).from(projects)
  const rows = await db
    .insert(projects)
    .values({ ...data, position: (max ?? -1) + 1 })
    .returning()
  return rows[0]
}

export async function updateProject(id: string, data: Partial<NewProject>): Promise<ProjectRow | undefined> {
  const rows = await getDb()
    .update(projects)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(projects.id, id))
    .returning()
  return rows[0]
}

export async function deleteProject(id: string): Promise<void> {
  await getDb().delete(projects).where(eq(projects.id, id))
}

/** Swap a project with its neighbor in display order. No-op at the edges. */
export async function moveProject(id: string, direction: "up" | "down"): Promise<void> {
  const db = getDb()
  const all = await db.select({ id: projects.id, position: projects.position }).from(projects).orderBy(asc(projects.position), desc(projects.createdAt))
  const i = all.findIndex((p) => p.id === id)
  const j = direction === "up" ? i - 1 : i + 1
  if (i < 0 || j < 0 || j >= all.length) return
  // Positions can collide (legacy rows default to 0), so write back clean
  // sequential positions with the two entries swapped.
  ;[all[i], all[j]] = [all[j], all[i]]
  for (let k = 0; k < all.length; k++) {
    if (all[k].position !== k) await db.update(projects).set({ position: k }).where(eq(projects.id, all[k].id))
  }
}

/**
 * Rebuild a project's asset links from its media list — the project-side
 * mirror of `syncPostAssets`, so `assetRefCount` stays accurate. Only
 * `/media/...` srcs (and video thumbnails) resolve to assets.
 */
export async function syncProjectAssets(projectId: string, media: ProjectMediaItem[]): Promise<void> {
  const db = getDb()
  await db.delete(projectAssets).where(eq(projectAssets.projectId, projectId))

  const urls = media.flatMap((m) => [m.src, m.thumbnailSrc ?? ""])
  const keys = [...new Set(urls.flatMap((u) => Array.from(u.matchAll(MEDIA_KEY_RE), (m) => m[1])))]
  if (!keys.length) return

  const found = await db.select().from(assets).where(inArray(assets.key, keys))
  if (found.length) {
    await db.insert(projectAssets).values(found.map((a, i) => ({ projectId, assetId: a.id, position: i })))
  }
}

// ---- Passions ----

/** List passions in display order; same visibility contract as `listProjects`. */
export async function listPassions(opts: { visibilities?: string[] } = {}): Promise<PassionRow[]> {
  const db = getDb()
  if (opts.visibilities && opts.visibilities.length) {
    return db
      .select()
      .from(passions)
      .where(inArray(passions.visibility, opts.visibilities))
      .orderBy(asc(passions.position), desc(passions.createdAt))
  }
  return db.select().from(passions).orderBy(asc(passions.position), desc(passions.createdAt))
}

export async function getPassionById(id: string): Promise<PassionRow | undefined> {
  const rows = await getDb().select().from(passions).where(eq(passions.id, id)).limit(1)
  return rows[0]
}

/** True if a passion already owns this slug (optionally ignoring one row's id). */
export async function passionSlugExists(slug: string, exceptId?: string): Promise<boolean> {
  const db = getDb()
  const where = exceptId ? and(eq(passions.slug, slug), ne(passions.id, exceptId)) : eq(passions.slug, slug)
  const rows = await db.select({ id: passions.id }).from(passions).where(where).limit(1)
  return rows.length > 0
}

/** Insert at the end of the display order. */
export async function createPassion(data: Omit<NewPassion, "position">): Promise<PassionRow> {
  const db = getDb()
  const [{ max }] = await db.select({ max: sql<number | null>`max(${passions.position})` }).from(passions)
  const rows = await db
    .insert(passions)
    .values({ ...data, position: (max ?? -1) + 1 })
    .returning()
  return rows[0]
}

export async function updatePassion(id: string, data: Partial<NewPassion>): Promise<PassionRow | undefined> {
  const rows = await getDb()
    .update(passions)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(passions.id, id))
    .returning()
  return rows[0]
}

export async function deletePassion(id: string): Promise<void> {
  await getDb().delete(passions).where(eq(passions.id, id))
}

/** Swap a passion with its neighbor in display order. No-op at the edges. */
export async function movePassion(id: string, direction: "up" | "down"): Promise<void> {
  const db = getDb()
  const all = await db.select({ id: passions.id, position: passions.position }).from(passions).orderBy(asc(passions.position), desc(passions.createdAt))
  const i = all.findIndex((p) => p.id === id)
  const j = direction === "up" ? i - 1 : i + 1
  if (i < 0 || j < 0 || j >= all.length) return
  ;[all[i], all[j]] = [all[j], all[i]]
  for (let k = 0; k < all.length; k++) {
    if (all[k].position !== k) await db.update(passions).set({ position: k }).where(eq(passions.id, all[k].id))
  }
}

/** Rebuild a passion's asset links from its image list — see `syncProjectAssets`. */
export async function syncPassionAssets(passionId: string, images: string[]): Promise<void> {
  const db = getDb()
  await db.delete(passionAssets).where(eq(passionAssets.passionId, passionId))

  const keys = [...new Set(images.flatMap((u) => Array.from(u.matchAll(MEDIA_KEY_RE), (m) => m[1])))]
  if (!keys.length) return

  const found = await db.select().from(assets).where(inArray(assets.key, keys))
  if (found.length) {
    await db.insert(passionAssets).values(found.map((a, i) => ({ passionId, assetId: a.id, position: i })))
  }
}

const MEDIA_KEY_RE = /\/media\/(assets\/[a-f0-9]{64}\.[a-z0-9]+)/g

/**
 * Rebuild a post's asset links from its current content. Parses `/media/...`
 * URLs out of the body and adds the cover, so `assetRefCount` stays accurate
 * and the media library won't let you delete something still in use.
 */
export async function syncPostAssets(postId: string, body: string, coverAssetId: string | null): Promise<void> {
  const db = getDb()
  await db.delete(postAssets).where(eq(postAssets.postId, postId))

  const keys = [...new Set(Array.from(body.matchAll(MEDIA_KEY_RE), (m) => m[1]))]
  const rows: { postId: string; assetId: string; role: string; position: number }[] = []

  if (keys.length) {
    const found = await db.select().from(assets).where(inArray(assets.key, keys))
    found.forEach((a, i) => rows.push({ postId, assetId: a.id, role: "inline", position: i }))
  }
  if (coverAssetId) rows.push({ postId, assetId: coverAssetId, role: "cover", position: 0 })

  if (rows.length) await db.insert(postAssets).values(rows)
}
