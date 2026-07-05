import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { ChevronLeft, Eye, Pencil } from "lucide-react"
import { isCurrentUserAdmin } from "@/lib/admin"
import { getPostBySlug, getAsset } from "@/lib/queries"
import { kindMeta, visibilityMeta, formatDate } from "@/lib/posts"
import { Markdown } from "@/app/components/markdown"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post || post.visibility !== "public") {
    return { title: "Journal | Maxime Newman" }
  }
  return {
    title: `${post.title} | Journal`,
    description: post.summary ?? undefined,
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const admin = await isCurrentUserAdmin()
  // Public posts are for everyone; private/draft only for the signed-in owner.
  if (post.visibility !== "public" && !admin) notFound()

  const cover = post.coverAssetId ? await getAsset(post.coverAssetId) : null
  const meta = kindMeta(post.kind)
  const vis = visibilityMeta(post.visibility)

  return (
    <article className="container mx-auto max-w-3xl px-4 py-10 md:py-14">
      <Link
        href="/blog"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
        Journal
      </Link>

      {/* Owner banner for non-public posts */}
      {admin && post.visibility !== "public" && (
        <div className="mb-6 flex flex-wrap items-center gap-3 rounded-lg border border-border bg-muted/60 px-4 py-2.5 text-sm">
          <Eye className="h-4 w-4 text-muted-foreground" />
          <span className="text-foreground">
            {post.visibility === "private" ? "Private — only you can see this." : "Draft — not shown on the blog."}
          </span>
          <Link href={`/admin/posts/${post.id}/edit`} className="ml-auto inline-flex items-center gap-1 text-primary hover:underline">
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Link>
        </div>
      )}

      <header className="mb-8">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${meta.badge}`}>{meta.label}</span>
          {admin && post.visibility !== "public" && (
            <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${vis.badge}`}>{vis.label}</span>
          )}
          <time className="text-sm text-muted-foreground">{formatDate(post.publishedAt)}</time>
        </div>
        <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">{post.title}</h1>
        {post.summary && <p className="mt-3 text-lg text-muted-foreground">{post.summary}</p>}
      </header>

      {cover && (
        <div className="relative mb-8 aspect-[16/9] w-full overflow-hidden rounded-xl border border-border bg-muted">
          <Image
            src={cover.publicUrl}
            alt={cover.originalName ?? post.title}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            priority
            className="object-cover"
            unoptimized={cover.mime === "image/svg+xml" || cover.mime === "image/gif"}
          />
        </div>
      )}

      <Markdown content={post.body} />

      {post.tags.length > 0 && (
        <div className="mt-10 flex flex-wrap gap-2 border-t border-border pt-6">
          {post.tags.map((t) => (
            <span key={t} className="rounded-full border border-border bg-secondary/60 px-3 py-1 font-mono text-xs text-accent-foreground">
              {t}
            </span>
          ))}
        </div>
      )}
    </article>
  )
}
