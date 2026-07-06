import Link from "next/link"
import { ChevronLeft, Plus, Pencil } from "lucide-react"
import { listPosts } from "@/lib/queries"
import { kindMeta, visibilityMeta, formatDateTime } from "@/lib/posts"

export const metadata = {
  title: "Posts | Admin",
  robots: { index: false, follow: false },
}

export default async function AdminPostsPage() {
  const posts = await listPosts()

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 md:py-16">
      <Link
        href="/admin"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
        Admin
      </Link>

      <div className="mb-8 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">Posts</h1>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          New post
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">No posts yet. Write your first entry.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {posts.map((post) => {
            const meta = kindMeta(post.kind)
            const vis = visibilityMeta(post.visibility)
            return (
              <Link
                key={post.id}
                href={`/admin/posts/${post.id}/edit`}
                className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${meta.badge}`}>{meta.label}</span>
                    <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${vis.badge}`}>{vis.label}</span>
                  </div>
                  <h2 className="mt-1.5 truncate font-semibold text-card-foreground">{post.title}</h2>
                  <p className="text-xs text-muted-foreground">{formatDateTime(post.publishedAt)}</p>
                </div>
                <Pencil className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
