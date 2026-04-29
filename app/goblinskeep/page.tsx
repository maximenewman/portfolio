import { ExternalLink, Github, Keyboard, Volume2 } from "lucide-react"

export const metadata = {
  title: "Goblin's Keep",
  description:
    "A pixel-art dungeon crawler built in TypeScript, embedded from a separate repository.",
}

const controls: { keys: string[]; label: string }[] = [
  { keys: ["W", "A", "S", "D"], label: "Move" },
  { keys: ["↑", "←", "↓", "→"], label: "Move" },
  { keys: ["M"], label: "Mute" },
]

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex h-7 min-w-[1.75rem] items-center justify-center rounded-md border border-border bg-secondary px-1.5 font-mono text-xs font-semibold text-secondary-foreground shadow-sm">
      {children}
    </kbd>
  )
}

export default function GoblinsKeepPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <header className="border-b border-border bg-card/50 py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-primary">
            Side Quest
          </p>
          <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            Goblin&apos;s Keep
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            A pixel-art dungeon crawler I&apos;ve been building in TypeScript.
            The browser build below is fetched from its own repository at deploy
            time and embedded right here — keyboard recommended.
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-12 md:py-16">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Controls + actions */}
          <div className="flex flex-col gap-4 rounded-xl border border-border bg-card/60 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Keyboard className="h-4 w-4 text-primary" aria-hidden />
                <span>Controls</span>
              </div>
              {controls.map(({ keys, label }, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="flex gap-1">
                    {keys.map((k) => (
                      <Kbd key={k}>{k}</Kbd>
                    ))}
                  </span>
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <a
                href="/goblinskeep/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-hover inline-flex items-center gap-2 rounded-md border border-border bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground hover:bg-muted"
              >
                <ExternalLink className="h-4 w-4" aria-hidden />
                Open fullscreen
              </a>
              <a
                href="https://github.com/maximenewman/GoblinsKeep"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-hover inline-flex items-center gap-2 rounded-md border border-primary/40 bg-primary/10 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/20"
              >
                <Github className="h-4 w-4" aria-hidden />
                Source
              </a>
            </div>
          </div>

          {/* Game frame */}
          <div className="animate-fade-in-up overflow-hidden rounded-2xl border border-border bg-[#04040a] shadow-lg">
            <div className="relative mx-auto aspect-[4/3] w-full max-w-[768px]">
              <iframe
                src="/goblinskeep/index.html"
                title="Goblin's Keep"
                className="absolute inset-0 h-full w-full"
                allow="autoplay; fullscreen"
                loading="lazy"
              />
            </div>
          </div>

          {/* Footnotes */}
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <Volume2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" aria-hidden />
            <p>
              Best played on desktop with a keyboard. Click the canvas first so
              it captures key presses. If the frame is blank, the game build
              isn&apos;t bundled with this deployment — check the{" "}
              <a
                href="https://github.com/maximenewman/GoblinsKeep"
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline text-primary"
              >
                source repo
              </a>{" "}
              instead.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
