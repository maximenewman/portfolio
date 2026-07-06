"use client"

import { useState } from "react"
import Image from "next/image"
import { ProjectMedia } from "@/app/projects/data/projects"
import { ChevronLeft, ChevronRight, Maximize2, Play, X } from "lucide-react"

interface ProjectMediaGalleryProps {
  media: ProjectMedia[]
  title: string
  priority?: boolean
}

function previewSrc(item: ProjectMedia): string | null {
  if (item.type === "image") return item.src
  return item.thumbnailSrc ?? null
}

// Embed players (YouTube etc.) need an iframe; direct video files play natively.
function isEmbedUrl(src: string): boolean {
  return src.includes("youtube.com/embed") || src.includes("player.vimeo.com")
}

export function ProjectMediaGallery({ media, title, priority = false }: ProjectMediaGalleryProps) {
  const [active, setActive] = useState(0)
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

  const activeItem = media[active]
  const activePreview = previewSrc(activeItem)

  return (
    <>
      <div className="flex flex-col gap-2">
        {/* Hero */}
        <button
          onClick={() => setSelectedIndex(active)}
          className="group relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-muted transition-all hover:ring-2 hover:ring-primary/50"
        >
          {activePreview ? (
            <>
              {/* Blurred letterbox backdrop */}
              <Image
                src={activePreview}
                alt=""
                fill
                aria-hidden
                sizes="(max-width: 768px) 100vw, 55vw"
                className="scale-110 object-cover blur-2xl brightness-50"
              />
              {/* Uncropped foreground */}
              <Image
                src={activePreview}
                alt={activeItem.alt || `${title} media ${active + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 55vw"
                className="object-contain"
                priority={priority}
              />
            </>
          ) : (
            <div className="flex h-full items-center justify-center bg-muted">
              <Play className="h-10 w-10 text-muted-foreground" />
            </div>
          )}

          {/* Video play overlay */}
          {activeItem.type === "video" && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm transition-transform group-hover:scale-110">
                <Play className="h-6 w-6 translate-x-0.5 fill-white text-white" />
              </span>
            </div>
          )}

          {/* Counter / view badge */}
          <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
            <Maximize2 className="h-3.5 w-3.5" />
            {media.length > 1 ? `${active + 1} / ${media.length}` : "View"}
          </div>
        </button>

        {/* Thumbnail strip */}
        {media.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {media.map((item, index) => {
              const thumb = previewSrc(item)
              const isActive = index === active
              return (
                <button
                  key={index}
                  onClick={() => setActive(index)}
                  aria-label={`Show media ${index + 1}`}
                  className={`relative h-11 w-[62px] overflow-hidden rounded-md border border-border bg-muted transition-all ${
                    isActive ? "opacity-100 ring-2 ring-primary" : "opacity-60 hover:opacity-100"
                  }`}
                >
                  {thumb ? (
                    <Image
                      src={thumb}
                      alt={item.alt || `${title} thumbnail ${index + 1}`}
                      width={62}
                      height={44}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Play className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                  {item.type === "video" && thumb && (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/25">
                      <Play className="h-3.5 w-3.5 fill-white text-white" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
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
            <div className="relative aspect-video w-full min-w-[300px] overflow-hidden rounded-xl md:min-w-[600px]">
              {media[selectedIndex].type === "image" ? (
                <Image
                  src={media[selectedIndex].src}
                  alt={media[selectedIndex].alt || `${title} media`}
                  fill
                  sizes="(max-width: 768px) 100vw, 896px"
                  className="object-contain"
                />
              ) : isEmbedUrl(media[selectedIndex].src) ? (
                <iframe
                  src={media[selectedIndex].src}
                  title={media[selectedIndex].alt || `${title} video`}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              ) : (
                <video
                  src={media[selectedIndex].src}
                  title={media[selectedIndex].alt || `${title} video`}
                  className="h-full w-full"
                  controls
                  autoPlay
                  playsInline
                  poster={media[selectedIndex].thumbnailSrc}
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
