"use client"

import { useState } from "react"
import { passions, type Passion } from "@/app/passions/data/passions"
import { PassionCard } from "./passions_card"
import { PassionModal } from "./passion_modal"

export function PassionsDisplay() {
  const [selectedPassion, setSelectedPassion] = useState<Passion | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCardClick = (passion: Passion) => {
    setSelectedPassion(passion)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <div className="space-y-8">
        {/* Featured passion - first one gets special treatment */}
        {passions.length > 0 && (
          <div
            className="card-hover cursor-pointer overflow-hidden rounded-2xl border border-border bg-card shadow-lg"
            onClick={() => handleCardClick(passions[0])}
          >
            <PassionCard passion={passions[0]} index={0} featured />
          </div>
        )}

        {/* Rest of passions in grid */}
        {passions.length > 1 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {passions.slice(1).map((passion, index) => (
              <div
                key={passion.id}
                className="card-hover cursor-pointer overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
                onClick={() => handleCardClick(passion)}
              >
                <PassionCard passion={passion} index={index + 1} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <PassionModal
        passion={selectedPassion}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  )
}
