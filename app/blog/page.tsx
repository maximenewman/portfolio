import { isCurrentUserAdmin } from "@/lib/admin"
import { listPosts, getAssetsByIds } from "@/lib/queries"
import { PostCard } from "./components/post-card"

// Depends on who's viewing (the owner sees private posts) and on live data.
export const dynamic = "force-dynamic"

export const metadata = {
  title: "Journal | Maxime Newman",
  description: "Notes on what I'm building — ideas, progress, wins, and failures.",
}

export default async function BlogPage() {
  const admin = await isCurrentUserAdmin()
  const posts = await listPosts({ visibilities: admin ? ["public", "private"] : ["public"] })
  const covers = await getAssetsByIds(posts.map((p) => p.coverAssetId).filter((x): x is string => !!x))

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
          <div className="stagger-children grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                cover={post.coverAssetId ? covers.get(post.coverAssetId) : undefined}
                showVisibility={admin}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
