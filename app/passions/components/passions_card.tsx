"use client"

import Image from "next/image"
import type { Passion } from "@/lib/passions"

// Icon components
function CodeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
    </svg>
  )
}

function PaletteIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 0 0 5.304 0l6.401-6.402M6.75 21A3.75 3.75 0 0 1 3 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 0 0 3.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008Z" />
    </svg>
  )
}

function MusicIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" />
    </svg>
  )
}

function BookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
    </svg>
  )
}

function DumbbellIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 17.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM20.25 6.75h.007v.008h-.007V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 10.5h.007v.008h-.007v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM5.25 6v.75m0 9.75V18m0-9v1.5m0 6V15m13.5-9v.75m0 9.75V18m0-9v1.5m0 6V15M6.75 6v12m10.5-12v12M9 6v12m6-12v12" />
    </svg>
  )
}

function PlaneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
    </svg>
  )
}

function FootballIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.5m0 13V21M3 12h2.5m13 0H21M6.4 6.4l1.8 1.8m7.6-1.8-1.8 1.8m-7.6 7.6 1.8-1.8m7.6 1.8-1.8-1.8" />
    </svg>
  )
}

function ChessIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 21h6M12 21v-3M8 18h8M10 15V9.5c0-.828-.448-1.5-1-1.5H8V6h8v2h-1c-.552 0-1 .672-1 1.5V15H10z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 8.5c0-.828.448-1.5 1-1.5h2c.552 0 1 .672 1 1.5" />
    </svg>
  )
}

function MicIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
    </svg>
  )
}

function RunningIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM6 20.25l3-4.5 2.25 2.25L13.5 15l3 5.25" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 7.5 9l3.75-.75 1.5 3.75" />
    </svg>
  )
}

function MountainIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 20.25 9 9l3.75 5.25L15.75 9l4.5 11.25H3.75Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m13.5 12 1.5-2.25 1.5 2.25" />
    </svg>
  )
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  code: CodeIcon,
  palette: PaletteIcon,
  music: MusicIcon,
  book: BookIcon,
  dumbbell: DumbbellIcon,
  plane: PlaneIcon,
  football: FootballIcon,
  chess: ChessIcon,
  mic: MicIcon,
  running: RunningIcon,
  mountain: MountainIcon,
}

interface PassionCardProps {
  passion: Passion
  index: number
  /** Receives the trigger element so focus can be handed back on close. */
  onOpen: (passion: Passion, trigger: HTMLButtonElement) => void
}

/**
 * Where an item sits in the bento.
 *
 * Span-based, following magicui's bento: the grid is fixed and every tile is
 * full width by default, *earning* a wider span further up the scale. Tiles are
 * widened, never moved, so visual order can never desync from DOM order the way
 * `grid-template-areas` allows. The cycle repeats every four items and tiles a
 * three-column grid exactly (2+1 / 1+2), so the rhythm holds for any number of
 * passions instead of being hand-placed for the six that exist today.
 */
export function bentoSlot(index: number) {
  const step = index % 4
  const wide = step === 0 || step === 3
  return {
    wide,
    span: wide ? "sm:col-span-2 lg:col-span-2" : "lg:col-span-1",
    // Aspect variety is what replaces the borders: the grid reads as composed
    // because the frames are different shapes, not because they are outlined.
    aspect:
      step === 0
        ? "aspect-[16/9]"
        : step === 1
          ? "aspect-[4/5]"
          : step === 2
            ? "aspect-square"
            : "aspect-[16/10]",
  }
}

/**
 * How a wide tile's mosaic fills a 2x2 grid. Small counts stretch so the
 * mosaic never leaves a hole.
 */
function mosaicSpan(count: number, i: number): string {
  if (count === 1) return "col-span-2 row-span-2"
  if (count === 2) return "row-span-2"
  if (count === 3 && i === 2) return "col-span-2"
  return ""
}

/**
 * One passion, as a photograph with a caption.
 *
 * The panel, the border, the blur, the hover-lift and the rounded icon chip are
 * gone; what is left is the image at whatever shape its slot calls for, and a
 * typeset caption under it. Nothing is desaturated at rest: these are personal
 * photographs and the colour *is* the content, so a `grayscale` resting state
 * would be a permanent downgrade on a phone, where there is no hover to lift
 * it. The treatment is a slow zoom on hover instead, which simply never fires
 * on touch.
 */
export function PassionCard({ passion, index, onOpen }: PassionCardProps) {
  const IconComponent = iconMap[passion.icon] || CodeIcon
  const objectPosition = passion.imagePosition === "top" ? "object-top" : "object-center"
  const { wide, aspect } = bentoSlot(index)

  const images = passion.images?.filter((src) => src && src.trim() !== "") ?? []
  // A wide tile can carry a mosaic; a narrow one shows a single frame. That is
  // a slot decision, not a form-factor one — both render the same tree.
  const shown = wide ? images.slice(0, 4) : images.slice(0, 1)

  const titleId = `passion-${passion.id}-title`
  const hintId = `passion-${passion.id}-hint`

  return (
    // `relative` is load-bearing: it is the containing block for the button laid
    // over the tile. Nothing here may grow a transform or filter.
    <div className="group relative flex flex-col gap-[clamp(0.875rem,2vw,1.25rem)]">
      <div className={`relative w-full overflow-hidden bg-muted ${aspect}`}>
        {shown.length > 0 ? (
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-1">
            {shown.map((src, i) => (
              <div key={i} className={`relative overflow-hidden ${mosaicSpan(shown.length, i)}`}>
                <Image
                  src={src}
                  alt={passion.imageAlts?.[i] || `${passion.title} photo ${i + 1}`}
                  fill
                  sizes={
                    wide
                      ? "(max-width: 1024px) 100vw, 66vw"
                      : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  }
                  priority={index === 0 && i === 0}
                  className={`object-cover ${objectPosition} transition-transform duration-700 ease-entrance group-hover:scale-[1.04]`}
                />
              </div>
            ))}
          </div>
        ) : (
          // No photographs yet: the icon stands in at size, rather than the
          // tile collapsing into a text row and breaking the grid's rhythm.
          <span aria-hidden className="absolute inset-0 flex items-center justify-center">
            <IconComponent className="h-12 w-12 text-muted-foreground" />
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <p className="flex flex-wrap items-center gap-2 font-mono text-eyebrow uppercase text-muted-foreground">
          <span aria-hidden className="flex shrink-0 text-primary">
            <IconComponent className="h-3.5 w-3.5" />
          </span>
          <span className="tabular-nums">{String(index + 1).padStart(2, "0")}</span>
          {/* The photo count used to be a blurred pill floating over the image.
              It is information, so it belongs in the caption. */}
          {images.length > 1 && <span>· {images.length} photos</span>}
        </p>
        <h2
          id={titleId}
          className="font-display text-h3 text-balance text-foreground transition-colors group-hover:text-primary"
        >
          {passion.title}
        </h2>
        <p className="text-pretty text-[0.95rem] leading-relaxed text-muted-foreground">
          {passion.description}
        </p>
        {/* The affordance is plain text that is always rendered — the old
            "Click to view gallery" hint was hover-only on a desktop and named
            an input a phone does not have. */}
        <span
          id={hintId}
          className="mt-1 inline-flex items-center gap-2 font-mono text-eyebrow uppercase text-primary"
        >
          View gallery
          <span aria-hidden className="transition-transform group-hover:translate-x-1">
            &rarr;
          </span>
        </span>
      </div>

      {/* The whole tile is one action, so the hit area is one button laid over
          it. Nesting the heading and copy *inside* a <button> would be invalid
          HTML (flow content in a phrasing-only element) and would flatten the
          heading out of the document outline; this keeps both the semantics and
          the full-tile target, which is far larger than the 44px minimum. */}
      <button
        type="button"
        aria-labelledby={`${titleId} ${hintId}`}
        aria-haspopup="dialog"
        onClick={(event) => onOpen(passion, event.currentTarget)}
        className="absolute inset-0 z-10 cursor-pointer"
      />
    </div>
  )
}
