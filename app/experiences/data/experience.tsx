import { project } from "@/app/projects/data/projects"

export interface experience{
    role: string
    company: string
    date: string
    location: string
    projects: project[]
}

export const experiences: experience[] = [
    {
        role: "AI Engineer",
        company: "SKC Engineering",
        date: "Sept 2025 - Present",
        location: "Surrey, BC",
        projects: [
            {
                title: "Weldcost Estimation Tool",
                description: [
                    ` Engineered a full-stack cost estimation platform with a Next.js frontend and Python FastAPI
                    backend, enabling engineers to generate precise weld cost reports directly in-browser.`,
                    ` Designed and implemented RESTful APIs using FastAPI to manage weld calculations,
                    threads, and workflow state, enforcing structured request/response contracts and scalable ser
                    vice boundaries.`,
                    `Orchestrated LLM-driven workflows with LangGraphbyequipping agents with domain-specific
                    tools, ensuring deterministic calculations and controlled state transitions.`,
                    `Optimized token usage by summarizing long conversational context prior to main LLM invoca
                    tion, reducing token consumption by 40% and improving response latency.`,
                    `Validated API inputs and agent state transitions using Pydantic, preventing malformed re
                    quests and improving overall system robustness.`,
                    ` Improved observability and developer velocity by integrating LangSmith for end-to-end tracing
                    and debugging of LLM workflows prior to production deployment.`,
                    ` Implemented automated testing with Pytest and continuous integration via GitHub Actions,
                    ensuring correctness and stability across feature branches before merging.`,
                    `Integrated Redis as a high-performance caching layer to accelerate repeated cost-estimation
                    lookups, reducing latency and unnecessary recomputation.`
                ],
                tech: [
                    "Next.js",
                    "Python FastAPI",
                    "LangGraph, Langchain, Langsmith",
                    "PostgreSQL"
                ],
                link: ""
            },
            {
                title: "Migration Script",
                description: [
                    ` Automated the migration and organization of 15,639 historical welding-procedure files from
                    SharePoint to support fine-tuning of an internal ML model.`,
                    `Developed a PowerShell-based migration pipeline authenticated via Azure App Registration,
                    enabling secure, programmatic access to SharePoint resources at scale.`,
                    ` Implemented CSV-based logging and verification to track all processed files, enabling auditabil
                    ity, error detection, and iterative improvements to the migration workflow.`
                ],
                tech: [
                    "Azure App",
                    "PnP PowerShell"
                ],
                link: ""
            },
        ]
    }
]

