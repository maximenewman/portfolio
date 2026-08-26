import Link from "next/link"
import Image from "next/image"
import type { Asset, Post } from "@/db/schema"
import { Panel } from "@/app/components/page-shell"
import { kindMeta, visibilityMeta, formatDateTime } from "@/lib/posts"

/** Card for the blog index. Shows a visibility badge only for non-public posts
 *  (the owner sees these; the public never receives them). */
export function PostCard({ post, cover, showVisibility }: { post: Post; cover?: Asset; showVisibility?: boolean }) {
  const meta = kindMeta(post.kind)
  const vis = visibilityMeta(post.visibility)

  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <Panel className="card-hover flex h-full flex-col overflow-hidden fine:group-hover:border-primary/50">
        {cover && (
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
            <Image
              src={cover.publicUrl}
              alt={cover.originalName ?? post.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
              // Focal point chosen in the editor — the crop has to respect it.
              style={{ objectPosition: post.coverPosition }}
              // Hover-only polish: gated to fine pointers so a tap on a touch
              // device doesn't leave the image stuck in its hovered state.
              className="object-cover transition-transform duration-500 ease-entrance fine:group-hover:scale-[1.04]"
              unoptimized={cover.mime === "image/svg+xml" || cover.mime === "image/gif"}
            />
          </div>
        )}

        <div className="flex flex-1 flex-col gap-3 p-[clamp(1.1rem,2vw,1.5rem)]">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full border px-2 py-1 font-mono text-eyebrow uppercase ${meta.badge}`}>
              {meta.label}
            </span>
            {showVisibility && post.visibility !== "public" && (
              <span className={`rounded-full border px-2 py-1 font-mono text-eyebrow uppercase ${vis.badge}`}>
                {vis.label}
              </span>
            )}
            <time
              dateTime={new Date(post.publishedAt).toISOString()}
              className="font-mono text-eyebrow uppercase text-muted-foreground"
            >
              {formatDateTime(post.publishedAt)}
            </time>
          </div>

          <h2 className="font-display text-h3 text-balance text-card-foreground transition-colors fine:group-hover:text-primary">
            {post.title}
          </h2>

          {post.summary && <p className="line-clamp-3 text-sm text-muted-foreground">{post.summary}</p>}

          {post.tags.length > 0 && (
            <ul className="mt-auto flex flex-wrap gap-1.5 pt-1">
              {post.tags.slice(0, 4).map((t) => (
                <li
                  key={t}
                  className="rounded-full border border-border bg-secondary/60 px-2 py-0.5 font-mono text-[10px] text-accent-foreground"
                >
                  {t}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Panel>
    </Link>
  )
}
