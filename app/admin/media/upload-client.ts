import type { Asset } from "@/db/schema"

/** SHA-256 of a file, hex — the dedup key, computed in the browser. */
export async function hashFile(file: File): Promise<string> {
  const buf = await file.arrayBuffer()
  const digest = await crypto.subtle.digest("SHA-256", buf)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

/** Best-effort intrinsic dimensions, read client-side (server never sees bytes). */
async function readDimensions(file: File): Promise<{ width?: number; height?: number }> {
  if (file.type.startsWith("image/") && file.type !== "image/svg+xml") {
    try {
      const bitmap = await createImageBitmap(file)
      const dims = { width: bitmap.width, height: bitmap.height }
      bitmap.close()
      return dims
    } catch {
      return {}
    }
  }
  if (file.type.startsWith("video/")) {
    return new Promise((resolve) => {
      const video = document.createElement("video")
      video.preload = "metadata"
      const url = URL.createObjectURL(file)
      video.onloadedmetadata = () => {
        URL.revokeObjectURL(url)
        resolve({ width: video.videoWidth, height: video.videoHeight })
      }
      video.onerror = () => {
        URL.revokeObjectURL(url)
        resolve({})
      }
      video.src = url
    })
  }
  return {}
}

/** PUT with upload progress (fetch has no progress events; XHR does). */
function putWithProgress(url: string, file: File, onProgress?: (pct: number) => void): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open("PUT", url)
    xhr.setRequestHeader("Content-Type", file.type)
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100))
    }
    xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`Upload failed (${xhr.status})`)))
    xhr.onerror = () => reject(new Error("Upload failed"))
    xhr.send(file)
  })
}

export type UploadResult = { asset: Asset; deduped: boolean }

/**
 * Full dedup upload: hash → ask server if it exists → if new, presigned PUT
 * straight to Tigris → confirm. Returns the asset and whether it was deduped.
 */
export async function uploadFile(file: File, onProgress?: (pct: number) => void): Promise<UploadResult> {
  const sha256 = await hashFile(file)

  const prep = await fetch("/api/admin/assets/prepare", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ sha256, mime: file.type, size: file.size }),
  })
  if (!prep.ok) throw new Error((await prep.json().catch(() => ({}))).error || "Prepare failed")
  const prepData = (await prep.json()) as
    | { exists: true; asset: Asset }
    | { exists: false; key: string; uploadUrl: string }

  if (prepData.exists) {
    onProgress?.(100)
    return { asset: prepData.asset, deduped: true }
  }

  await putWithProgress(prepData.uploadUrl, file, onProgress)
  const dims = await readDimensions(file)

  const conf = await fetch("/api/admin/assets/confirm", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ sha256, mime: file.type, size: file.size, originalName: file.name, ...dims }),
  })
  if (!conf.ok) throw new Error((await conf.json().catch(() => ({}))).error || "Confirm failed")
  return { asset: (await conf.json()).asset, deduped: false }
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  const units = ["KB", "MB", "GB"]
  let v = bytes / 1024
  let i = 0
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024
    i++
  }
  return `${v.toFixed(v < 10 ? 1 : 0)} ${units[i]}`
}
