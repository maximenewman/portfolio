import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin"
import { deleteObject } from "@/lib/storage"
import { getAsset, assetRefCount, deleteAssetRow } from "@/lib/queries"

/**
 * Delete an asset — bytes and row. Refuses if any post still references it, so
 * we never leave a post pointing at missing media (dedup means one asset can be
 * shared, so a live reference must win).
 */
export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await ctx.params
  const asset = await getAsset(id)
  if (!asset) return NextResponse.json({ error: "Not found" }, { status: 404 })

  if ((await assetRefCount(id)) > 0) {
    return NextResponse.json({ error: "Asset is in use by a post" }, { status: 409 })
  }

  await deleteObject(asset.key)
  await deleteAssetRow(id)
  return NextResponse.json({ ok: true })
}
