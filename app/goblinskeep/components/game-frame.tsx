"use client"

import { useEffect, useRef, useState } from "react"
import { Maximize2, Minimize2 } from "lucide-react"

export default function GameFrame() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [supported, setSupported] = useState(true)

  useEffect(() => {
    setSupported(typeof document !== "undefined" && !!document.fullscreenEnabled)

    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener("fullscreenchange", onChange)
    return () => document.removeEventListener("fullscreenchange", onChange)
  }, [])

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  const focusGame = () => iframeRef.current?.contentWindow?.focus()

  const toggleFullscreen = async () => {
    const el = wrapperRef.current
    if (!el) return
    try {
      if (!document.fullscreenElement) {
        await el.requestFullscreen()
      } else {
        await document.exitFullscreen()
      }
    } catch {
      /* user dismissed or browser refused — no-op */
    }
  }

  return (
    <div
      ref={wrapperRef}
      onMouseEnter={focusGame}
      className={`relative w-full bg-[#04040a] ${
        isFullscreen
          ? "h-screen"
          : "h-[calc(100dvh-4rem)] md:h-[calc(100dvh-5rem)]"
      }`}
    >
      <iframe
        ref={iframeRef}
        src="/goblinskeep/index.html"
        title="Goblin's Keep"
        className="block h-full w-full border-0"
        allow="autoplay; fullscreen"
        allowFullScreen
        onLoad={focusGame}
      />

      {supported && (
        <button
          type="button"
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          className="absolute right-3 top-3 z-10 inline-flex items-center gap-2 rounded-md border border-white/15 bg-black/50 px-3 py-2 text-sm font-medium text-white/90 opacity-70 backdrop-blur-sm transition hover:bg-black/70 hover:text-white hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {isFullscreen ? (
            <>
              <Minimize2 className="h-4 w-4" aria-hidden />
              Exit fullscreen
            </>
          ) : (
            <>
              <Maximize2 className="h-4 w-4" aria-hidden />
              Fullscreen
            </>
          )}
        </button>
      )}
    </div>
  )
}
