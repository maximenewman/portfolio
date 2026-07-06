import { isCurrentUserAdmin } from "@/lib/admin"
import { listPassions } from "@/lib/queries"
import { toCardPassion } from "@/lib/passions"
import { PassionsDisplay } from "./components/passions_display"

// Depends on who's viewing (the owner sees private passions) and on live data.
export const dynamic = "force-dynamic"

export default async function PassionsPage() {
  const admin = await isCurrentUserAdmin()
  const rows = await listPassions({ visibilities: admin ? ["public", "private"] : ["public"] })
  const passions = rows.map(toCardPassion)

  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <header className="border-b border-border bg-card/50 py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-primary">
            Beyond Code
          </p>
          <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            My Passions
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Life is more than just code. These are the pursuits that fuel my creativity,
            keep me grounded, and shape who I am outside of technology.
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-12 md:py-16">
        <PassionsDisplay passions={passions} />
      </main>
    </div>
  )
}
