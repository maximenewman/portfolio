"use client"

import { useCallback, useRef, useState } from "react"
import { Upload, Trash2, Copy, Check } from "lucide-react"
import type { Asset } from "@/db/schema"
import { AssetThumb } from "../components/asset-thumb"
import { uploadFile, formatBytes } from "./upload-client"

type Uploading = { id: string; name: string; pct: number; error?: string }

export function MediaLibrary({ initialAssets }: { initialAssets: Asset[] }) {
  const [assets, setAssets] = useState<Asset[]>(initialAssets)
  const [uploads, setUploads] = useState<Uploading[]>([])
  const [dragging, setDragging] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const list = Array.from(files)
    for (const file of list) {
      const id = `${file.name}-${file.size}-${Math.round(performance.now())}`
      setUploads((u) => [...u, { id, name: file.name, pct: 0 }])
      try {
        const { asset, deduped } = await uploadFile(file, (pct) =>
          setUploads((u) => u.map((x) => (x.id === id ? { ...x, pct } : x))),
        )
        setAssets((prev) => (prev.some((a) => a.id === asset.id) ? prev : [asset, ...prev]))
        setUploads((u) => u.map((x) => (x.id === id ? { ...x, pct: 100, name: deduped ? `${file.name} (already stored)` : file.name } : x)))
        setTimeout(() => setUploads((u) => u.filter((x) => x.id !== id)), 1500)
      } catch (err) {
        setUploads((u) => u.map((x) => (x.id === id ? { ...x, error: (err as Error).message } : x)))
      }
    }
  }, [])

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragging(false)
      if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files)
    },
    [handleFiles],
  )

  async function remove(asset: Asset) {
    const res = await fetch(`/api/admin/assets/${asset.id}`, { method: "DELETE" })
    if (res.ok) {
      setAssets((prev) => prev.filter((a) => a.id !== asset.id))
    } else {
      const msg = (await res.json().catch(() => ({}))).error || "Delete failed"
      alert(msg)
    }
  }

  function copyUrl(asset: Asset) {
    navigator.clipboard.writeText(asset.publicUrl)
    setCopiedId(asset.id)
    setTimeout(() => setCopiedId((c) => (c === asset.id ? null : c)), 1500)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-10 text-center transition-colors ${
          dragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
        }`}
      >
        <Upload className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm font-medium text-foreground">Drop files or click to upload</p>
        <p className="text-xs text-muted-foreground">Images, videos, and PDFs — identical files are deduped automatically.</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,video/*,application/pdf"
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </div>

      {/* Active uploads */}
      {uploads.length > 0 && (
        <div className="flex flex-col gap-2">
          {uploads.map((u) => (
            <div key={u.id} className="rounded-lg border border-border bg-card p-3">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="truncate text-card-foreground">{u.name}</span>
                {u.error ? (
                  <span className="shrink-0 text-xs text-red-500">{u.error}</span>
                ) : (
                  <span className="shrink-0 text-xs text-muted-foreground">{u.pct}%</span>
                )}
              </div>
              {!u.error && (
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-primary transition-all" style={{ width: `${u.pct}%` }} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Grid */}
      {assets.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">No media yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {assets.map((asset) => (
            <div key={asset.id} className="group overflow-hidden rounded-xl border border-border bg-card">
              <div className="relative aspect-square bg-muted">
                <AssetThumb asset={asset} />
                <div className="absolute inset-x-0 bottom-0 flex justify-end gap-1 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => copyUrl(asset)}
                    title="Copy URL"
                    className="rounded-md bg-white/90 p-1.5 text-black transition-colors hover:bg-white"
                  >
                    {copiedId === asset.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => remove(asset)}
                    title="Delete"
                    className="rounded-md bg-white/90 p-1.5 text-red-600 transition-colors hover:bg-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 px-2.5 py-2">
                <span className="truncate text-xs text-card-foreground" title={asset.originalName ?? ""}>
                  {asset.originalName ?? asset.key.split("/").pop()}
                </span>
                <span className="shrink-0 text-[10px] text-muted-foreground">{formatBytes(asset.size)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
