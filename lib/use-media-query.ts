"use client"

import { useCallback, useSyncExternalStore } from "react"

/**
 * Media query as reactive state, without a hydration mismatch.
 *
 * `useSyncExternalStore`'s third argument runs both on the server *and* during
 * hydration, so the first client render provably matches the server HTML; the
 * subscription then corrects it on the next tick. A `useState` + `useEffect`
 * version renders the wrong value first and trips a hydration warning on any
 * markup that depends on it.
 *
 * `serverFallback` is the value assumed before the browser can be asked. Pick
 * the one that degrades safely — e.g. assume reduced motion rather than
 * assuming a visitor wants animation.
 */
export function useMediaQuery(query: string, serverFallback = false): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query)
      mql.addEventListener("change", onChange)
      return () => mql.removeEventListener("change", onChange)
    },
    [query],
  )

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query])
  const getServerSnapshot = useCallback(() => serverFallback, [serverFallback])

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

/** True when the visitor has asked their OS to reduce motion. */
export function usePrefersReducedMotion(): boolean {
  // Server fallback is `true`: render the calm version first, then opt in.
  return useMediaQuery("(prefers-reduced-motion: reduce)", true)
}

/**
 * True for touch-primary devices. Used for *affordances and render cost only*
 * — never to pick a layout, which stays CSS-driven so one tree serves both
 * form factors.
 */
export function useCoarsePointer(): boolean {
  return useMediaQuery("(hover: none) and (pointer: coarse)", false)
}
