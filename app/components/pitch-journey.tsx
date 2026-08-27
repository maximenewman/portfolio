"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PitchPlan } from "./pitch-lines"

/**
 * The experience list plotted as a run up the pitch.
 *
 * Chronology maps to depth: the oldest role sits just outside our own penalty
 * area and each later role advances upfield, with the current one in the
 * attacking third. A dotted line traces the run.
 *
 * The pitch is a navigator. The ball rests on the current role and slides to
 * whichever position you point at — hovering a node, focusing it with the
 * keyboard, or hovering the matching row in the list all move it — and a
 * label names the role under the pointer. Clicking a position opens that
 * experience's page. On touch there is no hover, so a tap simply navigates,
 * which is the same promise with one step fewer.
 *
 * The markings and the run line are decorative (the rows carry every fact),
 * but the position nodes are genuine anchors with accessible names, so the
 * SVG is NOT presentational — PitchPlan gets `title={null}` and marks only
 * its chalk lines aria-hidden.
 *
 * One deliberate divergence between form factors, in presentation only:
 * at lg+ the pitch stands vertically in a sticky side column; below lg the
 * same run renders once as the horizontal plan above the list. Both draw from
 * one node list — the coordinates are just projected into each frame. The
 * links exist in both, but only one variant is ever displayed, and
 * `display: none` removes the hidden one from the tab order too.
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
  hovered,
  onHover,
  /** Frame width in viewBox units, for clamping the hover label. */
  frameWidth,
  showLabel,
}: {
  items: JourneyItem[]
  nodes: Node[]
  hovered: number | null
  onHover: (index: number | null) => void
  frameWidth: number
  showLabel: boolean
}) {
  const router = useRouter()
  // The run reads oldest → newest, so the trace is drawn in chronological order.
  const chrono = [...nodes].reverse()
  const ballIndex = hovered ?? 0
  const ball = nodes[Math.min(ballIndex, nodes.length - 1)] ?? nodes[0]
  const labelled = hovered !== null ? nodes[hovered] : null

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

      {/* Positions. Real anchors to the experience pages: plain left-click is
          upgraded to a client-side navigation so the WebGL backdrop survives
          the transition, while modified clicks and middle-click keep their
          native meaning through the real href. The visible dot is r=9 in
          pitch units, far too small to tap, so a transparent r=36 hit circle
          does the catching — about 44px on the mobile map. */}
      {items.map((item, i) => {
        const n = nodes[i]
        const href = `/experiences/${item.slug}`
        return (
          <a
            key={item.slug}
            href={href}
            aria-label={item.role}
            className="pitch-node"
            onClick={(event) => {
              if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
                return
              }
              event.preventDefault()
              router.push(href)
            }}
            onPointerEnter={(event) => {
              // Touch has no hover: a tap should navigate, not toggle a
              // preview state that then needs a second tap.
              if (event.pointerType !== "touch") onHover(i)
            }}
            onPointerLeave={() => onHover(null)}
            onFocus={() => onHover(i)}
            onBlur={() => onHover(null)}
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

      {/* The role under the pointer, named. aria-hidden because the anchor
          already announces the same words; this is the visual echo. Anchored
          to whichever side of the node has room and grows inward; when even
          that is not enough for a long role name, textLength compresses the
          glyphs to the room available. The width estimate is reliable because
          the label face is monospaced (~0.6em per character). */}
      {showLabel && labelled && hovered !== null && (() => {
        const startSide = labelled.x < frameWidth / 2
        const anchorX = startSide ? labelled.x + 44 : labelled.x - 44
        const room = (startSide ? frameWidth - anchorX : anchorX) - 16
        const estimate = items[hovered].role.length * 24 * 0.62
        const fit = estimate > room ? { textLength: room, lengthAdjust: "spacingAndGlyphs" as const } : {}
        return (
          <text
            aria-hidden="true"
            x={anchorX}
            y={labelled.y + 8}
            textAnchor={startSide ? "start" : "end"}
            className="pitch-node-label"
            fill="var(--primary)"
            {...fit}
          >
            {items[hovered].role}
          </text>
        )
      })()}

      {/* The ball. Positioned by transform so it slides between positions with
          the house overshoot curve (see .pitch-ball in globals). Pointer
          events off so it never sits between a click and its node. */}
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
  const [hovered, setHovered] = useState<number | null>(null)

  // The other direction of the same mapping: pointing at a role in the list
  // slides the ball to its position on the pitch. Delegated listeners so the
  // rows can stay server-rendered.
  useEffect(() => {
    const rows = Array.from(document.querySelectorAll<HTMLElement>("[data-journey-row]"))
    if (!rows.length) return

    const cleanups = rows.map((row) => {
      const index = Number(row.dataset.journeyRow)
      const enter = (event: PointerEvent) => {
        if (event.pointerType !== "touch") setHovered(index)
      }
      const leave = () => setHovered(null)
      row.addEventListener("pointerenter", enter)
      row.addEventListener("pointerleave", leave)
      return () => {
        row.removeEventListener("pointerenter", enter)
        row.removeEventListener("pointerleave", leave)
      }
    })
    return () => cleanups.forEach((cleanup) => cleanup())
  }, [items.length])

  if (items.length === 0) return null

  const nodes = journeyNodes(items.length)
  const verticalNodes = nodes.map(toVertical)

  return (
    <div className="lg:h-full lg:self-stretch">
      {/* Below lg: the run as a plan, once, above the list. No hover label —
          on touch the pointer never hovers, a tap goes straight through. */}
      <div className="reveal mx-auto max-w-[26rem] pb-8 lg:hidden">
        <PitchPlan title={null} className="line-draw w-full text-muted-foreground/40">
          <RunOverlay
            items={items}
            nodes={nodes}
            hovered={hovered}
            onHover={setHovered}
            frameWidth={1050}
            showLabel={false}
          />
        </PitchPlan>
      </div>

      {/* lg+: the pitch stands on end beside the list and stays put while the
          roles scroll past. */}
      <div className="reveal sticky top-24 hidden h-[min(calc(100svh-8rem),52rem)] justify-center lg:flex">
        <PitchPlan
          title={null}
          orientation="vertical"
          className="line-draw h-full w-auto text-muted-foreground/40"
        >
          <RunOverlay
            items={items}
            nodes={verticalNodes}
            hovered={hovered}
            onHover={setHovered}
            frameWidth={680}
            showLabel
          />
        </PitchPlan>
      </div>
    </div>
  )
}
