import { projects } from "./data/projects"
import { ProjectCard } from "./components/project_display"

export default function ProjectsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <header className="border-b border-border bg-card/50 py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-primary">
            My Work
          </p>
          <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            Projects & Creations
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            A showcase of personal and professional projects spanning web development, 
            machine learning, and embedded systems.
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-12 md:py-16">
        <div className="stagger-children grid gap-6 md:grid-cols-2">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>
      </main>
    </div>
  )
}
