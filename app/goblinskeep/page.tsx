import GameFrame from "./components/game-frame"

export const metadata = {
  title: "Goblin's Keep",
  description:
    "A pixel-art dungeon crawler built in TypeScript, embedded from a separate repository.",
}

export default function GoblinsKeepPage() {
  return <GameFrame />
}
