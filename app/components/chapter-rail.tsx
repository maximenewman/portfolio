"use client"

import { useEffect, useState } from "react"

export type Chapter = { id: string; label: string }

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"]

/**
 * The printed table of contents.
 *
 * One nav, one list, one set of links — the mobile and desktop presentations
 * are the *same DOM* with different positioning, so there is no duplicate
 * landmark and no second copy of the links in the accessibility tree.
 *
 *   - Below 64rem it sits in normal flow at the top of the page, as a printed
 *     index would.
 *   - At 64rem and above it becomes a fixed rail down the left margin that
 *     tracks the section you are reading.
 *
 * That divergence is deliberate: a fixed side rail on a phone either eats a
 * fifth of the reading width or overlaps the text, and a position-fixed
 * element fighting mobile browser chrome is the exact failure `svh` exists to
 * avoid. Content and order are identical; only `position` changes.
 *
 * CALLER CONTRACT: because the rail leaves the flow at `lg`, it reserves no
 * space for itself. The hosting page must add `lg:pl-[min(26vw,22rem)]` (or
 * equivalent) so the rail does not sit on top of the content — without it the
 * two overlap between roughly 1024px and 1440px, where `Container` is still
 * full-bleed. Only add that padding at `lg`; below it the rail is in normal
 * flow and a reserved gutter would waste a quarter of the reading width.
 */
export function ChapterRail({ chapters }: { chapters: Chapter[] }) {
  const [active, setActive] = useState("")
  const [footerInView, setFooterInView] = useState(false)

  useEffect(() => {
    const sections = chapters
      .map((c) => document.getElementById(c.id))
      .filter((el): el is HTMLElement => el !== null)
    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        // Whichever section fills most of the viewport wins. Picking "first
        // intersecting" instead makes the marker flicker whenever two sections
        // are on screen together.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { threshold: [0.15, 0.5, 0.85], rootMargin: "-20% 0px -40% 0px" },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [chapters])

  // The rail is position: fixed at lg, and the footer sits outside the page
  // wrapper that reserves its gutter, so without this the rail prints on top
  // of the footer's text. It fades out as the footer scrolls in; there is
  // nothing left for it to index down there anyway.
  useEffect(() => {
    const footer = document.querySelector("footer")
    if (!footer) return
    const observer = new IntersectionObserver(
      (entries) => setFooterInView(entries.some((e) => e.isIntersecting)),
      { threshold: 0 },
    )
    observer.observe(footer)
    return () => observer.disconnect()
  }, [])

  return (
    <nav
      aria-label="Sections"
      className={`
        border-b border-border/70 px-[clamp(1.25rem,4vw,4rem)] py-6
        lg:fixed lg:left-[clamp(1.25rem,4vw,4rem)] lg:top-1/2 lg:z-30
        lg:w-[min(20vw,16rem)] lg:-translate-y-1/2 lg:border-0 lg:px-0 lg:py-0
        lg:transition-opacity lg:duration-300
        ${footerInView ? "lg:pointer-events-none lg:opacity-0" : ""}
      `}
    >
      <p className="mb-3 font-mono text-eyebrow uppercase text-muted-foreground lg:hidden">
        Index
      </p>
      <ol className="flex flex-col gap-1">
        {chapters.map((chapter, i) => {
          const isActive = active === chapter.id
          return (
            <li key={chapter.id}>
              <a
                href={`#${chapter.id}`}
                aria-current={isActive ? "true" : undefined}
                // 44px touch target in flow; the desktop rail is pointer-driven
                // and can sit tighter.
                className={`flex min-h-11 items-baseline font-mono text-eyebrow uppercase tracking-[0.14em] transition-colors lg:min-h-0 lg:py-1 ${
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="tabular-nums">{ROMAN[i] ?? i + 1}</span>
                <span className="leader" aria-hidden="true" />
                <span>{chapter.label}</span>
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
