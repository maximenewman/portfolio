"use client"

import { useEffect, useRef, useState } from "react"
import { X, Upload } from "lucide-react"
import type { Asset } from "@/db/schema"
import { AssetThumb } from "./asset-thumb"
import { uploadFile, formatBytes } from "../media/upload-client"

type Props = {
  open: boolean
  onClose: () => void
  onSelect: (asset: Asset) => void
  title?: string
}

/** Modal grid of the media library. Pick an existing asset or upload a new one
 *  inline, then hand it back to the caller (cover picker / body inserter). */
export function MediaPicker({ open, onClose, onSelect, title = "Select media" }: Props) {
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(false)
  const [busy, setBusy] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    setLoading(true)
    fetch("/api/admin/assets")
      .then((r) => r.json())
      .then((d) => setAssets(d.assets ?? []))
      .finally(() => setLoading(false))
  }, [open])

  if (!open) return null

  async function handleUpload(files: FileList | null) {
    if (!files?.length) return
    setBusy(true)
    try {
      for (const file of Array.from(files)) {
        const { asset } = await uploadFile(file)
        setAssets((prev) => (prev.some((a) => a.id === asset.id) ? prev : [asset, ...prev]))
      }
    } catch (err) {
      alert((err as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <h2 className="font-semibold text-card-foreground">{title}</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="inline-flex items-center gap-1.5 rounded-lg border border-primary/40 bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20 disabled:opacity-50"
            >
              <Upload className="h-4 w-4" />
              {busy ? "Uploading…" : "Upload"}
            </button>
            <button onClick={onClose} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted" aria-label="Close">
              <X className="h-5 w-5" />
            </button>
            <input
              ref={inputRef}
              type="file"
              multiple
              accept="image/*,video/*,application/pdf"
              className="hidden"
              onChange={(e) => handleUpload(e.target.files)}
            />
          </div>
        </div>

        <div className="overflow-y-auto p-5">
          {loading ? (
            <p className="py-10 text-center text-sm text-muted-foreground">Loading…</p>
          ) : assets.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">No media yet. Upload something.</p>
          ) : (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {assets.map((asset) => (
                <button
                  key={asset.id}
                  onClick={() => onSelect(asset)}
                  className="group overflow-hidden rounded-xl border border-border bg-card text-left transition-all hover:ring-2 hover:ring-primary"
                >
                  <div className="relative aspect-square bg-muted">
                    <AssetThumb asset={asset} />
                  </div>
                  <div className="flex items-center justify-between gap-1 px-2 py-1.5">
                    <span className="truncate text-[11px] text-card-foreground">
                      {asset.originalName ?? asset.key.split("/").pop()}
                    </span>
                    <span className="shrink-0 text-[9px] text-muted-foreground">{formatBytes(asset.size)}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
