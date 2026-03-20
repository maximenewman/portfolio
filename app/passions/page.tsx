import { PassionsDisplay } from "./components/passions_display"

export default function PassionsPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          My Passions
        </h1>
        <p className="mt-2 text-muted-foreground">
          Beyond code, these are the pursuits that shape who I am
        </p>
      </header>
      <main>
        <PassionsDisplay />
      </main>
    </div>
  )
}
