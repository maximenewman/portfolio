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
    role: "Data Engineer",
    company: "SKC Engineering Ltd",
    date: "Jan 2026 - May 2026",
    location: "Surrey, BC",
    projects: [
      {
        title: "SharePoint File Classification Pipeline",
        description: [
          `Classified 15,639 SharePoint files into 6 welding-process categories with 70% requiring no manual review by building an authenticated PowerShell pipeline via Azure App Registration, delivering a cleaned dataset to the ML team for fine-tuning.`,
          `Saved an estimated $15,000+ in engineer time by building structured CSV logging with company-level and file-level outcomes, enabling full auditability and data quality tracking across parallel letter-batch migration runs.`,
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
      {
        title: "Linode → DigitalOcean MySQL Migration",
        description: [
          `Migrated 29,000+ rows across 87 tables from legacy Linode MySQL to managed DigitalOcean MySQL with 100% parity by engineering a topological-sort foreign-key resolver, idempotent batched inserts, and symmetric pre/post-migration primary-key validation.`,
        ],
        tech: [
          "MySQL",
          "Python",
          "Linode",
          "DigitalOcean",
        ],
        link: "",
      },
    ],
  },
  {
    type: "tech",
    role: "AI Engineer",
    company: "SKC Engineering Ltd",
    date: "Sept 2025 - Jan 2026",
    location: "Surrey, BC",
    projects: [
      {
        title: "WeldCost - AI-Powered Cost Estimation Platform",
        description: [
          `Built a full-stack AI-powered cost estimation platform with GPT-4o mini and LangGraph, using intent-based routing, deterministic tool execution, and structured state management to deliver consistent, auditable outputs.`,
          `Cut LLM inference cost per request by 20% by stabilizing input size across long parameter-gathering sessions through rolling context windows, automatic summarization, and state-first prompting.`,
          `Improved model consistency across deployments with 50+ LangSmith eval cases, using human-in-the-loop interrupts and a regression monitoring pipeline to detect behavioral drift.`,
          `Achieved sub-300 ms API response times for core authenticated endpoints by deploying to Fly.io using Docker multi-stage builds, GitHub Actions CI/CD, JWT-based access control, and idempotent APIs supporting a persistent multi-user workspace.`,
        ],
        tech: [
          "Next.js",
          "FastAPI",
          "LangGraph",
          "GPT-4o mini",
          "Supabase Postgres",
          "Fly.io",
          "Docker",
          "GitHub Actions",
          "LangSmith",
        ],
        link: "",
      },
    ],
  },
  {
    type: "tech",
    role: "Research Assistant",
    company: "SFU CS ARCH Group",
    date: "Jan 2025 - Present",
    location: "Burnaby, BC",
    highlights: [
      "Researched attention mechanisms and transformer architectures, focusing on how large-scale matrix multiplications dominate training and inference of LLMs.",
      "Authored a 'read-along guide' on GPU-accelerated matrix multiplication kernel optimizations in CUDA, outlining concepts based on GPU multi-threading and execution models (thread blocks, warps, SM scheduling).",
      "Leveraged CUDA programming to design kernels in Linux environments, achieving 93.7% of cuBLAS using NVIDIA Nsight Compute (NCU) for analysis. Inspected PTX assembly output to further unravel optimizations, understanding IR passes done by the compiler itself.",
    ],
    skills: ["CUDA", "GPU Computing", "C/C++", "NVIDIA Nsight Compute", "PTX", "Linear Algebra", "Research"],
  },
  {
    type: "tech",
    role: "Robotics Instructor",
    company: "Zebra Robotics Surrey",
    date: "Jan 2025 - Jun 2025",
    location: "Surrey, BC",
    highlights: [
      "Taught programming and robotics fundamentals using Python, Arduino, and microcontroller labs, enabling students to successfully program motors and sensors and complete functional robot prototypes.",
      "Led student robotics projects from concept design through testing, guiding teams in mechanical iteration and debugging with programmable hardware, resulting in completed robots that met project goals and were showcased in a school exhibition.",
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
