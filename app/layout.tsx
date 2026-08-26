import { ClerkProvider } from "@clerk/nextjs"
import type { Metadata, Viewport } from "next"
import { Archivo, Geist_Mono, Instrument_Serif, Inter } from "next/font/google"
import "./globals.css"
import Navbar from "./components/navigation"
import Footer from "./components/footer"
import { ThemeProvider } from "./components/theme-provider"
import { MotionProvider } from "./components/motion-provider"
import { RevealObserver } from "./components/reveal-observer"
import Backdrop from "./components/webgl/backdrop"

// Display face for headings — a grotesque tight enough to hold together at
// 8.5rem, which is where the fluid `text-display` scale tops out.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
})

// One high-contrast serif sentence per section; 400 is the only weight used.
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
})

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Maxime Newman | Portfolio",
  description:
    "Software engineer working on AI security, systems, and the parts of machine learning that touch real hardware. Experiences, projects, and passions.",
  icons: {
    icon: "/logo.png",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f6f0" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0e0d" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        {/* Applies the stored theme and motion preference before first paint.
            Without this the page renders light, then snaps dark on hydration. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var d=document.documentElement;var t=localStorage.getItem('theme')||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');d.classList.toggle('dark',t==='dark');var m=localStorage.getItem('motion-paused')==='1'||matchMedia('(prefers-reduced-motion:reduce)').matches;d.dataset.motion=m?'paused':'running'}catch(e){}`,
          }}
        />
      </head>
      <body
        className={`${archivo.variable} ${instrumentSerif.variable} ${inter.variable} ${geistMono.variable} flex min-h-svh flex-col font-sans antialiased`}
      >
        <ClerkProvider appearance={{ variables: { colorPrimary: "#15803d" } }}>
          <ThemeProvider>
            <MotionProvider>
              {/* One WebGL context for the whole site, mounted once so route
                  changes never tear down and rebuild the GPU resources. */}
              <Backdrop />
              <RevealObserver />
              <a
                href="#main"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground"
              >
                Skip to content
              </a>
              <Navbar />
              <main id="main" className="flex-1">
                {children}
              </main>
              <Footer />
            </MotionProvider>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
