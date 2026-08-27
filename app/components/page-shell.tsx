import type { ReactNode } from "react"

/**
 * The one page header.
 *
 * Every section page had previously hand-copied the same eyebrow / title /
 * lede block with slightly different spacing and breakpoints. One component
 * means one rhythm, and mobile differs from desktop only through the fluid
 * type scale — there is no second layout to keep in sync.
 */
export function PageHeader({
  eyebrow,
  title,
  deck,
  children,
}: {
  eyebrow: string
  title: string
  /** The single high-contrast serif sentence that sets up the page. */
  deck?: string
  children?: ReactNode
}) {
  return (
    <header className="border-b border-border/70">
      <Container className="py-[clamp(3.5rem,10vw,7rem)]">
        <p className="font-mono text-eyebrow uppercase text-primary">{eyebrow}</p>
        <h1 className="mt-4 max-w-[16ch] font-display text-h1 text-balance text-foreground">
          {title}
        </h1>
        {deck && (
          <p className="mt-6 max-w-[38ch] font-serif text-deck text-pretty text-muted-foreground">
            {deck}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </Container>
    </header>
  )
}

/**
 * Horizontal rhythm for the whole site. Gutters grow with the viewport via
 * clamp rather than stepping at breakpoints, so there is no width at which the
 * page suddenly feels cramped.
 */
export function Container({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode
  className?: string
  as?: "div" | "section" | "main" | "footer" | "nav"
}) {
  return (
    <Tag
      className={`mx-auto w-full max-w-page px-[clamp(1.25rem,4vw,4rem)] ${className}`}
    >
      {children}
    </Tag>
  )
}

/**
 * A titled section on a long page. `id` is the anchor the chapter rail tracks,
 * and `index` renders the printed-index numeral beside the heading.
 */
export function Section({
  id,
  index,
  eyebrow,
  title,
  deck,
  children,
  className = "",
}: {
  id: string
  index?: number
  eyebrow?: string
  title: string
  deck?: string
  children: ReactNode
  className?: string
}) {
  return (
    <section id={id} className={`scroll-mt-24 border-t border-border/70 ${className}`}>
      <Container className="py-[clamp(3.5rem,9vw,6.5rem)]">
        <div className="reveal mb-[clamp(2rem,5vw,3.5rem)] max-w-[52ch]">
          <div className="flex items-baseline gap-3">
            {index !== undefined && (
              <span className="font-mono text-eyebrow text-muted-foreground tabular-nums">
                {String(index).padStart(2, "0")}
              </span>
            )}
            {eyebrow && (
              <span className="font-mono text-eyebrow uppercase text-primary">{eyebrow}</span>
            )}
          </div>
          <h2 className="mt-3 font-display text-h2 text-balance text-foreground">{title}</h2>
          {deck && (
            <p className="mt-4 font-serif text-deck text-pretty text-muted-foreground">{deck}</p>
          )}
        </div>
        {children}
      </Container>
    </section>
  )
}

/**
 * A genuine surface — for things that really are contained, like a media
 * frame or a metadata block. NOT the default wrapper for list items; an index
 * of roles or posts belongs in `RowList` below.
 *
 * `backdrop-blur` is deliberately gone. It is the single most recognisable
 * marker of the generated-portfolio look, and it also establishes a containing
 * block, which silently breaks both `position: fixed` descendants and the
 * `.row-link` stretch.
 */
export function Panel({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`rounded-xl border border-border bg-card ${className}`}>
      {children}
    </div>
  )
}

/**
 * The editorial index: hairline-separated rows, no boxes.
 *
 * `role="list"` is not redundant — Safari + VoiceOver strip list semantics
 * from any list whose `list-style` is `none`, which Tailwind's preflight
 * applies globally.
 */
export function RowList({
  children,
  className = "",
  dim = true,
}: {
  children: ReactNode
  className?: string
  /** Recede the un-pointed rows on hover. Pointer-only; see globals.css. */
  dim?: boolean
}) {
  return (
    <ol
      role="list"
      className={`border-t border-border/60 ${dim ? "dim-siblings" : ""} ${className}`}
    >
      {children}
    </ol>
  )
}

/**
 * One row. `relative` is load-bearing: it is the containing block the
 * stretched `.row-link` resolves against.
 */
export function Row({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <li className={`group relative border-b border-border/60 ${className}`}>
      {children}
    </li>
  )
}

/**
 * The index numeral on a row. Tabular figures so the column stays aligned
 * whatever the digits, which is most of why a numbered index reads as
 * typeset rather than as decoration.
 */
export function RowIndex({ n, className = "" }: { n: number; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`font-mono text-eyebrow tabular-nums text-muted-foreground ${className}`}
    >
      {String(n).padStart(2, "0")}
    </span>
  )
}
