import { createHash } from "crypto"

export type AssetKind = "image" | "video" | "document"

/** Map a MIME type to the coarse kind we render by. Unknown → document. */
export function kindFromMime(mime: string): AssetKind {
  if (mime.startsWith("image/")) return "image"
  if (mime.startsWith("video/")) return "video"
  return "document"
}

/** Best-effort file extension from a MIME type, for building the storage key. */
export function extFromMime(mime: string): string {
  const map: Record<string, string> = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/avif": "avif",
    "image/svg+xml": "svg",
    "video/mp4": "mp4",
    "video/webm": "webm",
    "video/quicktime": "mov",
    "application/pdf": "pdf",
  }
  return map[mime] ?? "bin"
}

/** SHA-256 of raw bytes, hex-encoded — the dedup key used everywhere. */
export function sha256Hex(bytes: Uint8Array | Buffer): string {
  return createHash("sha256").update(bytes).digest("hex")
}

/** Reject anything we don't explicitly support before it reaches storage. */
export const ACCEPTED_MIME = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/svg+xml",
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "application/pdf",
])

export const MAX_UPLOAD_BYTES = 500 * 1024 * 1024 // 500 MB ceiling (videos)
