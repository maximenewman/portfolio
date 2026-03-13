import { projects } from "./data/projects"
import { ProjectCard } from "./components/project_display"

export default function ProjectsPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          My Projects
        </h1>
        <p className="mt-2 text-muted-foreground">
          A collection of personal and professional projects
        </p>
      </header>

      <main className="grid gap-6 md:grid-cols-2">
        {projects.map((project, index) => (
          <ProjectCard key={index} project={project} />
        ))}
      </main>
    </div>
  )
}
