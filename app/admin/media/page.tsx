import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { listAssets } from "@/lib/queries"
import { MediaLibrary } from "./media-library"

export const metadata = {
  title: "Media | Admin",
  robots: { index: false, follow: false },
}

// Guarded by middleware; loads the initial asset list server-side so the grid
// paints immediately, then the client handles uploads and mutations.
export default async function MediaPage() {
  const assets = await listAssets()

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12 md:py-16">
      <Link
        href="/admin"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
        Admin
      </Link>

      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">Media library</h1>
        <p className="mt-2 text-muted-foreground">
          Upload and manage images, videos, and resumes. Files are content-addressed, so uploading the same file twice
          never stores it twice.
        </p>
      </header>

      <MediaLibrary initialAssets={assets} />
    </div>
  )
}
