import { PassionsDisplay } from "./components/passions_display"

export default function PassionsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary py-16 md:py-24">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/5" />
          <div className="absolute -right-32 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-white/5" />
          <div className="absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-white/5" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-primary-foreground md:text-5xl lg:text-6xl">
              My Passions
            </h1>
            <p className="mt-4 text-lg text-primary-foreground/80 md:text-xl">
              Beyond code, these are the pursuits that shape who I am
            </p>
            <div className="mt-6 flex justify-center gap-2">
              <span className="inline-block h-1 w-12 rounded-full bg-primary-foreground/30" />
              <span className="inline-block h-1 w-6 rounded-full bg-primary-foreground/50" />
              <span className="inline-block h-1 w-3 rounded-full bg-primary-foreground/70" />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 md:py-16">
        <PassionsDisplay />
      </main>
    </div>
  )
}
