"use client"

import { useId, useMemo, useState } from "react"
import { ArrowDownUp } from "lucide-react"
import type { Asset, Post } from "@/db/schema"
import { POST_KINDS, yearOf } from "@/lib/posts"
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
  const kindLabelId = useId()
  const yearFieldId = useId()

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
    () => [
      { value: "all", label: "All" },
      ...kindsPresent.map((k) => ({ value: k.value, label: FILTER_LABELS[k.value] ?? k.label })),
    ],
    [kindsPresent],
  )

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
    // `.reveal` sits on the always-mounted wrapper, never on the filtered
    // cards: the global observer only re-scans on route change, so a node that
    // appears later from a filter change would keep `.reveal` and stay hidden.
    <div className="reveal flex flex-col gap-[clamp(2rem,4vw,3rem)]">
      <div className="group/filters flex flex-col gap-4 border-y border-border/70 py-4">
        {/* Kind filter. Every option is a real <button>, rendered at all times,
            in the natural tab order — the old version fanned these out of an
            emoji along a computed arc, which put them off-viewport on narrow
            screens and made them effectively keyboard-inoperable. The row
            wraps rather than scrolling horizontally so no chip can end up
            outside the viewport at any width. */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
          <span
            id={kindLabelId}
            className="inline-flex items-center gap-2 font-mono text-eyebrow uppercase text-muted-foreground"
          >
            {/* Decorative nod to the old "brain" control: it carries no
                information and no action, and only animates for pointer users. */}
            <span
              aria-hidden
              className="text-sm transition-transform duration-300 ease-pop fine:group-hover/filters:-rotate-12"
            >
              🧠
            </span>
            Filter
          </span>

          <div role="group" aria-labelledby={kindLabelId} className="flex flex-wrap items-center gap-2">
            {chipItems.map((k) => {
              const active = kind === k.value
              return (
                <button
                  key={k.value}
                  type="button"
                  onClick={() => setKind(k.value)}
                  aria-pressed={active}
                  // 44px minimum height only where the pointer is coarse; the
                  // fine-pointer size stays proportionate to the type.
                  className={`btn-hover inline-flex min-h-9 touch:min-h-11 items-center rounded-full border px-3.5 text-sm font-medium ${
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card/70 text-muted-foreground fine:hover:border-primary/50 fine:hover:text-foreground"
                  }`}
                >
                  {k.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Year + order. Sits on its own line under the chips on narrow
            viewports and pulls up beside them once there is room — one tree,
            reflowed by wrapping alone. */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
          {yearsPresent.length > 1 && (
            <div className="flex items-center gap-2">
              <label htmlFor={yearFieldId} className="font-mono text-eyebrow uppercase text-muted-foreground">
                Year
              </label>
              <select
                id={yearFieldId}
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="min-h-9 touch:min-h-11 rounded-full border border-border bg-card/70 px-3 text-sm text-foreground outline-none"
              >
                <option value="all">All years</option>
                {yearsPresent.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            type="button"
            onClick={() => setOrder((o) => (o === "newest" ? "oldest" : "newest"))}
            aria-label={`Sort by date — ${order} first. Activate to switch.`}
            className="btn-hover inline-flex min-h-9 touch:min-h-11 items-center gap-2 rounded-full border border-border bg-card/70 px-3.5 text-sm font-medium text-foreground"
          >
            <ArrowDownUp className="h-3.5 w-3.5 shrink-0" aria-hidden />
            {order === "newest" ? "Newest first" : "Oldest first"}
          </button>

          <p
            aria-live="polite"
            className="ml-auto font-mono text-eyebrow uppercase text-muted-foreground tabular-nums"
          >
            {visible.length} {visible.length === 1 ? "entry" : "entries"}
          </p>
        </div>
      </div>

      {/* Grid */}
      {visible.length === 0 ? (
        <p className="max-w-[46ch] text-lede text-muted-foreground">No entries match these filters.</p>
      ) : (
        <div className="grid gap-[clamp(1rem,2vw,1.5rem)] sm:grid-cols-2 lg:grid-cols-3">
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
