import Link from "next/link"
import { Row, RowList } from "./page-shell"
import { PitchJourney } from "./pitch-journey"
import type { Experience } from "@/lib/experiences"

const typeLabels: Record<Experience["type"], string> = {
  tech: "Engineering",
  leadership: "Leadership",
  other: "Community",
}

/**
 * First four-digit year in a free-text range — "Jan 2026 - May 2026" → "2026".
 * The date column keeps the full string; this is only the grouping key for the
 * gutter, so a row with an unparseable date simply prints no year and still
 * reads correctly.
 */
function startYear(date: string): string | null {
  return date.match(/\d{4}/)?.[0] ?? null
}

/** Metadata separator. Decorative, so it never reaches the accessibility tree. */
function Dot() {
  return (
    <span aria-hidden="true" className="text-muted-foreground/50">
      ·
    </span>
  )
}

/**
 * The experience chronology on the home page.
 *
 * An editorial index, not a stack of cards: hairline-separated rows, a
 * fixed-width year gutter that prints a year only when the year changes, and
 * the dates set flush right in tabular figures so they form a real column.
 * Each row has exactly one destination — the role title carries `.row-link`,
 * whose stretched pseudo-element makes the whole row clickable while keeping
 * the accessible name to the title alone and leaving middle-click and
 * right-click intact.
 *
 * The rail-and-dot markers are gone with the cards. A pulsing dot per item
 * plus a bordered panel per item is decoration standing in for hierarchy; the
 * year gutter does the same work with type, and it survives 320px unchanged.
 *
 * Beside the list, the same chronology is plotted as a run up a football
 * pitch (see pitch-journey.tsx): oldest role deepest in our own half, current
 * role in the attacking third, a ball tracking whichever row is being read.
 * The rows stay the single source of facts and links; the pitch is the
 * spatial index of the same journey.
 *
 * The list itself stays a server component; only the pitch is a client island.
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
    // At lg+ the pitch takes a sticky right-hand column and the ball walks the
    // run as the roles scroll past; below lg the same run renders once above
    // the list, because a phone has no width to spare for a side column.
    <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(15rem,19rem)] lg:items-start lg:gap-[clamp(2rem,4vw,4rem)]">
      <PitchJourney items={experiences.map((e) => ({ slug: e.slug, role: e.role }))} />

      <RowList className="max-w-[86ch] lg:col-start-1 lg:row-start-1">
      {experiences.map((experience, index) => {
        const year = startYear(experience.date)
        // Compared against the previous row rather than against every year seen
        // so far: the order is the owner's manual `position`, not a sort, so a
        // year that recurs after a gap should print again.
        const previousYear = index > 0 ? startYear(experiences[index - 1]?.date ?? "") : null
        const showYear = year !== null && year !== previousYear
        // The most recent role leads the section and is set as such — the rows
        // are deliberately not all the same height or the same composition.
        const isLead = index === 0

        return (
          <Row
            key={experience.slug}
            id={`xp-${experience.slug}`}
            data-journey-row={index}
            // scroll-mt clears the sticky nav when a pitch node links here.
            className={`reveal scroll-mt-28 ${isLead ? "py-7 sm:py-9" : "py-5 sm:py-6"}`}
          >
            <div className="flex items-baseline gap-4 sm:gap-6">
              {/* Fixed-width gutter. Rows that continue a year leave it empty
                  rather than repeating the number, which is what makes the
                  column read as a chronology; the full range is in the date
                  column, so nothing is lost when the year is not printed. */}
              <span
                aria-hidden="true"
                className="w-10 shrink-0 font-mono text-eyebrow tabular-nums text-muted-foreground md:w-14"
              >
                {showYear ? year : null}
              </span>

              <div className="min-w-0 flex-1">
                {/* Stacks below `sm` because a flush-right date column needs
                    width to be a column at all; above it, tabular figures line
                    the dates up down the whole list. */}
                <div className="flex flex-col gap-x-6 gap-y-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <h3 className="min-w-0 font-display text-h3 text-balance text-foreground">
                    <Link
                      href={`/experiences/${experience.slug}`}
                      className="row-link transition-colors duration-200 group-hover:text-primary"
                    >
                      {experience.role}
                    </Link>
                  </h3>
                  <span className="shrink-0 text-sm tabular-nums text-muted-foreground sm:text-right">
                    {experience.date}
                  </span>
                </div>

                {/* One monospace micro-label per row — the category — with the
                    rest set in the body face and separated by middots. */}
                <p className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm text-muted-foreground">
                  <span className="font-mono text-eyebrow uppercase">
                    {typeLabels[experience.type]}
                  </span>
                  <Dot />
                  <span>{experience.company}</span>
                  <Dot />
                  <span>{experience.location}</span>
                </p>

                <p
                  className={
                    isLead
                      ? "mt-4 max-w-[52ch] font-serif text-[1.3rem] leading-snug text-pretty text-foreground sm:text-[1.5rem]"
                      : "mt-2 max-w-[62ch] text-lede text-pretty text-muted-foreground"
                  }
                >
                  {experience.headline}
                </p>
              </div>
            </div>
          </Row>
        )
      })}
      </RowList>
    </div>
  )
}
