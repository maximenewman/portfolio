import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import Hero from "./components/bio"
import HomeTimeline from "./components/home-timeline"
import { ChapterRail } from "./components/chapter-rail"
import { Panel, Section } from "./components/page-shell"
import { bio } from "@/lib/bio"
import { isCurrentUserAdmin } from "@/lib/admin"
import { listExperiences } from "@/lib/queries"
import { toCardExperience } from "@/lib/experiences"

// Depends on who's viewing (the owner sees private experiences) and on live data.
export const dynamic = "force-dynamic"

const chapters = [
  { id: "journey", label: "Journey" },
  { id: "about", label: "About" },
  { id: "elsewhere", label: "Elsewhere" },
]

const elsewhere = [
  {
    href: "/projects",
    kicker: "Work",
    title: "Projects",
    blurb: "Shipped things — security tooling, GPU work, full-stack products, and the write-ups behind them.",
  },
  {
    href: "/blog",
    kicker: "Writing",
    title: "Blog",
    blurb: "Notes from the build: what broke, what I read, and what I would do differently next time.",
  },
  {
    href: "/passions",
    kicker: "Off the clock",
    title: "Passions",
    blurb: "Football, mountains and long runs — the part of the week that happens away from a keyboard.",
  },
  {
    href: "/goblinskeep",
    kicker: "Play",
    title: "Goblin's Keep",
    blurb: "A pixel-art dungeon crawler I wrote in TypeScript, running right here in the page.",
  },
]

// `bio.skills` is `as const`, so its values arrive as readonly tuples of string
// literals. One cast at the boundary keeps the render loop plainly typed.
const skillGroups = Object.entries(bio.skills) as [string, readonly string[]][]

export default async function Home() {
  const admin = await isCurrentUserAdmin()
  const rows = await listExperiences({ visibilities: admin ? ["public", "private"] : ["public"] })
  const experiences = rows.map(toCardExperience)

  return (
    // The chapter rail goes `position: fixed` in the left margin at `lg` (see
    // chapter-rail.tsx) and nothing else reserves that margin for it, so the
    // page that hosts it does. This is the one place the two form factors
    // genuinely diverge: below `lg` the rail is an ordinary block at the top of
    // the document and needs no gutter, and reserving one there would cost a
    // quarter of a phone's reading width for a margin nothing sits in.
    <div className="lg:pl-[min(26vw,22rem)]">
      <Hero />

      <ChapterRail chapters={chapters} />

      <Section
        id="journey"
        index={1}
        eyebrow="Experience"
        title="The journey so far"
        deck="Research labs, engineering teams, classrooms and clubs — the roles that taught me how systems behave once real people are using them."
      >
        <HomeTimeline experiences={experiences} />
      </Section>

      <Section
        id="about"
        index={2}
        eyebrow="About"
        title="Who is doing the building"
        deck="A short account of what I work on, why I work on it, and what I do when the laptop is shut."
      >
        <div className="grid gap-[clamp(2.5rem,6vw,4rem)] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start">
          <div className="reveal max-w-[62ch] space-y-6">
            {bio.about.map((paragraph) => (
              <p key={paragraph.slice(0, 32)} className="text-lede text-pretty text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="reveal">
            <h3 className="font-mono text-eyebrow uppercase text-foreground">Toolkit</h3>
            <dl className="mt-5 border-t border-border/70">
              {skillGroups.map(([group, items]) => (
                <div
                  key={group}
                  className="grid gap-2 border-b border-border/70 py-4 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-6"
                >
                  <dt className="font-mono text-eyebrow uppercase text-muted-foreground">{group}</dt>
                  <dd className="flex flex-wrap gap-1.5">
                    {items.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-border bg-card/60 px-2.5 py-1 font-mono text-eyebrow text-foreground backdrop-blur-sm"
                      >
                        {item}
                      </span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Section>

      <Section
        id="elsewhere"
        index={3}
        eyebrow="Elsewhere"
        title="The rest of the site"
        deck="Four more rooms, if you want to keep reading."
      >
        <ul className="grid gap-4 sm:grid-cols-2">
          {elsewhere.map((item, index) => (
            <li
              key={item.href}
              className="reveal"
              style={{ transitionDelay: `${index * 60}ms` }}
            >
              <Link href={item.href} className="card-hover group block h-full rounded-2xl">
                <Panel className="flex h-full flex-col p-6">
                  <p className="flex items-center justify-between gap-4 font-mono text-eyebrow uppercase text-primary">
                    {item.kicker}
                    {/* Drawn at rest, not revealed on hover, so the same
                        affordance is visible to a touch user. */}
                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0 transition-transform fine:group-hover:-translate-y-0.5 fine:group-hover:translate-x-0.5"
                    />
                  </p>
                  <h3 className="mt-4 font-display text-h3 text-card-foreground">{item.title}</h3>
                  <p className="mt-3 text-lede text-pretty text-muted-foreground">{item.blurb}</p>
                </Panel>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  )
}
