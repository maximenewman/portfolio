import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

// The portfolio is fully public. Only the admin surface requires auth — and
// beyond being signed in, the user must be on the owner allowlist. Everything
// else falls through untouched.
const isAdminRoute = createRouteMatcher(["/admin(.*)", "/api/admin(.*)"])

function adminIds(): Set<string> {
  return new Set(
    (process.env.ADMIN_USER_IDS ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  )
}

export default clerkMiddleware(async (auth, req) => {
  if (!isAdminRoute(req)) return

  const { userId, redirectToSignIn } = await auth()
  if (!userId) return redirectToSignIn()

  // Signed in but not the owner → bounce to home rather than leak the admin UI.
  if (!adminIds().has(userId)) {
    return NextResponse.redirect(new URL("/", req.url))
  }
})

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
}
