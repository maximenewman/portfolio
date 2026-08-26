import type { ReactNode } from "react"
import Image from "next/image"
import { Calendar, ExternalLink, Link2, MapPin, Wrench } from "lucide-react"
import { Experience } from "@/lib/experiences"
import { Panel } from "@/app/components/page-shell"

/** Brand color for the hero, keyed off the company name. */
function brandColor(company: string): string {
  const c = company.toLowerCase()
  if (c.includes("sfu") || c.includes("simon fraser")) return "#A6192E"
  if (c.includes("skc")) return "#2563eb"
  if (c.includes("zebra")) return "#0f172a"
  return "var(--primary)"
}

/**
 * Company hero image + how to fit it. Transparent logos are "contain" (shown on
 * a branded panel); full-bleed banners with their own background are "cover".
 * Missing → monogram fallback.
 */
function companyHero(company: string): { src?: string; fit: "cover" | "contain" } {
  const c = company.toLowerCase()
  if (c.includes("sfu") || c.includes("simon fraser"))
    return { src: "/media/assets/d5e08d002894bffacff3464b90a7171aa46ef0cc39e491a12c4bc76e63559afe.png", fit: "contain" }
  if (c.includes("skc"))
    return { src: "/media/assets/633fe74c7bd09b848ea7ff83e1e1a3d481524e3bf5785e5e8ec6851ea014c4ac.webp", fit: "contain" }
  if (c.includes("zebra"))
    return { src: "/media/assets/febe7b543b33030aef2b732411fe551eafc7ee7a62f4b75adcf0958f6e2a62c4.png", fit: "cover" }
  return { fit: "contain" }
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
}

/** Tools shown in the sidebar: explicit skills, else the union of project tech. */
function toolsFor(e: Experience): string[] {
  if (e.skills?.length) return e.skills
  return Array.from(new Set(e.projects?.flatMap((p) => p.tech) ?? []))
}

/** Shared shape for the sidebar's label + value pairs. */
function DetailRow({
  icon,
  label,
  children,
}: {
  icon: ReactNode
  label: string
  children: ReactNode
}) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 font-mono text-eyebrow uppercase text-muted-foreground">
        {icon}
        {label}
      </dt>
      <dd className="mt-2">{children}</dd>
    </div>
  )
}

export function ExperienceDetail({ experience }: { experience: Experience }) {
  const color = brandColor(experience.company)
  const tools = toolsFor(experience)
  const hero = companyHero(experience.company)
  const heroSrc = experience.heroImage ?? hero.src
  const heroFit = experience.heroImage ? "contain" : hero.fit
  const links = experience.links ?? []
  const projects = experience.projects ?? []
  const highlights = experience.highlights ?? []
  // The headline carries the deck; only show a separate Overview paragraph
  // when there is one, so the same sentence never appears twice.
  const overview = experience.overview

  return (
    <div>
      {/* Hero — logo contained on a branded panel, banner covered, else monogram */}
      <Panel className="reveal relative mt-8 aspect-[21/9] w-full overflow-hidden">
        {heroSrc ? (
          heroFit === "cover" ? (
            <Image
              src={heroSrc}
              alt={`${experience.company}`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1184px"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0" style={{ background: `color-mix(in srgb, ${color} 10%, #ffffff)` }}>
              <Image
                src={heroSrc}
                alt={`${experience.company} logo`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 1184px"
                className="object-contain p-6 md:p-12"
              />
            </div>
          )
        ) : (
          <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${color}, var(--card))` }}>
            <span
              aria-hidden
              className="absolute inset-0 flex items-center justify-center font-display text-[clamp(5rem,18vw,13rem)] leading-none text-white/10"
            >
              {initials(experience.company)}
            </span>
          </div>
        )}
      </Panel>

      <header className="reveal mt-[clamp(1.75rem,4vw,2.75rem)]">
        <p className="font-mono text-eyebrow uppercase text-primary">{experience.company}</p>
        <h1 className="mt-4 max-w-[18ch] font-display text-h1 text-balance text-foreground">{experience.role}</h1>
        <p className="mt-6 max-w-[40ch] font-serif text-deck text-pretty text-muted-foreground">
          {experience.headline}
        </p>
      </header>

      {/*
        One grid, two placements. The sidebar comes FIRST in the DOM so the
        facts of the role (dates, place, links, tools) are read and reached
        immediately on a phone and by a screen reader; explicit column/row
        placement moves it to the right-hand rail from `md` up without a second
        copy of the markup and without reordering anything for assistive tech.
      */}
      <div className="mt-[clamp(2.5rem,6vw,4rem)] grid gap-x-[clamp(2rem,4vw,3.5rem)] gap-y-10 md:grid-cols-[minmax(0,1fr)_17rem]">
        <aside className="reveal md:col-start-2 md:row-start-1 md:self-start md:sticky md:top-24">
          <Panel className="p-5">
            {/* Named for screen readers only — the labels below are the visible
                structure, and a visible heading here would be noise. */}
            <h2 className="sr-only">Role details</h2>
            <dl className="space-y-5">
              <DetailRow icon={<Calendar className="h-3.5 w-3.5" aria-hidden />} label="Timeline">
                <p className="text-sm text-card-foreground">{experience.date}</p>
              </DetailRow>

              <DetailRow icon={<MapPin className="h-3.5 w-3.5" aria-hidden />} label="Location">
                <p className="text-sm text-card-foreground">{experience.location}</p>
              </DetailRow>

              {links.length > 0 && (
                <DetailRow icon={<Link2 className="h-3.5 w-3.5" aria-hidden />} label="Links">
                  <ul className="flex flex-col gap-1">
                    {links.map((l) => (
                      <li key={l.url}>
                        <a
                          href={l.url}
                          {...(l.url.startsWith("/") ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                          // Roomier hit area where the pointer is coarse.
                          className="inline-flex min-h-8 touch:min-h-11 items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                        >
                          <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden />
                          {l.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </DetailRow>
              )}

              {tools.length > 0 && (
                <DetailRow icon={<Wrench className="h-3.5 w-3.5" aria-hidden />} label="Tools & skills">
                  <ul className="flex flex-wrap gap-1.5">
                    {tools.map((t) => (
                      <li
                        key={t}
                        className="rounded-full border border-border bg-secondary/60 px-2 py-0.5 font-mono text-[10px] text-secondary-foreground"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </DetailRow>
              )}
            </dl>
          </Panel>
        </aside>

        <div className="reveal space-y-[clamp(2.5rem,5vw,3.5rem)] md:col-start-1 md:row-start-1">
          {overview && (
            <section>
              <h2 className="font-display text-h3 text-foreground">Overview</h2>
              <p className="mt-4 max-w-[68ch] text-pretty text-lede text-muted-foreground">{overview}</p>
            </section>
          )}

          <section>
            <h2 className="font-display text-h3 text-foreground">What happened</h2>
            {projects.length > 0 ? (
              <div className="mt-6 space-y-8">
                {projects.map((project, i) => (
                  <article key={i} className="border-l border-border/70 pl-5">
                    <h3 className="font-display text-lg font-semibold text-foreground">{project.title}</h3>
                    <div className="mt-2 max-w-[68ch] space-y-2">
                      {project.description.map((d, j) => (
                        <p key={j} className="text-pretty text-sm leading-relaxed text-muted-foreground">
                          {d}
                        </p>
                      ))}
                    </div>
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex min-h-9 touch:min-h-11 items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                      >
                        <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden />
                        View project
                      </a>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-6 max-w-[68ch] space-y-3">
                {highlights.map((h, i) => (
                  <p key={i} className="text-pretty text-sm leading-relaxed text-muted-foreground">
                    {h}
                  </p>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
