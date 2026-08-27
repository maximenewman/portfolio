"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronUp, ChevronDown, ImagePlus, Loader2, Plus, Trash2, X } from "lucide-react"
import type { Asset, ProjectMediaItem, ExperienceLink } from "@/db/schema"
import { EXPERIENCE_TYPES } from "@/lib/experiences"
import { VISIBILITIES, visibilityMeta, slugify } from "@/lib/posts"
import { MediaPicker } from "../components/media-picker"
import { createExperienceAction, updateExperienceAction, deleteExperienceAction, type ExperienceInput } from "./actions"

// Embedded projects edit description as one text block (one bullet per line)
// and tech as a comma-separated string; media rides along untouched.
export type ProjectDraft = {
  title: string
  description: string
  tech: string
  link: string
  media?: ProjectMediaItem[]
  playUrl?: string
  linkedinPostUrl?: string
}

export type ExperienceEditorInitial = {
  slug: string
  type: string
  role: string
  company: string
  date: string
  location: string
  headline: string
  overview: string
  heroImage: string
  projects: ProjectDraft[]
  highlights: string[]
  skills: string[]
  links: ExperienceLink[]
  visibility: string
}

type Props = {
  mode: "create" | "edit"
  experienceId?: string
  initial: ExperienceEditorInitial
}

export function ExperienceEditor({ mode, experienceId, initial }: Props) {
  const router = useRouter()
  const [type, setType] = useState(initial.type)
  const [role, setRole] = useState(initial.role)
  const [company, setCompany] = useState(initial.company)
  const [slug, setSlug] = useState(initial.slug)
  const [slugEdited, setSlugEdited] = useState(mode === "edit")
  const [date, setDate] = useState(initial.date)
  const [location, setLocation] = useState(initial.location)
  const [headline, setHeadline] = useState(initial.headline)
  const [overview, setOverview] = useState(initial.overview)
  const [heroImage, setHeroImage] = useState(initial.heroImage)
  const [projects, setProjects] = useState<ProjectDraft[]>(initial.projects)
  // One paragraph per line, like the other editors.
  const [highlights, setHighlights] = useState(initial.highlights.join("\n"))
  const [skills, setSkills] = useState<string[]>(initial.skills)
  const [skillDraft, setSkillDraft] = useState("")
  const [links, setLinks] = useState<ExperienceLink[]>(initial.links)
  const [visibility, setVisibility] = useState(initial.visibility)

  const [pickingHero, setPickingHero] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)

  function syncSlug(nextRole: string, nextCompany: string) {
    if (!slugEdited) setSlug(slugify(`${nextRole}-${nextCompany}`))
  }

  function addSkill(raw: string) {
    const s = raw.trim().replace(/,$/, "")
    if (s && !skills.includes(s) && skills.length < 20) setSkills((prev) => [...prev, s])
    setSkillDraft("")
  }

  function patchProject(index: number, patch: Partial<ProjectDraft>) {
    setProjects((prev) => prev.map((p, i) => (i === index ? { ...p, ...patch } : p)))
  }

  function moveProject(index: number, dir: -1 | 1) {
    setProjects((prev) => {
      const next = [...prev]
      const j = index + dir
      if (j < 0 || j >= next.length) return prev
      ;[next[index], next[j]] = [next[j], next[index]]
      return next
    })
  }

  async function save() {
    setSaving(true)
    setError(null)
    const input: ExperienceInput = {
      slug,
      type,
      role,
      company,
      date,
      location,
      headline,
      overview,
      heroImage,
      projects: projects.map((p) => ({
        title: p.title,
        description: p.description.split("\n").map((d) => d.trim()).filter(Boolean),
        tech: p.tech.split(",").map((t) => t.trim()).filter(Boolean),
        link: p.link || undefined,
        playUrl: p.playUrl,
        linkedinPostUrl: p.linkedinPostUrl,
        media: p.media,
      })),
      highlights: highlights.split("\n").map((h) => h.trim()).filter(Boolean),
      skills,
      links,
      visibility,
    }
    const res = mode === "create" ? await createExperienceAction(input) : await updateExperienceAction(experienceId!, input)
    if (res.ok) {
      router.push("/admin/experiences")
      router.refresh()
    } else {
      setError(res.error)
      setSaving(false)
    }
  }

  async function doDelete() {
    setSaving(true)
    const res = await deleteExperienceAction(experienceId!)
    if (res.ok) {
      router.push("/admin/experiences")
      router.refresh()
    } else {
      setError(res.error || "Delete failed")
      setSaving(false)
    }
  }

  const inputCls =
    "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary"

  return (
    <div className="flex flex-col gap-5">
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Role + company */}
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          value={role}
          onChange={(e) => {
            setRole(e.target.value)
            syncSlug(e.target.value, company)
          }}
          placeholder="Role (e.g. Research Assistant)"
          className="w-full bg-transparent text-2xl font-bold text-foreground outline-none placeholder:text-muted-foreground md:text-3xl"
        />
        <input
          value={company}
          onChange={(e) => {
            setCompany(e.target.value)
            syncSlug(role, e.target.value)
          }}
          placeholder="Company"
          className="w-full bg-transparent text-2xl font-bold text-muted-foreground outline-none placeholder:text-muted-foreground md:text-3xl"
        />
      </div>

      {/* Meta row */}
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground">Type</span>
          <select value={type} onChange={(e) => setType(e.target.value)} className={inputCls}>
            {EXPERIENCE_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground">Dates</span>
          <input value={date} onChange={(e) => setDate(e.target.value)} placeholder="Jan 2025 - Present" className={inputCls} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground">Location</span>
          <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Burnaby, BC" className={inputCls} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground">Slug</span>
          <input
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value)
              setSlugEdited(true)
            }}
            className={`${inputCls} font-mono`}
          />
        </label>
      </div>

      {/* Headline */}
      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-muted-foreground">Headline: one-liner shown on the home timeline</span>
        <textarea value={headline} onChange={(e) => setHeadline(e.target.value)} rows={2} className={inputCls} />
      </label>

      {/* Overview */}
      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-muted-foreground">Overview: detail-page intro (falls back to headline)</span>
        <textarea value={overview} onChange={(e) => setOverview(e.target.value)} rows={3} className={inputCls} />
      </label>

      {/* Hero image */}
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-muted-foreground">Hero image (optional: company logo/banner fallback when empty)</span>
        <div className="flex gap-2">
          <input
            value={heroImage}
            onChange={(e) => setHeroImage(e.target.value)}
            placeholder="/media/… or /public path"
            className={`${inputCls} font-mono text-xs`}
          />
          <button
            onClick={() => setPickingHero(true)}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border px-2.5 text-xs font-medium text-foreground hover:bg-muted"
          >
            <ImagePlus className="h-3.5 w-3.5" />
            Library
          </button>
        </div>
      </div>

      {/* Highlights */}
      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-muted-foreground">Highlights: one paragraph per line, shown as the detail story</span>
        <textarea
          value={highlights}
          onChange={(e) => setHighlights(e.target.value)}
          rows={6}
          className={`${inputCls} min-h-[120px] resize-y leading-relaxed`}
        />
      </label>

      {/* Skills */}
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-muted-foreground">Skills: sidebar tools (falls back to project tech)</span>
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
          {skills.map((s) => (
            <span key={s} className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">
              {s}
              <button onClick={() => setSkills((prev) => prev.filter((x) => x !== s))} className="text-muted-foreground hover:text-foreground">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          <input
            value={skillDraft}
            onChange={(e) => setSkillDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault()
                addSkill(skillDraft)
              } else if (e.key === "Backspace" && !skillDraft && skills.length) {
                setSkills((prev) => prev.slice(0, -1))
              }
            }}
            onBlur={() => skillDraft && addSkill(skillDraft)}
            placeholder={skills.length ? "" : "Add skills…"}
            className="min-w-[100px] flex-1 bg-transparent text-sm text-foreground outline-none"
          />
        </div>
      </div>

      {/* Links */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">Links: repos or related pages, shown in the detail sidebar</span>
          <button
            onClick={() => setLinks((prev) => [...prev, { label: "", url: "" }])}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
          >
            <Plus className="h-3.5 w-3.5" />
            Add link
          </button>
        </div>
        {links.map((l, index) => (
          <div key={index} className="flex gap-2">
            <input
              value={l.label}
              onChange={(e) => setLinks((prev) => prev.map((x, i) => (i === index ? { ...x, label: e.target.value } : x)))}
              placeholder="Label"
              className={`${inputCls} max-w-[220px]`}
            />
            <input
              value={l.url}
              onChange={(e) => setLinks((prev) => prev.map((x, i) => (i === index ? { ...x, url: e.target.value } : x)))}
              placeholder="https://github.com/… or /projects"
              className={`${inputCls} font-mono text-xs`}
            />
            <button
              onClick={() => setLinks((prev) => prev.filter((_, i) => i !== index))}
              className="rounded p-1 text-red-600 hover:bg-muted dark:text-red-400"
              aria-label="Remove link"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Embedded projects */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">Projects: work done in this role, shown on the detail page</span>
          <button
            onClick={() => setProjects((prev) => [...prev, { title: "", description: "", tech: "", link: "" }])}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
          >
            <Plus className="h-3.5 w-3.5" />
            Add project
          </button>
        </div>

        {projects.map((p, index) => (
          <div key={index} className="flex flex-col gap-2 rounded-xl border border-border bg-card p-3">
            <div className="flex items-center gap-2">
              <input
                value={p.title}
                onChange={(e) => patchProject(index, { title: e.target.value })}
                placeholder="Project title"
                className={`${inputCls} font-semibold`}
              />
              <button
                onClick={() => moveProject(index, -1)}
                disabled={index === 0}
                className="rounded p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                aria-label="Move up"
              >
                <ChevronUp className="h-4 w-4" />
              </button>
              <button
                onClick={() => moveProject(index, 1)}
                disabled={index === projects.length - 1}
                className="rounded p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                aria-label="Move down"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
              <button
                onClick={() => setProjects((prev) => prev.filter((_, i) => i !== index))}
                className="rounded p-1 text-red-600 hover:bg-muted dark:text-red-400"
                aria-label="Remove project"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <textarea
              value={p.description}
              onChange={(e) => patchProject(index, { description: e.target.value })}
              placeholder="One paragraph per line"
              rows={3}
              className={`${inputCls} resize-y leading-relaxed`}
            />
            <div className="flex gap-2">
              <input
                value={p.tech}
                onChange={(e) => patchProject(index, { tech: e.target.value })}
                placeholder="Tech, comma-separated"
                className={inputCls}
              />
              <input
                value={p.link}
                onChange={(e) => patchProject(index, { link: e.target.value })}
                placeholder="Link (optional)"
                className={`${inputCls} font-mono text-xs`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Visibility */}
      <div className="flex flex-col gap-1.5 border-t border-border pt-4">
        <span className="text-xs font-medium text-muted-foreground">Visibility</span>
        <div className="inline-flex w-fit rounded-lg border border-border bg-background p-1">
          {VISIBILITIES.map((v) => (
            <button
              key={v.value}
              onClick={() => setVisibility(v.value)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                visibility === v.value ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
        <span className="text-xs text-muted-foreground">{visibilityMeta(visibility).desc}</span>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="ml-auto flex items-center gap-2">
          {mode === "edit" &&
            (confirmDelete ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sure?</span>
                <button onClick={doDelete} disabled={saving} className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50">
                  Delete
                </button>
                <button onClick={() => setConfirmDelete(false)} className="rounded-lg border border-border px-3 py-2 text-sm hover:bg-muted">
                  Cancel
                </button>
              </div>
            ) : (
              <button onClick={() => setConfirmDelete(true)} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-red-600 hover:bg-muted dark:text-red-400">
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            ))}
          <button
            onClick={() => router.push("/admin/experiences")}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={saving || !role.trim() || !company.trim()}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90 disabled:opacity-50"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Save {visibilityMeta(visibility).label.toLowerCase()}
          </button>
        </div>
      </div>

      <MediaPicker
        open={pickingHero}
        onClose={() => setPickingHero(false)}
        onSelect={(asset: Asset) => {
          setHeroImage(asset.publicUrl)
          setPickingHero(false)
        }}
        title="Choose a hero image"
      />
    </div>
  )
}
