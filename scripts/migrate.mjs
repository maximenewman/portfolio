// Apply pending Drizzle migrations to Neon.
//   node --env-file=.env.local scripts/migrate.mjs
import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { migrate } from "drizzle-orm/neon-http/migrator"

if (!process.env.DATABASE_URL) {
  console.error("✗ Missing env: DATABASE_URL")
  process.exit(1)
}

const db = drizzle(neon(process.env.DATABASE_URL))
await migrate(db, { migrationsFolder: "db/migrations" })
console.log("✓ Migrations applied")
