/**
 * Profile data shared by the hero, the footer and page metadata.
 *
 * Extracted out of `app/components/bio.tsx` so the footer no longer imports a
 * client component just to read a constant.
 *
 * Deliberately excludes the phone number from the resume: this file is
 * rendered into every public page, and a personal number does not belong in
 * crawlable HTML. The resume itself is no longer served from the site at all.
 */
export const bio = {
  name: "Maxime Newman Nereyabagabo",
  shortName: "Maxime Newman",
  role: "Software Engineer",
  /** The one-line positioning statement under the name. */
  tagline: "I work on AI security, backends, and GPU performance.",
  location: "Vancouver, BC",
  email: "maximenewman05@gmail.com",
  education: {
    school: "Simon Fraser University",
    degree: "BSc Computer Science & Statistics",
    graduation: "Expected August 2027",
  },
  picture: "/IMG_4311.jpg",
  socials: {
    github: "https://github.com/maximenewman",
    linkedin: "https://www.linkedin.com/in/maxime-newman-nereyabagabo-a546b42b5/",
    instagram: "https://www.instagram.com/tungsten_gains/",
    youtube: "https://www.youtube.com/@yvngg_max",
    tiktok: "https://www.tiktok.com/@yvngg_max",
  },
  /**
   * The "about" prose. Kept in the author's own voice — this is the one place
   * on the site that is not resume-speak, and it should stay that way.
   */
  about: [
    `Hello, welcome to my universe. I'm Max. I study Computer Science and Statistics at Simon Fraser University. Most of my time goes into security pipelines, GPU kernels, and backends that need to be fast.`,
    `I don't think programming has one purpose. It's a toolbox for hard problems, and generative AI is the newest tool in it. Some people worry about how much we lean on it. I see it as progress. We automate the boring work to make room for the interesting work. I like building AI into products so people spend less time fighting their tools.`,
    `Outside of that I'm an athlete. Football, running, hiking, snowboarding. I've played competitively in the FVSL and VMSL Prem, so if your team needs a player, I'm available.`,
  ],
  /** Grouped from the resume's Technical Skills section. */
  skills: {
    Languages: ["Python", "Java", "C++", "TypeScript", "JavaScript", "SQL", "Bash"],
    "Frameworks & Backend": ["React", "Next.js", "FastAPI", "Django", "REST", "gRPC"],
    "AI / ML": [
      "LangGraph",
      "Multi-Agent Workflows",
      "RAG",
      "Anthropic",
      "Scikit-learn",
      "Pandas",
      "NumPy",
      "LangSmith",
    ],
    "Cloud & DevOps": ["Docker", "AWS", "Azure", "GCP", "GitHub Actions", "CI/CD", "Redis"],
    Databases: ["PostgreSQL", "MySQL", "MongoDB"],
    "Testing & Performance": ["Pytest", "JUnit", "Mockito", "CUDA", "Multithreading", "TSan/ASan/UBSan"],
    Other: ["Git", "Linux", "PowerShell", "CodeQL", "MCP"],
  },
} as const
