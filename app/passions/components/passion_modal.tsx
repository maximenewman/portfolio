"use client"

import { useEffect, useState, useCallback } from "react"
import Image from "next/image"
import type { Passion } from "@/app/passions/data/passions"
import { X, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"

interface PassionModalProps {
  passion: Passion | null
  isOpen: boolean
  onClose: () => void
}

export function PassionModal({ passion, isOpen, onClose }: PassionModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const nextImage = useCallback(() => {
    if (passion?.images) {
      setCurrentImageIndex((prev) =>
        prev === passion.images!.length - 1 ? 0 : prev + 1
      )
    }
  }, [passion?.images])

  const prevImage = useCallback(() => {
    if (passion?.images) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? passion.images!.length - 1 : prev - 1
      )
    }
  }, [passion?.images])

  // Reset image index when passion changes
  useEffect(() => {
    setCurrentImageIndex(0)
  }, [passion?.id])

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowRight") nextImage()
      if (e.key === "ArrowLeft") prevImage()
    }

    document.addEventListener("keydown", handleKeyDown)
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose, nextImage, prevImage])

  if (!isOpen || !passion) return null

  const hasMultipleImages = passion.images && passion.images.length > 1

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

      {/* Modal Container */}
      <div
        className="relative z-10 flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 text-card-foreground backdrop-blur-sm transition-colors hover:bg-background"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-1 flex-col overflow-y-auto md:flex-row">
          {/* Image Gallery Section */}
          {passion.images && passion.images.length > 0 && (
            <div className="relative flex h-64 w-full flex-shrink-0 flex-col bg-muted md:h-auto md:w-1/2">
              {/* Main Image */}
              <div className="relative flex-1">
                <Image
                  src={passion.images[currentImageIndex]}
                  alt={`${passion.title} photo ${currentImageIndex + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />

                {/* Image Navigation */}
                {hasMultipleImages && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-card-foreground backdrop-blur-sm transition-colors hover:bg-background"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-card-foreground backdrop-blur-sm transition-colors hover:bg-background"
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Strip */}
              {hasMultipleImages && (
                <div className="flex gap-2 bg-card/50 p-3 backdrop-blur-sm">
                  {passion.images.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImageIndex(i)}
                      className={`relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                        currentImageIndex === i
                          ? "border-primary"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                      aria-label={`View image ${i + 1}`}
                    >
                      <Image
                        src={src}
                        alt={`${passion.title} thumbnail ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Image Counter */}
              {hasMultipleImages && (
                <div className="absolute bottom-16 right-3 rounded-full bg-background/80 px-3 py-1 text-sm font-medium backdrop-blur-sm">
                  {currentImageIndex + 1} / {passion.images.length}
                </div>
              )}
            </div>
          )}

          {/* Content Section */}
          <div className="flex flex-1 flex-col overflow-y-auto p-6 md:p-8">
            {/* Title */}
            <h2 className="mb-4 text-2xl font-bold text-card-foreground md:text-3xl">
              {passion.title}
            </h2>

            {/* Description */}
            <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
              {passion.description}
            </p>

            {/* Details */}
            <div className="space-y-4">
              {passion.details.map((detail, i) => (
                <p
                  key={i}
                  className="leading-relaxed text-card-foreground"
                >
                  {detail}
                </p>
              ))}
            </div>

            {/* Media Links */}
            {passion.media && passion.media.length > 0 && (
              <div className="mt-8 border-t border-border pt-6">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Links
                </h3>
                <div className="flex flex-wrap gap-3">
                  {passion.media.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                    >
                      <ExternalLink className="h-4 w-4" />
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
