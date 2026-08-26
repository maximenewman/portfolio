"use client"

import { useCallback, useRef, useState } from "react"
import type { Passion } from "@/lib/passions"
import { PassionCard } from "./passions_card"
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

  const [featured, ...rest] = passions

  return (
    <>
      {/* One grid for every card. The lead card simply spans the full row —
          there is no second arrangement and no second copy of the markup. */}
      <ul className="grid grid-cols-1 gap-[clamp(1.25rem,3vw,2rem)] md:grid-cols-2 xl:grid-cols-3">
        <li className="reveal md:col-span-2 xl:col-span-3">
          <PassionCard passion={featured} index={0} featured onOpen={handleOpen} />
        </li>
        {rest.map((passion, index) => (
          <li key={passion.id} className="reveal">
            <PassionCard passion={passion} index={index + 1} onOpen={handleOpen} />
          </li>
        ))}
      </ul>

      <PassionModal passion={selected} isOpen={selected !== null} onClose={handleClose} />
    </>
  )
}
