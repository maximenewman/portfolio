export interface PassionMediaLink {
  label: string
  url: string
}

export interface Passion {
  id: string
  title: string
  description: string
  icon: string
  color: string
  hoverColor: string
  details: string[]
  media?: PassionMediaLink[]
  images?: string[]
}

export const passions: Passion[] = [
  {
    id: "football",
    title: "Football (Soccer)",
    description: "Football has been part of my life for as long as I can remember — it's more than a sport; it's an escape and a unifying force.",
    icon: "football",
    color: "bg-gradient-to-br from-green-600 to-green-800",
    hoverColor: "hover:from-green-500 hover:to-green-700",
    details: [
      "Football has been part of my life for as long as I can remember — it's more than a sport; it's an escape and a unifying force.",
      "Competitively, I've played for FVSL and VMSL Premier teams over the last two seasons.",
      "Beyond that, I've captained intramural futsal and outdoor football sides, leading both to championship wins — two titles and counting.",
    ],
    images: [
      "/portfolio/football/IMG_0682.JPG.jpeg",
      "/portfolio/football/IMG_0683.JPG.jpeg",
      "/portfolio/football/IMG_2485.JPG.jpeg",
      "/portfolio/football/IMG_2488.JPG.jpeg",
    ],
  },
  {
    id: "chess",
    title: "Chess",
    description: "Chess, for me, is a game of intuition as much as strategy.",
    icon: "chess",
    color: "bg-gradient-to-br from-amber-700 to-amber-900",
    hoverColor: "hover:from-amber-600 hover:to-amber-800",
    details: [
      "Chess, for me, is a game of intuition as much as strategy. When time is against you, calculation alone isn't enough — you have to feel the position.",
      "I'm always up for a game (play me if you want to lose).",
    ],
    media: [
      { label: "Play me on Chess.com", url: "https://www.chess.com/member/hunchom99" },
    ],
    images: [
      "/portfolio/chess/IMG_2095.jpg",
      "/portfolio/chess/IMG_2098.jpg",
    ],
  },
  {
    id: "reading",
    title: "Reading",
    description: "Books let you train your mind and travel anywhere — back in time, into space, across entirely different worlds.",
    icon: "book",
    color: "bg-gradient-to-br from-blue-700 to-blue-900",
    hoverColor: "hover:from-blue-600 hover:to-blue-800",
    details: [
      '"The first and greatest victory is to conquer yourself." — Plato',
      "Books let you train your mind and travel anywhere — back in time, into space, across entirely different worlds. Every book has something to offer.",
      "Lately I've found deep wisdom in the Stoics — Epictetus, Marcus Aurelius, Seneca — whose ideas feel especially relevant in a world that constantly tempts us to seek external validation. True fulfilment, I've come to believe, only comes from within.",
      "A few books I'd recommend:",
      "The Art of War — Sun Tzu",
      "Meditations — Marcus Aurelius",
      "Letters of a Stoic — Seneca",
      "Discourses — Epictetus",
    ],
    images: [
      "/portfolio/reading/IMG_0227.jpg",
      "/portfolio/reading/IMG_0229.jpg",
      "/portfolio/reading/IMG_0242.jpg",
    ],
  },
  {
    id: "motivational-speaking",
    title: "Motivational Speaking",
    description: "Through personal stories, I speak on mental health, fitness, resilience, and finding your way.",
    icon: "mic",
    color: "bg-gradient-to-br from-purple-700 to-purple-900",
    hoverColor: "hover:from-purple-600 hover:to-purple-800",
    details: [
      "I've been fortunate to have had mentors who gave me wisdom early — people who helped me navigate life's pitfalls before I stumbled into them. Now I pay it forward.",
      "Through personal stories and — with permission — the experiences of others, I speak on mental health, fitness, resilience, and finding your way.",
      "My goal is simple: help people see that a better version of themselves is possible.",
    ],
    media: [
      { label: "YouTube", url: "https://www.youtube.com/@yvngg_max" },
      { label: "Instagram", url: "https://www.instagram.com/tungsten_gains/" },
      { label: "TikTok", url: "https://www.tiktok.com/@yvngg_max" },
    ],
    images: [
      "/portfolio/motivational speaking/happiness.png",
    ],
  },
  {
    id: "running",
    title: "Running",
    description: "Running is my daily reset.",
    icon: "running",
    color: "bg-gradient-to-br from-orange-600 to-orange-800",
    hoverColor: "hover:from-orange-500 hover:to-orange-700",
    details: [
      "Running is my daily reset. They say it's Vancouver's biggest addiction — I can confirm that's true.",
    ],
    images: [
      "/portfolio/running/IMG_8814.JPG.jpeg",
      "/portfolio/running/IMG_8815.JPG.jpeg",
      "/portfolio/running/IMG_8819.JPG.jpeg",
    ],
  },
  {
    id: "hiking",
    title: "Hiking",
    description: "Everything is digital, but nature never loses its beauty.",
    icon: "mountain",
    color: "bg-gradient-to-br from-teal-700 to-teal-900",
    hoverColor: "hover:from-teal-600 hover:to-teal-800",
    details: [
      "Everything is digital, but nature never loses its beauty.",
      "I've been lucky enough to take in some truly breathtaking views on the trails, and I try never to take that for granted.",
    ],
    images: [
      "/portfolio/hiking/IMG_6551.jpg",
      "/portfolio/hiking/IMG_6668.jpg",
      "/portfolio/hiking/IMG_6935.jpg",
    ],
  },
]
