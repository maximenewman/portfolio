import type { Asset } from "@/db/schema"
import { isCurrentUserAdmin } from "@/lib/admin"
import { listPosts, getAssetsByIds } from "@/lib/queries"
import { BlogList } from "./components/blog-list"

// Depends on who's viewing (the owner sees private posts) and on live data.
export const dynamic = "force-dynamic"

export const metadata = {
  title: "Journal | Maxime Newman",
  description: "Notes on what I'm building — ideas, progress, wins, and failures.",
}

export default async function BlogPage() {
  const admin = await isCurrentUserAdmin()
  const posts = await listPosts({ visibilities: admin ? ["public", "private"] : ["public"] })
  const coverMap = await getAssetsByIds(posts.map((p) => p.coverAssetId).filter((x): x is string => !!x))
  const covers: Record<string, Asset> = Object.fromEntries(coverMap)

  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-card/50 py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-primary">Journal</p>
          <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            What I&apos;m Doing. Recap
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            A running log of ideas, progress, wins, and the occasional failure — documented as I go.
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 md:py-16">
        {posts.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">No entries yet — check back soon.</p>
        ) : (
          <BlogList posts={posts} covers={covers} isAdmin={admin} />
        )}
      </main>
    </div>
  )
}
