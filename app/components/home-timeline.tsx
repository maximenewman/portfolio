import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Panel } from "./page-shell"
import type { Experience } from "@/lib/experiences"

const typeLabels: Record<Experience["type"], string> = {
  tech: "Engineering",
  leadership: "Leadership",
  other: "Community",
}

/**
 * The experience timeline on the home page.
 *
 * A plain server component: the reveal animation is the site-wide `.reveal`
 * class, driven by the one IntersectionObserver in the root layout, so there is
 * no per-page observer and nothing here needs to ship to the browser.
 *
 * One column at every width. A left-hand rail with the cards hanging off it
 * survives 320px as readily as 1600px, so there is no alternating / centred
 * variant to keep in sync — the rail simply sits further from the text as the
 * gutter grows.
 */
export default function HomeTimeline({ experiences }: { experiences: Experience[] }) {
  if (experiences.length === 0) {
    return (
      <p className="reveal font-mono text-eyebrow uppercase text-muted-foreground">
        No experiences published yet.
      </p>
    )
  }

  return (
    <ol className="relative max-w-[72ch] pl-8 sm:pl-12">
      {/* The rail is decoration behind the dots; the list itself carries the
          order for anything reading the page non-visually. */}
      <span
        aria-hidden="true"
        className="timeline-rail pointer-events-none absolute bottom-0 left-[5px] top-0 w-px"
      />

      {experiences.map((experience, index) => (
        <li
          key={experience.slug}
          className="reveal relative pb-4 last:pb-0 sm:pb-5"
          // Staggered only for the first few, so a long list never ends up
          // waiting a second and a half for its last card.
          style={{ transitionDelay: `${Math.min(index, 4) * 60}ms` }}
        >
          <span
            aria-hidden="true"
            className="timeline-dot absolute left-[5px] top-[1.85rem] z-10 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-primary"
          />

          <Link
            href={`/experiences/${experience.slug}`}
            className="card-hover group block rounded-2xl"
          >
            <Panel className="p-5 sm:p-6">
              <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-eyebrow uppercase">
                <span className="rounded-full bg-accent px-2.5 py-1 text-accent-foreground">
                  {typeLabels[experience.type]}
                </span>
                <span className="text-muted-foreground">{experience.date}</span>
              </p>

              <h3 className="mt-4 flex items-start justify-between gap-4 font-display text-h3 text-balance text-card-foreground">
                {experience.role}
                {/* Always drawn, never hover-revealed — the hover state only
                    nudges it, so touch users see the same affordance. */}
                <ArrowUpRight
                  aria-hidden="true"
                  className="mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-transform fine:group-hover:-translate-y-0.5 fine:group-hover:translate-x-0.5"
                />
              </h3>

              <p className="mt-2 font-mono text-eyebrow uppercase text-muted-foreground">
                {experience.company}
                <span aria-hidden="true" className="mx-2 text-border">
                  /
                </span>
                {experience.location}
              </p>

              <p className="mt-4 max-w-[62ch] text-lede text-pretty text-muted-foreground">
                {experience.headline}
              </p>
            </Panel>
          </Link>
        </li>
      ))}
    </ol>
  )
}
