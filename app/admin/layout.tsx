// Everything under /admin reads live data and is auth-gated: never prerender
// or cache it. This segment config cascades to all nested admin routes.
export const dynamic = "force-dynamic"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children
}
