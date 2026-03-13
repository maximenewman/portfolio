"use client"

import { passions } from "@/app/passions/data/passions"
import { PassionCard } from "./passions_card"

export function PassionsDisplay() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {passions.map((passion, index) => (
        <PassionCard key={passion.id} passion={passion} index={index} />
      ))}
    </div>
  )
}
