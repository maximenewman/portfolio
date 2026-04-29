export const metadata = {
  title: "Goblin's Keep",
  description:
    "A pixel-art dungeon crawler built in TypeScript, embedded from a separate repository.",
}

export default function GoblinsKeepPage() {
  return (
    <div className="h-[calc(100dvh-4rem)] w-full bg-[#04040a] md:h-[calc(100dvh-5rem)]">
      <iframe
        src="/goblinskeep/index.html"
        title="Goblin's Keep"
        className="block h-full w-full border-0"
        allow="autoplay; fullscreen"
      />
    </div>
  )
}
