import { NextRequest } from "next/server"
import { GetObjectCommand } from "@aws-sdk/client-s3"
import { getS3, bucket } from "@/lib/storage"

// Serves objects from the (private) Tigris bucket over the same origin. Keys are
// content hashes, so responses are immutable and cache forever. Range requests
// are forwarded so browsers can seek within videos.
export async function GET(req: NextRequest, ctx: { params: Promise<{ key: string[] }> }) {
  const { key: segments } = await ctx.params
  const key = segments.map(decodeURIComponent).join("/")

  // Only ever serve from the assets/ prefix — no path traversal into other keys.
  if (!key.startsWith("assets/") || key.includes("..")) {
    return new Response("Not found", { status: 404 })
  }

  const range = req.headers.get("range") ?? undefined

  try {
    const obj = await getS3().send(new GetObjectCommand({ Bucket: bucket(), Key: key, Range: range }))
    const body = obj.Body?.transformToWebStream()
    if (!body) return new Response("Not found", { status: 404 })

    const headers = new Headers({
      "Content-Type": obj.ContentType ?? "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
      "Accept-Ranges": "bytes",
    })
    if (obj.ContentLength != null) headers.set("Content-Length", String(obj.ContentLength))
    if (obj.ContentRange) headers.set("Content-Range", obj.ContentRange)

    // 206 when a range was requested and honored, otherwise 200.
    return new Response(body, { status: range && obj.ContentRange ? 206 : 200, headers })
  } catch (err) {
    const name = (err as { name?: string })?.name
    if (name === "NoSuchKey" || name === "NotFound") {
      return new Response("Not found", { status: 404 })
    }
    console.error("[media] serve error", err)
    return new Response("Error", { status: 500 })
  }
}
