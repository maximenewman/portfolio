import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { getPassionById } from "@/lib/queries"
import { PassionEditor, type PassionEditorInitial } from "../../passion-editor"

export const metadata = {
  title: "Edit passion | Admin",
  robots: { index: false, follow: false },
}

export default async function EditPassionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const passion = await getPassionById(id)
  if (!passion) notFound()

  const initial: PassionEditorInitial = {
    title: passion.title,
    slug: passion.slug,
    description: passion.description,
    icon: passion.icon,
    details: passion.details,
    mediaLinks: passion.mediaLinks,
    images: passion.images.map((src, i) => ({ src, alt: passion.imageAlts[i] ?? "" })),
    videoEmbed: passion.videoEmbed ?? "",
    timeline: passion.timeline.map((t) => ({ date: t.date, items: t.items.join("\n") })),
    imagePosition: passion.imagePosition,
    visibility: passion.visibility,
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 md:py-16">
      <Link
        href="/admin/passions"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
        Passions
      </Link>
      <h1 className="mb-8 text-2xl font-bold tracking-tight text-foreground">Edit passion</h1>
      <PassionEditor mode="edit" passionId={passion.id} initial={initial} />
    </div>
  )
}
