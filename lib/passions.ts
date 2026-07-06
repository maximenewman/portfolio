// Shared passion shapes — safe to import from both server and client.

import type { PassionMediaLink, PassionTimelineEntry, PassionRow } from "@/db/schema"

export type { PassionMediaLink, PassionTimelineEntry }

/** Keys of the icon map in passions_card.tsx — the editor's icon choices. */
export const PASSION_ICONS = [
  "code",
  "palette",
  "music",
  "book",
  "dumbbell",
  "plane",
  "football",
  "chess",
  "mic",
  "running",
  "mountain",
] as const

/** The shape the passion cards and modal render. */
export interface Passion {
  id: string
  title: string
  description: string
  icon: string
  details: string[]
  media?: PassionMediaLink[]
  images?: string[]
  imageAlts?: string[]
  videoEmbed?: string
  /** Milestone log in chronological order (oldest first). Rendered as a timeline in the modal. */
  timeline?: PassionTimelineEntry[]
  /** Crop anchor for images. "top" keeps heads in frame for tall action shots. Defaults to center. */
  imagePosition?: "top" | "center"
}

/** DB row → card props (empty collections become absent, matching the old data file). */
export function toCardPassion(row: PassionRow): Passion {
  return {
    id: row.slug,
    title: row.title,
    description: row.description,
    icon: row.icon,
    details: row.details,
    media: row.mediaLinks.length ? row.mediaLinks : undefined,
    images: row.images.length ? row.images : undefined,
    imageAlts: row.imageAlts.length ? row.imageAlts : undefined,
    videoEmbed: row.videoEmbed ?? undefined,
    timeline: row.timeline.length ? row.timeline : undefined,
    imagePosition: row.imagePosition === "top" ? "top" : "center",
  }
}
