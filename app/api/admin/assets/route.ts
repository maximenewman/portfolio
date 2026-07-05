import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin"
import { listAssets } from "@/lib/queries"

/** List all stored assets for the media library, newest first. */
export async function GET(req: NextRequest) {
  try {
    await requireAdmin()
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const kind = req.nextUrl.searchParams.get("kind") ?? undefined
  const items = await listAssets(kind)
  return NextResponse.json({ assets: items })
}
