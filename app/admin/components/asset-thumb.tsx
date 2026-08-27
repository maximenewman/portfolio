import Image from "next/image"
import { FileText, Film } from "lucide-react"
import type { Asset } from "@/db/schema"

/** Square thumbnail for an asset: image preview, muted video poster, or a
 *  document icon. Used across the media library and post editor. */
export function AssetThumb({ asset, className = "" }: { asset: Asset; className?: string }) {
  if (asset.kind === "image") {
    return (
      <Image
        src={asset.publicUrl}
        alt={asset.originalName ?? "image"}
        width={asset.width ?? 400}
        height={asset.height ?? 400}
        className={`h-full w-full object-cover ${className}`}
        unoptimized={asset.mime === "image/svg+xml" || asset.mime === "image/gif"}
      />
    )
  }
  if (asset.kind === "video") {
    return (
      <div className={`relative h-full w-full ${className}`}>
        <video src={asset.publicUrl} className="h-full w-full object-cover" muted preload="metadata" />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20">
          <Film className="h-6 w-6 text-white/90" />
        </div>
      </div>
    )
  }
  return (
    <div className={`flex h-full w-full flex-col items-center justify-center gap-1 bg-muted ${className}`}>
      <FileText className="h-6 w-6 text-muted-foreground" />
      <span className="px-1 text-[10px] uppercase text-muted-foreground">{asset.mime.split("/")[1]}</span>
    </div>
  )
}
