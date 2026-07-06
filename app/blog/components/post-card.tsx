import Link from "next/link"
import Image from "next/image"
import type { Asset, Post } from "@/db/schema"
import { kindMeta, visibilityMeta, formatDateTime } from "@/lib/posts"

/** Card for the blog index. Shows a visibility badge only for non-public posts
 *  (the owner sees these; the public never receives them). */
export function PostCard({ post, cover, showVisibility }: { post: Post; cover?: Asset; showVisibility?: boolean }) {
  const meta = kindMeta(post.kind)
  const vis = visibilityMeta(post.visibility)

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="card-hover group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
    >
      {cover && (
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
          <Image
            src={cover.publicUrl}
            alt={cover.originalName ?? post.title}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            style={{ objectPosition: post.coverPosition }}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            unoptimized={cover.mime === "image/svg+xml" || cover.mime === "image/gif"}
          />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${meta.badge}`}>{meta.label}</span>
          {showVisibility && post.visibility !== "public" && (
            <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${vis.badge}`}>{vis.label}</span>
          )}
          <span className="text-xs text-muted-foreground">{formatDateTime(post.publishedAt)}</span>
        </div>

        <h2 className="text-lg font-bold text-card-foreground transition-colors group-hover:text-primary">
          {post.title}
        </h2>

        {post.summary && <p className="line-clamp-3 text-sm text-muted-foreground">{post.summary}</p>}

        {post.tags.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
            {post.tags.slice(0, 4).map((t) => (
              <span key={t} className="rounded-full border border-border bg-secondary/60 px-2 py-0.5 font-mono text-[10px] text-accent-foreground">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
