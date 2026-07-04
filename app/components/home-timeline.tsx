"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowRight, Briefcase, MapPin } from "lucide-react"
import { experiences, type Experience } from "@/app/experiences/data/experience"

const typeLabels: Record<Experience["type"], string> = {
  tech: "Engineering",
  leadership: "Leadership",
  other: "Community",
}

/** Flatten an experience into the bullet points + skill tags shown on the timeline. */
function summarize(experience: Experience) {
  const points =
    experience.highlights ??
    experience.projects?.flatMap((project) => project.description) ??
    []

  const skills =
    experience.skills ??
    Array.from(
      new Set(experience.projects?.flatMap((project) => project.tech) ?? [])
    )

  return { points, skills }
}

export default function HomeTimeline() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const nodes = rootRef.current?.querySelectorAll<HTMLElement>(".reveal")
    if (!nodes || nodes.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible")
            observer.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    )

    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="journey"
      ref={rootRef}
      className="border-t border-border bg-card/30"
    >
      <div className="container mx-auto px-4 py-16 md:py-24">
        {/* Section header */}
        <div className="reveal mx-auto mb-14 max-w-2xl text-center md:mb-20">
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-primary">
            Experience
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
            My Journey So Far
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            Scroll through the roles that shaped me — from research labs and
            engineering teams to teaching and community leadership.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative mx-auto max-w-3xl">
          {/* Vertical rail */}
          <div className="timeline-rail absolute bottom-0 left-4 top-2 w-px md:left-1/2 md:-translate-x-1/2" />

          <div className="space-y-10 md:space-y-14">
            {experiences.map((experience, index) => {
              const { points, skills } = summarize(experience)
              const alignRight = index % 2 === 1

              return (
                <div
                  key={`${experience.company}-${experience.role}`}
                  className="reveal relative"
                  style={{ transitionDelay: `${(index % 2) * 80}ms` }}
                >
                  {/* Node marker */}
                  <span className="timeline-dot absolute left-4 top-3 z-10 h-3 w-3 -translate-x-1/2 rounded-full bg-primary md:left-1/2" />

                  {/* Card */}
                  <div
                    className={`ml-10 md:ml-0 md:w-[calc(50%-2.5rem)] ${
                      alignRight ? "md:ml-auto" : ""
                    }`}
                  >
                    <div className="card-hover rounded-xl border border-border bg-card p-5 shadow-sm md:p-6">
                      <div className="mb-3 flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground">
                          {typeLabels[experience.type]}
                        </span>
                        <span className="text-xs font-medium text-muted-foreground">
                          {experience.date}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold text-card-foreground md:text-xl">
                        {experience.role}
                      </h3>
                      <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Briefcase className="h-3.5 w-3.5 shrink-0" />
                        {experience.company}
                        <span className="text-border">·</span>
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        {experience.location}
                      </p>

                      {points.length > 0 && (
                        <ul className="mt-4 space-y-2">
                          {points.slice(0, 3).map((point, i) => (
                            <li
                              key={i}
                              className="relative pl-4 text-sm leading-relaxed text-muted-foreground before:absolute before:left-0 before:top-2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-primary/60"
                            >
                              {point}
                            </li>
                          ))}
                        </ul>
                      )}

                      {skills.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {skills.slice(0, 5).map((skill, i) => (
                            <span
                              key={i}
                              className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="reveal mt-14 text-center md:mt-20">
          <Link
            href="/experiences"
            className="btn-hover inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3 text-sm font-semibold text-card-foreground transition-colors hover:bg-muted"
          >
            View full experience
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
