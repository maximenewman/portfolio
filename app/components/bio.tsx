"use client"

import Image from "next/image"
import { useEffect, useRef } from "react"
import { Github, Instagram, Linkedin, Mail, Youtube } from "lucide-react"
import { bio } from "@/lib/bio"
import { Container, Panel } from "./page-shell"
import { useMotion } from "./motion-provider"

/**
 * The masthead splits the name across two lines rather than letting it wrap
 * wherever it lands. The surname is the single longest unbroken string on the
 * site, and at `text-display`'s 3rem floor it is the only one that can outrun a
 * 320px viewport — giving it its own line (plus `hyphens-auto` as a last
 * resort) is what keeps the page from scrolling sideways on a small phone.
 */
const nameWords = bio.name.split(" ")
const surname = nameWords[nameWords.length - 1]
const forenames = nameWords.slice(0, -1).join(" ")

const socials = [
  { name: "GitHub", href: bio.socials.github, Icon: Github },
  { name: "LinkedIn", href: bio.socials.linkedin, Icon: Linkedin },
  { name: "Instagram", href: bio.socials.instagram, Icon: Instagram },
  { name: "YouTube", href: bio.socials.youtube, Icon: Youtube },
]

/* The parallax offsets are read out of two custom properties the hook writes on
   the hero root, so the moving elements never re-render — React sets these
   strings once and the rAF loop only touches `style.setProperty`. Both vars
   fall back to `0`, which is what an untouched hero, a paused hero and a
   server-rendered hero all resolve to.

   Deliberately no `will-change`. It was here as a hint, but it promoted both
   elements to their own compositor layer permanently, for an effect that only
   runs while a pointer is actually over the hero — MDN treats `will-change` as
   a last resort rather than a default. The promotion also had a visible cost:
   screenshot capture skipped the promoted layer, rendering the portrait blank.
   Two small transform-only elements do not need the hint. */
const PORTRAIT_TRANSFORM: React.CSSProperties = {
  transform:
    "perspective(900px) rotateX(calc(var(--px-y, 0) * -3.5deg)) rotateY(calc(var(--px-x, 0) * 3.5deg)) translate3d(calc(var(--px-x, 0) * 8px), calc(var(--px-y, 0) * 8px), 0)",
}

const TEXT_TRANSFORM: React.CSSProperties = {
  transform: "translate3d(calc(var(--px-x, 0) * -5px), calc(var(--px-y, 0) * -3px), 0)",
}

/**
 * The hero's one signature interaction.
 *
 * A single `pointermove` listener drives a damped offset that is written to CSS
 * custom properties on the hero root. That means one code path for every input
 * device: `pointermove` fires for a finger drag exactly as it does for a mouse,
 * so on touch the portrait tilts while the finger is down and eases back to
 * rest on `pointerup` / `pointercancel` — `pointercancel` being what the
 * browser sends when it claims the gesture for scrolling. Nothing is
 * `preventDefault`ed and no `touch-action` is set, so a drag still scrolls.
 *
 * It is decorative only: no content, affordance or state depends on it, and the
 * listeners are never attached while `useMotion().paused` is true.
 */
function usePointerParallax(paused: boolean) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root || paused) return

    let targetX = 0
    let targetY = 0
    let x = 0
    let y = 0
    let frame = 0

    const draw = () => {
      // A plain lerp: quick enough to feel attached to the pointer, slow enough
      // that a flick glides instead of snapping.
      x += (targetX - x) * 0.09
      y += (targetY - y) * 0.09
      root.style.setProperty("--px-x", x.toFixed(4))
      root.style.setProperty("--px-y", y.toFixed(4))
      frame =
        Math.abs(targetX - x) > 0.0015 || Math.abs(targetY - y) > 0.0015
          ? requestAnimationFrame(draw)
          : 0
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(draw)
    }

    const clamp = (value: number) => Math.max(-1, Math.min(1, value))

    const onMove = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      targetX = clamp(((event.clientX - rect.left) / rect.width - 0.5) * 2)
      targetY = clamp(((event.clientY - rect.top) / rect.height - 0.5) * 2)
      schedule()
    }

    const onRest = () => {
      targetX = 0
      targetY = 0
      schedule()
    }

    root.addEventListener("pointermove", onMove, { passive: true })
    root.addEventListener("pointerleave", onRest)
    root.addEventListener("pointerup", onRest)
    root.addEventListener("pointercancel", onRest)

    return () => {
      root.removeEventListener("pointermove", onMove)
      root.removeEventListener("pointerleave", onRest)
      root.removeEventListener("pointerup", onRest)
      root.removeEventListener("pointercancel", onRest)
      if (frame) cancelAnimationFrame(frame)
      root.style.removeProperty("--px-x")
      root.style.removeProperty("--px-y")
    }
  }, [paused])

  return ref
}

/**
 * The home page masthead: eyebrow, name, tagline, education line, the two
 * primary actions and the portrait plate.
 *
 * One tree at every width. The only thing that changes across the `lg`
 * boundary is the grid: below it the portrait follows the text in normal flow,
 * at and above it the same two children sit side by side. Nothing is
 * duplicated, hidden or re-ordered.
 */
export default function Hero() {
  const { paused } = useMotion()
  const rootRef = usePointerParallax(paused)

  return (
    <section
      ref={rootRef}
      aria-labelledby="hero-name"
      // `svh`, not `vh`: mobile browser chrome makes `vh` jump as the address
      // bar collapses, which would make the hero resize mid-scroll.
      className="flex min-h-[calc(100svh-4rem)] flex-col justify-center"
    >
      <Container className="py-[clamp(3rem,8vw,5.5rem)]">
        <div className="grid items-center gap-[clamp(2.5rem,6vw,5rem)] lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.6fr)]">
          <div style={TEXT_TRANSFORM}>
            <p className="font-mono text-eyebrow uppercase text-primary">
              {bio.role}
              <span aria-hidden="true" className="mx-2 text-border">
                /
              </span>
              {bio.location}
            </p>

            <h1
              id="hero-name"
              className="mt-[clamp(1.25rem,3vw,2rem)] font-display text-display hyphens-auto text-foreground"
            >
              <span className="block">{forenames}</span>
              <span className="block">{surname}</span>
            </h1>

            <p className="mt-[clamp(1.5rem,3vw,2.25rem)] max-w-[34ch] font-serif text-deck text-pretty text-muted-foreground">
              {bio.tagline}
            </p>

            <p className="mt-8 flex flex-wrap items-baseline font-mono text-eyebrow uppercase text-muted-foreground">
              <span>{bio.education.school}</span>
              <span aria-hidden="true" className="mx-2 text-border">
                /
              </span>
              <span>{bio.education.degree}</span>
              <span aria-hidden="true" className="mx-2 text-border">
                /
              </span>
              <span>{bio.education.graduation}</span>
            </p>

            {/* `min-h-11` is the 44px WCAG 2.5.5 target, kept at every width —
                a pointer user loses nothing by the buttons being comfortable. */}
            <div className="mt-[clamp(2rem,4vw,2.75rem)] flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${bio.email}`}
                className="btn-hover inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-6 font-mono text-eyebrow uppercase text-primary-foreground"
              >
                <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                Email
              </a>
            </div>

            <ul className="mt-6 flex flex-wrap items-center gap-1" aria-label="Social profiles">
              {socials.map(({ name, href, Icon }) => (
                <li key={name}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={name}
                    className="btn-hover inline-flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* The portrait as a plate rather than an avatar: hairline frame,
              printed caption, no blurred halo. `Panel` is translucent so the
              site-wide WebGL lattice still reads through the frame. */}
          <figure className="w-full max-w-[22rem] lg:justify-self-end" style={PORTRAIT_TRANSFORM}>
            <Panel className="p-2">
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-muted">
                <Image
                  src={bio.picture}
                  alt={`Portrait of ${bio.name}`}
                  fill
                  priority
                  sizes="(min-width: 64rem) 22rem, 90vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="flex items-baseline justify-between gap-3 px-2 pb-1 pt-3 font-mono text-eyebrow uppercase text-muted-foreground">
                <span>Fig. 01</span>
                <span>{bio.shortName}</span>
              </figcaption>
            </Panel>
          </figure>
        </div>
      </Container>
    </section>
  )
}
