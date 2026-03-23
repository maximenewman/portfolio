"use client"

import { usePathname } from "next/navigation"
import PageNavigation from "./page-navigation"

export default function PageNavigationWrapper() {
  const pathname = usePathname()
  return <PageNavigation currentPath={pathname} />
}
