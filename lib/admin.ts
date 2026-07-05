import { auth } from "@clerk/nextjs/server"

/** Owner allowlist from env — the Clerk user IDs permitted into /admin. */
export function adminIds(): Set<string> {
  return new Set(
    (process.env.ADMIN_USER_IDS ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  )
}

export function isAdminUser(userId: string | null | undefined): boolean {
  return !!userId && adminIds().has(userId)
}

/** True if the current request is from an allowlisted owner. Safe in RSC. */
export async function isCurrentUserAdmin(): Promise<boolean> {
  const { userId } = await auth()
  return isAdminUser(userId)
}

/**
 * Guard for server actions / route handlers. Throws if the caller isn't the
 * owner — middleware already blocks page navigation, but mutations must
 * re-check since they can be invoked directly.
 */
export async function requireAdmin(): Promise<string> {
  const { userId } = await auth()
  if (!isAdminUser(userId)) throw new Error("Unauthorized")
  return userId as string
}
