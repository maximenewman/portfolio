import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { PassionEditor, type PassionEditorInitial } from "../passion-editor"

export const metadata = {
  title: "New passion | Admin",
  robots: { index: false, follow: false },
}

export default function NewPassionPage() {
  const initial: PassionEditorInitial = {
    title: "",
    slug: "",
    description: "",
    icon: "code",
    details: [],
    mediaLinks: [],
    images: [],
    videoEmbed: "",
    timeline: [],
    imagePosition: "center",
    visibility: "draft",
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
      <h1 className="mb-8 text-2xl font-bold tracking-tight text-foreground">New passion</h1>
      <PassionEditor mode="create" initial={initial} />
    </div>
  )
}
