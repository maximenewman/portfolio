"use client"

import dynamic from "next/dynamic"
import { usePathname } from "next/navigation"
import { BackdropFallback, BackdropShell } from "./backdrop-fallback"

/**
 * Client-side boundary for the WebGL backdrop.
 *
 * `ssr: false` needs a Client Component — Next rejects it in a Server
 * Component outright, and rendering <Canvas> on the server fails earlier and
 * far less legibly, dying during page-data collection with a minified
 * `createContext is not a function`.
 *
 * Nothing here may statically import `backdrop-canvas`; see the note in
 * `backdrop-fallback.tsx`. The loading state is the same wash the canvas sits
 * on, in the identical fixed box, so nothing reflows when the chunk lands —
 * and a fixed `-z-10` layer contributes no layout, so CLS stays at zero.
 */
const BackdropCanvas = dynamic(() => import("./backdrop-canvas"), {
  ssr: false,
  loading: () => (
    <BackdropShell>
      <BackdropFallback />
    </BackdropShell>
  ),
})

/** Routes that get the plain wash instead of the canvas. */
function wantsCanvas(pathname: string): boolean {
  // The admin is a working tool — a decorative render loop competing with a
  // media-upload form is cost without benefit. `/goblinskeep` hands the GPU to
  // an embedded game and should not be sharing it.
  return !pathname.startsWith("/admin") && !pathname.startsWith("/goblinskeep")
}

export default function Backdrop() {
  const pathname = usePathname()

  if (!wantsCanvas(pathname)) {
    return (
      <BackdropShell>
        <BackdropFallback />
      </BackdropShell>
    )
  }

  return <BackdropCanvas />
}
