import { pgTable, uuid, text, integer, timestamp, index } from "drizzle-orm/pg-core"

/**
 * Content-addressed media/assets. `sha256` is the dedup key: the same bytes
 * always hash to the same value and map to a single storage object, so
 * re-uploading a file never stores it twice. Rows here just track metadata;
 * the bytes live in Tigris under `key`.
 */
export const assets = pgTable(
  "assets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sha256: text("sha256").notNull().unique(),
    key: text("key").notNull(), // storage object key, e.g. "assets/<sha256>.png"
    kind: text("kind").notNull(), // "image" | "video" | "document"
    mime: text("mime").notNull(),
    size: integer("size").notNull(), // bytes
    width: integer("width"),
    height: integer("height"),
    originalName: text("original_name"),
    publicUrl: text("public_url").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("assets_kind_idx").on(t.kind)],
)

/**
 * Journal-style blog posts. `publishedAt` is the entry date the reader sees;
 * `published` gates public visibility (drafts stay admin-only). `kind` is the
 * journal flavor (idea / progress / shipped / …); `status` reserved for future.
 */
export const posts = pgTable(
  "posts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    summary: text("summary"),
    body: text("body").notNull().default(""), // markdown
    kind: text("kind").notNull().default("note"), // idea|in-progress|shipped|success|failure|note
    tags: text("tags").array().notNull().default([]),
    coverAssetId: uuid("cover_asset_id").references(() => assets.id, { onDelete: "set null" }),
    // CSS object-position ("x% y%") for the cover's focal point within its
    // cropped frame — set by dragging in the editor.
    coverPosition: text("cover_position").notNull().default("50% 50%"),
    // draft = owner-only in admin, private = on /blog but only when signed in,
    // public = visible to everyone.
    visibility: text("visibility").notNull().default("draft"),
    publishedAt: timestamp("published_at", { withTimezone: true }).defaultNow().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index("posts_visibility_idx").on(t.visibility, t.publishedAt),
    index("posts_slug_idx").on(t.slug),
  ],
)

/**
 * Which assets a post uses, and in what role. `role` distinguishes the hero
 * cover from inline body media and gallery items; `position` orders them.
 * Deleting a post drops the links but never the underlying (possibly shared)
 * asset — dedup means one asset can belong to many posts.
 */
export const postAssets = pgTable(
  "post_assets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    assetId: uuid("asset_id")
      .notNull()
      .references(() => assets.id, { onDelete: "cascade" }),
    role: text("role").notNull().default("inline"), // cover | inline | gallery
    position: integer("position").notNull().default(0),
  },
  (t) => [index("post_assets_post_idx").on(t.postId)],
)

export type Asset = typeof assets.$inferSelect
export type NewAsset = typeof assets.$inferInsert
export type Post = typeof posts.$inferSelect
export type NewPost = typeof posts.$inferInsert
export type PostAsset = typeof postAssets.$inferSelect
