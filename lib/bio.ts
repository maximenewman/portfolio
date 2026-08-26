/**
 * Profile data shared by the hero, the footer and page metadata.
 *
 * Extracted out of `app/components/bio.tsx` so the footer no longer imports a
 * client component just to read a constant.
 *
 * Deliberately excludes the phone number that appears on the resume — this
 * file is rendered into every public page, and a personal number does not
 * belong in crawlable HTML.
 */
export const bio = {
  name: "Maxime Newman Nereyabagabo",
  shortName: "Maxime Newman",
  role: "Software Engineer",
  /** The one-line positioning statement under the name. */
  tagline: "AI security, systems, and the parts of machine learning that touch real hardware.",
  location: "Vancouver, BC",
  email: "maximenewman05@gmail.com",
  education: {
    school: "Simon Fraser University",
    degree: "BSc Computer Science & Statistics",
    graduation: "Expected August 2027",
  },
  picture: "/LinkedInpp.JPG",
  resumePath: "/resume/Maxime_resume.pdf",
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
    `Hello, welcome to my universe. I'm Max, studying Computer Science and Statistics at Simon Fraser University, and most of my time goes to the seam where machine learning meets systems that have to actually hold up — security pipelines, GPU kernels, backends that cannot afford to be slow.`,
    `I don't think there's one purpose to programming. It's a toolbox for complex problems, and generative AI is the tool that has grown fastest. Some people worry about how much we lean on it; I read it as the same move we've always made — we stopped scavenging for food, and now we're clearing away the mundane work so there's more room for the interesting kind. What I care about is building AI into products so that the person using them spends less time fighting the tool.`,
    `Outside of that I'm an athlete. Football, running, hiking, snowboarding. I've played competitively in both FVSL and VMSL Prem, so if your team needs someone, I'm available.`,
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
