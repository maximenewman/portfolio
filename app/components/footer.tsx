"use client"

import Link from "next/link"
import { bioData } from "./bio"
import { Github, Linkedin, Mail, FileText } from "lucide-react"

export default function Footer() {
  const resumePath = "/Maxime_Resume.pdf"

  return (
    <footer className="border-t border-border bg-muted/50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Site Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Site
            </h3>
            <nav className="flex flex-col gap-2">
              <Link
                href="/experiences"
                className="text-sm transition-colors hover:text-primary"
              >
                Experiences
              </Link>
              <Link
                href="/projects"
                className="text-sm transition-colors hover:text-primary"
              >
                Projects
              </Link>
              <Link
                href="/passions"
                className="text-sm transition-colors hover:text-primary"
              >
                Passions
              </Link>
            </nav>
          </div>

          {/* Socials */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Socials
            </h3>
            <nav className="flex flex-col gap-2">
              <a
                href="https://github.com/maximenewman"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm transition-colors hover:text-primary"
              >
                <Github className="h-4 w-4" />
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/maxime-newman-a546b42b5"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm transition-colors hover:text-primary"
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </a>
              <a
                href={`mailto:${bioData.email}`}
                className="flex items-center gap-2 text-sm transition-colors hover:text-primary"
              >
                <Mail className="h-4 w-4" />
                Email
              </a>
            </nav>
          </div>

          {/* Resume */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Resume
            </h3>
            <button
              onClick={() => window.open(resumePath, "_blank", "noopener,noreferrer")}
              className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
            >
              <FileText className="h-4 w-4" />
              View Resume
            </button>
          </div>
        </div>

        <hr className="my-6 border-border" />

        <p className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Maxime Newman Nereyabagabo. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
