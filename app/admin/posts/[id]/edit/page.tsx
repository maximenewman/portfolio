import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { getPostById, getAsset } from "@/lib/queries"
import { PostEditor, type EditorInitial } from "../../post-editor"

export const metadata = {
  title: "Edit post | Admin",
  robots: { index: false, follow: false },
}

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = await getPostById(id)
  if (!post) notFound()

  const cover = post.coverAssetId ? await getAsset(post.coverAssetId) : null

  const initial: EditorInitial = {
    title: post.title,
    slug: post.slug,
    summary: post.summary ?? "",
    body: post.body,
    kind: post.kind,
    tags: post.tags,
    coverAssetId: post.coverAssetId,
    visibility: post.visibility,
    publishedAt: new Date(post.publishedAt).toISOString().slice(0, 10),
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 md:py-16">
      <Link
        href="/admin/posts"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
        Posts
      </Link>
      <h1 className="mb-8 text-2xl font-bold tracking-tight text-foreground">Edit entry</h1>
      <PostEditor mode="edit" postId={post.id} initial={initial} initialCover={cover ?? null} />
    </div>
  )
}
