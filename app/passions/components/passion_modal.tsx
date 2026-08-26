"use client"

import { useCallback, useEffect, useId, useRef, useState } from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import type { Passion } from "@/lib/passions"
import { X, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"

interface PassionModalProps {
  passion: Passion | null
  isOpen: boolean
  onClose: () => void
}

interface PassionModalContentProps {
  passion: Passion
  onClose: () => void
}

const FOCUSABLE =
  'a[href],button:not([disabled]),input,select,textarea,iframe,video[controls],[tabindex]:not([tabindex="-1"])'

function PassionModalContent({ passion, onClose }: PassionModalContentProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showVideo, setShowVideo] = useState(false)
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const titleId = useId()

  const validImages = passion.images?.filter((img) => img && img.trim() !== "") || []
  const imageCount = validImages.length

  const nextImage = useCallback(() => {
    if (imageCount > 1) {
      setCurrentImageIndex((prev) => (prev === imageCount - 1 ? 0 : prev + 1))
    }
  }, [imageCount])

  const prevImage = useCallback(() => {
    if (imageCount > 1) {
      setCurrentImageIndex((prev) => (prev === 0 ? imageCount - 1 : prev - 1))
    }
  }, [imageCount])

  // Mount-only, because this component only exists while the dialog is open:
  // move focus in, lock the background scroll. Kept separate from the key
  // handler so a changing handler identity never re-steals focus mid-session.
  useEffect(() => {
    dialogRef.current?.focus()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  // Escape closes, arrows page the gallery, Tab is trapped inside the dialog.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
        return
      }
      if (event.key === "ArrowRight") {
        nextImage()
        return
      }
      if (event.key === "ArrowLeft") {
        prevImage()
        return
      }
      if (event.key !== "Tab") return

      const node = dialogRef.current
      if (!node) return
      const focusable = Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.getClientRects().length > 0,
      )
      if (focusable.length === 0) {
        event.preventDefault()
        node.focus()
        return
      }
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const current = document.activeElement
      const outside = current === node || !node.contains(current)
      if (event.shiftKey && (outside || current === first)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (outside || current === last)) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [onClose, nextImage, prevImage])

  const hasImages = validImages.length > 0
  const hasMultipleImages = validImages.length > 1
  const currentImage = validImages[currentImageIndex] || validImages[0]
  const objectPosition = passion.imagePosition === "top" ? "object-top" : "object-center"

  // Cap the thumbnail strip so it never overflows past the image column.
  // The window slides to keep the current image visible; the rest are reached
  // by clicking through (arrows or the "+N" tile).
  const MAX_THUMBS = 8
  const thumbStart = Math.min(
    Math.max(0, currentImageIndex - Math.floor(MAX_THUMBS / 2)),
    Math.max(0, validImages.length - MAX_THUMBS)
  )
  const thumbEnd = Math.min(validImages.length, thumbStart + MAX_THUMBS)
  const moreAfter = validImages.length - thumbEnd

  // Portalled to <body> so no ancestor transform or query container can turn
  // itself into the containing block for this `position: fixed` layer. Only
  // ever rendered after a click, so there is no server pass to guard against.
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-[clamp(1rem,3vw,1.5rem)]">
      {/* Backdrop dismiss as a real button rather than a click handler on a
          div. Untabbable and hidden from assistive tech on purpose: it is a
          pointer shortcut, and the labelled Close control below is the
          keyboard/screen-reader route out (as is Escape). */}
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-background/80 backdrop-blur-sm"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="@container relative z-10 flex max-h-[90dvh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl outline-none"
      >
        {/* 44px square: the close control is the one thing that must never be
            fiddly, on either input. */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-background/80 text-card-foreground backdrop-blur-sm transition-colors fine:hover:bg-background"
          aria-label="Close gallery"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>

        {/* Container query, not a viewport breakpoint: the dialog splits when
            the dialog is wide, which is the thing that actually decides
            whether two columns fit. */}
        <div className="flex flex-1 flex-col overflow-y-auto @3xl:flex-row">
          {/* Image / Video Section */}
          {hasImages && currentImage && (
            <div className="relative flex h-80 w-full flex-shrink-0 flex-col bg-muted @3xl:h-[32rem] @3xl:w-1/2">
              {showVideo && passion.videoEmbed ? (
                <div className="relative flex-1">
                  <iframe
                    src={passion.videoEmbed}
                    title={`${passion.title} video`}
                    className="h-full w-full"
                    allowFullScreen
                    allow="autoplay"
                  />
                  <button
                    type="button"
                    onClick={() => setShowVideo(false)}
                    className="absolute left-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-background/80 text-card-foreground backdrop-blur-sm transition-colors fine:hover:bg-background"
                    aria-label="Back to photos"
                  >
                    <ChevronLeft className="h-5 w-5" aria-hidden />
                  </button>
                </div>
              ) : (
                <div className="relative flex-1">
                  <Image
                    src={currentImage}
                    alt={passion.imageAlts?.[currentImageIndex] || `${passion.title} photo ${currentImageIndex + 1}`}
                    fill
                    className={`object-cover ${objectPosition}`}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {/* Play button overlay */}
                  {passion.videoEmbed && (
                    <button
                      type="button"
                      onClick={() => setShowVideo(true)}
                      className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors fine:hover:bg-black/40"
                      aria-label="Play video"
                    >
                      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg">
                        <svg className="h-7 w-7 translate-x-0.5 text-black" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </span>
                    </button>
                  )}
                  {/* Image Navigation — 44px targets, so the same control works
                      for a thumb and a cursor. */}
                  {hasMultipleImages && (
                    <>
                      <button
                        type="button"
                        onClick={prevImage}
                        className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-card-foreground backdrop-blur-sm transition-colors fine:hover:bg-background"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="h-5 w-5" aria-hidden />
                      </button>
                      <button
                        type="button"
                        onClick={nextImage}
                        className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-card-foreground backdrop-blur-sm transition-colors fine:hover:bg-background"
                        aria-label="Next image"
                      >
                        <ChevronRight className="h-5 w-5" aria-hidden />
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Thumbnail Strip — windowed so it never overflows the column */}
              {hasMultipleImages && !showVideo && (
                <div className="flex gap-2 overflow-hidden bg-card/50 p-3 backdrop-blur-sm">
                  {validImages.slice(thumbStart, thumbEnd).map((src, i) => {
                    const index = thumbStart + i
                    const showMoreBadge = index === thumbEnd - 1 && moreAfter > 0
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() =>
                          setCurrentImageIndex(showMoreBadge ? thumbEnd : index)
                        }
                        className={`relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                          currentImageIndex === index && !showMoreBadge
                            ? "border-primary"
                            : "border-transparent opacity-60 fine:hover:opacity-100"
                        }`}
                        aria-current={
                          currentImageIndex === index && !showMoreBadge ? "true" : undefined
                        }
                        aria-label={
                          showMoreBadge
                            ? `View ${moreAfter} more images`
                            : `View image ${index + 1}`
                        }
                      >
                        <Image
                          src={src}
                          alt=""
                          fill
                          className={`object-cover ${objectPosition}`}
                          sizes="48px"
                        />
                        {showMoreBadge && (
                          <span className="absolute inset-0 flex items-center justify-center bg-background/70 text-xs font-semibold backdrop-blur-sm">
                            +{moreAfter}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Image Counter */}
              {hasMultipleImages && !showVideo && (
                <p className="absolute bottom-[4.5rem] right-3 rounded-full bg-background/80 px-3 py-1 font-mono text-eyebrow tabular-nums backdrop-blur-sm">
                  {currentImageIndex + 1} / {validImages.length}
                </p>
              )}
            </div>
          )}

          {/* Content Section */}
          <div className="flex flex-1 flex-col overflow-y-auto p-[clamp(1.5rem,4cqi,2.5rem)]">
            {/* pr-14 clears the close button, which is pinned to this corner. */}
            <h2
              id={titleId}
              className="pr-14 font-display text-h3 text-balance text-card-foreground"
            >
              {passion.title}
            </h2>
            <p className="mt-4 font-serif text-deck text-pretty text-muted-foreground">
              {passion.description}
            </p>
            <div className="mt-6 space-y-4">
              {passion.details.map((detail, i) => (
                <p key={i} className="text-pretty leading-relaxed text-card-foreground">
                  {detail}
                </p>
              ))}
            </div>
            {passion.timeline && passion.timeline.length > 0 && (
              <div className="mt-8 border-t border-border pt-6">
                <h3 className="mb-5 font-mono text-eyebrow uppercase text-muted-foreground">
                  Progress Log
                </h3>
                <div className="relative space-y-6 pl-6">
                  {/* Vertical rail */}
                  <span className="absolute bottom-1.5 left-[3px] top-1.5 w-px bg-border" />
                  {passion.timeline.map((entry, i) => (
                    <div key={i} className="relative">
                      {/* Node */}
                      <span className="absolute -left-6 top-1.5 h-[9px] w-[9px] rounded-full bg-primary ring-4 ring-card" />
                      <p className="font-mono text-eyebrow uppercase text-primary">
                        {entry.date}
                      </p>
                      <ul className="mt-2 space-y-1.5">
                        {entry.items.map((item, j) => (
                          <li
                            key={j}
                            className="relative pl-4 text-sm leading-relaxed text-card-foreground before:absolute before:left-0 before:top-2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-primary/60"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {passion.media && passion.media.length > 0 && (
              <div className="mt-8 border-t border-border pt-6">
                <h3 className="mb-4 font-mono text-eyebrow uppercase text-muted-foreground">
                  Links
                </h3>
                <div className="flex flex-wrap gap-3">
                  {passion.media.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-hover inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-card-foreground transition-colors fine:hover:bg-muted"
                    >
                      <ExternalLink className="h-4 w-4" aria-hidden />
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export function PassionModal({ passion, isOpen, onClose }: PassionModalProps) {
  if (!isOpen || !passion) return null
  return <PassionModalContent key={passion.id} passion={passion} onClose={onClose} />
}
