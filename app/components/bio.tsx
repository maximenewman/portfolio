import Image from "next/image"

export const bioData = {
    name: "Maxime Newman Nereyabagabo",
    email: "mnn6@sfu.ca",
    description: [
        `Hello, welcome to my Universe! I'm Max, currently I'm pursuing Computer Science at Simon Fraser University,
        focusing on machine learning, networking, and embedded systems.`,
        `There is no a unique purpose for programming, I see it as a big toolbox that can be used solve complex problems.
        One of these tools that has sky rocketed is generative AI, and while some are concerned on the growing dependency for it in our daily lives,
        I see it as inevitable progression of the human race in search for innovation. Before, we had to scavenge for food, and now we are eliminating mandane tasks that will give us more time for progression.
        With this in mind I pride myself in integrating AI into products to facilitate the user experience when navigating the vast tech world.`,
        `Besides that I'm an athlete, I love football, running, hiking, and snowboarding. 
        I've played competitively in both FVSL and VMSL Prem so if you're looking for a player to bring your team to victory I'm your man!`
    ],
    picture: "/LinkedInpp.JPG"
}



export default function MyBio(){
    return (
        <div className="hero mt-5">
            <div className="flex flex-col items-center">
                <Image 
                    // className="ring-1"
                    src={bioData.picture}
                    alt={`Picture of ${bioData.name}`}
                    width="200"
                    height="200"
                />
                <h1>{bioData.name}</h1>
                <a href={`mailto:${bioData.email}`}>{bioData.email}</a>
                
                <div className="mt-4 text-center text-balance">

                    <ul> 
                        {bioData.description.map((desc, i) => (
                                <li key={i}>{desc}</li>
                            ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}