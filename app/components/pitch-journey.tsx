"use client"

import { useEffect, useState } from "react"
import { PitchPlan } from "./pitch-lines"

/**
 * The experience list plotted as a run up the pitch.
 *
 * Chronology maps to depth: the oldest role sits just outside our own penalty
 * area and each later role advances upfield, with the current one in the
 * attacking third. A dotted line traces the run; a ball sits on whichever
 * role you are reading and follows the scroll. The pitch works both ways:
 * every position is a real link that scrolls the list to its role, so you can
 * move through the experiences by clicking through the pitch.
 *
 * The markings and the run line are decorative (the rows carry every fact),
 * but the position nodes are genuine anchors with accessible names, so the
 * SVG is NOT presentational — PitchPlan gets `title={null}` and marks only
 * its chalk lines aria-hidden.
 *
 * One deliberate divergence between form factors, in presentation only:
 * at lg+ the pitch stands vertically in a sticky side column, so scrolling
 * down the roles visibly walks the ball back down the field; below lg there is
 * no room for a side column, so the same run renders once as the horizontal
 * plan above the list. Both draw from one node list — the coordinates are just
 * projected into each frame. The links exist in both, which double-renders
 * them in the DOM; only one set is ever visible or focusable, because
 * `display: none` on the hidden variant removes it from the tab order too.
 */

export type JourneyItem = { slug: string; role: string }

// Horizontal-frame coordinates (1050 x 680 decimetre pitch, attacking right).
const ADVANCE_START = 150
const ADVANCE_END = 935

// Lanes the run weaves through, cycled by chronological index. Fixed values,
// not random: the layout must be identical on server and client.
const LANES = [340, 210, 470, 160, 510, 250, 430, 190, 540, 300]

type Node = { x: number; y: number }

/** List-order nodes (index 0 = newest role, most advanced position). */
function journeyNodes(count: number): Node[] {
  const last = Math.max(count - 1, 1)
  return Array.from({ length: count }, (_, listIndex) => {
    const chrono = count - 1 - listIndex // 0 = oldest
    const t = chrono / last
    return {
      x: ADVANCE_START + t * (ADVANCE_END - ADVANCE_START),
      y: LANES[chrono % LANES.length],
    }
  })
}

/** The rotation PitchPlan applies for its vertical variant: (x, y) → (y, 1050 − x). */
function toVertical({ x, y }: Node): Node {
  return { x: y, y: 1050 - x }
}

function RunOverlay({
  items,
  nodes,
  active,
}: {
  items: JourneyItem[]
  nodes: Node[]
  active: number
}) {
  // The run reads oldest → newest, so the trace is drawn in chronological order.
  const chrono = [...nodes].reverse()
  const ball = nodes[Math.min(active, nodes.length - 1)] ?? nodes[0]

  return (
    <>
      <polyline
        aria-hidden="true"
        points={chrono.map((n) => `${n.x},${n.y}`).join(" ")}
        strokeDasharray="4 16"
        strokeLinecap="round"
        className="text-muted-foreground/60"
        stroke="currentColor"
      />

      {/* Positions. Real SVG anchors: clicking one scrolls the list to its
          role (the rows carry matching ids), keyboard reaches them in list
          order, and each announces the role it goes to. The visible dot is
          r=9 in pitch units, far too small to tap, so a transparent r=36 hit
          circle does the actual catching — about 44px on the mobile map. */}
      {items.map((item, i) => {
        const n = nodes[i]
        return (
          <a
            key={item.slug}
            href={`#xp-${item.slug}`}
            aria-label={`Go to ${item.role}`}
            className="pitch-node"
          >
            <circle cx={n.x} cy={n.y} r="36" fill="transparent" stroke="none" />
            <circle
              cx={n.x}
              cy={n.y}
              r="9"
              pathLength="1"
              stroke="currentColor"
              className="pitch-node-dot text-muted-foreground"
              fill="var(--background)"
            />
          </a>
        )
      })}

      {/* The ball. Positioned by transform so the move to a newly active role
          eases with the house overshoot curve (see .pitch-ball in globals).
          pointer-events none so it never sits between a click and its node. */}
      <g
        aria-hidden="true"
        className="pitch-ball pointer-events-none"
        style={{ transform: `translate(${ball.x}px, ${ball.y}px)` }}
      >
        <circle r="13" fill="var(--primary)" stroke="none" />
        <circle r="20" pathLength="1" stroke="var(--primary)" strokeWidth="2" opacity="0.35" />
      </g>
    </>
  )
}

export function PitchJourney({ items }: { items: JourneyItem[] }) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const rows = Array.from(document.querySelectorAll<HTMLElement>("[data-journey-row]"))
    if (!rows.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        // The row occupying the reading band wins; ties go to the most visible.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        const top = visible[0]?.target as HTMLElement | undefined
        if (top?.dataset.journeyRow !== undefined) {
          setActive(Number(top.dataset.journeyRow))
        }
      },
      { threshold: [0.2, 0.6], rootMargin: "-25% 0px -45% 0px" },
    )

    rows.forEach((row) => observer.observe(row))
    return () => observer.disconnect()
  }, [items.length])

  if (items.length === 0) return null

  const nodes = journeyNodes(items.length)
  const verticalNodes = nodes.map(toVertical)

  return (
    <div className="lg:h-full lg:self-stretch">
      {/* Below lg: the run as a plan, once, above the list. */}
      <div className="reveal mx-auto max-w-[26rem] pb-8 lg:hidden">
        <PitchPlan title={null} className="line-draw w-full text-muted-foreground/40">
          <RunOverlay items={items} nodes={nodes} active={active} />
        </PitchPlan>
      </div>

      {/* lg+: the pitch stands on end beside the list and stays put while the
          roles scroll past, the ball walking the run as you read. */}
      <div className="reveal sticky top-24 hidden h-[min(calc(100svh-8rem),52rem)] justify-center lg:flex">
        <PitchPlan
          title={null}
          orientation="vertical"
          className="line-draw h-full w-auto text-muted-foreground/40"
        >
          <RunOverlay items={items} nodes={verticalNodes} active={active} />
        </PitchPlan>
      </div>
    </div>
  )
}
