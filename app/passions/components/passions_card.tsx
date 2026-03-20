"use client"

import { useState } from "react"
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
}

export function PassionCard({ passion, index }: PassionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const IconComponent = iconMap[passion.icon] || CodeIcon

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl ${passion.color} ${passion.hoverColor} transition-all duration-500 ease-out cursor-pointer`}
      style={{ animationDelay: `${index * 100}ms` }}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="relative z-10 p-6 md:p-8">
        {/* Icon */}
        <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
          <IconComponent className="w-6 h-6 text-white" />
        </div>

        {/* Title */}
        <h3 className="text-xl md:text-2xl font-bold text-white mb-2 transition-transform duration-300 group-hover:translate-x-1">
          {passion.title}
        </h3>

        {/* Description */}
        <p className="text-white/70 text-sm md:text-base leading-relaxed mb-4">
          {passion.description}
        </p>

        {/* Expandable Details */}
        <div
          className={`grid transition-all duration-500 ease-out ${
            isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="space-y-3 pt-4 border-t border-white/20">
              {passion.details.map((detail, i) => (
                <p key={i} className="text-white/80 text-sm leading-relaxed">
                  {detail}
                </p>
              ))}
            </div>

            {passion.media && passion.media.length > 0 && (
              <div className="mt-4 pt-3 border-t border-white/10">
                <p className="text-white/50 text-xs uppercase tracking-wider mb-2">Media</p>
                <div className="flex flex-col gap-1">
                  {passion.media.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-white/80 text-sm hover:text-white underline underline-offset-2"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Expand indicator */}
        <div className="mt-4 flex items-center gap-2 text-white/50 text-xs">
          <span>{isExpanded ? "Click to collapse" : "Click to explore"}</span>
          <svg
            className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m19 9-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/5 transition-transform duration-500 group-hover:scale-150" />
      <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-white/5 transition-transform duration-700 group-hover:scale-150" />
    </div>
  )
}
