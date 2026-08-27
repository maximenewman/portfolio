"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronUp, ChevronDown, ImagePlus, Loader2, Plus, Trash2 } from "lucide-react"
import type { Asset, PassionMediaLink } from "@/db/schema"
import { PASSION_ICONS } from "@/lib/passions"
import { VISIBILITIES, visibilityMeta, slugify } from "@/lib/posts"
import { MediaPicker } from "../components/media-picker"
import { createPassionAction, updatePassionAction, deletePassionAction, type PassionInput, type PassionImageInput } from "./actions"

// Timeline entries edit their items as one text block, one item per line.
type TimelineDraft = { date: string; items: string }

export type PassionEditorInitial = {
  title: string
  slug: string
  description: string
  icon: string
  details: string[]
  mediaLinks: PassionMediaLink[]
  images: PassionImageInput[]
  videoEmbed: string
  timeline: TimelineDraft[]
  imagePosition: string
  visibility: string
}

type Props = {
  mode: "create" | "edit"
  passionId?: string
  initial: PassionEditorInitial
}

export function PassionEditor({ mode, passionId, initial }: Props) {
  const router = useRouter()
  const [title, setTitle] = useState(initial.title)
  const [slug, setSlug] = useState(initial.slug)
  const [slugEdited, setSlugEdited] = useState(mode === "edit")
  const [description, setDescription] = useState(initial.description)
  const [icon, setIcon] = useState(initial.icon)
  // One paragraph per line, mirroring the projects editor's bullets.
  const [details, setDetails] = useState(initial.details.join("\n"))
  const [mediaLinks, setMediaLinks] = useState<PassionMediaLink[]>(initial.mediaLinks)
  const [images, setImages] = useState<PassionImageInput[]>(initial.images)
  const [videoEmbed, setVideoEmbed] = useState(initial.videoEmbed)
  const [timeline, setTimeline] = useState<TimelineDraft[]>(initial.timeline)
  const [imagePosition, setImagePosition] = useState(initial.imagePosition)
  const [visibility, setVisibility] = useState(initial.visibility)

  const [picker, setPicker] = useState<number | null>(null) // image row being filled
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)

  function onTitle(v: string) {
    setTitle(v)
    if (!slugEdited) setSlug(slugify(v))
  }

  function patchImage(index: number, patch: Partial<PassionImageInput>) {
    setImages((prev) => prev.map((m, i) => (i === index ? { ...m, ...patch } : m)))
  }

  function moveImage(index: number, dir: -1 | 1) {
    setImages((prev) => {
      const next = [...prev]
      const j = index + dir
      if (j < 0 || j >= next.length) return prev
      ;[next[index], next[j]] = [next[j], next[index]]
      return next
    })
  }

  function onPick(asset: Asset) {
    if (picker !== null) {
      patchImage(picker, { src: asset.publicUrl })
    }
    setPicker(null)
  }

  async function save() {
    setSaving(true)
    setError(null)
    const input: PassionInput = {
      title,
      slug,
      description,
      icon,
      details: details.split("\n").map((d) => d.trim()).filter(Boolean),
      mediaLinks,
      images,
      videoEmbed,
      timeline: timeline.map((t) => ({
        date: t.date,
        items: t.items.split("\n").map((x) => x.trim()).filter(Boolean),
      })),
      imagePosition,
      visibility,
    }
    const res = mode === "create" ? await createPassionAction(input) : await updatePassionAction(passionId!, input)
    if (res.ok) {
      router.push("/admin/passions")
      router.refresh()
    } else {
      setError(res.error)
      setSaving(false)
    }
  }

  async function doDelete() {
    setSaving(true)
    const res = await deletePassionAction(passionId!)
    if (res.ok) {
      router.push("/admin/passions")
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
        onChange={(e) => onTitle(e.target.value)}
        placeholder="Passion title"
        className="w-full bg-transparent text-2xl font-bold text-foreground outline-none placeholder:text-muted-foreground md:text-3xl"
      />

      {/* Meta row */}
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground">Icon</span>
          <select value={icon} onChange={(e) => setIcon(e.target.value)} className={inputCls}>
            {PASSION_ICONS.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground">Image crop</span>
          <select value={imagePosition} onChange={(e) => setImagePosition(e.target.value)} className={inputCls}>
            <option value="center">Center</option>
            <option value="top">Top (keeps heads in frame)</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 sm:col-span-2">
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

      {/* Description */}
      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-muted-foreground">Description: short blurb shown on the card</span>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className={inputCls} />
      </label>

      {/* Details */}
      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-muted-foreground">Details: one paragraph per line, shown in the modal</span>
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          rows={6}
          className={`${inputCls} min-h-[140px] resize-y leading-relaxed`}
        />
      </label>

      {/* Media links */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">Links: external profiles shown in the modal</span>
          <button
            onClick={() => setMediaLinks((prev) => [...prev, { label: "", url: "" }])}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
          >
            <Plus className="h-3.5 w-3.5" />
            Add link
          </button>
        </div>
        {mediaLinks.map((m, index) => (
          <div key={index} className="flex gap-2">
            <input
              value={m.label}
              onChange={(e) => setMediaLinks((prev) => prev.map((x, i) => (i === index ? { ...x, label: e.target.value } : x)))}
              placeholder="Label"
              className={`${inputCls} max-w-[220px]`}
            />
            <input
              value={m.url}
              onChange={(e) => setMediaLinks((prev) => prev.map((x, i) => (i === index ? { ...x, url: e.target.value } : x)))}
              placeholder="https://…"
              className={`${inputCls} font-mono text-xs`}
            />
            <button
              onClick={() => setMediaLinks((prev) => prev.filter((_, i) => i !== index))}
              className="rounded p-1 text-red-600 hover:bg-muted dark:text-red-400"
              aria-label="Remove link"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Video embed */}
      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-muted-foreground">Video embed URL (optional, shown in the modal)</span>
        <input
          value={videoEmbed}
          onChange={(e) => setVideoEmbed(e.target.value)}
          placeholder="https://www.tiktok.com/embed/v2/… or https://youtube.com/embed/…"
          className={`${inputCls} font-mono text-xs`}
        />
      </label>

      {/* Images */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">Photos: first four show on the featured card</span>
          <button
            onClick={() => setImages((prev) => [...prev, { src: "", alt: "" }])}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
          >
            <Plus className="h-3.5 w-3.5" />
            Add photo
          </button>
        </div>

        {images.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
            No photos yet.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {images.map((item, index) => (
              <div key={index} className="flex items-center gap-2 rounded-xl border border-border bg-card p-2">
                <div className="flex flex-col">
                  <button
                    onClick={() => moveImage(index, -1)}
                    disabled={index === 0}
                    className="rounded p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30"
                    aria-label="Move up"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => moveImage(index, 1)}
                    disabled={index === images.length - 1}
                    className="rounded p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30"
                    aria-label="Move down"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
                <input
                  value={item.src}
                  onChange={(e) => patchImage(index, { src: e.target.value })}
                  placeholder="Image URL"
                  className={`${inputCls} font-mono text-xs`}
                />
                <button
                  onClick={() => setPicker(index)}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border px-2.5 py-2 text-xs font-medium text-foreground hover:bg-muted"
                >
                  <ImagePlus className="h-3.5 w-3.5" />
                  Library
                </button>
                <input
                  value={item.alt}
                  onChange={(e) => patchImage(index, { alt: e.target.value })}
                  placeholder="Alt text"
                  className={`${inputCls} max-w-[240px]`}
                />
                <button
                  onClick={() => setImages((prev) => prev.filter((_, i) => i !== index))}
                  className="rounded p-1 text-red-600 hover:bg-muted dark:text-red-400"
                  aria-label="Remove photo"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">Timeline: milestones, oldest first (optional)</span>
          <button
            onClick={() => setTimeline((prev) => [...prev, { date: "", items: "" }])}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
          >
            <Plus className="h-3.5 w-3.5" />
            Add milestone
          </button>
        </div>
        {timeline.map((t, index) => (
          <div key={index} className="flex gap-2">
            <input
              value={t.date}
              onChange={(e) => setTimeline((prev) => prev.map((x, i) => (i === index ? { ...x, date: e.target.value } : x)))}
              placeholder="Jul 2026"
              className={`${inputCls} max-w-[140px]`}
            />
            <textarea
              value={t.items}
              onChange={(e) => setTimeline((prev) => prev.map((x, i) => (i === index ? { ...x, items: e.target.value } : x)))}
              placeholder="One achievement per line"
              rows={1}
              className={`${inputCls} resize-y`}
            />
            <button
              onClick={() => setTimeline((prev) => prev.filter((_, i) => i !== index))}
              className="rounded p-1 text-red-600 hover:bg-muted dark:text-red-400"
              aria-label="Remove milestone"
            >
              <Trash2 className="h-4 w-4" />
            </button>
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
            onClick={() => router.push("/admin/passions")}
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

      <MediaPicker open={picker !== null} onClose={() => setPicker(null)} onSelect={onPick} title="Choose a photo" />
    </div>
  )
}
