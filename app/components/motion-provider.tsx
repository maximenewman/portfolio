"use client"

import { createContext, useCallback, useContext, useEffect, useSyncExternalStore } from "react"
import { usePrefersReducedMotion } from "@/lib/use-media-query"

type MotionContextValue = {
  /** True when nothing should be moving, for either reason. */
  paused: boolean
  /** True when the OS asked for reduced motion (the toggle can't override this). */
  systemReduced: boolean
  /** The visitor's explicit choice, independent of the OS setting. */
  userPaused: boolean
  toggle: () => void
}

const MotionContext = createContext<MotionContextValue>({
  paused: true,
  systemReduced: false,
  userPaused: false,
  toggle: () => {},
})

const STORAGE_KEY = "motion-paused"
const CHANGE_EVENT = "motion-preference-change"

/**
 * localStorage read as an external store rather than state-in-an-effect.
 * Reading it during render would desync hydration (the server has no
 * localStorage), and setting it from an effect trips
 * `react-hooks/set-state-in-effect` — `useSyncExternalStore` is the shape
 * React actually wants here, and it matches how the theme is already read.
 */
function subscribeToPreference(onChange: () => void) {
  window.addEventListener("storage", onChange)
  window.addEventListener(CHANGE_EVENT, onChange)
  return () => {
    window.removeEventListener("storage", onChange)
    window.removeEventListener(CHANGE_EVENT, onChange)
  }
}

function getPreferenceSnapshot(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1"
  } catch {
    // Private mode / blocked storage — running is the safe default.
    return false
  }
}

function getPreferenceServerSnapshot(): boolean {
  return false
}

/**
 * Owns the site's single "is anything allowed to move" answer.
 *
 * Two independent inputs collapse into one boolean:
 *   1. `prefers-reduced-motion` — the OS setting, authoritative and not
 *      overridable from the page.
 *   2. An explicit Pause control — required by WCAG 2.2.2 (Level A), which
 *      asks for a pause/stop/hide mechanism for motion that starts
 *      automatically, lasts more than five seconds and is presented alongside
 *      other content. An ambient WebGL backdrop behind readable text is
 *      precisely that, so the control has to exist even for visitors who never
 *      set an OS preference.
 *
 * The result is mirrored onto <html data-motion> so CSS can react to it
 * without every animated component subscribing to this context.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  const systemReduced = usePrefersReducedMotion()
  const userPaused = useSyncExternalStore(
    subscribeToPreference,
    getPreferenceSnapshot,
    getPreferenceServerSnapshot,
  )

  const paused = systemReduced || userPaused

  useEffect(() => {
    document.documentElement.dataset.motion = paused ? "paused" : "running"
  }, [paused])

  const toggle = useCallback(() => {
    const next = !getPreferenceSnapshot()
    try {
      window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0")
    } catch {
      // Preference just won't survive a reload; not worth failing over.
    }
    // `storage` only fires in *other* tabs, so this tab needs its own nudge.
    window.dispatchEvent(new Event(CHANGE_EVENT))
  }, [])

  return (
    <MotionContext.Provider value={{ paused, systemReduced, userPaused, toggle }}>
      {children}
    </MotionContext.Provider>
  )
}

export function useMotion() {
  return useContext(MotionContext)
}
