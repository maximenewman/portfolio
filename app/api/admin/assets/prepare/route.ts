import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin"
import { ACCEPTED_MIME, MAX_UPLOAD_BYTES, extFromMime } from "@/lib/assets"
import { assetKey, presignPut } from "@/lib/storage"
import { findAssetBySha } from "@/lib/queries"

/**
 * Step 1 of the dedup upload flow. The browser hashes the file and asks whether
 * it's already stored. If so, no upload happens. Otherwise we hand back a
 * short-lived presigned PUT so the browser uploads straight to Tigris.
 */
export async function POST(req: NextRequest) {
  try {
    await requireAdmin()
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { sha256, mime, size } = await req.json().catch(() => ({}))

  if (typeof sha256 !== "string" || !/^[a-f0-9]{64}$/.test(sha256)) {
    return NextResponse.json({ error: "Invalid sha256" }, { status: 400 })
  }
  if (typeof mime !== "string" || !ACCEPTED_MIME.has(mime)) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 415 })
  }
  if (typeof size !== "number" || size <= 0 || size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: "File too large" }, { status: 413 })
  }

  const existing = await findAssetBySha(sha256)
  if (existing) {
    return NextResponse.json({ exists: true, asset: existing })
  }

  const key = assetKey(sha256, extFromMime(mime))
  const uploadUrl = await presignPut(key, mime)
  return NextResponse.json({ exists: false, key, uploadUrl })
}
