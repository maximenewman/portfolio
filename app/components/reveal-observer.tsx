"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { useMotion } from "./motion-provider"

/**
 * One IntersectionObserver for every `.reveal` element on the site.
 *
 * Mounted once in the root layout rather than re-implemented per page: each
 * page previously wired its own observer, which meant several copies of the
 * same threshold and margin drifting apart. Elements are unobserved once
 * revealed, so this costs nothing after first scroll.
 *
 * A MutationObserver picks up `.reveal` nodes that appear *after* the initial
 * scan — a filtered list re-rendering, a modal opening, a route transition
 * streaming in. Without it, anything mounted later keeps `opacity: 0` forever,
 * which is a genuinely nasty failure mode: the content is in the DOM and in
 * the accessibility tree, but invisible.
 */
export function RevealObserver() {
  const pathname = usePathname()
  const { paused } = useMotion()

  useEffect(() => {
    // With motion off, reveal everything immediately and never observe. The
    // CSS forces the visible state too, but marking the class keeps the DOM
    // honest for anything else reading it.
    if (paused) {
      document
        .querySelectorAll<HTMLElement>(".reveal:not(.is-visible)")
        .forEach((node) => node.classList.add("is-visible"))
      return
    }

    const intersection = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add("is-visible")
          intersection.unobserve(entry.target)
        }
      },
      // Fire slightly before the element is fully in view, so the motion reads
      // as the page settling rather than as a delayed pop.
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    )

    // `observe` is idempotent per element, so re-scanning is safe.
    const scan = (root: ParentNode) => {
      root.querySelectorAll<HTMLElement>(".reveal:not(.is-visible)").forEach((node) => {
        intersection.observe(node)
      })
    }

    scan(document)

    const mutations = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (!(node instanceof HTMLElement)) continue
          if (node.classList.contains("reveal") && !node.classList.contains("is-visible")) {
            intersection.observe(node)
          }
          scan(node)
        }
      }
    })

    mutations.observe(document.body, { childList: true, subtree: true })

    return () => {
      intersection.disconnect()
      mutations.disconnect()
    }
  }, [pathname, paused])

  return null
}
