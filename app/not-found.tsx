import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Container } from "./components/page-shell"

export default function NotFound() {
  return (
    <Container className="flex min-h-[60svh] flex-col justify-center py-[clamp(4rem,12vw,8rem)]">
      <p className="font-mono text-eyebrow uppercase text-primary">Not found</p>
      <h1 className="mt-6 font-display text-display text-foreground">404</h1>
      <p className="mt-6 max-w-[30ch] font-serif text-deck text-pretty text-muted-foreground">
        This page was never set in type — or it has since been taken out of print.
      </p>
      <div className="mt-10 border-t border-border/70 pt-6">
        <Link
          href="/"
          className="btn-hover inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 font-mono text-eyebrow uppercase text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to home
        </Link>
      </div>
    </Container>
  )
}
