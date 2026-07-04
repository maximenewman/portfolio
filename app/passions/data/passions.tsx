export interface PassionMediaLink {
  label: string
  url: string
}

export interface PassionTimelineEntry {
  /** When this update happened, e.g. "Jul 2026". */
  date: string
  /** What was added / achieved in this update. */
  items: string[]
}

export interface Passion {
  id: string
  title: string
  description: string
  icon: string
  details: string[]
  media?: PassionMediaLink[]
  images?: string[]
  imageAlts?: string[]
  videoEmbed?: string
  /** Milestone log in chronological order (oldest first). Rendered as a timeline in the modal. */
  timeline?: PassionTimelineEntry[]
  /** Crop anchor for images. "top" keeps heads in frame for tall action shots. Defaults to center. */
  imagePosition?: "top" | "center"
}

export const passions: Passion[] = [
  {
    id: "football",
    title: "Football (Soccer)",
    description: "Football has been part of my life for as long as I can remember - it's more than a sport; it's an escape and a unifying force.",
    icon: "football",
    details: [
      "Football has been part of my life for as long as I can remember - it's more than a sport; it's an escape and a unifying force.",
      "Competitively, I've played for FVSL and VMSL Premier teams, and I now captain my church team in the BCCSL - where I was named Man of the Match twice this season.",
      "I'm a 4x intramural champion (1x Co-ed and 3x Division 1), having captained both futsal and outdoor sides to the title.",
      "Most recently, I was named MVP of the 2026 BCMSA tournament.",
    ],
    images: [
      "/portfolio/football/IMG_0682.JPG.jpeg",
      "/portfolio/football/IMG_0683.JPG.jpeg",
      "/portfolio/football/IMG_2485.JPG.jpeg",
      "/portfolio/football/IMG_2488.JPG.jpeg",
      "/portfolio/football/IMG_2584.JPG.jpeg",
      "/portfolio/football/IMG_1184.jpeg",
      "/portfolio/football/IMG_8511.jpeg",
      "/portfolio/football/IMG_8537.jpeg",
    ],
    imageAlts: [
      "Maxime dribbling down the wing",
      "Maxime dribbling past the goalkeeper",
      "Maxime and his team, Futsal champions",
      "Maxime with the Futsal trophy",
      "football",
      "football",
      "football",
      "football",
    ],
  },
  {
    id: "chess",
    title: "Chess",
    description: "Chess, for me, is a game of intuition as much as strategy.",
    icon: "chess",
    details: [
      "Chess, for me, is a game of intuition as much as strategy. When time is against you, calculation alone isn't enough - you have to feel the position.",
      "I'm always up for a game (play me if you want to lose).",
    ],
    media: [
      { label: "Play me on Chess.com", url: "https://www.chess.com/member/hunchom99" },
    ],
    images: [
      "/portfolio/chess/IMG_2095.jpg",
      "/portfolio/chess/IMG_2098.jpg",
    ],
    imageAlts: [
      "Maxime deep in thought while playing chess",
      "Maxime's opponent making a move during their chess game",
    ],
  },
  {
    id: "reading",
    title: "Reading",
    description: "Books let you train your mind and travel anywhere - back in time, into space, across entirely different worlds.",
    icon: "book",
    details: [
      '"The first and greatest victory is to conquer yourself." - Plato',
      "Books let you train your mind and travel anywhere - back in time, into space, across entirely different worlds. Every book has something to offer.",
      "Lately I've found deep wisdom in the Stoics - Epictetus, Marcus Aurelius, Seneca - whose ideas feel especially relevant in a world that constantly tempts us to seek external validation. True fulfilment, I've come to believe, only comes from within.",
      "A few books I'd recommend: The Art of War (Sun Tzu), Meditations (Marcus Aurelius), Letters of a Stoic (Seneca), Discourses (Epictetus).",
    ],
    images: [
      "/portfolio/reading/IMG_0242.jpg",
    ],
    imageAlts: [
      "Maxime reading Meditations by Marcus Aurelius",
    ],
  },
  {
    id: "motivational-speaking",
    title: "Motivational Speaking",
    description: "Through personal stories, I speak on mental health, fitness, resilience, and finding your way.",
    icon: "mic",
    details: [
      "I've been fortunate to have had mentors who gave me wisdom early - people who helped me navigate life's pitfalls before I stumbled into them. Now I pay it forward.",
      "Through personal stories and - with permission - the experiences of others, I speak on mental health, fitness, resilience, and finding your way.",
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
    imageAlts: [
      "Maxime speaking on happiness",
    ],
    videoEmbed: "https://www.tiktok.com/embed/v2/7595900361513176340",
  },
  {
    id: "running",
    title: "Running",
    description: "Running is my daily reset.",
    icon: "running",
    imagePosition: "top",
    details: [
      "Running is my daily reset. They say it's Vancouver's biggest addiction - I can confirm that's true.",
    ],
    timeline: [
      {
        date: "Oct 2025",
        items: ["Ran my first full marathon (42.2 km)"],
      },
      {
        date: "Feb 2026",
        items: ["Ran my first official half marathon (21.1 km)"],
      },
      {
        date: "May 2026",
        items: ["Ran my second full marathon (42.2 km)"],
      },
      {
        date: "Jun 2026",
        items: ["Ran my second official half marathon (21.1 km)"],
      },
    ],
    images: [
      "/portfolio/running/IMG_8814.JPG.jpeg",
      "/portfolio/running/IMG_8815.JPG.jpeg",
      "/portfolio/running/IMG_8819.JPG.jpeg",
      "/portfolio/running/IMG_0787.JPG.jpeg",
      "/portfolio/running/IMG_0788.JPG.jpeg",
      "/portfolio/running/IMG_0789.JPG.jpeg",
      "/portfolio/running/IMG_0790.JPG.jpeg",
      "/portfolio/running/IMG_0791.JPG.jpeg",
      "/portfolio/running/IMG_1957.JPG.jpeg",
      "/portfolio/running/IMG_1958.JPG.jpeg",
      "/portfolio/running/IMG_1959.JPG.jpeg",
      "/portfolio/running/IMG_1960.JPG.jpeg",
      "/portfolio/running/IMG_1961.JPG.jpeg",
      "/portfolio/running/IMG_1962.JPG.jpeg",
      "/portfolio/running/IMG_1963.JPG.jpeg",
    ],
    imageAlts: [
      "Maxime running a marathon",
      "Maxime running a marathon",
      "Maxime running a marathon",
      "running",
      "running",
      "running",
      "running",
      "running",
      "running",
      "running",
      "running",
      "running",
      "running",
      "running",
      "running",
    ],
  },
  {
    id: "hiking",
    title: "Hiking",
    description: "Everything is digital, but nature never loses its beauty.",
    icon: "mountain",
    details: [
      "Everything is digital, but nature never loses its beauty.",
      "I've been lucky enough to take in some truly breathtaking views on the trails, and I try never to take that for granted.",
    ],
    images: [
      "/portfolio/hiking/IMG_6930.jpg",
      "/portfolio/hiking/IMG_6935.jpg",
      "/portfolio/hiking/IMG_6668.jpg",
      "/portfolio/hiking/IMG_6551.jpg",
    ],
    imageAlts: [
      "Maxime hiking in Chief Squamish",
      "Maxime hiking in Chief Squamish",
      "Maxime hiking on Grouse Mountain, overlooking the city",
      "Maxime in front of a waterfall",
    ],
  },
]
