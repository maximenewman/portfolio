"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { Menu, X, Sun, Moon } from "lucide-react"
import { useTheme } from "./theme-provider"

const pageRoutes = [
  { name: "Home", link: "/" },
  { name: "Experiences", link: "/experiences" },
  { name: "Projects", link: "/projects" },
  { name: "Passions", link: "/passions" },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { theme, toggleTheme, mounted } = useTheme()

  const isActive = (link: string) => {
    if (link === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(link)
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-card/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center md:h-20">
          {/* Logo - Far Left with circle border */}
          <Link 
            href="/" 
            className="mr-auto flex items-center transition-transform hover:scale-105"
          >
            <div className="rounded-full border-2 border-primary/30 p-1 transition-colors hover:border-primary/60">
              <Image
                src="/logo.png"
                alt="Logo of Maxime"
                width={64}
                height={64}
                className="h-10 w-10 rounded-full md:h-12 md:w-12"
              />
            </div>
          </Link>

          {/* Desktop Navigation - Centered */}
          <ul className="absolute left-1/2 hidden -translate-x-1/2 gap-1 md:flex">
            {pageRoutes.map((page) => (
              <li key={page.link}>
                <Link
                  href={page.link}
                  className={`relative rounded-md px-4 py-2 text-sm font-medium transition-all ${
                    isActive(page.link)
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {page.name}
                  {/* Active indicator */}
                  {isActive(page.link) && (
                    <span className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-primary" />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right side - Theme toggle */}
          <div className="flex items-center gap-2">
            {mounted && (
              <button
                onClick={toggleTheme}
                className="btn-hover rounded-full p-2.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              >
                {theme === "light" ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setOpen(!open)}
              className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
              aria-label="Toggle menu"
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {open && (
          <div className="animate-fade-in border-t border-border pb-4 md:hidden">
            <nav className="flex flex-col gap-1 pt-4">
              {pageRoutes.map((page) => (
                <Link
                  key={page.link}
                  href={page.link}
                  onClick={() => setOpen(false)}
                  className={`rounded-md px-4 py-3 text-sm font-medium transition-colors ${
                    isActive(page.link)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {page.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </nav>
  )
}
