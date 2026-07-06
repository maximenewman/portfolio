import { Project } from "@/lib/projects"
import { slugify } from "@/lib/posts"

export type ExperienceType = "tech" | "leadership" | "other"

export interface Experience {
  type: ExperienceType
  role: string
  company: string
  date: string
  location: string
  /** One-line summary / signature achievement shown on the timeline. */
  headline: string
  /** Overview paragraph for the detail page (falls back to headline). */
  overview?: string
  /** Hero image for the detail page (e.g. company photo/logo). Falls back to a
   *  branded monogram when absent. Path under /public or a /media URL. */
  heroImage?: string
  projects?: Project[]
  highlights?: string[]
  skills?: string[]
}

/** Stable URL slug for an experience detail page. Role + company keeps
 *  same-titled roles at different companies distinct. */
export function experienceSlug(e: Experience): string {
  return slugify(`${e.role}-${e.company}`)
}

export function getExperienceBySlug(slug: string): Experience | undefined {
  return experiences.find((e) => experienceSlug(e) === slug)
}

export const experiences: Experience[] = [
  {
    type: "tech",
    role: "Research Assistant",
    company: "SFU Cybersecurity",
    date: "May 2026 - Present",
    location: "Burnaby, BC",
    headline:
      "Owning end-to-end runs of an LLM security pipeline across 120 Java projects for a CCS submission.",
    overview:
      "AutoSec reads a Java codebase the way an attacker would: it finds a flaw, proves the flaw is real, then closes it. Four LLM agents — Finder, Exploiter, Patcher, Verifier — run in sequence over LangGraph, and my job is to turn that pipeline from something that works on a good day into something that produces evidence a paper can stand on.",
    highlights: [
      "The pipeline chains four agents. The Finder runs IRIS, an LLM-augmented CodeQL, to surface candidate vulnerabilities. The Exploiter tries to actually trigger them. The Patcher writes a fix, and the Verifier rebuilds the project to confirm the exploit is dead and the existing tests still pass. I own the end-to-end runs across the 120 Java projects in CWE-Bench-Java — the scans, exploits, and patches the evaluation is built on all come out of runs I babysit from start to finish.",
      "The part I find most interesting is watching real threat modelling emerge inside the Exploiter. Instead of trusting a static warning at face value, it's handed read-only tools and a source-to-sink data flow and asked to reason about attack surface: it groups traces that converge on the same sink into distinct flows, tags each program point as source, intermediate, or sink, then writes a proof-of-vulnerability test and runs it in a container against both the vulnerable and the fixed commit. A static finding stops being a guess and becomes something the system has demonstrably triggered.",
      "When I started, a full benchmark run couldn't survive its own startup. I rebuilt the reliability contract so it runs unattended: cached scan results are reused by default, with a fallback that re-extracts a project's source when the working tree has gone missing so the build always has something to compile, plus flags to force a fresh analysis or inject cached stages. I also chased down the quieter failures — shell-quoting the analysis command, sharing one typed output shape across the agents — that were breaking long runs halfway through.",
      "The frontier now is patching. Detection and exploitation have become reliable enough to trust; the Patcher is the harder, less-mature stage, still working under uniform hard-coded constraints, and the next step is teaching it to reason per vulnerability instead. We're writing the whole system up as a manuscript aimed at ACM CCS, with the emphasis on reliability, verification, and auditability — results you can actually re-run.",
    ],
    skills: ["LangGraph", "IRIS", "CodeQL", "SARIF", "Python", "Java", "Static Analysis", "LLM Agents", "Research"],
  },
  {
    type: "tech",
    role: "Data Engineer",
    company: "SKC Engineering Ltd",
    date: "Jan 2026 - May 2026",
    location: "Surrey, BC",
    headline:
      "Classified 15,639 SharePoint files and migrated 29,000+ rows across 87 tables with 100% parity.",
    overview:
      "Two data problems back to back: first turning 15,000 messy SharePoint files into a clean training set, then moving a live database between clouds without losing a single row.",
    projects: [
      {
        title: "SharePoint File Classification Pipeline",
        description: [
          `The ML team needed clean training data, but it was buried in 15,639 SharePoint files with no consistent structure. I built an authenticated PowerShell pipeline through an Azure App Registration to pull every file and sort it into six welding-process categories, and tuned it well enough that 70% needed no human review at all before it went to the team for fine-tuning.`,
          `The part I'm proudest of isn't the classifier — it's the logging. Every run wrote structured CSVs at both the company and the file level, so when something looked wrong you could trace exactly what happened instead of re-running blind. Across the parallel letter-batch runs, that auditability saved an estimated $15,000+ in engineer time.`,
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
          `The other half was moving a live database off legacy Linode MySQL onto managed DigitalOcean — 29,000+ rows across 87 tables — without dropping or duplicating anything. The tables had foreign-key dependencies, so insert order mattered: I wrote a topological sort to resolve them, made the inserts idempotent and batched so a failed run could be retried safely, and validated primary keys symmetrically before and after. Every row was accounted for on both sides — 100% parity.`,
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
    role: "AI/ML Engineer",
    company: "SKC Engineering Ltd",
    date: "Sept 2025 - Jan 2026",
    location: "Surrey, BC",
    headline:
      "Built WeldCost, an AI cost-estimation platform on GPT-4o mini + LangGraph with sub-300ms APIs.",
    overview:
      "Estimating a weld job is a conversation — you gather parameters one piece at a time — and a naive LLM either forgets what you told it or drifts between runs. WeldCost is built to be dependable rather than clever: it turns that back-and-forth into a consistent, auditable estimate.",
    projects: [
      {
        title: "WeldCost - AI-Powered Cost Estimation Platform",
        description: [
          `I built it on GPT-4o mini and LangGraph, but the design goal was trust, not novelty. It routes on intent, runs its tools deterministically, and keeps its state explicit — so the same inputs produce the same estimate, and every output can be traced back to how it was reached.`,
          `Long estimating sessions get expensive because the context keeps growing. I kept input size flat with rolling context windows, automatic summarization, and state-first prompting, which cut inference cost per request by about 20%. To stop the model quietly changing behavior between deployments, I built 50+ LangSmith eval cases with human-in-the-loop interrupts and a regression monitor that flags drift before it ships.`,
          `On the infrastructure side it runs on Fly.io behind Docker multi-stage builds and GitHub Actions CI/CD, with JWT access control and idempotent APIs backing a persistent multi-user workspace. The core authenticated endpoints answer in under 300ms.`,
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
    headline:
      "Optimized CUDA matrix-multiply kernels to 93.7% of cuBLAS and authored a GPU kernel guide.",
    overview:
      "Chasing NVIDIA's own math library on its own hardware — and then writing down how, so the next person doesn't have to start from zero.",
    highlights: [
      "The group's question was why large matrix multiplications dominate the cost of training and running LLMs, and how close you can get to peak hardware by hand. That meant getting underneath attention mechanisms and transformer architectures to the linear algebra that actually eats the compute.",
      "I wrote CUDA kernels for matrix multiply and tuned them against cuBLAS, NVIDIA's own library, landing at 93.7% of its throughput. Getting there meant living in NVIDIA Nsight Compute and reading the profiler instead of guessing, then going all the way down to the PTX assembly to see what the compiler's IR passes were really doing to my code.",
      "The kernels were only half of it. I wrote a read-along guide to GPU matrix-multiply optimization that builds the mental model from the execution hierarchy up — thread blocks, warps, SM scheduling — so someone new to the GPU can follow the reasoning behind each optimization rather than just copy it.",
    ],
    skills: ["CUDA", "GPU Computing", "C/C++", "NVIDIA Nsight Compute", "PTX", "Linear Algebra", "Research"],
  },
  {
    type: "tech",
    role: "Robotics Instructor",
    company: "Zebra Robotics Surrey",
    date: "Jan 2025 - Jun 2025",
    location: "Surrey, BC",
    headline:
      "Taught Python, Arduino, and microcontroller robotics, guiding students to working robot prototypes.",
    overview:
      "Robotics is where code stops being abstract and physically moves a motor. My job was getting students from that first spark — a sensor and a motor finally talking — to a robot that actually works.",
    highlights: [
      "I taught programming and robotics fundamentals through Python, Arduino, and microcontroller labs. The reward was watching a student get a sensor and a motor talking for the first time, then keep going until they had a working prototype in their hands.",
      "I ran projects end to end, from concept and mechanical design through debugging on real hardware. Teams iterated, things broke, we fixed them together — and the robots that came out the other side met their goals and were shown off at a school exhibition.",
    ],
    skills: ["Teaching", "Python", "Microcontrollers", "Arduino", "Robotics", "Curriculum Design"],
  },
  {
    type: "leadership",
    role: "Calculus Teaching Assistant",
    company: "Simon Fraser University",
    date: "Jan 2025 - Apr 2025",
    location: "Burnaby, BC",
    headline: "Led weekly peer-led calculus sessions, fostering collaborative learning and academic growth.",
    overview:
      "The same group of students, every week, all term — which meant I got to watch them grow instead of just answering one-off questions.",
    highlights: [
      "I ran weekly peer-led sessions for a dedicated group of students, working through concepts as a conversation and solving problems together rather than lecturing at a board. Over a term you see the shift from following steps to actually reasoning, which is the whole point.",
      "Teaching a subject is the fastest way to find the gaps in your own understanding. Every time a student asked 'but why', I had to make sure I actually knew — which sharpened my own calculus as much as theirs.",
    ],
    skills: ["Calculus", "Teaching", "Mentoring", "Problem Solving", "Communication"],
  },
  {
    type: "leadership",
    role: "Hive Leader",
    company: "Simon Fraser University",
    date: "Aug 2024 - Sep 2024",
    location: "Burnaby, BC",
    headline: "Led orientation events welcoming and mentoring incoming students.",
    overview:
      "Orientation is a new student's first impression of a huge campus, and I got to help make it a good one.",
    highlights: [
      "I planned and ran welcome events, coordinated with the other Hive Leaders to pull off group activities, and helped incoming students find their footing during a transition that can feel overwhelming.",
      "I also mentored HIVE volunteers who wanted to become leaders themselves, passing on what the role had taught me about reading a room and keeping people engaged.",
    ],
    skills: ["Leadership", "Event Planning", "Mentoring", "Public Speaking", "Team Collaboration"],
  },
  {
    type: "other",
    role: "Recreation Assistant",
    company: "SFU Recreation",
    date: "Apr 2024 - Aug 2024",
    location: "Burnaby, BC",
    headline: "Ran front-desk operations, fitness classes, and an intramural soccer league.",
    overview:
      "A bit of everything that keeps a rec centre running — and a crash course in the fact that most of it comes down to making people feel welcome.",
    highlights: [
      "I worked the front desk handling check-ins, questions, and the small things that keep a day moving, and learned that customer service is really just making sure every person who walks in feels welcome and heard.",
      "I supported fitness instructors with class setup and equipment while keeping sessions running safely, and I helped organize and officiate an intramural soccer league — the scheduling and on-field calls that keep games fun and fair.",
    ],
    skills: ["Customer Service", "Event Coordination", "Communication", "Teamwork", "Organization"],
  },
]
