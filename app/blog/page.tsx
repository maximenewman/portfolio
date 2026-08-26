import type { Asset } from "@/db/schema"
import { isCurrentUserAdmin } from "@/lib/admin"
import { listPosts, getAssetsByIds } from "@/lib/queries"
import { Container, PageHeader } from "@/app/components/page-shell"
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
      <PageHeader
        eyebrow="Journal"
        title="What I'm doing. Recap"
        deck="A running log of ideas, progress, wins, and the occasional failure — documented as I go."
      />

      {/* The root layout already owns <main>, so this is a plain section. */}
      <Container as="section" className="py-[clamp(2.5rem,7vw,4.5rem)]">
        {posts.length === 0 ? (
          <p className="max-w-[46ch] text-lede text-muted-foreground">
            No entries yet — check back soon.
          </p>
        ) : (
          <BlogList posts={posts} covers={covers} isAdmin={admin} />
        )}
      </Container>
    </div>
  )
}
