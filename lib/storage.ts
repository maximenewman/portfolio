import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

let _s3: S3Client | null = null

/**
 * S3 client pointed at Tigris (Fly's S3-compatible object store). Tigris uses
 * virtual-host-style URLs, so `forcePathStyle` stays false. Lazily built so a
 * build without credentials doesn't fail at import time.
 */
export function getS3(): S3Client {
  if (!_s3) {
    const endpoint = process.env.AWS_ENDPOINT_URL_S3
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
    if (!endpoint || !accessKeyId || !secretAccessKey) {
      throw new Error("Tigris/S3 credentials are not set (AWS_ENDPOINT_URL_S3, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)")
    }
    _s3 = new S3Client({
      region: process.env.AWS_REGION ?? "auto",
      endpoint,
      credentials: { accessKeyId, secretAccessKey },
      forcePathStyle: false,
    })
  }
  return _s3
}

export function bucket(): string {
  const b = process.env.TIGRIS_BUCKET
  if (!b) throw new Error("TIGRIS_BUCKET is not set")
  return b
}

/** Content-addressed storage key: identical bytes always collapse to one object. */
export function assetKey(sha256: string, ext: string): string {
  const clean = ext.replace(/^\.+/, "").toLowerCase()
  return `assets/${sha256}${clean ? "." + clean : ""}`
}

/**
 * Public CDN URL for a stored object. The bucket is public-read, so the blog
 * can serve media straight from Tigris's edge. Base is configurable because
 * Tigris exposes both `<bucket>.fly.storage.tigris.dev` and custom domains.
 */
export function publicUrl(key: string): string {
  const base = process.env.TIGRIS_PUBLIC_BASE
  if (base) return `${base.replace(/\/$/, "")}/${key}`
  return `https://${bucket()}.fly.storage.tigris.dev/${key}`
}

/** Presigned PUT so the browser can upload big files (video) straight to Tigris. */
export function presignPut(key: string, mime: string, expiresIn = 600): Promise<string> {
  return getSignedUrl(
    getS3(),
    new PutObjectCommand({ Bucket: bucket(), Key: key, ContentType: mime }),
    { expiresIn },
  )
}

export function presignGet(key: string, expiresIn = 600): Promise<string> {
  return getSignedUrl(getS3(), new GetObjectCommand({ Bucket: bucket(), Key: key }), { expiresIn })
}

/** Returns true if the object already exists in the bucket (belt-and-suspenders dedup). */
export async function objectExists(key: string): Promise<boolean> {
  try {
    await getS3().send(new HeadObjectCommand({ Bucket: bucket(), Key: key }))
    return true
  } catch {
    return false
  }
}

export async function putObject(key: string, body: Uint8Array | Buffer, mime: string): Promise<void> {
  await getS3().send(new PutObjectCommand({ Bucket: bucket(), Key: key, Body: body, ContentType: mime }))
}

export async function deleteObject(key: string): Promise<void> {
  await getS3().send(new DeleteObjectCommand({ Bucket: bucket(), Key: key }))
}
