"use client"

import { useState } from "react"
import Image from "next/image"
import { ProjectMedia } from "@/app/projects/data/projects"
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react"

interface ProjectMediaGalleryProps {
  media: ProjectMedia[]
  title: string
}

export function ProjectMediaGallery({ media, title }: ProjectMediaGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  if (media.length === 0) return null

  const handlePrev = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === 0 ? media.length - 1 : selectedIndex - 1)
    }
  }

  const handleNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === media.length - 1 ? 0 : selectedIndex + 1)
    }
  }

  return (
    <>
      {/* Thumbnail Grid */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {media.slice(0, 6).map((item, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className="group relative aspect-video overflow-hidden rounded-md border border-border bg-muted transition-all hover:border-primary"
          >
            {item.type === "image" ? (
              <Image
                src={item.src}
                alt={item.alt || `${title} media ${index + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform group-hover:scale-105"
              />
            ) : item.thumbnailSrc ? (
              <>
                <Image
                  src={item.thumbnailSrc}
                  alt={item.alt || `${title} video thumbnail ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/30">
                  <Play className="h-8 w-8 text-white drop-shadow" />
                </div>
              </>
            ) : (
              <div className="flex h-full items-center justify-center bg-muted">
                <Play className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            {index === 5 && media.length > 6 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white">
                <span className="text-lg font-semibold">+{media.length - 6}</span>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          {/* Close Button */}
          <button
            onClick={() => setSelectedIndex(null)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Media Display */}
          <div className="relative max-h-[80vh] max-w-4xl">
            <div className="relative aspect-video w-full min-w-[300px] md:min-w-[600px]">
              {media[selectedIndex].type === "image" ? (
                <Image
                  src={media[selectedIndex].src}
                  alt={media[selectedIndex].alt || `${title} media`}
                  fill
                  sizes="(max-width: 768px) 100vw, 896px"
                  className="object-contain"
                />
              ) : (
                <iframe
                  src={media[selectedIndex].src}
                  title={media[selectedIndex].alt || `${title} video`}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              )}
            </div>

            {/* Navigation Buttons */}
            {media.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 transition-colors hover:bg-white"
                  aria-label="Previous"
                >
                  <ChevronLeft className="h-6 w-6 text-black" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 transition-colors hover:bg-white"
                  aria-label="Next"
                >
                  <ChevronRight className="h-6 w-6 text-black" />
                </button>
              </>
            )}

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-sm text-white">
              {selectedIndex + 1} / {media.length}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
