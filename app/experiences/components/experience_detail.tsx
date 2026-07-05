import Image from "next/image"
import { Calendar, MapPin, Wrench } from "lucide-react"
import { Experience } from "../data/experience"

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

export function ExperienceDetail({ experience }: { experience: Experience }) {
  const color = brandColor(experience.company)
  const tools = toolsFor(experience)
  const hero = companyHero(experience.company)
  const heroSrc = experience.heroImage ?? hero.src
  const heroFit = experience.heroImage ? "contain" : hero.fit

  return (
    <div>
      {/* Hero — logo contained on a branded panel, banner covered, else monogram */}
      <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl border border-border">
        {heroSrc ? (
          heroFit === "cover" ? (
            <Image
              src={heroSrc}
              alt={`${experience.company}`}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 800px"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0" style={{ background: `color-mix(in srgb, ${color} 10%, #ffffff)` }}>
              <Image
                src={heroSrc}
                alt={`${experience.company} logo`}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 800px"
                className="object-contain p-6 md:p-12"
              />
            </div>
          )
        ) : (
          <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${color}, var(--card))` }}>
            <span className="absolute inset-0 flex items-center justify-center text-[120px] font-black leading-none text-white/10 md:text-[200px]">
              {initials(experience.company)}
            </span>
          </div>
        )}
      </div>

      {/* Title below the hero */}
      <header className="mt-6">
        <p className="text-sm font-medium text-primary">{experience.company}</p>
        <h1 className="mt-1 text-2xl font-bold text-foreground md:text-4xl">{experience.role}</h1>
      </header>

      {/* Body: content + metadata sidebar */}
      <div className="mt-8 grid gap-8 md:grid-cols-[1fr_260px]">
        <div className="order-2 space-y-10 md:order-1">
          <section>
            <h2 className="text-lg font-semibold text-foreground">Overview</h2>
            <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
              {experience.overview ?? experience.headline}
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">What happened</h2>
            {experience.projects?.length ? (
              <div className="mt-4 space-y-8">
                {experience.projects.map((project, i) => (
                  <div key={i}>
                    <h3 className="font-semibold text-foreground">{project.title}</h3>
                    <div className="mt-2 space-y-2">
                      {project.description.map((d, j) => (
                        <p key={j} className="text-pretty text-sm leading-relaxed text-muted-foreground">
                          {d}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {experience.highlights?.map((h, i) => (
                  <p key={i} className="text-pretty text-sm leading-relaxed text-muted-foreground">
                    {h}
                  </p>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <aside className="order-1 md:order-2">
          <div className="space-y-5 rounded-xl border border-border bg-card p-5 md:sticky md:top-24">
            <div>
              <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                Timeline
              </h3>
              <p className="mt-1.5 text-sm text-card-foreground">{experience.date}</p>
            </div>
            <div>
              <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                Location
              </h3>
              <p className="mt-1.5 text-sm text-card-foreground">{experience.location}</p>
            </div>
            {tools.length > 0 && (
              <div>
                <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <Wrench className="h-3.5 w-3.5" />
                  Tools &amp; skills
                </h3>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {tools.map((t) => (
                    <span key={t} className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
