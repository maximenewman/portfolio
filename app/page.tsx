import MyBio from "./components/bio"
import { isCurrentUserAdmin } from "@/lib/admin"
import { listExperiences } from "@/lib/queries"
import { toCardExperience } from "@/lib/experiences"

// Depends on who's viewing (the owner sees private experiences) and on live data.
export const dynamic = "force-dynamic"

export default async function Home() {
  const admin = await isCurrentUserAdmin()
  const rows = await listExperiences({ visibilities: admin ? ["public", "private"] : ["public"] })

  return (
    <main>
      <MyBio experiences={rows.map(toCardExperience)} />
    </main>
  )
}
