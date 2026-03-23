import { ExperiencesList } from "./components/display_experiences"

export default function ExperiencesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <header className="border-b border-border bg-card/50 py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-primary">
            My Journey
          </p>
          <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            Professional Experiences
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            A timeline of my professional growth, from teaching and leadership roles 
            to hands-on technical experience in robotics and software development.
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-12 md:py-16">
        <ExperiencesList />
      </main>
    </div>
  )
}
