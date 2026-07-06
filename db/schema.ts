import { pgTable, uuid, text, integer, timestamp, index, jsonb } from "drizzle-orm/pg-core"

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

/**
 * One gallery item on a project card. `src` is either an embed URL (YouTube),
 * a direct video/image URL (`/media/...` asset or `/projects/...` public
 * file), or any absolute URL — the gallery picks iframe vs <video> by URL.
 */
export type ProjectMediaItem = {
  type: "image" | "video"
  src: string
  alt?: string
  thumbnailSrc?: string
}

/**
 * Portfolio projects, managed from the admin. `position` orders the public
 * list (ascending); `visibility` reuses the posts model (draft = admin-only,
 * private = owner-only on /projects, public = everyone). Media is a jsonb
 * list rather than a join table because items can point outside the asset
 * store (YouTube embeds, legacy /projects/ files).
 */
export const projects = pgTable(
  "projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    description: text("description").array().notNull().default([]), // bullet points
    tech: text("tech").array().notNull().default([]),
    link: text("link"),
    playUrl: text("play_url"),
    linkedinPostUrl: text("linkedin_post_url"),
    media: jsonb("media").$type<ProjectMediaItem[]>().notNull().default([]),
    visibility: text("visibility").notNull().default("draft"),
    position: integer("position").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("projects_visibility_idx").on(t.visibility, t.position)],
)

/**
 * Which assets a project's media uses — mirrors `postAssets` so
 * `assetRefCount` can guard the media library against deleting something a
 * project still displays. Only `/media/...` srcs resolve to rows here.
 */
export const projectAssets = pgTable(
  "project_assets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    assetId: uuid("asset_id")
      .notNull()
      .references(() => assets.id, { onDelete: "cascade" }),
    position: integer("position").notNull().default(0),
  },
  (t) => [index("project_assets_project_idx").on(t.projectId)],
)

/** External link shown in a passion's modal (e.g. Chess.com profile). */
export type PassionMediaLink = { label: string; url: string }

/** One milestone entry in a passion's timeline (chronological, oldest first). */
export type PassionTimelineEntry = { date: string; items: string[] }

/**
 * "Beyond code" passions, managed from the admin like `projects`. Images stay
 * parallel arrays (`images` / `imageAlts`) because that's the shape the cards
 * and modal already render; the editor pairs them up per row.
 */
export const passions = pgTable(
  "passions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(), // stable key, e.g. "football"
    title: text("title").notNull(),
    description: text("description").notNull().default(""), // card blurb
    icon: text("icon").notNull().default("code"), // key into the card's icon map
    details: text("details").array().notNull().default([]), // modal paragraphs
    mediaLinks: jsonb("media_links").$type<PassionMediaLink[]>().notNull().default([]),
    images: text("images").array().notNull().default([]),
    imageAlts: text("image_alts").array().notNull().default([]),
    videoEmbed: text("video_embed"),
    timeline: jsonb("timeline").$type<PassionTimelineEntry[]>().notNull().default([]),
    imagePosition: text("image_position").notNull().default("center"), // center | top
    visibility: text("visibility").notNull().default("draft"),
    position: integer("position").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("passions_visibility_idx").on(t.visibility, t.position)],
)

/** Asset links for passion images — same ref-count guard as post/project assets. */
export const passionAssets = pgTable(
  "passion_assets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    passionId: uuid("passion_id")
      .notNull()
      .references(() => passions.id, { onDelete: "cascade" }),
    assetId: uuid("asset_id")
      .notNull()
      .references(() => assets.id, { onDelete: "cascade" }),
    position: integer("position").notNull().default(0),
  },
  (t) => [index("passion_assets_passion_idx").on(t.passionId)],
)

export type Asset = typeof assets.$inferSelect
export type NewAsset = typeof assets.$inferInsert
export type Post = typeof posts.$inferSelect
export type NewPost = typeof posts.$inferInsert
export type PostAsset = typeof postAssets.$inferSelect
export type ProjectRow = typeof projects.$inferSelect
export type NewProject = typeof projects.$inferInsert
export type PassionRow = typeof passions.$inferSelect
export type NewPassion = typeof passions.$inferInsert
