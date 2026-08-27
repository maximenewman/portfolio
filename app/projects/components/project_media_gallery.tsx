"use client"

import { useCallback, useEffect, useId, useRef, useState } from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import { ProjectMedia } from "@/lib/projects"
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

const FOCUSABLE =
  'a[href],button:not([disabled]),input,select,textarea,iframe,video[controls],[tabindex]:not([tabindex="-1"])'

export function ProjectMediaGallery({ media, title, priority = false }: ProjectMediaGalleryProps) {
  // One index drives both the inline hero and the viewer, so paging inside the
  // viewer leaves the card showing whatever the visitor stopped on.
  const [active, setActive] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const heroRef = useRef<HTMLButtonElement | null>(null)

  const showPrev = useCallback(
    () => setActive((prev) => (prev === 0 ? media.length - 1 : prev - 1)),
    [media.length],
  )
  const showNext = useCallback(
    () => setActive((prev) => (prev === media.length - 1 ? 0 : prev + 1)),
    [media.length],
  )
  const open = useCallback(() => setIsOpen(true), [])
  // Focus returns to the tile that opened the viewer, not to the top of the page.
  const close = useCallback(() => {
    setIsOpen(false)
    heroRef.current?.focus()
  }, [])

  if (media.length === 0) return null

  const activeItem = media[active]
  const activePreview = previewSrc(activeItem)

  return (
    <>
      <div className="flex flex-col gap-3">
        <button
          ref={heroRef}
          type="button"
          onClick={open}
          aria-haspopup="dialog"
          aria-label={
            media.length > 1
              ? `Open ${title} media viewer (${active + 1} of ${media.length})`
              : `Open ${title} media viewer`
          }
          // No frame and no radius: the hero bleeds to the edge of the page, so
          // a border would be a line hanging in space. The hover ring is inset
          // for the same reason — it must not add geometry outside the bleed.
          className="group relative aspect-video w-full overflow-hidden bg-muted transition-shadow duration-200 hover:ring-2 hover:ring-inset hover:ring-primary/60"
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
            <span className="flex h-full items-center justify-center bg-muted">
              <Play className="h-10 w-10 text-muted-foreground" />
            </span>
          )}

          {/* Video play overlay */}
          {activeItem.type === "video" && (
            <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/60 transition-transform group-hover:scale-110">
                <Play className="h-6 w-6 translate-x-0.5 fill-white text-white" />
              </span>
            </span>
          )}

          {/* Counter / view badge */}
          {/* Opaque rather than blurred: `backdrop-filter` is both the most
              recognisable marker of the generated-card look and a containing
              block, which breaks fixed-position descendants. */}
          <span className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-black/70 px-2.5 py-1.5 font-mono text-eyebrow uppercase text-white">
            <Maximize2 className="h-3.5 w-3.5" aria-hidden />
            {media.length > 1 ? `${active + 1} / ${media.length}` : "View"}
          </span>
        </button>

        {/* Thumbnail strip. Real buttons, 48px tall so they clear the 44px touch
            minimum without a separate mobile control. The hero bleeds to the
            page edge but the strip is inset to the page gutter — same clamp as
            <Container> — so it reads as a caption under the image rather than
            as a row of tiles jammed against the viewport. */}
        {media.length > 1 && (
          <div className="flex flex-wrap gap-2 px-[clamp(1.25rem,4vw,4rem)]">
            {media.map((item, index) => {
              const thumb = previewSrc(item)
              const isActive = index === active
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActive(index)}
                  aria-label={item.alt || `Show ${title} media ${index + 1}`}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative h-12 w-[68px] overflow-hidden rounded-md border border-border bg-muted transition-opacity ${
                    isActive ? "opacity-100 ring-2 ring-primary" : "opacity-60 hover:opacity-100"
                  }`}
                >
                  {thumb ? (
                    <Image
                      src={thumb}
                      alt=""
                      width={68}
                      height={48}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="flex h-full items-center justify-center">
                      <Play className="h-4 w-4 text-muted-foreground" />
                    </span>
                  )}
                  {item.type === "video" && thumb && (
                    <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/25">
                      <Play className="h-3.5 w-3.5 fill-white text-white" />
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {isOpen && (
        <MediaLightbox
          media={media}
          title={title}
          index={active}
          onPrev={showPrev}
          onNext={showNext}
          onClose={close}
        />
      )}
    </>
  )
}

/**
 * Full-screen media viewer.
 *
 * Mounted only while open, so its mount effect *is* the "on open" hook: focus
 * moves into the dialog, background scroll locks, and key handling installs.
 * Escape closes, arrows page, Tab cycles inside the dialog.
 *
 * Portalled to <body> because the row around it carries the scroll-reveal
 * transform, which makes an ancestor the containing block for
 * `position: fixed` and would pin this "full screen" layer to the row instead
 * of the viewport. Only ever rendered after a click, so there is no server
 * pass to guard against.
 */
function MediaLightbox({
  media,
  title,
  index,
  onPrev,
  onNext,
  onClose,
}: {
  media: ProjectMedia[]
  title: string
  index: number
  onPrev: () => void
  onNext: () => void
  onClose: () => void
}) {
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const labelId = useId()
  const item = media[index]

  // Mount-only: focus in, lock scroll. Kept apart from the key handler so a
  // changing handler identity never yanks focus back to the container.
  useEffect(() => {
    dialogRef.current?.focus()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
        return
      }
      if (event.key === "ArrowLeft" && media.length > 1) {
        onPrev()
        return
      }
      if (event.key === "ArrowRight" && media.length > 1) {
        onNext()
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

    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [media.length, onClose, onNext, onPrev])

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dismiss-on-backdrop as a real button rather than a click handler on a
          div. Hidden from assistive tech and untabbable on purpose: it is a
          pointer shortcut for the labelled close control beside it. */}
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/90"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelId}
        tabIndex={-1}
        className="relative z-10 flex max-h-full w-full max-w-4xl flex-col gap-3 outline-none"
      >
        <div className="flex items-center justify-between gap-3">
          <h2 id={labelId} className="font-mono text-eyebrow uppercase text-white/80">
            {title}
            {media.length > 1 ? ` — ${index + 1} of ${media.length}` : ""}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close media viewer"
            className="btn-hover flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <X className="h-6 w-6" aria-hidden />
          </button>
        </div>

        <div className="relative">
          <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
            {item.type === "image" ? (
              <Image
                src={item.src}
                alt={item.alt || `${title} media ${index + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 896px"
                className="object-contain"
              />
            ) : isEmbedUrl(item.src) ? (
              <iframe
                src={item.src}
                title={item.alt || `${title} video`}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            ) : (
              <video
                src={item.src}
                title={item.alt || `${title} video`}
                className="h-full w-full"
                controls
                autoPlay
                playsInline
                poster={item.thumbnailSrc}
              />
            )}
          </div>

          {/* 44px controls, inset from the media edge so they clear a thumb on
              a phone and still read as an overlay on a desktop pointer. */}
          {media.length > 1 && (
            <>
              <button
                type="button"
                onClick={onPrev}
                aria-label="Previous media"
                className="btn-hover absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-black transition-colors hover:bg-white"
              >
                <ChevronLeft className="h-6 w-6" aria-hidden />
              </button>
              <button
                type="button"
                onClick={onNext}
                aria-label="Next media"
                className="btn-hover absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-black transition-colors hover:bg-white"
              >
                <ChevronRight className="h-6 w-6" aria-hidden />
              </button>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}
