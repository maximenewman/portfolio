import type { CSSProperties } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

const VIDEO_RE = /\.(mp4|webm|mov)(\?|#|$)/i

// Size keywords / explicit widths carried in the markdown image title:
//   ![alt](url "medium")   ![alt](url "w=300")   ![alt](url "w=50%")
const SIZE_KEYWORDS: Record<string, string> = {
  small: "max-w-[240px]",
  medium: "max-w-[420px]",
  large: "max-w-[640px]",
  full: "",
}

function mediaSize(title?: string | null): { className: string; style?: CSSProperties } {
  const t = (title ?? "").trim().toLowerCase()
  if (t in SIZE_KEYWORDS) {
    const max = SIZE_KEYWORDS[t]
    return { className: max ? `w-full ${max} mx-auto` : "w-full" }
  }
  const m = t.match(/^w=(\d+)(%?)$/)
  if (m) {
    return { className: "mx-auto", style: { width: "100%", maxWidth: m[2] ? `${m[1]}%` : `${m[1]}px` } }
  }
  return { className: "w-full" } // no hint → full width (backwards compatible)
}

/**
 * Renders journal markdown. Media inserted as `![alt](url)` becomes an <img>,
 * or a <video> player when the URL points at a video file — so images and
 * videos interleave naturally in the body. GFM adds tables, task lists, etc.
 */
export function Markdown({ content }: { content: string }) {
  return (
    <div className="md">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          img({ src, alt, title }) {
            const url = typeof src === "string" ? src : ""
            const { className, style } = mediaSize(title)
            if (VIDEO_RE.test(url)) {
              return (
                <video
                  src={url}
                  controls
                  preload="metadata"
                  style={style}
                  className={`my-5 block rounded-lg border border-border ${className}`}
                />
              )
            }
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={url}
                alt={alt ?? ""}
                loading="lazy"
                style={style}
                className={`my-5 block rounded-lg border border-border ${className}`}
              />
            )
          },
          a({ href, children }) {
            const external = typeof href === "string" && /^https?:\/\//.test(href)
            return (
              <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                {children}
              </a>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
