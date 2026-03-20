"use client"

import Image from "next/image"
import type { Passion } from "@/app/passions/data/passions"

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
  featured?: boolean
}

export function PassionCard({ passion, featured = false }: PassionCardProps) {
  const IconComponent = iconMap[passion.icon] || CodeIcon

  if (featured) {
    return (
      <div className="group">
        <div className="flex flex-col lg:flex-row">
          {/* Image Gallery - Featured */}
          {passion.images && passion.images.length > 0 && (
            <div className="relative aspect-[4/3] w-full lg:aspect-auto lg:min-h-[500px] lg:w-3/5">
              <div className="grid h-full grid-cols-2 gap-1">
                {passion.images.slice(0, 4).map((src, i) => (
                  <div
                    key={i}
                    className={`relative overflow-hidden ${
                      passion.images!.length === 1 ? "col-span-2 row-span-2" : ""
                    } ${passion.images!.length === 2 ? "row-span-2" : ""}`}
                  >
                    <Image
                      src={src}
                      alt={`${passion.title} photo ${i + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 60vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                ))}
              </div>
              {/* Click to expand hint */}
              <div className="absolute bottom-4 right-4 rounded-full bg-background/80 px-3 py-1.5 text-xs font-medium backdrop-blur-sm transition-opacity group-hover:opacity-100 md:opacity-0">
                Click to view gallery
              </div>
            </div>
          )}

          {/* Content - Featured */}
          <div className="flex flex-1 flex-col p-6 lg:p-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <IconComponent className="h-6 w-6 text-primary" />
              </div>
              <div>
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Featured
                </span>
                <h3 className="text-2xl font-bold text-card-foreground md:text-3xl">
                  {passion.title}
                </h3>
              </div>
            </div>

            <p className="mb-4 leading-relaxed text-muted-foreground">
              {passion.description}
            </p>

            {/* Preview of details */}
            <div className="space-y-3">
              {passion.details.slice(0, 2).map((detail, i) => (
                <p key={i} className="text-sm leading-relaxed text-card-foreground">
                  {detail}
                </p>
              ))}
              {passion.details.length > 2 && (
                <p className="text-sm font-medium text-primary">
                  Click to read more...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="group flex h-full flex-col">
      {/* Image Preview - Full prominent display */}
      {passion.images && passion.images.length > 0 && (
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Image
            src={passion.images[0]}
            alt={`${passion.title} preview`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />
          {/* Image count badge */}
          {passion.images.length > 1 && (
            <div className="absolute right-3 top-3 rounded-full bg-background/80 px-2.5 py-1 text-xs font-medium backdrop-blur-sm">
              +{passion.images.length - 1} photos
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
            <IconComponent className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-card-foreground">
            {passion.title}
          </h3>
        </div>

        <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">
          {passion.description}
        </p>

        {/* Click hint */}
        <span className="text-xs font-medium text-primary transition-colors group-hover:text-primary/80">
          Click to explore
        </span>
      </div>
    </div>
  )
}
