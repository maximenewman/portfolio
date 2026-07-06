"use client"

import { useRef } from "react"
import Image from "next/image"
import { RotateCcw } from "lucide-react"
import type { Asset } from "@/db/schema"

function parse(pos: string): [number, number] {
  const m = pos.match(/^(\d{1,3})% (\d{1,3})%$/)
  return m ? [Number(m[1]), Number(m[2])] : [50, 50]
}
const clamp = (n: number) => Math.max(0, Math.min(100, n))

/**
 * Drag the cover within a 16/9 frame (matching where it's shown on the blog) to
 * choose which part stays visible after cropping. Emits a CSS object-position.
 */
export function CoverPositioner({
  asset,
  position,
  onChange,
}: {
  asset: Asset
  position: string
  onChange: (pos: string) => void
}) {
  const frameRef = useRef<HTMLDivElement>(null)
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(null)

  function onPointerDown(e: React.PointerEvent) {
    const [px, py] = parse(position)
    drag.current = { x: e.clientX, y: e.clientY, px, py }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!drag.current || !frameRef.current) return
    const rect = frameRef.current.getBoundingClientRect()
    // Dragging the image right reveals more of its left edge → position x drops.
    const dxPct = ((e.clientX - drag.current.x) / rect.width) * 100
    const dyPct = ((e.clientY - drag.current.y) / rect.height) * 100
    onChange(`${Math.round(clamp(drag.current.px - dxPct))}% ${Math.round(clamp(drag.current.py - dyPct))}%`)
  }

  function endDrag(e: React.PointerEvent) {
    drag.current = null
    try {
      ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
    } catch {}
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        ref={frameRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="relative aspect-[16/9] w-full max-w-md cursor-move touch-none select-none overflow-hidden rounded-lg border border-border bg-muted"
      >
        <Image
          src={asset.publicUrl}
          alt={asset.originalName ?? "cover"}
          fill
          draggable={false}
          sizes="(max-width: 768px) 100vw, 448px"
          style={{ objectPosition: position }}
          className="pointer-events-none object-cover"
          unoptimized={asset.mime === "image/svg+xml" || asset.mime === "image/gif"}
        />
        {/* rule-of-thirds guides */}
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute left-1/3 top-0 h-full w-px bg-white/50" />
          <div className="absolute left-2/3 top-0 h-full w-px bg-white/50" />
          <div className="absolute left-0 top-1/3 h-px w-full bg-white/50" />
          <div className="absolute left-0 top-2/3 h-px w-full bg-white/50" />
        </div>
        <span className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-2.5 py-0.5 text-[11px] text-white">
          Drag to reposition
        </span>
      </div>
      <button
        type="button"
        onClick={() => onChange("50% 50%")}
        className="inline-flex w-fit items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Center
      </button>
    </div>
  )
}
