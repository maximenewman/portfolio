import Link from "next/link"
import Hero from "./components/bio"
import HomeTimeline from "./components/home-timeline"
import { ChapterRail } from "./components/chapter-rail"
import { Row, RowIndex, RowList, Section } from "./components/page-shell"
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
    blurb: "Security tooling, GPU work, and full-stack products I have shipped.",
  },
  {
    href: "/blog",
    kicker: "Writing",
    title: "Blog",
    blurb: "Notes on what I am building. What broke, and what I learned.",
  },
  {
    href: "/passions",
    kicker: "Off the clock",
    title: "Passions",
    blurb: "Football, mountains, and long runs.",
  },
  {
    href: "/goblinskeep",
    kicker: "Play",
    title: "Goblin's Keep",
    blurb: "A pixel-art dungeon crawler I wrote in TypeScript. It runs right here in the browser.",
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
        deck="Research labs, engineering teams, classrooms and clubs. These roles taught me how systems behave once real people use them."
      >
        <HomeTimeline experiences={experiences} />
      </Section>

      <Section
        id="about"
        index={2}
        eyebrow="About"
        title="About me"
        deck="What I work on, why I work on it, and what I do away from the keyboard."
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
                        className="rounded-full border border-border bg-card/60 px-2.5 py-1 font-mono text-eyebrow text-foreground"
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
        deck="Where to go next."
      >
        {/* This is navigation, not content: four destinations. A grid of
            identical tiles dressed it up as four articles, which is the shape
            cards get used for when the hierarchy is doing no work. A numbered
            contents list says the same thing in a quarter of the space, and
            the title — not the tile — is the link. */}
        <RowList className="max-w-[68ch]">
          {elsewhere.map((item, index) => (
            <Row key={item.href} className="reveal py-5 sm:py-6">
              <div className="flex items-baseline gap-4 sm:gap-6">
                <RowIndex n={index + 1} className="w-6 shrink-0 md:w-8" />

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="font-display text-h3 text-foreground">
                      <Link
                        href={item.href}
                        className="row-link transition-colors duration-200 group-hover:text-primary"
                      >
                        {item.title}
                      </Link>
                    </h3>
                    <span aria-hidden="true" className="text-muted-foreground/50">
                      ·
                    </span>
                    <span className="font-mono text-eyebrow uppercase text-muted-foreground">
                      {item.kicker}
                    </span>
                  </div>

                  <p className="mt-2 max-w-[56ch] text-lede text-pretty text-muted-foreground">
                    {item.blurb}
                  </p>
                </div>
              </div>
            </Row>
          ))}
        </RowList>
      </Section>
    </div>
  )
}
