import { Project } from "@/app/projects/data/projects"

export type ExperienceType = "tech" | "leadership" | "other"

export interface Experience {
  type: ExperienceType
  role: string
  company: string
  date: string
  location: string
  projects?: Project[]
  highlights?: string[]
  skills?: string[]
}

export const experiences: Experience[] = [
  {
    type: "tech",
    role: "AI Engineering Co-op",
    company: "SKC Engineering Ltd",
    date: "May 2025 - Present",
    location: "Surrey, BC",
    projects: [
      {
        title: "WeldCost - AI-Powered Cost Estimation Platform",
        description: [
          `Built a full-stack welding cost calculator with a conversational AI chatbot using Next.js, FastAPI, and LangGraph, replacing a stateless print-only tool with a persistent, multi-user workspace.`,
          `Designed an agentic workflow that separates intent classification from deterministic cost math, with human-in-the-loop interrupts and Pydantic-validated structured outputs to keep calculations correct and auditable.`,
          `Implemented full persistence using Supabase Postgres for conversation threads, saved welds, and projects, enabling users to revisit estimates and organize work by job or quote.`,
          `Deployed to Fly.io via Docker multi-stage builds and GitHub Actions CI/CD, with JWT auth, idempotent API endpoints, and a LangSmith evaluation suite for regression monitoring.`,
        ],
        tech: [
          "Next.js",
          "FastAPI",
          "LangGraph",
          "Supabase Postgres",
          "Fly.io",
          "Docker",
          "GitHub Actions",
          "LangSmith",
        ],
        link: "",
      },
      {
        title: "SharePoint Migration Pipeline",
        description: [
          `Eliminated months of manual file-handling delays by automating the migration of 15,639 historical welding-procedure files from SharePoint, saving an estimated $15,000+ in engineer time at prevailing BC welder rates.`,
          `Built an authenticated PowerShell pipeline via Azure App Registration and a Python decision engine using regex-based path exclusions, filename allowlists, duplicate detection, and a depth-first search over a nested regex lookup table to classify and route each file automatically.`,
          `Implemented CSV logging that tracks company-level and file-level outcomes, enabling full auditability and iterative improvement across migration runs.`,
        ],
        tech: [
          "PowerShell",
          "Azure App Registration",
          "Python",
          "Regex",
          "CSV",
        ],
        link: "",
      },
    ],
  },
  {
    type: "tech",
    role: "Undergraduate Research Assistant",
    company: "SFU CS ARCH Group",
    date: "Jun 2025 - Sep 2025",
    location: "Burnaby, BC",
    highlights: [
      "Achieved 93% of cuBLAS performance by engineering a GPU-accelerated matrix multiplication kernel using CUDA, applying tiling, shared memory optimization, and coalesced memory access patterns.",
      "Identified key bottlenecks in sparse and dense matrix operations through systematic performance profiling, proposing optimization strategies that informed the team's kernel design decisions.",
      "Validated computational physics models by collaborating on ThunderKittens simulation accuracy, ensuring correctness of GPU-accelerated numerical methods.",
    ],
    skills: ["CUDA", "GPU Computing", "C/C++", "Performance Profiling", "Linear Algebra", "Research"],
  },
  {
    type: "tech",
    role: "Robotics Instructor",
    company: "Zebra Robotics Surrey",
    date: "Jan 2025 - Jun 2025",
    location: "Surrey, BC",
    highlights: [
      "Taught students the fundamentals of programming, introducing key concepts through engaging, hands-on lessons.",
      "Programmed microcontroller-based systems with students to control motors, sensors, and inputs.",
      "Led robotics projects where students designed, tested, and iterated on mechanical models.",
    ],
    skills: ["Teaching", "Python", "Microcontrollers", "Arduino", "Robotics", "Curriculum Design"],
  },
  {
    type: "leadership",
    role: "Calculus Teaching Assistant",
    company: "Simon Fraser University",
    date: "Jan 2025 - Apr 2025",
    location: "Burnaby, BC",
    highlights: [
      "Led weekly peer-led sessions for a dedicated group of students, fostering collaborative learning and long-term academic growth.",
      "Explained key concepts through interactive discussions and guided problem-solving sessions.",
      "Reinforced personal mastery of calculus through teaching, feedback, and real-time troubleshooting.",
    ],
    skills: ["Calculus", "Teaching", "Mentoring", "Problem Solving", "Communication"],
  },
  {
    type: "leadership",
    role: "Hive Leader",
    company: "Simon Fraser University",
    date: "Aug 2024 - Sep 2024",
    location: "Burnaby, BC",
    highlights: [
      "Organized and led events to welcome and engage new students.",
      "Collaborated with other Hive Leaders to plan and execute group activities.",
      "Supported and mentored HIVE volunteers aspiring to become Hive Leaders.",
      "Led orientation sessions, ensuring new students had a smooth transition.",
    ],
    skills: ["Leadership", "Event Planning", "Mentoring", "Public Speaking", "Team Collaboration"],
  },
  {
    type: "other",
    role: "Recreation Assistant",
    company: "SFU Recreation",
    date: "Apr 2024 - Aug 2024",
    location: "Burnaby, BC",
    highlights: [
      "Front Desk Reception: Managed check-ins, answered inquiries, and kept daily operations running smoothly.",
      "Customer Service: Built relationships with clients, addressed concerns, and made sure every member felt welcomed.",
      "Fitness Class Assistant: Supported instructors with class setup and equipment while keeping participants motivated and sessions running safely.",
      "Intramural Soccer League Assistant: Helped organize and run a soccer league — handling scheduling, officiating, and ensuring games ran smoothly.",
    ],
    skills: ["Customer Service", "Event Coordination", "Communication", "Teamwork", "Organization"],
  },
]
