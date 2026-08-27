import Link from "next/link"
import Image from "next/image"
import type { Asset, Post } from "@/db/schema"
import { Row } from "@/app/components/page-shell"
import { DISPLAY_TIME_ZONE, kindMeta, visibilityMeta } from "@/lib/posts"

/**
 * "Jul 4" — the year lives in the left gutter once per group rather than being
 * reprinted on every line. Pinned to the one display zone so the server and the
 * client render the same string (otherwise hydration diverges by timezone).
 */
const DAY_MONTH = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: DISPLAY_TIME_ZONE,
})

type Props = {
  post: Post
  cover?: Asset
  /** Owner-only: surfaces draft/private state on the public index. */
  showVisibility?: boolean
  /** Year of this entry, in the display zone. */
  year: number
  /** True on the first row of a year group — the only row that prints the year. */
  showYear?: boolean
  /** The top row of the current list, given a lead-story treatment. */
  lead?: boolean
  /**
   * Hold the cover lane open even when this row has no cover, so the text
   * column stays on one axis down the page. The parent only sets it when some
   * visible entry actually has a cover — otherwise every row would carry a
   * column of dead space.
   */
  reserveCover?: boolean
}

/**
 * One entry in the journal index.
 *
 * This is a row, not a card: a hairline separator instead of a border, no
 * surface, no blur, no lift. NN/g's finding is that card grids are less
 * scannable than lists for homogeneous items, and a blog index is the
 * homogeneous case — every entry has exactly the same shape, so the box around
 * each one carries no information and only costs vertical rhythm.
 *
 * The row's padding is deliberately NOT uniform: the lead entry and the first
 * entry of a year breathe more than the rest. Identical padding on every item
 * is what makes an index read as generated.
 */
export function PostRow({
  post,
  cover,
  showVisibility,
  year,
  showYear = false,
  lead = false,
  reserveCover = false,
}: Props) {
  const meta = kindMeta(post.kind)
  const vis = visibilityMeta(post.visibility)
  const published = new Date(post.publishedAt)

  // Three rhythms, not one. The lead gets the most air; a new year group gets a
  // wider gap above it so the year marker reads as a break in the run.
  const padding = lead
    ? "pt-8 pb-9 md:pt-10 md:pb-11"
    : showYear
      ? "pt-9 pb-6 md:pt-12 md:pb-7"
      : "py-6 md:py-7"

  return (
    <Row>
      {/* One tree for phone and desktop. The only thing that changes across the
          breakpoint is the width of the year gutter and of the cover lane — the
          order and nesting of the content is identical at every width. */}
      <div className={`flex gap-4 md:gap-6 ${padding}`}>
        {/* Year gutter. Always present so continuation rows indent by exactly
            the same amount as the row that prints the year — the alignment is
            what makes the grouping legible without a heading per group.
            aria-hidden because the year is not dropped for assistive tech: each
            row's <time> carries it in full below. */}
        <div aria-hidden="true" className="w-10 shrink-0 md:w-14">
          {showYear && (
            <span className="font-mono text-eyebrow tabular-nums text-foreground">{year}</span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          {/* Metadata reads as one line of small caps separated by a middot.
              The kind used to be a pill; a pill is a control affordance, and
              this is a label nobody can press. */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-eyebrow uppercase text-muted-foreground">
            <time dateTime={published.toISOString()} className="tabular-nums">
              {DAY_MONTH.format(published)}
              {/* The visible year sits in the gutter once per group; screen
                  readers get it on every entry. */}
              <span className="sr-only">, {year}</span>
            </time>
            <span aria-hidden="true">·</span>
            <span>{meta.label}</span>
            {showVisibility && post.visibility !== "public" && (
              <span className={`rounded-full border px-2 py-0.5 font-mono text-eyebrow uppercase ${vis.badge}`}>
                {vis.label}
              </span>
            )}
          </div>

          {/* The one real anchor in the row. `.row-link` stretches it over the
              whole row, so the hit area is the row while the accessible name
              stays the title — wrapping the row in a <Link> instead would read
              the date, summary and tags aloud as the link's name. */}
          <h2
            className={`mt-2 font-display text-balance leading-snug text-foreground transition-colors group-hover:text-primary ${
              lead ? "text-h3" : "text-xl"
            }`}
          >
            <Link href={`/blog/${post.slug}`} className="row-link">
              {post.title}
            </Link>
          </h2>

          {post.summary && (
            <p
              className={`mt-2 max-w-[62ch] text-pretty text-muted-foreground ${
                lead ? "text-lede" : "line-clamp-2 text-sm"
              }`}
            >
              {post.summary}
            </p>
          )}

          {post.tags.length > 0 && (
            <p className="mt-3 font-mono text-eyebrow text-muted-foreground/80">
              {post.tags.slice(0, 4).join(" · ")}
            </p>
          )}
        </div>

        {/* Cover lane.
            This is an inline thumbnail, not a floating cursor preview. The
            cursor-following pattern is a desktop-only conceit — the well-known
            implementations bind mousemove/mouseenter only and set `cursor:none`,
            so on a phone the cover simply never appears — and the enhanced
            variants of it all fail one of three ways here: an absolutely
            positioned preview large enough to be worth showing overlaps the
            hovered row's own summary at narrow desktop widths, it is laid out
            (and so adds page overflow) even at opacity 0, or it has to animate
            width/height, which is a layout pass per frame. So the thumbnail is
            a real, always-visible element that grows once at the breakpoint,
            and hover only moves colour. */}
        {(cover || reserveCover) && (
          <div className="w-20 shrink-0 md:w-36">
            {cover && (
              <div className="relative aspect-[3/2] overflow-hidden rounded-md bg-muted ring-1 ring-border transition-shadow group-hover:ring-primary/40 group-focus-within:ring-primary/40">
                <Image
                  src={cover.publicUrl}
                  alt={cover.originalName ?? post.title}
                  fill
                  sizes="(min-width: 768px) 144px, 80px"
                  // Focal point chosen in the editor — the crop has to respect it.
                  style={{ objectPosition: post.coverPosition }}
                  // Colour only: no scale, no lift. Tailwind compiles `hover:`
                  // inside @media (hover: hover) on its own, and focus-within
                  // gives keyboard users the same response (WCAG 2.1.1).
                  className="object-cover opacity-90 transition-opacity duration-300 ease-entrance group-hover:opacity-100 group-focus-within:opacity-100"
                  unoptimized={cover.mime === "image/svg+xml" || cover.mime === "image/gif"}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </Row>
  )
}
