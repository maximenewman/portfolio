"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronUp, ChevronDown, ImagePlus, Loader2, Plus, Trash2, X } from "lucide-react"
import type { Asset, ProjectMediaItem } from "@/db/schema"
import { VISIBILITIES, visibilityMeta } from "@/lib/posts"
import { MediaPicker } from "../components/media-picker"
import { createProjectAction, updateProjectAction, deleteProjectAction, type ProjectInput } from "./actions"

export type ProjectEditorInitial = {
  title: string
  description: string[]
  tech: string[]
  link: string
  playUrl: string
  linkedinPostUrl: string
  media: ProjectMediaItem[]
  visibility: string
}

type Props = {
  mode: "create" | "edit"
  projectId?: string
  initial: ProjectEditorInitial
}

// Which media-item field the picker is currently filling.
type PickTarget = { index: number; field: "src" | "thumbnailSrc" } | null

export function ProjectEditor({ mode, projectId, initial }: Props) {
  const router = useRouter()
  const [title, setTitle] = useState(initial.title)
  // One bullet per line: bullets are sentences, so a single textarea beats
  // managing a list of inputs.
  const [description, setDescription] = useState(initial.description.join("\n"))
  const [tech, setTech] = useState<string[]>(initial.tech)
  const [techDraft, setTechDraft] = useState("")
  const [link, setLink] = useState(initial.link)
  const [playUrl, setPlayUrl] = useState(initial.playUrl)
  const [linkedinPostUrl, setLinkedinPostUrl] = useState(initial.linkedinPostUrl)
  const [media, setMedia] = useState<ProjectMediaItem[]>(initial.media)
  const [visibility, setVisibility] = useState(initial.visibility)

  const [picker, setPicker] = useState<PickTarget>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)

  function addTech(raw: string) {
    const t = raw.trim().replace(/,$/, "")
    if (t && !tech.includes(t) && tech.length < 16) setTech((prev) => [...prev, t])
    setTechDraft("")
  }

  function patchMedia(index: number, patch: Partial<ProjectMediaItem>) {
    setMedia((prev) => prev.map((m, i) => (i === index ? { ...m, ...patch } : m)))
  }

  function moveMedia(index: number, dir: -1 | 1) {
    setMedia((prev) => {
      const next = [...prev]
      const j = index + dir
      if (j < 0 || j >= next.length) return prev
      ;[next[index], next[j]] = [next[j], next[index]]
      return next
    })
  }

  function onPick(asset: Asset) {
    if (picker) {
      if (picker.field === "src") {
        patchMedia(picker.index, {
          src: asset.publicUrl,
          type: asset.kind === "video" ? "video" : "image",
        })
      } else {
        patchMedia(picker.index, { thumbnailSrc: asset.publicUrl })
      }
    }
    setPicker(null)
  }

  async function save() {
    setSaving(true)
    setError(null)
    const input: ProjectInput = {
      title,
      description: description.split("\n").map((d) => d.trim()).filter(Boolean),
      tech,
      link,
      playUrl,
      linkedinPostUrl,
      media,
      visibility,
    }
    const res = mode === "create" ? await createProjectAction(input) : await updateProjectAction(projectId!, input)
    if (res.ok) {
      router.push("/admin/projects")
      router.refresh()
    } else {
      setError(res.error)
      setSaving(false)
    }
  }

  async function doDelete() {
    setSaving(true)
    const res = await deleteProjectAction(projectId!)
    if (res.ok) {
      router.push("/admin/projects")
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

      {/* Title */}
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Project title"
        className="w-full bg-transparent text-2xl font-bold text-foreground outline-none placeholder:text-muted-foreground md:text-3xl"
      />

      {/* Description bullets */}
      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-muted-foreground">Description: one bullet point per line</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
          placeholder={"Built an interactive dashboard…\nQuantified a $47K seasonal return…"}
          className={`${inputCls} min-h-[140px] resize-y leading-relaxed`}
        />
      </label>

      {/* Tech tags */}
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-muted-foreground">Technologies</span>
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
          {tech.map((t) => (
            <span key={t} className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">
              {t}
              <button onClick={() => setTech((prev) => prev.filter((x) => x !== t))} className="text-muted-foreground hover:text-foreground">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          <input
            value={techDraft}
            onChange={(e) => setTechDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault()
                addTech(techDraft)
              } else if (e.key === "Backspace" && !techDraft && tech.length) {
                setTech((prev) => prev.slice(0, -1))
              }
            }}
            onBlur={() => techDraft && addTech(techDraft)}
            placeholder={tech.length ? "" : "Add technologies…"}
            className="min-w-[100px] flex-1 bg-transparent text-sm text-foreground outline-none"
          />
        </div>
      </div>

      {/* Links */}
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground">Project link (GitHub etc.)</span>
          <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://github.com/…" className={inputCls} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground">Play URL (optional)</span>
          <input value={playUrl} onChange={(e) => setPlayUrl(e.target.value)} placeholder="/goblinskeep" className={inputCls} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground">LinkedIn post (optional)</span>
          <input value={linkedinPostUrl} onChange={(e) => setLinkedinPostUrl(e.target.value)} placeholder="https://linkedin.com/…" className={inputCls} />
        </label>
      </div>

      {/* Media */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">Media: images, YouTube embeds, or video files</span>
          <button
            onClick={() => setMedia((prev) => [...prev, { type: "image", src: "" }])}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
          >
            <Plus className="h-3.5 w-3.5" />
            Add media
          </button>
        </div>

        {media.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
            No media yet.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {media.map((item, index) => (
              <div key={index} className="flex flex-col gap-2 rounded-xl border border-border bg-card p-3">
                <div className="flex items-center gap-2">
                  <select
                    value={item.type}
                    onChange={(e) => patchMedia(index, { type: e.target.value as "image" | "video" })}
                    className="rounded-lg border border-border bg-background px-2 py-1.5 text-xs text-foreground outline-none focus:border-primary"
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                  <span className="flex-1" />
                  <button
                    onClick={() => moveMedia(index, -1)}
                    disabled={index === 0}
                    className="rounded p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                    aria-label="Move up"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => moveMedia(index, 1)}
                    disabled={index === media.length - 1}
                    className="rounded p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                    aria-label="Move down"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setMedia((prev) => prev.filter((_, i) => i !== index))}
                    className="rounded p-1 text-red-600 hover:bg-muted dark:text-red-400"
                    aria-label="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex gap-2">
                  <input
                    value={item.src}
                    onChange={(e) => patchMedia(index, { src: e.target.value })}
                    placeholder={item.type === "video" ? "https://youtube.com/embed/… or video file URL" : "Image URL"}
                    className={`${inputCls} font-mono text-xs`}
                  />
                  <button
                    onClick={() => setPicker({ index, field: "src" })}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border px-2.5 text-xs font-medium text-foreground hover:bg-muted"
                  >
                    <ImagePlus className="h-3.5 w-3.5" />
                    Library
                  </button>
                </div>

                <input
                  value={item.alt ?? ""}
                  onChange={(e) => patchMedia(index, { alt: e.target.value })}
                  placeholder="Alt text / caption"
                  className={inputCls}
                />

                {item.type === "video" && (
                  <div className="flex gap-2">
                    <input
                      value={item.thumbnailSrc ?? ""}
                      onChange={(e) => patchMedia(index, { thumbnailSrc: e.target.value })}
                      placeholder="Thumbnail image URL (shown before play)"
                      className={`${inputCls} font-mono text-xs`}
                    />
                    <button
                      onClick={() => setPicker({ index, field: "thumbnailSrc" })}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border px-2.5 text-xs font-medium text-foreground hover:bg-muted"
                    >
                      <ImagePlus className="h-3.5 w-3.5" />
                      Library
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
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
            onClick={() => router.push("/admin/projects")}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={saving || !title.trim()}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90 disabled:opacity-50"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Save {visibilityMeta(visibility).label.toLowerCase()}
          </button>
        </div>
      </div>

      <MediaPicker
        open={picker !== null}
        onClose={() => setPicker(null)}
        onSelect={onPick}
        title={picker?.field === "thumbnailSrc" ? "Choose a video thumbnail" : "Choose media"}
      />
    </div>
  )
}
