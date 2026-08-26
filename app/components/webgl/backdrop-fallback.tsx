/**
 * The non-WebGL backdrop: two soft washes in the brand colours.
 *
 * This lives in its own module, apart from the canvas, on purpose. Importing
 * it from `backdrop-canvas.tsx` would be a *static* import of the very module
 * `next/dynamic` is meant to defer, which pulls three.js into the layout
 * bundle and silently undoes the code split — every route then downloads
 * ~870 kB of WebGL it may never use.
 *
 * It is what visitors see before the canvas chunk arrives, when WebGL is
 * unavailable, and after a lost context.
 */
export function BackdropFallback() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute -right-32 -top-32 h-[36rem] w-[36rem] rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-40 -left-32 h-[32rem] w-[32rem] rounded-full bg-spark/10 blur-3xl" />
    </div>
  )
}

/** The fixed, decorative layer both the canvas and the fallback occupy. */
export function BackdropShell({ children }: { children: React.ReactNode }) {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 h-svh w-full">
      {children}
    </div>
  )
}
