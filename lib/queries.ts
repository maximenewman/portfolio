import { getDb } from "./db"
import { assets, posts, postAssets, type Asset, type NewAsset, type Post, type NewPost } from "@/db/schema"
import { eq, ne, and, desc, inArray } from "drizzle-orm"

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

/** How many posts reference this asset — guards deletion of in-use media. */
export async function assetRefCount(id: string): Promise<number> {
  const rows = await getDb().select({ id: postAssets.id }).from(postAssets).where(eq(postAssets.assetId, id))
  return rows.length
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
