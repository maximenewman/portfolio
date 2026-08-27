import Link from "next/link"
import { Mail } from "lucide-react"
import { bio } from "@/lib/bio"
import { Container } from "./page-shell"

/* Inline marks rather than an icon dependency: five brand glyphs are cheaper as
   paths than as another package, and they inherit `currentColor` so both themes
   are handled for free. Every one is `aria-hidden` — the visible label beside it
   is what the accessibility tree reads. */

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  )
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  )
}

function TiktokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.75a8.26 8.26 0 0 0 4.83 1.55V6.85a4.85 4.85 0 0 1-1.06-.16z" />
    </svg>
  )
}

const siteLinks = [
  { name: "Experience", href: "/#journey" },
  { name: "Projects", href: "/projects" },
  { name: "Blog", href: "/blog" },
  { name: "Passions", href: "/passions" },
]

const socialLinks = [
  { name: "GitHub", href: bio.socials.github, Icon: GithubIcon },
  { name: "LinkedIn", href: bio.socials.linkedin, Icon: LinkedinIcon },
  { name: "Instagram", href: bio.socials.instagram, Icon: InstagramIcon },
  { name: "YouTube", href: bio.socials.youtube, Icon: YoutubeIcon },
  { name: "TikTok", href: bio.socials.tiktok, Icon: TiktokIcon },
  { name: "Email", href: `mailto:${bio.email}`, Icon: Mail },
]

// Shared by every link in the footer. `min-h-11` is the WCAG 2.5.5 target size,
// kept at every width — the columns stack on narrow screens but the rows are the
// same rows, never a second set of markup.
const linkClass =
  "link-underline inline-flex min-h-11 items-center gap-3 font-mono text-eyebrow uppercase text-muted-foreground transition-colors fine:min-h-9 hover:text-primary"

/**
 * Site footer. A plain server component — it reads constants from `lib/bio`
 * rather than importing the client `bio` component, and the resume is a real
 * anchor instead of a button calling `window.open`, so it works with middle
 * click, "open in new tab" and JavaScript disabled.
 */
export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border/70">
      <Container className="py-[clamp(3rem,7vw,5rem)]">
        <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr]">
          {/* Identity */}
          <div>
            <p className="font-display text-h3 text-foreground">{bio.shortName}</p>
            <p className="mt-3 max-w-[26ch] font-serif text-deck text-pretty text-muted-foreground">
              I build AI systems and the infrastructure they run on.
            </p>
            <a
              href={`mailto:${bio.email}`}
              className="link-underline mt-5 inline-flex min-h-11 items-center font-mono text-eyebrow uppercase text-primary fine:min-h-9"
            >
              {bio.email}
            </a>
          </div>

          {/* Site */}
          <nav aria-labelledby="footer-site">
            <h2
              id="footer-site"
              className="font-mono text-eyebrow uppercase text-foreground"
            >
              Site
            </h2>
            <ul className="mt-4 flex flex-col border-t border-border/70 pt-2">
              {siteLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Connect */}
          <nav aria-labelledby="footer-connect">
            <h2
              id="footer-connect"
              className="font-mono text-eyebrow uppercase text-foreground"
            >
              Connect
            </h2>
            <ul className="mt-4 flex flex-col border-t border-border/70 pt-2">
              {socialLinks.map(({ name, href, Icon }) => {
                const external = href.startsWith("http")
                return (
                  <li key={name}>
                    <a
                      href={href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer" : undefined}
                      className={linkClass}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {name}
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>

        </div>

        <div className="mt-[clamp(2.5rem,6vw,4rem)] flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-border/70 pt-6 font-mono text-eyebrow uppercase text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} {bio.name}
          </p>
          <p>{bio.location}</p>
        </div>
      </Container>
    </footer>
  )
}
