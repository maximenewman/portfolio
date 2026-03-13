import { Project } from "@/app/projects/data/projects"

export interface Experience {
  role: string
  company: string
  date: string
  location: string
  projects: Project[]
}

export const experiences: Experience[] = [
  {
    role: "AI Engineering Co-op",
    company: "SKC Engineering Ltd",
    date: "Sept 2025 - Present",
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
]
