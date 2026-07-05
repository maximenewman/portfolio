import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin"
import { ACCEPTED_MIME, extFromMime, kindFromMime } from "@/lib/assets"
import { assetKey, publicUrl, objectExists } from "@/lib/storage"
import { insertAsset } from "@/lib/queries"

/**
 * Step 2 of the dedup upload flow. After the browser PUTs the bytes to Tigris,
 * it confirms so we record the asset. We recompute the key from the hash (never
 * trust a client-supplied key) and verify the object really landed before
 * inserting, so we can't create DB rows pointing at nothing.
 */
export async function POST(req: NextRequest) {
  try {
    await requireAdmin()
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json().catch(() => ({}))
  const { sha256, mime, size, originalName, width, height } = body

  if (typeof sha256 !== "string" || !/^[a-f0-9]{64}$/.test(sha256)) {
    return NextResponse.json({ error: "Invalid sha256" }, { status: 400 })
  }
  if (typeof mime !== "string" || !ACCEPTED_MIME.has(mime)) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 415 })
  }
  if (typeof size !== "number" || size <= 0) {
    return NextResponse.json({ error: "Invalid size" }, { status: 400 })
  }

  const key = assetKey(sha256, extFromMime(mime))
  if (!(await objectExists(key))) {
    return NextResponse.json({ error: "Object not found in storage" }, { status: 409 })
  }

  const asset = await insertAsset({
    sha256,
    key,
    kind: kindFromMime(mime),
    mime,
    size,
    width: typeof width === "number" ? width : null,
    height: typeof height === "number" ? height : null,
    originalName: typeof originalName === "string" ? originalName.slice(0, 255) : null,
    publicUrl: publicUrl(key),
  })

  return NextResponse.json({ asset })
}
