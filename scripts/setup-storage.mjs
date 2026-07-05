// One-shot Tigris setup + verification for the proxy-serving model.
//   node --env-file=.env.local scripts/setup-storage.mjs
//
// The bucket stays PRIVATE. Media is served through the app's /media/[key]
// route (server reads via SDK), and uploads go browser-direct via presigned
// PUT — so all we must configure is CORS (for the browser PUT). This verifies:
//   1. CORS is applied
//   2. A presigned PUT round-trips (browser-direct upload path)
//   3. The SDK can read the object back (the /media proxy path)
// Idempotent; cleans up its probe object.

import {
  S3Client,
  PutBucketCorsCommand,
  GetBucketCorsCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

const bucket = process.env.BUCKET_NAME ?? process.env.TIGRIS_BUCKET
if (!bucket) {
  console.error("✗ Missing env: BUCKET_NAME")
  process.exit(1)
}

const s3 = new S3Client({
  region: process.env.AWS_REGION || "auto",
  endpoint: process.env.AWS_ENDPOINT_URL_S3,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
})

async function main() {
  console.log(`Bucket: ${bucket}`)

  // 1. CORS — allow browser-direct presigned PUT/GET/HEAD
  await s3.send(
    new PutBucketCorsCommand({
      Bucket: bucket,
      CORSConfiguration: {
        CORSRules: [
          {
            AllowedOrigins: ["*"],
            AllowedMethods: ["GET", "PUT", "HEAD"],
            AllowedHeaders: ["*"],
            ExposeHeaders: ["ETag"],
            MaxAgeSeconds: 3600,
          },
        ],
      },
    }),
  )
  const cors = await s3.send(new GetBucketCorsCommand({ Bucket: bucket }))
  console.log(`✓ CORS applied (${cors.CORSRules?.[0]?.AllowedMethods?.join(", ")})`)

  // 2. Presigned PUT round-trip (simulates the admin browser upload)
  const key = "assets/_healthcheck.txt"
  const mime = "text/plain"
  const putUrl = await getSignedUrl(s3, new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: mime }), {
    expiresIn: 120,
  })
  const put = await fetch(putUrl, { method: "PUT", headers: { "Content-Type": mime }, body: "healthcheck" })
  if (!put.ok) {
    console.error(`✗ Presigned PUT failed (${put.status})`)
    process.exit(1)
  }
  console.log("✓ Presigned PUT round-trip works")

  // 3. SDK read-back (simulates the /media proxy serving the file)
  const got = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }))
  const text = await got.Body.transformToString()
  if (text !== "healthcheck") {
    console.error("✗ SDK read-back mismatch")
    process.exit(1)
  }
  console.log("✓ SDK read-back works (proxy serving path)")

  // Cleanup probes
  for (const k of [key, "assets/_probe_acl.txt", "assets/_probe_plain.txt"]) {
    await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: k })).catch(() => {})
  }
  console.log("\nStorage is ready (private bucket + proxy serving + presigned uploads).")
}

main().catch((err) => {
  console.error("✗ Setup failed:", err.name, err.message)
  process.exit(1)
})
