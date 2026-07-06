"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowRight, BadgeCheck, Briefcase, MapPin } from "lucide-react"
import type { Experience } from "@/lib/experiences"

const ccrPath = "/Maxime_CCR.pdf"

const typeLabels: Record<Experience["type"], string> = {
  tech: "Engineering",
  leadership: "Leadership",
  other: "Community",
}

/** The landing-page experience timeline. Each role shows a one-line headline;
 *  click through (arrow-indicated) to its full detail page. This is the only
 *  experiences surface — there's no separate /experiences index. */
export default function HomeTimeline({ experiences }: { experiences: Experience[] }) {
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
    <section id="journey" ref={rootRef} className="border-t border-border bg-card/30">
      <div className="container mx-auto px-4 py-16 md:py-24">
        {/* Section header */}
        <div className="reveal mx-auto mb-14 max-w-2xl text-center md:mb-20">
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-primary">Experience</p>
          <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">My Journey So Far</h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            The roles that shaped me — from research labs and engineering teams to teaching and community
            leadership. Tap any role to read the full story.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative mx-auto max-w-2xl">
          {/* Vertical rail */}
          <div className="timeline-rail absolute bottom-2 left-4 top-2 w-px" />

          <div className="space-y-6">
            {experiences.map((experience, index) => (
              <div
                key={experience.slug}
                className="reveal relative"
                style={{ transitionDelay: `${(index % 3) * 60}ms` }}
              >
                {/* Node marker */}
                <span className="timeline-dot absolute left-4 top-6 z-10 h-3 w-3 -translate-x-1/2 rounded-full bg-primary" />

                <Link
                  href={`/experiences/${experience.slug}`}
                  className="card-hover group ml-10 block rounded-xl border border-border bg-card p-5 shadow-sm md:p-6"
                >
                  <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground">
                      {typeLabels[experience.type]}
                    </span>
                    <span className="text-xs font-medium text-muted-foreground">{experience.date}</span>
                  </div>

                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-semibold text-card-foreground transition-colors group-hover:text-primary md:text-xl">
                      {experience.role}
                    </h3>
                    <span className="mt-1 inline-flex shrink-0 items-center gap-1 text-xs font-medium text-muted-foreground transition-colors group-hover:text-primary">
                      Read more
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>

                  <p className="mt-1 flex flex-wrap items-center gap-x-1.5 text-sm text-muted-foreground">
                    <Briefcase className="h-3.5 w-3.5 shrink-0" />
                    {experience.company}
                    <span className="text-border">·</span>
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    {experience.location}
                  </p>

                  <p className="mt-3 text-pretty text-sm leading-relaxed text-card-foreground">
                    {experience.headline}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Verification — these roles are backed by SFU's official record */}
        <div className="reveal mx-auto mt-14 max-w-2xl text-center md:mt-20">
          <a
            href={ccrPath}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground shadow-sm transition-colors hover:border-primary/40 hover:text-primary"
          >
            <BadgeCheck className="h-4 w-4 text-primary" />
            Verified on my official SFU Co-Curricular Record
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </section>
  )
}
