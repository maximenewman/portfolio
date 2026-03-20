import { ExperiencesList } from "./components/display_experiences"

export default function ExperiencesPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          My Experiences
        </h1>
        <p className="mt-2 text-muted-foreground">
          Professional experience and work history
        </p>
      </header>

      <main>
        <ExperiencesList />
      </main>
    </div>
  )
}
