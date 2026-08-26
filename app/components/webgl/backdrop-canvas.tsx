"use client"

import { useEffect, useState } from "react"
import { Canvas } from "@react-three/fiber"
import { useMotion } from "../motion-provider"
import { useTheme } from "../theme-provider"
import { useCoarsePointer } from "@/lib/use-media-query"
import { BackdropFallback, BackdropShell } from "./backdrop-fallback"
import { LatticeField } from "./lattice-field"

/**
 * The site's single WebGL context.
 *
 * One context, site-wide, deliberately: Chromium evicts the oldest context
 * once a page holds too many ("the oldest context will be lost"), so a
 * per-page canvas is a reliability problem, not just a cost one. This mounts
 * once in the root layout and persists across route changes.
 *
 * It is purely decorative — `aria-hidden` and `pointer-events: none` — so it
 * can never swallow a tap, a scroll or a link, and a screen reader never
 * encounters it.
 */
export default function BackdropCanvas() {
  const { paused } = useMotion()
  const { theme } = useTheme()
  const coarse = useCoarsePointer()
  const [documentHidden, setDocumentHidden] = useState(false)
  const [contextLost, setContextLost] = useState(false)

  // A backgrounded tab should not be running a render loop on someone's
  // battery.
  useEffect(() => {
    const onVisibility = () => setDocumentHidden(document.hidden)
    document.addEventListener("visibilitychange", onVisibility)
    onVisibility()
    return () => document.removeEventListener("visibilitychange", onVisibility)
  }, [])

  // On context loss the spec invalidates every WebGLObject, so there is
  // nothing to salvage — fall back to the CSS wash rather than render garbage.
  if (contextLost) {
    return (
      <BackdropShell>
        <BackdropFallback />
      </BackdropShell>
    )
  }

  const frozen = paused || documentHidden

  return (
    <BackdropShell>
      <BackdropFallback />
      <Canvas
        // A static frame when motion is off: the composition still reads, but
        // nothing moves and no frames are scheduled.
        frameloop={frozen ? "demand" : "always"}
        // r3f defaults to dpr [1,2] and powerPreference "high-performance"
        // (verified in @react-three/fiber's own source). Requesting the
        // discrete GPU for an ambient background is the wrong trade on a
        // laptop and actively bad on a phone.
        dpr={coarse ? [1, 1.5] : [1, 2]}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: coarse ? "low-power" : "default",
          // `alpha: false` is documented as costly on some platforms, and the
          // canvas must be see-through to sit under the page anyway.
        }}
        camera={{ position: [0, 0, 15], fov: 45 }}
        fallback={null}
        onCreated={({ gl }) => {
          // Required by the WebGL spec: without preventDefault the context is
          // never eligible for restoration.
          gl.domElement.addEventListener(
            "webglcontextlost",
            (event) => {
              event.preventDefault()
              setContextLost(true)
            },
            false,
          )
        }}
      >
        <LatticeField lowPower={coarse} dark={theme === "dark"} paused={frozen} />
      </Canvas>
    </BackdropShell>
  )
}

