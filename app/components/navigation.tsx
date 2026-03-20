"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Menu, X } from "lucide-react"

const pageRoutes = [
  { name: "Home", link: "/" },
  { name: "Experiences", link: "/experiences" },
  { name: "Projects", link: "/projects" },
  { name: "My Passions", link: "/passions" },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center md:h-20">
          {/* Logo - Far Left */}
          <Link href="/" className="mr-auto flex items-center">
            <Image
              src="/logo.png"
              alt="Logo of Maxime"
              width={64}
              height={64}
              className="h-12 w-12 md:h-16 md:w-16"
            />
          </Link>

          {/* Desktop Navigation - Centered */}
          <ul className="absolute left-1/2 hidden -translate-x-1/2 gap-1 md:flex">
            {pageRoutes.map((page) => (
              <li key={page.link}>
                <Link
                  href={page.link}
                  className="rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-white/10"
                >
                  {page.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            className="rounded-md p-2 transition-colors hover:bg-white/10 md:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {open && (
          <div className="border-t border-white/20 pb-4 md:hidden">
            <nav className="flex flex-col gap-2 pt-4">
              {pageRoutes.map((page) => (
                <Link
                  key={page.link}
                  href={page.link}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-white/10"
                >
                  {page.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </nav>
  )
}
