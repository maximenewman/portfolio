"use client"

import { passions } from "@/app/passions/data/passions"
import { PassionCard } from "./passions_card"

export function PassionsDisplay() {
  return (
    <div className="space-y-8">
      {/* Featured passion - first one gets special treatment */}
      {passions.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
          <PassionCard passion={passions[0]} index={0} featured />
        </div>
      )}

      {/* Rest of passions in grid */}
      {passions.length > 1 && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {passions.slice(1).map((passion, index) => (
            <div
              key={passion.id}
              className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-lg"
            >
              <PassionCard passion={passion} index={index + 1} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
