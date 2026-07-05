import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { PostEditor, type EditorInitial } from "../post-editor"

export const metadata = {
  title: "New post | Admin",
  robots: { index: false, follow: false },
}

export default function NewPostPage() {
  const today = new Date().toISOString().slice(0, 10)
  const initial: EditorInitial = {
    title: "",
    slug: "",
    summary: "",
    body: "",
    kind: "note",
    tags: [],
    coverAssetId: null,
    visibility: "draft",
    publishedAt: today,
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
      <h1 className="mb-8 text-2xl font-bold tracking-tight text-foreground">New entry</h1>
      <PostEditor mode="create" initial={initial} />
    </div>
  )
}
