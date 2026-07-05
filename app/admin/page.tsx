import Link from "next/link"
import { currentUser } from "@clerk/nextjs/server"
import { FileText, ImageIcon } from "lucide-react"

export const metadata = {
  title: "Admin | Maxime Newman",
  robots: { index: false, follow: false },
}

// Middleware already gates this route to the owner allowlist; this page is the
// authenticated landing. Sections get wired up in later phases.
export default async function AdminHome() {
  const user = await currentUser()

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 md:py-16">
      <header className="mb-10">
        <p className="mb-2 text-sm font-medium uppercase tracking-widest text-primary">
          Admin
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Welcome back{user?.firstName ? `, ${user.firstName}` : ""}
        </h1>
        <p className="mt-3 text-muted-foreground">
          Write journal entries, manage media, and publish to the blog.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/posts"
          className="card-hover flex items-start gap-4 rounded-2xl border border-border bg-card p-6"
        >
          <FileText className="h-6 w-6 shrink-0 text-primary" />
          <div>
            <h2 className="font-semibold text-card-foreground">Posts</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Create and edit journal entries.
            </p>
          </div>
        </Link>

        <Link
          href="/admin/media"
          className="card-hover flex items-start gap-4 rounded-2xl border border-border bg-card p-6"
        >
          <ImageIcon className="h-6 w-6 shrink-0 text-primary" />
          <div>
            <h2 className="font-semibold text-card-foreground">Media library</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Upload images, videos, and resumes.
            </p>
          </div>
        </Link>
      </div>
    </div>
  )
}
