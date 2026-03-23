"use client"

import Link from "next/link"
import { ChevronUp, ChevronDown } from "lucide-react"

// Define the page order for navigation
const pageOrder = [
  { path: "/", label: "Home" },
  { path: "/experiences", label: "Experiences" },
  { path: "/projects", label: "Projects" },
  { path: "/passions", label: "Passions" },
]

interface PageNavigationProps {
  currentPath: string
}

export default function PageNavigation({ currentPath }: PageNavigationProps) {
  const currentIndex = pageOrder.findIndex((page) => page.path === currentPath)
  const prevPage = currentIndex > 0 ? pageOrder[currentIndex - 1] : null
  const nextPage = currentIndex < pageOrder.length - 1 ? pageOrder[currentIndex + 1] : null

  return (
    <div className="fixed bottom-8 right-8 z-40 flex flex-col gap-2">
      {/* Up arrow - previous page */}
      {prevPage && (
        <Link
          href={prevPage.path}
          className="group flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card/90 text-muted-foreground shadow-lg backdrop-blur-sm transition-all hover:border-primary hover:bg-card hover:text-primary hover:shadow-xl"
          aria-label={`Go to ${prevPage.label}`}
        >
          <ChevronUp className="h-6 w-6 transition-transform group-hover:-translate-y-0.5" />
        </Link>
      )}

      {/* Down arrow - next page */}
      {nextPage && (
        <Link
          href={nextPage.path}
          className="group flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card/90 text-muted-foreground shadow-lg backdrop-blur-sm transition-all hover:border-primary hover:bg-card hover:text-primary hover:shadow-xl"
          aria-label={`Go to ${nextPage.label}`}
        >
          <ChevronDown className="h-6 w-6 transition-transform group-hover:translate-y-0.5" />
        </Link>
      )}
    </div>
  )
}
