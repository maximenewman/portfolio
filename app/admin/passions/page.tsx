import Link from "next/link"
import { ChevronLeft, ChevronUp, ChevronDown, Plus, Pencil } from "lucide-react"
import { listPassions } from "@/lib/queries"
import { visibilityMeta } from "@/lib/posts"
import { movePassionAction } from "./actions"

export const metadata = {
  title: "Passions | Admin",
  robots: { index: false, follow: false },
}

export default async function AdminPassionsPage() {
  const passions = await listPassions()

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
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">Passions</h1>
        <Link
          href="/admin/passions/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          New passion
        </Link>
      </div>

      {passions.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">No passions yet. Add your first one.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {passions.map((passion, index) => {
            const vis = visibilityMeta(passion.visibility)
            return (
              <div
                key={passion.id}
                className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
              >
                {/* Reorder: forms so the row link stays a plain server page */}
                <div className="flex flex-col">
                  <form action={movePassionAction.bind(null, passion.id, "up")}>
                    <button
                      disabled={index === 0}
                      className="rounded p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30"
                      aria-label="Move up"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                  </form>
                  <form action={movePassionAction.bind(null, passion.id, "down")}>
                    <button
                      disabled={index === passions.length - 1}
                      className="rounded p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30"
                      aria-label="Move down"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </form>
                </div>

                <Link href={`/admin/passions/${passion.id}/edit`} className="flex min-w-0 flex-1 items-center gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${vis.badge}`}>{vis.label}</span>
                      <span className="text-[11px] text-muted-foreground">
                        {passion.icon} · {passion.images.length} photos
                        {index === 0 ? " · featured" : ""}
                      </span>
                    </div>
                    <h2 className="mt-1.5 truncate font-semibold text-card-foreground">{passion.title}</h2>
                  </div>
                  <Pencil className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                </Link>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
