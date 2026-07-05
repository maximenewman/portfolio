import { drizzle } from "drizzle-orm/neon-http"
import { neon } from "@neondatabase/serverless"
import * as schema from "@/db/schema"

type DB = ReturnType<typeof drizzle<typeof schema>>

let _db: DB | null = null

/**
 * Lazily-initialized Drizzle client over Neon's HTTP driver. Lazy so that
 * `next build` (and any import that doesn't touch the DB) works without
 * DATABASE_URL present — the env is only required the first time a query runs.
 */
export function getDb(): DB {
  if (!_db) {
    const url = process.env.DATABASE_URL
    if (!url) throw new Error("DATABASE_URL is not set")
    _db = drizzle(neon(url), { schema })
  }
  return _db
}
