import Image from "next/image"

export const bioData = {
  name: "Maxime Newman Nereyabagabo",
  email: "mnn6@sfu.ca",
  description: [
    `Hello, welcome to my Universe! I'm Max, currently I'm pursuing Computer Science at Simon Fraser University, focusing on machine learning, networking, and embedded systems.`,
    `There is no a unique purpose for programming, I see it as a big toolbox that can be used solve complex problems. One of these tools that has sky rocketed is generative AI, and while some are concerned on the growing dependency for it in our daily lives, I see it as inevitable progression of the human race in search for innovation. Before, we had to scavenge for food, and now we are eliminating mundane tasks that will give us more time for progression. With this in mind I pride myself in integrating AI into products to facilitate the user experience when navigating the vast tech world.`,
    `Besides that I'm an athlete, I love football, running, hiking, and snowboarding. I've played competitively in both FVSL and VMSL Prem so if you're looking for a player to bring your team to victory I'm your man!`,
  ],
  picture: "/LinkedInpp.JPG",
}

export default function MyBio() {
  return (
    <section className="container mx-auto px-4 py-8 md:py-12">
      <div className="mx-auto max-w-3xl rounded-lg border border-border bg-card p-6 shadow-sm md:p-8">
        <div className="flex flex-col items-center gap-6">
          <div className="relative h-40 w-40 overflow-hidden rounded-full border-4 border-primary/20 md:h-48 md:w-48">
            <Image
              src={bioData.picture}
              alt={`Picture of ${bioData.name}`}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-card-foreground md:text-3xl">
              {bioData.name}
            </h1>
            <a
              href={`mailto:${bioData.email}`}
              className="mt-1 inline-block text-sm text-muted-foreground transition-colors hover:text-primary md:text-base"
            >
              {bioData.email}
            </a>
          </div>

          <div className="space-y-4 text-center">
            {bioData.description.map((desc, i) => (
              <p
                key={i}
                className="text-pretty text-sm leading-relaxed text-muted-foreground md:text-base"
              >
                {desc}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
