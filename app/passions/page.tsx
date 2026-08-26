import { isCurrentUserAdmin } from "@/lib/admin"
import { listPassions } from "@/lib/queries"
import { toCardPassion } from "@/lib/passions"
import { Container, PageHeader } from "@/app/components/page-shell"
import { PassionsDisplay } from "./components/passions_display"

// Depends on who's viewing (the owner sees private passions) and on live data.
export const dynamic = "force-dynamic"

export default async function PassionsPage() {
  const admin = await isCurrentUserAdmin()
  const rows = await listPassions({ visibilities: admin ? ["public", "private"] : ["public"] })
  const passions = rows.map(toCardPassion)

  return (
    <div>
      <PageHeader
        eyebrow="Beyond code"
        title="My Passions"
        deck="The pursuits that keep me curious, competitive, and a long way from a screen."
      />

      {/* The root layout already owns <main>, so this is a plain section. */}
      <Container as="section" className="py-[clamp(3rem,8vw,5.5rem)]">
        <PassionsDisplay passions={passions} />
      </Container>
    </div>
  )
}
