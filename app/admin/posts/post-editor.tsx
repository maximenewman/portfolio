"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { ImagePlus, Eye, Pencil, X, Trash2, Loader2 } from "lucide-react"
import type { Asset } from "@/db/schema"
import { POST_KINDS, VISIBILITIES, visibilityMeta, slugify } from "@/lib/posts"
import { Markdown } from "@/app/components/markdown"
import { MediaPicker } from "../components/media-picker"
import { CoverPositioner } from "./cover-positioner"
import { createPostAction, updatePostAction, deletePostAction, type PostInput } from "./actions"

export type EditorInitial = {
  title: string
  slug: string
  summary: string
  body: string
  kind: string
  tags: string[]
  coverAssetId: string | null
  coverPosition: string // CSS object-position "x% y%"
  visibility: string // draft | private | public
  publishedAt: string // yyyy-mm-dd
}

type Props = {
  mode: "create" | "edit"
  postId?: string
  initial: EditorInitial
  initialCover?: Asset | null
}

export function PostEditor({ mode, postId, initial, initialCover }: Props) {
  const router = useRouter()
  const [title, setTitle] = useState(initial.title)
  const [slug, setSlug] = useState(initial.slug)
  const [slugEdited, setSlugEdited] = useState(mode === "edit")
  const [summary, setSummary] = useState(initial.summary)
  const [body, setBody] = useState(initial.body)
  const [kind, setKind] = useState(initial.kind)
  const [tags, setTags] = useState<string[]>(initial.tags)
  const [tagDraft, setTagDraft] = useState("")
  const [coverAssetId, setCoverAssetId] = useState(initial.coverAssetId)
  const [coverPosition, setCoverPosition] = useState(initial.coverPosition)
  const [cover, setCover] = useState<Asset | null>(initialCover ?? null)
  const [visibility, setVisibility] = useState(initial.visibility)
  const [publishedAt, setPublishedAt] = useState(initial.publishedAt)

  const [preview, setPreview] = useState(false)
  const [insertSize, setInsertSize] = useState("medium")
  const [picker, setPicker] = useState<null | "cover" | "body">(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const bodyRef = useRef<HTMLTextAreaElement>(null)

  function onTitle(v: string) {
    setTitle(v)
    if (!slugEdited) setSlug(slugify(v))
  }

  function addTag(raw: string) {
    const t = raw.trim().replace(/,$/, "")
    if (t && !tags.includes(t) && tags.length < 12) setTags((prev) => [...prev, t])
    setTagDraft("")
  }

  function insertIntoBody(text: string) {
    const ta = bodyRef.current
    if (!ta) {
      setBody((b) => b + text)
      return
    }
    const start = ta.selectionStart
    const end = ta.selectionEnd
    setBody((b) => b.slice(0, start) + text + b.slice(end))
    requestAnimationFrame(() => {
      ta.focus()
      ta.selectionStart = ta.selectionEnd = start + text.length
    })
  }

  function onPick(asset: Asset) {
    if (picker === "cover") {
      setCover(asset)
      setCoverAssetId(asset.id)
      setCoverPosition("50% 50%") // reset focal point for the new image
    } else if (picker === "body") {
      const alt = (asset.originalName ?? "media").replace(/\.[^.]+$/, "")
      const token = insertSize === "full" ? "" : ` "${insertSize}"`
      insertIntoBody(`\n![${alt}](${asset.publicUrl}${token})\n`)
    }
    setPicker(null)
  }

  async function save() {
    setSaving(true)
    setError(null)
    const input: PostInput = { title, slug, summary, body, kind, tags, coverAssetId, coverPosition, visibility, publishedAt }
    const res = mode === "create" ? await createPostAction(input) : await updatePostAction(postId!, input)
    if (res.ok) {
      router.push("/admin/posts")
      router.refresh()
    } else {
      setError(res.error)
      setSaving(false)
    }
  }

  async function doDelete() {
    setSaving(true)
    const res = await deletePostAction(postId!)
    if (res.ok) {
      router.push("/admin/posts")
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
        placeholder="Post title"
        className="w-full bg-transparent text-2xl font-bold text-foreground outline-none placeholder:text-muted-foreground md:text-3xl"
      />

      {/* Meta row */}
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground">Date</span>
          <input type="date" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} className={inputCls} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground">Type</span>
          <select value={kind} onChange={(e) => setKind(e.target.value)} className={inputCls}>
            {POST_KINDS.map((k) => (
              <option key={k.value} value={k.value}>
                {k.label}
              </option>
            ))}
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

      {/* Tags */}
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-muted-foreground">Tags</span>
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
          {tags.map((t) => (
            <span key={t} className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">
              {t}
              <button onClick={() => setTags((prev) => prev.filter((x) => x !== t))} className="text-muted-foreground hover:text-foreground">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          <input
            value={tagDraft}
            onChange={(e) => setTagDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault()
                addTag(tagDraft)
              } else if (e.key === "Backspace" && !tagDraft && tags.length) {
                setTags((prev) => prev.slice(0, -1))
              }
            }}
            onBlur={() => tagDraft && addTag(tagDraft)}
            placeholder={tags.length ? "" : "Add tags…"}
            className="min-w-[100px] flex-1 bg-transparent text-sm text-foreground outline-none"
          />
        </div>
      </div>

      {/* Summary */}
      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-muted-foreground">Summary (optional — shown on the blog index)</span>
        <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={2} className={inputCls} />
      </label>

      {/* Cover */}
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-muted-foreground">Cover image</span>
        {cover ? (
          <div className="flex flex-col gap-3">
            <CoverPositioner asset={cover} position={coverPosition} onChange={setCoverPosition} />
            <div className="flex gap-2">
              <button onClick={() => setPicker("cover")} className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-muted">
                Change
              </button>
              <button
                onClick={() => {
                  setCover(null)
                  setCoverAssetId(null)
                }}
                className="rounded-lg border border-border px-3 py-1.5 text-sm text-red-600 hover:bg-muted dark:text-red-400"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setPicker("cover")}
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-dashed border-border px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
          >
            <ImagePlus className="h-4 w-4" />
            Choose cover
          </button>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">Body (Markdown)</span>
          <div className="flex items-center gap-2">
            <select
              value={insertSize}
              onChange={(e) => setInsertSize(e.target.value)}
              title="Size for inserted media"
              className="rounded-lg border border-border bg-background px-2 py-1.5 text-xs text-foreground outline-none focus:border-primary"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
              <option value="full">Full width</option>
            </select>
            <button
              onClick={() => setPicker("body")}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
            >
              <ImagePlus className="h-3.5 w-3.5" />
              Insert media
            </button>
            <button
              onClick={() => setPreview((p) => !p)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
            >
              {preview ? <Pencil className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              {preview ? "Edit" : "Preview"}
            </button>
          </div>
        </div>
        {preview ? (
          <div className="min-h-[300px] rounded-lg border border-border bg-background p-4">
            {body.trim() ? <Markdown content={body} /> : <p className="text-sm text-muted-foreground">Nothing to preview.</p>}
          </div>
        ) : (
          <textarea
            ref={bodyRef}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={16}
            placeholder="Write your journal entry in Markdown. Use **Insert media** to drop in images and videos."
            className={`${inputCls} min-h-[300px] resize-y font-mono leading-relaxed`}
          />
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
            onClick={() => router.push("/admin/posts")}
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
        title={picker === "cover" ? "Choose a cover image" : "Insert media into the post"}
      />
    </div>
  )
}
