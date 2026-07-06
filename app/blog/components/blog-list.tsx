"use client"

import { useMemo, useState } from "react"
import { ArrowDownUp, X } from "lucide-react"
import type { Asset, Post } from "@/db/schema"
import { POST_KINDS, kindMeta, yearOf } from "@/lib/posts"
import { PostCard } from "./post-card"

type Props = {
  posts: Post[]
  covers: Record<string, Asset>
  isAdmin: boolean
}

const FILTER_LABELS: Record<string, string> = {
  idea: "Ideas",
  note: "Notes",
  "in-progress": "In progress",
  shipped: "Shipped",
  success: "Successes",
  failure: "Failures",
}

/** Client-side filtered blog index: narrow by kind and year, sort by date. */
export function BlogList({ posts, covers, isAdmin }: Props) {
  const [kind, setKind] = useState<string>("all")
  const [year, setYear] = useState<string>("all")
  const [order, setOrder] = useState<"newest" | "oldest">("newest")
  const [brainOpen, setBrainOpen] = useState(false)

  // Only offer filters that actually match posts.
  const kindsPresent = useMemo(() => {
    const set = new Set(posts.map((p) => p.kind))
    return POST_KINDS.filter((k) => set.has(k.value))
  }, [posts])

  const yearsPresent = useMemo(() => {
    const set = new Set(posts.map((p) => yearOf(p.publishedAt)))
    return Array.from(set).sort((a, b) => b - a)
  }, [posts])

  // Plural labels read better as filter categories ("Ideas") than the singular
  // post badges ("Idea").
  const chipItems = useMemo(
    () => [{ value: "all", label: "All" }, ...kindsPresent.map((k) => ({ value: k.value, label: FILTER_LABELS[k.value] ?? k.label }))],
    [kindsPresent],
  )
  // Uniform distance for every chip; grows slightly with count so labels clear.
  const chipRadius = 36 + chipItems.length * 3


  const visible = useMemo(() => {
    const filtered = posts.filter((p) => {
      if (kind !== "all" && p.kind !== kind) return false
      if (year !== "all" && yearOf(p.publishedAt) !== Number(year)) return false
      return true
    })
    filtered.sort((a, b) => {
      const diff = new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
      return order === "newest" ? -diff : diff
    })
    return filtered
  }, [posts, kind, year, order])

  return (
    <div className="flex flex-col gap-8">
      {/* Filter bar — controls on the left, brain in the right corner.
          Pulled up (and compensated below) so the "All" chip hanging under
          the brain clears the first card row */}
      <div className="-mt-6 mb-6 flex items-center justify-between gap-3">
        {/* Brain: click to pop the kind filters out of it, like thoughts */}
        <div className="order-2 flex flex-wrap items-center gap-2">
          <div className="relative mr-1">
              <button
                onClick={() => setBrainOpen((o) => !o)}
                aria-expanded={brainOpen}
                aria-label="Filter by entry type"
                title="Filter by entry type"
                className={`relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                  brainOpen
                    ? "border-primary bg-primary/10 shadow-lg shadow-primary/25"
                    : "border-border bg-card hover:border-primary/60"
                }`}
              >
                <span className={`text-xl transition-all duration-300 ${brainOpen ? "" : "grayscale"}`} aria-hidden>
                  🧠
                </span>
                {/* Active-filter dot when collapsed with a non-default filter */}
                {!brainOpen && kind !== "all" && (
                  <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-primary" />
                )}
              </button>

              {/* Popout thoughts — bloom out of the brain along an arch and
                  collapse as soon as one is picked */}
              <div className="pointer-events-none absolute left-1/2 top-1/2 z-20">
                {chipItems.map((k, i) => {
                  // "All" tucks directly below the brain; the rest fan across
                  // the top, opening toward the content so nothing clips at
                  // the screen edge the brain is cornered against.
                  // Fan starts at top center (90°) and sweeps leftward toward
                  // the content, since the brain sits in the right corner.
                  const m = chipItems.length - 1
                  let deg: number
                  if (i === 0) deg = 270
                  else if (m === 1) deg = 90
                  else deg = 90 + (90 * (i - 1)) / (m - 1)
                  const rad = (deg * Math.PI) / 180
                  // Side chips (near-horizontal, e.g. "Notes") sit further out
                  // so their long labels clear the brain; top/bottom stay tight.
                  const r = chipRadius + Math.round(Math.abs(Math.cos(rad)) * 16)
                  const x = Math.round(Math.cos(rad) * r)
                  const y = Math.round(-Math.sin(rad) * r)
                  return (
                    <button
                      key={k.value}
                      onClick={() => {
                        setKind(k.value)
                        setBrainOpen(false)
                      }}
                      tabIndex={brainOpen ? 0 : -1}
                      aria-hidden={!brainOpen}
                      style={{
                        transitionDelay: brainOpen ? `${i * 40}ms` : `${(chipItems.length - 1 - i) * 20}ms`,
                        transform: brainOpen
                          ? `translate(-50%, -50%) translate(${x}px, ${y}px)`
                          : "translate(-50%, -50%) scale(0.3)",
                      }}
                      className={`absolute whitespace-nowrap rounded-full border px-3 py-1 text-sm font-medium shadow-md transition-all duration-300 ${
                        brainOpen ? "pointer-events-auto opacity-100" : "opacity-0"
                      } ${
                        kind === k.value
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
                      }`}
                    >
                      {k.label}
                    </button>
                  )
                })}
              </div>
          </div>

          {/* Collapsed summary of the active filter, left of the brain */}
          {!brainOpen && kind !== "all" && (
            <span className="-order-1 mb-1 inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              {FILTER_LABELS[kind] ?? kindMeta(kind).label}
              <button onClick={() => setKind("all")} aria-label="Clear type filter" className="hover:opacity-70">
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          )}
        </div>

        {/* Date controls */}
        <div className="order-1 flex items-center gap-2">
          {yearsPresent.length > 1 && (
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-foreground outline-none transition-colors focus:border-primary"
              aria-label="Filter by year"
            >
              <option value="all">All years</option>
              {yearsPresent.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          )}
          <button
            onClick={() => setOrder((o) => (o === "newest" ? "oldest" : "newest"))}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-muted"
          >
            <ArrowDownUp className="h-3.5 w-3.5" />
            {order === "newest" ? "Newest" : "Oldest"}
          </button>
        </div>
      </div>

      {/* Grid */}
      {visible.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">No entries match these filters.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              cover={post.coverAssetId ? covers[post.coverAssetId] : undefined}
              showVisibility={isAdmin}
            />
          ))}
        </div>
      )}
    </div>
  )
}
