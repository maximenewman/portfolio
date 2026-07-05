import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

const VIDEO_RE = /\.(mp4|webm|mov)(\?|#|$)/i

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
          img({ src, alt }) {
            const url = typeof src === "string" ? src : ""
            if (VIDEO_RE.test(url)) {
              return (
                <video
                  src={url}
                  controls
                  preload="metadata"
                  className="my-5 w-full rounded-lg border border-border"
                />
              )
            }
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={url}
                alt={alt ?? ""}
                loading="lazy"
                className="my-5 w-full rounded-lg border border-border"
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
