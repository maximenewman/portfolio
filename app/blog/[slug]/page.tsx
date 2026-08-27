import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { ChevronLeft, Eye, Pencil } from "lucide-react"
import { isCurrentUserAdmin } from "@/lib/admin"
import { getPostBySlug, getAsset } from "@/lib/queries"
import { kindMeta, visibilityMeta, formatDateTime } from "@/lib/posts"
import { Markdown } from "@/app/components/markdown"
import { Container, Panel } from "@/app/components/page-shell"

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
    <Container as="section" className="py-[clamp(2.5rem,6vw,4.5rem)]">
      {/* One column, aligned left of a wide page: the cover runs the full
          column while the body is held to a reading measure below. */}
      <article className="mx-auto max-w-[54rem]">
        <Link
          href="/blog"
          className="link-underline inline-flex items-center gap-1.5 font-mono text-eyebrow uppercase text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="h-3.5 w-3.5" aria-hidden />
          Journal
        </Link>

        {/* Owner banner for non-public posts */}
        {admin && post.visibility !== "public" && (
          <Panel className="mt-6 flex flex-wrap items-center gap-3 px-4 py-3 text-sm">
            <Eye className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
            <span className="text-foreground">
              {post.visibility === "private" ? "Private. Only you can see this." : "Draft. Not shown on the blog."}
            </span>
            <Link
              href={`/admin/posts/${post.id}/edit`}
              className="ml-auto inline-flex min-h-9 touch:min-h-11 items-center gap-1.5 font-medium text-primary hover:underline"
            >
              <Pencil className="h-3.5 w-3.5" aria-hidden />
              Edit
            </Link>
          </Panel>
        )}

        <header className="reveal mt-[clamp(2rem,5vw,3rem)]">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full border px-2.5 py-1 font-mono text-eyebrow uppercase ${meta.badge}`}>
              {meta.label}
            </span>
            {admin && post.visibility !== "public" && (
              <span className={`rounded-full border px-2.5 py-1 font-mono text-eyebrow uppercase ${vis.badge}`}>
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

          <h1 className="mt-5 max-w-[20ch] font-display text-h1 text-balance text-foreground">{post.title}</h1>

          {post.summary && (
            <p className="mt-6 max-w-[40ch] font-serif text-deck text-pretty text-muted-foreground">{post.summary}</p>
          )}
        </header>

        {cover && (
          <div className="reveal relative mt-[clamp(2rem,5vw,3rem)] aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border bg-muted">
            <Image
              src={cover.publicUrl}
              alt={cover.originalName ?? post.title}
              fill
              sizes="(max-width: 1024px) 100vw, 864px"
              priority
              style={{ objectPosition: post.coverPosition }}
              className="object-cover"
              unoptimized={cover.mime === "image/svg+xml" || cover.mime === "image/gif"}
            />
          </div>
        )}

        {/* Reading measure. <Markdown> supplies the `.md` wrapper that carries
            the journal body typography — it must stay inside, not around. */}
        <div className="mt-[clamp(2rem,5vw,3rem)] max-w-[70ch]">
          <Markdown content={post.body} />
        </div>

        {post.tags.length > 0 && (
          <ul className="mt-12 flex max-w-[70ch] flex-wrap gap-2 border-t border-border/70 pt-6">
            {post.tags.map((t) => (
              <li
                key={t}
                className="rounded-full border border-border bg-secondary/60 px-3 py-1 font-mono text-xs text-accent-foreground"
              >
                {t}
              </li>
            ))}
          </ul>
        )}
      </article>
    </Container>
  )
}
