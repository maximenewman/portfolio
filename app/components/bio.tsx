import Image from "next/image"

const bio = {
    name: "Maxime Newman Nereyabagabo",
    email: "mnn6@sfu.ca",
    description: [

    ],
    picture: "/LinkedInpp.JPG"
}



export default function MyBio(){
    return (
        <div>
            <div>
                <Image 
                    className="ring-1"
                    src={bio.picture}
                    alt={`Picture of ${bio.name}`}
                    width="200"
                    height="200"
                />

                <h1>{bio.name}</h1>
                <a href={`mailto:${bio.email}`}>{bio.email}</a>
            </div>

            {bio.description.map((desc, i) => (
                <ul> 
                    <li key={i}>{desc}</li>
                </ul>
            ))}
        </div>
    )
}