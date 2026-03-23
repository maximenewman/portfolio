"use client"

import Image from "next/image"
import { FileText, ArrowDown, Github, Linkedin, Mail } from "lucide-react"

export const bioData = {
  name: "Maxime Newman Nereyabagabo",
  title: "Software Developer & Cybersecurity Enthusiast",
  email: "mnn6@sfu.ca",
  description: [
    `Hello, welcome to my Universe! I'm Max, currently I'm pursuing Computer Science at Simon Fraser University, focusing on machine learning, networking, and embedded systems.`,
    `There is no a unique purpose for programming, I see it as a big toolbox that can be used solve complex problems. One of these tools that has sky rocketed is generative AI, and while some are concerned on the growing dependency for it in our daily lives, I see it as inevitable progression of the human race in search for innovation. Before, we had to scavenge for food, and now we are eliminating mundane tasks that will give us more time for progression. With this in mind I pride myself in integrating AI into products to facilitate users' experiences when navigating the vast tech world.`,
    `Besides that I'm an athlete, I love football, running, hiking, and snowboarding. I've played competitively in both FVSL and VMSL Prem so if you're looking for a player to bring your team to victory I'm your man!`,
  ],
  picture: "/LinkedInpp.JPG",
  resumePath: "/resume/Maxime_resume.pdf",
  socials: {
    github: "https://github.com/maximenewman",
    linkedin: "https://www.linkedin.com/in/maxime-newman-a546b42b5",
  },
}

export default function MyBio() {
  const openResume = () => {
    window.open(bioData.resumePath, "_blank", "noopener,noreferrer")
  }

  return (
    <section className="relative min-h-[calc(100vh-5rem)] overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        {/* Hero Section - Above the fold */}
        <div className="flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center py-8 md:flex-row md:gap-12 md:py-12 lg:gap-20">
          {/* Profile Image - Centered and prominent */}
          <div className="stagger-children mb-8 flex flex-col items-center md:mb-0">
            <div className="relative">
              {/* Decorative ring */}
              <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-primary/40 to-primary/10 blur-sm" />
              <div className="relative h-48 w-48 overflow-hidden rounded-full border-4 border-card shadow-xl md:h-64 md:w-64 lg:h-72 lg:w-72">
                <Image
                  src={bioData.picture}
                  alt={`Picture of ${bioData.name}`}
                  fill
                  sizes="(max-width: 768px) 192px, 288px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="stagger-children flex max-w-xl flex-col items-center text-center md:items-start md:text-left">
            {/* Name and title */}
            <div>
              <p className="mb-2 text-sm font-medium uppercase tracking-widest text-primary md:text-base">
                Welcome to my Universe
              </p>
              <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
                {bioData.name}
              </h1>
              <p className="mt-2 text-lg text-muted-foreground md:text-xl">
                {bioData.title}
              </p>
            </div>

            {/* Short intro */}
            <p className="mt-6 text-pretty leading-relaxed text-muted-foreground">
              Computer Science student at Simon Fraser University, passionate about machine learning, 
              networking, and embedded systems. Building the future with AI-powered solutions.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 md:justify-start">
              <button
                onClick={openResume}
                className="btn-hover inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-colors hover:bg-primary/90"
              >
                <FileText className="h-4 w-4" />
                View Resume
              </button>
              <a
                href={`mailto:${bioData.email}`}
                className="btn-hover inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3 text-sm font-semibold text-card-foreground transition-colors hover:bg-muted"
              >
                <Mail className="h-4 w-4" />
                Contact Me
              </a>
            </div>

            {/* Social links */}
            <div className="mt-6 flex items-center gap-4">
              <a
                href={bioData.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-hover rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href={bioData.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-hover rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 animate-bounce md:block">
          <ArrowDown className="h-6 w-6 text-muted-foreground" />
        </div>
      </div>

      {/* About Section - Below the fold */}
      <div className="border-t border-border bg-card/50">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-center text-2xl font-bold text-foreground md:text-3xl">
              About Me
            </h2>
            <div className="space-y-6">
              {bioData.description.map((desc, i) => (
                <p
                  key={i}
                  className="text-pretty leading-relaxed text-muted-foreground"
                >
                  {desc}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
