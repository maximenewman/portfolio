// Shared post metadata — safe to import from both server and client.

export const POST_KINDS = [
  { value: "idea", label: "Idea", badge: "bg-amber-500/10 text-amber-600 border-amber-500/30 dark:text-amber-400" },
  { value: "in-progress", label: "In progress", badge: "bg-blue-500/10 text-blue-600 border-blue-500/30 dark:text-blue-400" },
  { value: "shipped", label: "Shipped", badge: "bg-primary/10 text-primary border-primary/40" },
  { value: "success", label: "Success", badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:text-emerald-400" },
  { value: "failure", label: "Failure", badge: "bg-red-500/10 text-red-600 border-red-500/30 dark:text-red-400" },
  { value: "note", label: "Note", badge: "bg-muted text-muted-foreground border-border" },
] as const

export type PostKind = (typeof POST_KINDS)[number]["value"]

export function kindMeta(value: string) {
  return POST_KINDS.find((k) => k.value === value) ?? POST_KINDS[POST_KINDS.length - 1]
}

export const VISIBILITIES = [
  { value: "draft", label: "Draft", desc: "Only you, in the admin", badge: "bg-muted text-muted-foreground border-border" },
  { value: "private", label: "Private", desc: "On the blog, but only when you're signed in", badge: "bg-purple-500/10 text-purple-600 border-purple-500/30 dark:text-purple-400" },
  { value: "public", label: "Public", desc: "Visible to everyone", badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:text-emerald-400" },
] as const

export type Visibility = (typeof VISIBILITIES)[number]["value"]

export function visibilityMeta(value: string) {
  return VISIBILITIES.find((v) => v.value === value) ?? VISIBILITIES[0]
}

/** URL-safe slug from a title. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
}

/**
 * All dates render in this fixed zone so server-side output is identical in
 * dev (local tz) and production (UTC) — without it, the same instant can show
 * as different days depending on where the server runs.
 */
export const DISPLAY_TIME_ZONE = "America/Vancouver"

/** Format an entry date for display (e.g. "Jul 4, 2026"). */
export function formatDate(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: DISPLAY_TIME_ZONE,
  })
}

/** Full timestamp for journal entries (e.g. "Jul 4, 2026, 3:42 PM"). */
export function formatDateTime(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: DISPLAY_TIME_ZONE,
  })
}

/** Year of an instant in the display zone (keeps filters consistent with what's shown). */
export function yearOf(d: Date | string): number {
  return Number(
    new Intl.DateTimeFormat("en-US", { year: "numeric", timeZone: DISPLAY_TIME_ZONE }).format(
      typeof d === "string" ? new Date(d) : d,
    ),
  )
}
