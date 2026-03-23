import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import Navbar from "./components/navigation"
import Footer from "./components/footer"
import { ThemeProvider } from "./components/theme-provider"
import PageNavigationWrapper from "./components/page-navigation-wrapper"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Maxime Newman | Portfolio",
  description: `Software developer and Cybersecurity enthusiast. Explore my experiences, projects, and passions.`,
  icons: {
    icon: "/logo.png",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#16a34a" },
    { media: "(prefers-color-scheme: dark)", color: "#22c55e" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col font-sans antialiased`}
      >
        <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem('theme')||(window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');document.documentElement.classList.toggle('dark',t==='dark')}catch(e){}` }} />
        <ThemeProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <PageNavigationWrapper />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
