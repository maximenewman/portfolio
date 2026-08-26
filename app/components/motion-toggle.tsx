"use client"

import { Pause, Play } from "lucide-react"
import { useMotion } from "./motion-provider"

/**
 * The Pause control for site motion.
 *
 * WCAG 2.2.2 (Pause, Stop, Hide) is a Level A criterion: motion that starts
 * automatically, runs longer than five seconds and sits alongside other
 * content needs a mechanism to stop it. The ambient WebGL backdrop is exactly
 * that, so this has to exist for every visitor — not only those who set an OS
 * preference.
 *
 * When the OS already asks for reduced motion the control is disabled rather
 * than hidden, so the state is still discoverable and honest: nothing is
 * moving, and the page says why.
 */
export function MotionToggle({ className = "" }: { className?: string }) {
  const { paused, systemReduced, toggle } = useMotion()

  const label = systemReduced
    ? "Motion is off because your system asks for reduced motion"
    : paused
      ? "Resume motion"
      : "Pause motion"

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={systemReduced}
      aria-pressed={paused}
      aria-label={label}
      title={label}
      // 44px on touch: WCAG 2.5.5's enhanced target size, worth meeting for a
      // persistent control even though 2.5.8 only requires 24px.
      className={`btn-hover inline-flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40 fine:h-9 fine:w-9 ${className}`}
    >
      {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
    </button>
  )
}
