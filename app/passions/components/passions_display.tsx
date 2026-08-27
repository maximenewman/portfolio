"use client"

import { useCallback, useRef, useState } from "react"
import type { Passion } from "@/lib/passions"
import { PassionCard, bentoSlot } from "./passions_card"
import { PassionModal } from "./passion_modal"

export function PassionsDisplay({ passions }: { passions: Passion[] }) {
  const [selected, setSelected] = useState<Passion | null>(null)
  // The card that opened the dialog, so focus can be handed straight back.
  const triggerRef = useRef<HTMLButtonElement | null>(null)

  const handleOpen = useCallback((passion: Passion, trigger: HTMLButtonElement) => {
    triggerRef.current = trigger
    setSelected(passion)
  }, [])

  const handleClose = useCallback(() => {
    // Focus first, then unmount. Restoring focus while the dialog is still in
    // the DOM avoids the moment where focus falls to <body> and the next Tab
    // restarts from the top of the page.
    triggerRef.current?.focus()
    setSelected(null)
  }, [])

  if (passions.length === 0) {
    return (
      <p className="font-mono text-eyebrow uppercase text-muted-foreground">
        Nothing published here yet.
      </p>
    )
  }

  return (
    <>
      {/* A span-based bento: three fixed columns, every tile full width by
          default, widened at a breakpoint by `bentoSlot`. Because tiles are
          only ever widened — never repositioned — reading order, tab order and
          visual order stay locked together, which `grid-template-areas` cannot
          promise. The vertical gap is much larger than the horizontal one so
          each caption groups with its own photograph now that no border says
          where one tile ends and the next begins. */}
      <ul
        role="list"
        className="grid grid-cols-1 gap-x-[clamp(1rem,2vw,1.75rem)] gap-y-[clamp(2.25rem,4vw,3.5rem)] sm:grid-cols-2 lg:grid-cols-3"
      >
        {passions.map((passion, index) => (
          <li key={passion.id} className={`reveal ${bentoSlot(index).span}`}>
            <PassionCard passion={passion} index={index} onOpen={handleOpen} />
          </li>
        ))}
      </ul>

      <PassionModal passion={selected} isOpen={selected !== null} onClose={handleClose} />
    </>
  )
}
