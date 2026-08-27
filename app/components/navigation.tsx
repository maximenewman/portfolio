"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { Menu, Moon, Sun, X } from "lucide-react"
import { Show, UserButton } from "@clerk/nextjs"
import { Container } from "./page-shell"
import { MotionToggle } from "./motion-toggle"
import { useTheme } from "./theme-provider"

const routes = [
  { name: "Home", href: "/" },
  { name: "Projects", href: "/projects" },
  { name: "Blog", href: "/blog" },
  { name: "Passions", href: "/passions" },
]

const LIST_ID = "site-nav-links"

/**
 * The site's primary navigation.
 *
 * There is exactly ONE route list in the DOM. The previous version rendered the
 * routes twice — a centred desktop `<ul>` and a second `<nav>` inside a
 * `{open && …}` branch — which meant two sets of markup, two sets of active-state
 * classes, and two copies of every link in the accessibility tree.
 *
 * Now the same `<ul>` is:
 *   - a full-width column that the disclosure button reveals below the bar
 *     (the bar itself grows, because the list is in normal flow), and
 *   - an inline row beside the logo at `md` and above.
 *
 * Only `display`, `flex-direction`, `flex-basis` and spacing change. That is the
 * single justified divergence in this file: four uppercase labels laid side by
 * side do not survive a 320px viewport without either wrapping into an unreadable
 * ragged block or shrinking below a usable touch target, so below `md` they stack
 * behind a disclosure. Content, order and behaviour are identical either way.
 */
export default function Navbar() {
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)

  // Close the panel whenever the route changes. Done as a render-phase state
  // adjustment rather than an effect: `react-hooks/set-state-in-effect` rejects
  // a setState in an effect body, and an effect would also paint one stale frame
  // with the panel still open. Unlike an onClick handler this also covers
  // browser back/forward and any programmatic navigation.
  const [lastPath, setLastPath] = useState(pathname)
  if (lastPath !== pathname) {
    setLastPath(pathname)
    if (open) setOpen(false)
  }

  // Escape closes the panel and returns focus to the control that opened it, so
  // a keyboard user is never dropped at the top of the document.
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      setOpen(false)
      toggleRef.current?.focus()
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [open])

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)

  return (
    <nav
      aria-label="Primary"
      className="sticky top-0 z-50 border-b border-border/70 bg-card/80 backdrop-blur"
    >
      <Container className="flex flex-wrap items-center gap-x-4 py-3 md:py-4">
        {/* The logo is not a home link. Home is one tap away in the nav list,
            so the mark is free to do something better: it sends a ripple
            through the WebGL field and spins once. Purely playful, so a page
            with no canvas (admin, the game) still gives the spin as feedback. */}
        <button
          type="button"
          onClick={(event) => {
            window.dispatchEvent(new Event("lattice-pulse"))
            const img = event.currentTarget.querySelector("img")
            if (img) {
              img.classList.remove("logo-spin")
              // Force a reflow so removing and re-adding the class restarts
              // the animation on rapid clicks.
              void img.offsetWidth
              img.classList.add("logo-spin")
            }
          }}
          aria-label="Send a ripple through the background"
          title="Send a ripple through the background"
          className="btn-hover order-1 flex items-center rounded-full"
        >
          <span className="rounded-full border border-border p-1 transition-colors hover:border-primary">
            <Image
              src="/logo.png"
              alt=""
              width={64}
              height={64}
              loading="eager"
              className="h-10 w-10 rounded-full md:h-11 md:w-11"
            />
          </span>
        </button>

        {/* The disclosure sits immediately before the list in the DOM so that
            opening it puts the revealed links next in reading and tab order —
            the `order-*` classes below are what move it to the right end of the
            bar visually without breaking that relationship. */}
        <button
          ref={toggleRef}
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls={LIST_ID}
          aria-label={open ? "Close menu" : "Open menu"}
          className="btn-hover order-3 inline-flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* The one route list. `hidden`/`flex` is toggled by the disclosure below
            `md`; from `md` up it is always an inline row. */}
        <ul
          id={LIST_ID}
          className={`order-4 w-full basis-full flex-col border-t border-border/70 pt-2
            md:order-2 md:mt-0 md:w-auto md:basis-auto md:flex-row md:items-center md:border-0 md:pt-0
            ${open ? "mt-3 flex" : "hidden"} md:flex`}
        >
          {routes.map((route) => {
            const active = isActive(route.href)
            return (
              <li key={route.href}>
                <Link
                  href={route.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  // 44px tall wherever the pointer is coarse; a mouse can afford
                  // the tighter bar, so the shrink is keyed to input capability
                  // rather than to viewport width.
                  className={`link-underline flex min-h-11 items-center gap-2.5 px-3 font-mono text-eyebrow uppercase transition-colors fine:min-h-0 fine:py-2 ${
                    active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {/* Marker, not decoration-only state: `aria-current` carries the
                      meaning, this just makes it visible in both orientations. */}
                  <span
                    aria-hidden="true"
                    className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors ${
                      active ? "bg-primary" : "bg-transparent"
                    }`}
                  />
                  {route.name}
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="order-2 ml-auto flex items-center gap-1 md:order-3">
          <Show when="signed-in">
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="link-underline flex min-h-11 items-center px-3 font-mono text-eyebrow uppercase text-muted-foreground transition-colors fine:min-h-0 fine:py-2 hover:text-foreground"
            >
              Admin
            </Link>
            <UserButton appearance={{ elements: { avatarBox: "h-8 w-8" } }} />
          </Show>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            className="btn-hover inline-flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground fine:h-9 fine:w-9"
          >
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>

          <MotionToggle />
        </div>
      </Container>
    </nav>
  )
}
