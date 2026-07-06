// Shared project shapes — safe to import from both server and client.

import type { ProjectMediaItem, ProjectRow } from "@/db/schema"

export type ProjectMedia = ProjectMediaItem

/**
 * The shape project cards render. DB rows map onto this; the experiences page
 * also builds these statically, which is why it stays a plain interface
 * rather than the row type.
 */
export interface Project {
  title: string
  description: string[]
  tech: string[]
  link?: string
  playUrl?: string
  linkedinPostUrl?: string
  media?: ProjectMedia[]
}

/** DB row → card props (nullable columns become absent). */
export function toCardProject(row: ProjectRow): Project {
  return {
    title: row.title,
    description: row.description,
    tech: row.tech,
    link: row.link ?? undefined,
    playUrl: row.playUrl ?? undefined,
    linkedinPostUrl: row.linkedinPostUrl ?? undefined,
    media: row.media,
  }
}
